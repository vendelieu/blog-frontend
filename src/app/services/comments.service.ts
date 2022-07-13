import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrl } from '../config/api-url';
import { ApiService } from '../core/api.service';
import { Comment, CommentDTO } from '../interfaces/comments';
import { PaginatedHttpResponse } from '../interfaces/http-response';
import { Sort } from '../interfaces/posts';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getCommentsByPostSlug(slug: string, sortParam: Sort, page: number = 1): Observable<PaginatedHttpResponse<Comment[]> | undefined> {
    return this.apiService.httpGetCustomResponse<PaginatedHttpResponse<Comment[]>>(
      this.apiService.getApiUrl(ApiUrl.GET_COMMENTS).replace(':slug', slug),
      { sort_by: sortParam, page: page }
    );
  }

  saveComment(comment: CommentDTO | undefined): Observable<any> {
    const body = {
      text: comment?.text,
      reply_to: comment?.reply_to
    };

    return this.apiService.httpPost<any>(
      this.apiService.getApiUrl(ApiUrl.SAVE_COMMENTS).replace(':slug', comment?.post_slug ?? ''),
      body
    );
  }

  deleteComment(comment: Comment): Observable<any> {
    return this.apiService.httpDelete<any>(
      this.apiService.getApiUrl(ApiUrl.COMMENT_ACTION).replace(':id', String(comment?.id ?? 0))
    );
  }

  updateComment(id: number, value: string): Observable<any> {
    return this.apiService.httpPut<any>(
      this.apiService.getApiUrl(ApiUrl.COMMENT_ACTION).replace(':id', String(id)),
      { text: value }
    );
  }
}
