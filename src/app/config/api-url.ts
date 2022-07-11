export enum ApiUrl {
  API_URL_PREFIX = '/api',
  GET_POSTS = '/posts',
  GET_POST_BY_SLUG = '/post/:slug',
  GET_TAGS_BY_POST_SLUG = '/post/:slug/tags',
  GET_RELATED_POST_BY_SLUG = '/post/:slug/related',
  GET_COMMENTS = '/post/:slug/commentaries',
  SAVE_COMMENTS = '/post/:slug/commentary',
  COMMENT_ACTION = '/commentary/:id',
  REGISTER = '/auth/signup',
  LOGIN = '/auth/login',
  LOGOUT = '/auth/logout',
  GET_LOGIN_USER = '/auth/info',
}
