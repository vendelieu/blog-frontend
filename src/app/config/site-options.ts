import { environment as env } from '../../environments/environment';

export const Options = {
  site_name: 'Vendeli.eu',
  site_description: 'what is V stands for',
  site_author: 'Vendelieu',
  site_keywords: '',
  site_slogan: '',
  copyright_notice: 'Vendelieu',
  api_url: env.api_url,
  site_url: env.site,
  githubUrl: 'https://github.com/vendelieu',
  telegramUrl: 'https://t.me/vendelieu',
  email: 'vendelieu@gmail.com',
  GITHUB_API_URL: 'https://api.github.com/users/vendelieu/repos?sort=pushed',
  STORAGE_POSTS_SORTING_KEY: 'posts_sorting',
  STORAGE_THEME_KEY: 'cur_theme',
  CUR_YEAR: new Date().getFullYear().toString(),
  PAGINATOR_PAGE_SIZE: 10,
  PAGINATOR_PAGINATION_SIZE: 9
};
