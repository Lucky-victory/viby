import { Component, Input, OnInit } from '@angular/core';
import { IResponse } from 'src/app/interfaces/common.interface';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent implements OnInit {
  currentUser: IUserToView;
  @Input() user: IUserToView;
  isSending: boolean;
  constructor(
    private authService: AuthService,
    private chatService: ChatService,private utilsService:UtilsService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
  }
  addFriend(user: IUserToView) {
    this.isSending = true;
    this.chatService
      .addFriend(user?.user_id)
      .subscribe((result: IResponse<{}>) => {
        setTimeout(() => {
          this.isSending = false;
          
        },1500)
      });
  };
  sendPrivateMessage = async () => {
    await this.utilsService.showAlert({
      message:'Not available yet',
    })
  }
  editProfile = async () => {
    await this.utilsService.showAlert({
      message:'Not available yet',
    })
  }
}
