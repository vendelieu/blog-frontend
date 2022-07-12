import { EventEmitter, Injectable, Output } from '@angular/core';
import { SortType } from '../interfaces/posts';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  @Output() sortingChanged = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<number>();

  changeSort(newSort: SortType) {
    this.sortingChanged.emit(newSort);
  }

  changePage(newPage: number) {
    this.pageChanged.emit(newPage);
  }
}
