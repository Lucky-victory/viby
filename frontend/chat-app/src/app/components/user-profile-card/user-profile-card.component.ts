import { Component, Input, OnInit } from '@angular/core';
import { IResponse } from 'src/app/interfaces/common.interface';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent implements OnInit {
  currentUser: IUserToView;
  @Input() user: IUserToView;
  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
  }
  addFriend(user: IUserToView){
    this.chatService
      .addFriend(user?.user_id)
      .subscribe((result: IResponse<{}>) => {
        console.log(result);
      });
  };
}
