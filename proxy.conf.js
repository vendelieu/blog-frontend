const PROXY_CONFIG = {
  '/api': {
    target: 'http://localhost:8080/',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
};

module.exports = PROXY_CONFIG;
