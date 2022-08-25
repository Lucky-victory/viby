import { Component, Input, OnInit } from '@angular/core';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent implements OnInit {
  currentUser: IUserToView;
  @Input() user:IUserToView;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
  }
}
