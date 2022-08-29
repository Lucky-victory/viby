import { IChannelToView } from './../../interfaces/channel.interface';
import { IResponse } from './../../interfaces/common.interface';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-channel-form',
  templateUrl: './new-channel-form.component.html',
  styleUrls: ['./new-channel-form.component.scss'],
})
export class NewChannelFormComponent implements OnInit {
  channelName: string = '';
  isPublic: boolean = true;
  isMobile: boolean;
  isSending: boolean = false;
  isValid: boolean;
  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private chatService: ChatService,
    private utilsService: UtilsService,
    private router: Router
  ) {
    this.isMobile = this.platform.is('mobile');
  }

  ngOnInit() {}
  checkInput() {
    this.isValid = this.channelName !== '' && this.channelName.length >= 3;
  }
  createChannel() {
    this.chatService
      .createChannel({
        title: this.channelName,
        is_public: this.isPublic,
      })
      .subscribe(
        async (result: IResponse<IChannelToView>) => {
          if (result.data) {
            this.utilsService.showToast({
              message: 'Channel created successfully',
              duration: 1000,
            });
            await this.dismiss();
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        },
        (error) => {
          this.utilsService.showAlert({
            message: error,
            header: 'Error:',
          });
        }
      );
  }
  dismiss = async () => {
    this.modalCtrl.dismiss();
  };
}
