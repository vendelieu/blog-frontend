import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('dark');
  public themeChanges: Observable<string>;

  constructor() {
    this.themeChanges = this.themeSubject.asObservable();
  }

  changeTheme(newTheme: string) {
    this.themeSubject.next(newTheme);
  }
}
