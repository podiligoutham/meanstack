import { AuthData } from './uth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private userAuthSub = new Subject<boolean>();
  isAuthenticated = false;
  constructor(private http: HttpClient) { }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.userAuthSub.asObservable();
  }

  createUser(email: string, password: string) {
    const user: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/users/signin', user)
    .subscribe(res => {
        console.log(res);
    });

  }

  login(email: string, password: string) {
    const user: AuthData = {email, password};
    this.http.post<{token: string}>('http://localhost:3000/api/users/login', user)
    .subscribe(res => {
      console.log(res);
      this.token = res.token;
      if (this.token) {
        this.isAuthenticated = true;
        this.userAuthSub.next(true);
      }
    });
  }
  logout() {
    this.userAuthSub.next(false);
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
}

