import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  login(email: string, name: string = 'Carlos Tchipia') {
    this.currentUser.next({ name, email });
  }

  logout() {
    this.currentUser.next(null);
  }
}
