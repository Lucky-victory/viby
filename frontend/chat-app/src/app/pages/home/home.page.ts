import { Component, OnInit } from '@angular/core';
import { IUserToView } from 'src/app/interfaces/user.interface';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isLoggedIn: boolean;
  currentUser: IUserToView;
  constructor(private authService: AuthService) {}
  ionViewWillEnter() {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.currentUser = this.authService.currentUser;
  }
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn;
  }
  logout() {
    console.log('logout');

    this.authService.logout();
    this.isLoggedIn = this.authService.isLoggedIn;
  }
}
