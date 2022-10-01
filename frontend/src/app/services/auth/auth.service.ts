import { Injectable } from '@angular/core';
import moment from 'moment';

import { switchMap, tap } from 'rxjs/operators';

import { IResponse } from 'src/app/interfaces/common.interface';
import {
  INewUser,
  IUserCredentials,
  IUserLogin,
  IUserToView,
} from 'src/app/interfaces/user.interface';

import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  set setSession(result: IUserCredentials) {
    const token = result?.token;
    const tokenExpiresAt = result?.expires_at;
    console.log(tokenExpiresAt, 'set session');
    const user = result?.user;
    this.saveTokenExpiration(tokenExpiresAt);
    this.saveToken(token);
    this.setCurrentUser(user);
  }
  signUp(details: INewUser) {
    return this.apiService
      .post('/sign-up', details)
      .pipe(
        tap((res: IResponse<IUserCredentials>) => (this.setSession = res.data))
      );
  }
  signIn(details: IUserLogin) {
    return this.apiService
      .post('/sign-in', details)
      .pipe(
        tap((res: IResponse<IUserCredentials>) => (this.setSession = res.data))
      );
  }
  getUserProfile(userId: string) {
    return this.apiService.get(`/user/others/${userId}`);
  }
  getToken(): string {
    return localStorage.getItem('viby_token');
  }
  saveToken(token: string) {
    localStorage.setItem('viby_token', token);
  }
  saveTokenExpiration(expiresAt: number) {
    const expireTime = new Date().getTime() + expiresAt;

    console.log(expireTime, 'epire time');

    localStorage.setItem('viby_token_expiration', JSON.stringify(expireTime));
  }
  getTokenExpiration() {
    const expiration = localStorage.getItem('viby_token_expiration');

    const expiresAt = JSON.parse(expiration);
    console.log(expiresAt, 'expire');
    console.log(new Date().getTime(), 'current');
    return moment(expiresAt);
  }
  setCurrentUser(user: IUserToView) {
    localStorage.setItem('viby_user', JSON.stringify(user));
  }
  get currentUser(): IUserToView {
    return JSON.parse(localStorage.getItem('viby_user') || '{}') as IUserToView;
  }
  logout() {
    localStorage.removeItem('viby_token');
    localStorage.removeItem('viby_user');
    localStorage.removeItem('viby_token_expiration');
  }
  isLoggedIn(): boolean {
    return moment().isBefore(this.getTokenExpiration());
  }
  get isLoggedOut() {
    return !this.isLoggedIn();
  }
}
