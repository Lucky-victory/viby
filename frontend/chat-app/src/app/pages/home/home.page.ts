import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isLoggedIn: boolean;
  constructor(private authService: AuthService) {}
  ionViewWillEnter() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn;
  }
  logout() {
    this.authService.logout();
    this.isLoggedIn = this.authService.isLoggedIn;
  }
}
