import { Component, Input, OnInit } from '@angular/core';
import { IResponse } from 'src/app/interfaces/common.interface';
import { IUser, IUserToView } from 'src/app/interfaces/user.interface';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { UserProfileCardComponent } from '../user-profile-card/user-profile-card.component';

@Component({
  selector: 'channel-active-users-item',
  templateUrl: './channel-active-users-item.component.html',
  styleUrls: ['./channel-active-users-item.component.scss'],
})
export class ChannelActiveUsersItemComponent {
  @Input() currentUser: IUserToView;
  @Input() member: IUserToView;
  constructor(
    private utilsService: UtilsService,
    private chatService: ChatService
  ) {}

  showUserProfile = async (event: Event, user: IUserToView) => {
    this.chatService
      .getUser(user?.user_id)
      .subscribe(async (result: IResponse<IUserToView>) => {
        const userResult = result.data;

        await this.utilsService.showModalOrPopover({
          component: UserProfileCardComponent,
          componentProps: { user: userResult },
          breakpoints: [0, 0.5, 1],
          initialBreakpoint: 0.5,

          event,
          cssClass: 'user-profile-card',
        });
      });
  };
}
