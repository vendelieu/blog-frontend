import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { join } from 'path';
import { AppServerModule } from '../src/main.server';
import ENV_CONFIG from './config/env.config';
import APP_CONFIG from './config/app.config';

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      bootstrap: AppServerModule,
      viewsPath: join(process.cwd(), 'dist/browser')
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ENV_CONFIG, APP_CONFIG]
    })
  ],
  providers: [ConfigService],
  controllers: []
})
export class AppModule {}
