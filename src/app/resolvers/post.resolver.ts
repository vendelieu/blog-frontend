import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { PostEntity } from '../interfaces/posts';
import { PostsService } from '../services/posts.service';

export const postResolver: ResolveFn<PostEntity | undefined> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(PostsService).getPostBySlug(route.paramMap.get('postSlug')!);
};
