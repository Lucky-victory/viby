import { Component, OnInit } from '@angular/core';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'user-profile-pic',
  templateUrl: './user-profile-pic.component.html',
  styleUrls: ['./user-profile-pic.component.scss'],
})
export class UserProfilePicComponent implements OnInit {
  currentUser: IUserToView;
  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
  }

}
