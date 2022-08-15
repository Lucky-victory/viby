import { Injectable } from '@angular/core';
import moment from 'moment';
import { INewUser, IUser, IUserCredentials } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  
  constructor(private apiService:ApiService) { }

  setSession(result:IUserCredentials) {
    const token = result?.token;
    const tokenExpiresAt = result?.expires_at;
    const user = result?.user;
    this.saveTokenExpiration(tokenExpiresAt);
    this.saveToken(token);
    this.setCurrentUser(user);
  }
  signUp(details:INewUser) {
    
  }
  login(details:Partial<INewUser>) {
    
  }
  getToken(): string {
    return localStorage.getItem('viby_token');
  }
  saveToken(token:string) {
    localStorage.setItem('viby_token',token);
    
  }
  saveTokenExpiration(expiresAt: number) {
    const expiry=moment().add(expiresAt, 'second')
    localStorage.setItem('viby_token_expiration',JSON.stringify(expiry.valueOf()))
  }
  getTokenExpiration() {
    const expiration = JSON.parse(localStorage.getItem('viby_token_expiration')) as number;
    return moment(expiration);
  } 
  setCurrentUser(user:IUser) {
    localStorage.setItem('viby_user', JSON.stringify(user));
  }
  get currentUser(): IUser {
    return JSON.parse(localStorage.getItem('viby_user')) as IUser;

  }
  logout() {
    localStorage.removeItem('viby_token');
    localStorage.removeItem('viby_user');
    localStorage.removeItem('viby_token_expiration');
  }
  isLoggedIn():boolean {
    return moment().isBefore(this.getTokenExpiration()) && this.currentUser !== null;
  }
  isLoggedOut() {
    return !this.isLoggedIn()
  }
}
