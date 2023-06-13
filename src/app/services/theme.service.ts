import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('dark');

  constructor() {
  }

  changeTheme(newTheme: string) {
    this.themeSubject.next(newTheme);
  }

  getFlow(): Observable<string> {
    return this.themeSubject.asObservable();
  }
}
