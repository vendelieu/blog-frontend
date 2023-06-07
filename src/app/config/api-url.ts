export enum ApiUrl {
  API_URL_PREFIX = '/api',
  GET_POSTS = '/posts',
  GET_POST_BY_SLUG = '/post/:slug',
  GET_TAGS_BY_POST_SLUG = '/post/:slug/tags',
  GET_RELATED_POST_BY_SLUG = '/post/:slug/related',
  GET_TAG_BY_NAME = '/tag/:name',

  ADMIN_STATUS_URL = '/admin/check',
  ADMIN_CREATE_POST = '/admin/post',
  ADMIN_POST_ACTION = '/admin/post/:id',
}
