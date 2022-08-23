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
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly sampleUser: IUserToView = {
    user_id: 'b23e3692-ee33-4f24-acad-2e743597a22a',
    username: 'LuckyVictoryU5J6',
    fullname: 'Lucky Victory',
    profile_picture:
      'https://www.gravatar.com/avatar/0f69cbedcf462f733c3458f3665e9d75.jpg?s=150',
    cover_picture: null,
    created_at: '2022-08-20T14:54:02.883Z',
    bio: null,
    status: null,
  };
  constructor(private apiService: ApiService) {}

  set setSession(result: IUserCredentials) {
    const token = result?.token;
    const tokenExpiresAt = result?.expires_at;
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
  getToken(): string {
    return localStorage.getItem('viby_token');
  }
  saveToken(token: string) {
    localStorage.setItem('viby_token', token);
  }
  saveTokenExpiration(expiresAt: number) {
    const expiry = moment().add(expiresAt, 'second');
    localStorage.setItem(
      'viby_token_expiration',
      JSON.stringify(expiry.valueOf())
    );
  }
  getTokenExpiration() {
    const expiration = JSON.parse(
      localStorage.getItem('viby_token_expiration')
    ) as number;
    return moment(expiration);
  }
  setCurrentUser(user: IUserToView) {
    localStorage.setItem('viby_user', JSON.stringify(user));
  }
  get currentUser(): IUserToView {
    return (
      (JSON.parse(localStorage.getItem('viby_user')) as IUserToView) ||
      this.sampleUser
    );
  }
  logout() {
    localStorage.removeItem('viby_token');
    localStorage.removeItem('viby_user');
    localStorage.removeItem('viby_token_expiration');
  }
  get isLoggedIn(): boolean {
    return (
      moment().isBefore(this.getTokenExpiration()) && this.currentUser !== null
    );
  }
  get isLoggedOut() {
    return !this.isLoggedIn;
  }
}
