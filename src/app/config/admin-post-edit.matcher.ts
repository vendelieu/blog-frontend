import {Route, UrlSegment, UrlSegmentGroup} from '@angular/router';

export function adminPostEditMatcher(url: UrlSegment[], group: UrlSegmentGroup, route: Route) {
  const postRegexp = /^[a-zA-Z\d]+(?:[~@$%&*\-_=+;:,]+[a-zA-Z\d]+)*$/i;

  if (url.length > 3 || url.length < 3) {
    return null;
  }
  if (url[0].path !== "admin" && url[1].path !== "post") {
    return null;
  }

  if (!postRegexp.test(url[1].path) || /^\d+$/i.test(url[1].path)) {
    return null;
  }

  return {
    consumed: url,
    posParams: {
      postSlug: new UrlSegment(`${url[2]}`, {})
    }
  };
}
