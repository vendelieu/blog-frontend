import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';

export function postPageUrlMatcher(url: UrlSegment[], group: UrlSegmentGroup, route: Route) {
  const nameReg = /^[a-zA-Z\d]+(?:[~@$%&*\-_=+;:,]+[a-zA-Z\d]+)*$/i;
  if (url.length > 1 || url.length < 1) {
    return null;
  }
  if (/\./.test(url[0].path)) {
    return null;
  }
  if (url.length === 1 && (!nameReg.test(url[0].path) || /^\d+$/i.test(url[0].path))) {
    return null;
  }

  return {
    consumed: url,
    posParams: {
      postSlug: new UrlSegment(`${url[0]}`, {})
    }
  };
}
