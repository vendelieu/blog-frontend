import { Options } from '../config/site-options';
import { ApiUrl } from '../config/api-url';

export function getApiUrl(path: string): string {
  return `${Options.api_url}${ApiUrl.API_URL_PREFIX}${path}`;
}

export function getAdminUrl(path: string): string {
  return `${Options.api_url}:8080${ApiUrl.API_URL_PREFIX}${path}`;
}
