import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersInterface } from '../../../shared/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'http://localhost:8082';
  private authTokenKey: string = 'auth-token';
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private httpClient: HttpClient) {
    if (this.getToken()) {
      this.isAuthenticated.next(!!this.getToken());
    }
  }

  signup(user: UsersInterface) {
    return this.httpClient.post(`${this.url}/auth/signup`, user);
  }

  signin(user: UsersInterface) {
    return this.httpClient.post(`${this.url}/auth/signin`, user, {
      // headers: {
      //   Authorization: `Bearer ${this.getToken()}`,
      // }
    });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.authTokenKey);
    }
    return null;
  }
}
