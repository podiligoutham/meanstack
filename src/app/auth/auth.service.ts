import { AuthData } from './uth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private userId: string;
  private userAuthSub = new Subject<boolean>();
  isAuthenticated = false;
  timer: any;
  constructor(private http: HttpClient, private route: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.userAuthSub.asObservable();
  }

  createUser(email: string, password: string) {
    const user: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/users/signin', user).subscribe(() => {
      this.route.navigate(['/']);
    }, error => {
      this.userAuthSub.next(false);
    });

  }

  autoAuthUser() {
    const data = this.getAuthData();
    if (!data) {
      return;
    }
    const now = new Date();
    const future = data.expiresIn.getTime() - now.getTime();
    if (future > 0) {
      this.token = data.token;
      this.isAuthenticated = true;
      this.userId = data.userId;
      this.setTimer(future / 1000);
      this.userAuthSub.next(true);
    }
  }

  getUserId() {
    return this.userId;
  }

  login(email: string, password: string) {
    const user: AuthData = {email, password};
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/users/login', user)
    .subscribe(res => {
      this.token = res.token;
      if (this.token) {
        const expiresIn = res.expiresIn;
        this.setTimer(expiresIn);
        this.isAuthenticated = true;
        this.userId = res.userId;
        this.userAuthSub.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        console.log(expirationDate);
        this.saveData(this.token, expirationDate, this.userId);
        this.route.navigate(['/']);
      }
    }, error => {
      this.userAuthSub.next(false);
    });
  }
  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.userAuthSub.next(false);
    clearTimeout(this.timer);
    this.clearData();
    this.route.navigate(['/login']);
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  private saveData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearData() {
     localStorage.removeItem('token');
     localStorage.removeItem('expiration');
     localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const time = localStorage.getItem('expiration');
    const userId  = localStorage.getItem('userId');
    if (!token || !time) {
      return;
    }
    return {
      token,
      expiresIn: new Date(time),
      userId
    };
  }

  private setTimer(duration) {
    console.log('setting duration :' + duration);
    this.timer = setTimeout ( () => {
      this.logout();
    }, duration * 1000);
  }
}

