import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';

export function tagUrlMatcher(url: UrlSegment[], group: UrlSegmentGroup, route: Route) {
  if (url.length < 2 || url.length > 3 || url[0].path !== 'tag') {
    return null;
  }
  let page = '';
  if (url[2]) {
    if (!/^page-\d+$/i.test(url[2].path)) {
      return null;
    }
    page = url[2].path.split('-')[1];
  }
  const params: {
    [name: string]: UrlSegment;
  } = {
    [url[0].path]: new UrlSegment(url[1].path, {})
  };
  if (page) {
    params['page'] = new UrlSegment(page, {});
  }
  return {
    consumed: url,
    posParams: params
  };
}
