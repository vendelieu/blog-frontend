import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REQUEST, RESPONSE } from './src/express.tokens';
import bootstrap from './src/main.server';
import compress from 'compression';
import { createClient } from 'redis';

export function getCacheProvider() {
  const cacheManager = createClient({
    url: 'redis://localhost:6379',
    // We are disabling Redis offline queue, if Redis is down
    // we'll throw an error that we can handle to continue executing
    // our application, otherwise redis we'll keep try to reconnect
    // and our application will not be responsive
    disableOfflineQueue: true,

    // Wait 5 seconds before trying to reconnect if Redis
    // instance goes down
    socket: {
      reconnectStrategy() {
        console.log('Redis: reconnecting ', new Date().toJSON());
        return 5000;
      }
    }
  })
    .on('ready', () => console.log('Redis: ready', new Date().toJSON()))
    .on('error', err => console.error('Redis: error', err, new Date().toJSON()));

  // connect to the Redis instance
  cacheManager.connect().then(it => {
    console.log('Redis Client Connected');
  }).catch(error => {
    console.error('Redis couldn\'t connect', error);
  });

  return cacheManager;
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const cacheProvider = getCacheProvider();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y'
    })
  );

  server.use(compress({ level: 8 }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
      console.log(`Looking for route in cache: ` + req.originalUrl);
      cacheProvider.get(req.originalUrl).then(cachedHtml => {
        if (cachedHtml) {
          console.log("found cached page");
          res.send(cachedHtml);
        } else {
          next();
        }
      }).catch(error => {
        console.error(error);
        next();
      });
    },
    // Angular SSR rendering
    (req, res) => {
      const { protocol, originalUrl, baseUrl, headers } = req;

      commonEngine
        .render({
          bootstrap,
          documentFilePath: indexHtml,
          url: `${protocol}://${headers.host}${originalUrl}`,
          publicPath: browserDistFolder,
          providers: [
            { provide: APP_BASE_HREF, useValue: baseUrl },
            { provide: REQUEST, useValue: req },
            { provide: RESPONSE, useValue: res }
          ]
        })
        .then((html) => {
          // Cache the rendered `html` for this request url
          cacheProvider.set(req.originalUrl, html, {
            EX: 43200 // 12h
          }).catch(err => console.log('Could not cache request', err));
          res.send(html);
        })
        .catch((err) => console.error(err));
    });

  return server;
}

function run(): void {
  const port = parseInt(process.env['PORT'] ?? '4200') || 4200;

  // Start up the Node server
  const server = app();
  server.listen(port, '127.0.0.1', () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
