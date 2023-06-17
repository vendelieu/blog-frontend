import { registerAs } from '@nestjs/config';
import { environment } from '../../src/environments/environment';

const APP_CONFIG = () => ({
  host: environment.server?.host || 'localhost',
  port: environment.server?.port || 4200,
  api: { host: environment.api_url }
});

export default registerAs('app', APP_CONFIG);
