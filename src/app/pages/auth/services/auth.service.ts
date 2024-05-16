import { Injectable } from '@angular/core';
import { HttpService } from '@/services/http/http.service';
import { UsersInterface } from '@/shared/models';
import { BehaviorSubject } from 'rxjs';
import { ApiRoutes } from '@/ts/enums';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authTokenKey: string = 'auth-token';
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private httpClient: HttpService) {
    if (this.getToken()) {
      this.isAuthenticated.next(!!this.getToken());
    }
  }

  signup(user: UsersInterface) {
    return this.httpClient.post(ApiRoutes.SignUp, user);
  }

  signin(user: UsersInterface) {
    return this.httpClient.post(ApiRoutes.SignIn, user, {
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
