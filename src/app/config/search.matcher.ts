import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';

export function searchMatcher(url: UrlSegment[], group: UrlSegmentGroup, route: Route) {
  const nameReg = /^[a-zA-Z\d]+(?:[~@$%&*\-_=+;:,]+[a-zA-Z\d]+)*$/i;
  if (url.length > 2 || url.length < 2) {
    return null;
  }
  if (url[0].path !== 'search' && !nameReg.test(url[1].path)) {
    return null;
  }

  return {
    consumed: url,
    posParams: {
      keyword: new UrlSegment(`${url[1]}`, {})
    }
  };
}
