import { HttpHeaders } from '@angular/common/http';

export interface HttpResponseEntity<T> {
  code?: number;
  message?: string;
  data?: T;
}

export interface PaginatedHttpResponse<T> extends HttpResponseEntity<T> {
  page_num: number;
  page_size: number;
  total_elements: number;
}
