import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SeoService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    const name = this.authService.currentUser?.fullname;
    this.seoService.setTitle('Profile | ' + name);
  }
}
