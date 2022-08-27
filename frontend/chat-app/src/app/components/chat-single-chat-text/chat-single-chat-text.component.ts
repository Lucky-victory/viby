import { IResponse } from './../../interfaces/common.interface';
import { UserProfileCardComponent } from 'src/app/components/user-profile-card/user-profile-card.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetOptions,
  Platform,
  PopoverOptions,
} from '@ionic/angular';
import { IMessageToView } from 'src/app/interfaces/message.interface';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PopoverActionsComponent } from '../popover-actions/popover-actions.component';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'chat-single-chat-text',
  templateUrl: './chat-single-chat-text.component.html',
  styleUrls: ['./chat-single-chat-text.component.scss'],
})
export class ChatSingleChatTextComponent implements OnInit {
  @Input() chat: IMessageToView;
  currentUser: IUserToView;
  isCurrentUser!: boolean;
  isMobile!: boolean;
  isDesktop: boolean;
  private canEdit: boolean;
  private canCopy: boolean;
  private canDelete: boolean;
  @Output('onedit') onedit = new EventEmitter<IMessageToView>();
  @Output('ondelete') ondelete = new EventEmitter<IMessageToView>();
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private utilsService: UtilsService,
    private chatService: ChatService
  ) {
    this.currentUser = this.authService.currentUser;
    this.isMobile = this.platform.is('mobile');
    this.isDesktop = this.platform.is('desktop');
  }
  ngOnInit(chat = this.chat) {
    this.isCurrentUser = chat?.user?.user_id === this.currentUser?.user_id;
    this.canDelete = this.isCurrentUser;
    this.canCopy = chat.type === 'text';
    this.canEdit = this.canCopy && this.canDelete;
  }
  showActions = async (event, chat: IMessageToView) => {
    const buttons = [];

    if (this.canEdit) {
      buttons.push({
        text: 'Edit',
        icon: 'create-outline',
        role: 'edit',
        data: { id: 'edit' },
      });
    }
    if (this.canCopy) {
      buttons.push({
        text: 'Copy Text',
        icon: 'copy-outline',
        role: 'copy',
        data: {
          id: 'copy',
        },
      });
    }
    if (this.canDelete) {
      buttons.push({
        text: 'Delete',
        role: 'destructive',
        icon: 'trash-outline',
        data: { id: 'delete' },
      });
    }
    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      data: { id: 'cancel' },
    });
    let options: ActionSheetOptions | PopoverOptions;
    if (this.platform.is('desktop')) {
      options = {
        component: PopoverActionsComponent,
        componentProps: { buttons },
        event,
      };
    } else {
      options = { buttons };
    }
    const { data } = await this.utilsService.showPopoverOrActionSheet(options);
    if (data?.id === 'copy') {
      await this.copyText(chat);
    }
    if (data?.id === 'edit') {
      this.edit(chat);
    }
    if (data?.id === 'delete') {
      this.deleteFunc(chat);
    }
  };
  async mobilePress(event, chat: IMessageToView) {
    await this.showActions(event, chat);
  }
  async copyText(chat: IMessageToView) {
    await navigator.clipboard.writeText(chat?.content);
    await this.utilsService.showToast({
      message: 'Copied to clipboard',
      duration: 2500,
      position: 'bottom',
    });
  }
  edit(chat: IMessageToView) {
    this.onedit.emit(chat);
  }
  deleteFunc(chat: IMessageToView) {
    this.ondelete.emit(chat);
  }
  async onAvatarClick({ event, user }) {
    await this.showUserProfile(event, user);
  }
  showUserProfile = async (event, user) => {
    this.chatService
      .getUser(user?.user_id)
      .subscribe(async (result: IResponse<IUserToView>) => {
        const userResult = result.data;
        console.log(userResult);

        await this.utilsService.showModalOrPopover({
          component: UserProfileCardComponent,
          componentProps: { userResult },
          breakpoints: [0, 0.5, 1],
          initialBreakpoint: 0.5,
          canDismiss: true,
          event,
          cssClass: 'user-profile-card',
        });
      });
  };
}
