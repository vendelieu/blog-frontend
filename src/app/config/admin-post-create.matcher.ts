import {Route, UrlSegment, UrlSegmentGroup} from '@angular/router';

export function adminPostCreateMatcher(url: UrlSegment[], group: UrlSegmentGroup, route: Route) {
  if (url.length > 2 || url.length < 2) {
    return null;
  }
  if (url[0].path !== "admin" && url[1].path !== "post") {
    return null;
  }
  return {consumed: url};
}
