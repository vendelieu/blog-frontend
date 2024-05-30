import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public themeChanges: Observable<string>;
  private themeSubject = new BehaviorSubject<string>('dark');

  constructor() {
    this.themeChanges = this.themeSubject.asObservable();
  }

  changeTheme(newTheme: string) {
    this.themeSubject.next(newTheme);
  }
}
