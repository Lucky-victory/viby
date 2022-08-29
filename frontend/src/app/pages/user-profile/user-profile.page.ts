import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SeoService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  currentUser: IUserToView;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService?.currentUser;
    const name = this.currentUser?.fullname;
    this.seoService.setTitle('Profile | ' + name);
  }
}
