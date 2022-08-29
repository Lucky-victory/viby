import { IChannelToView } from './../../interfaces/channel.interface';
import { IResponse } from './../../interfaces/common.interface';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AuthService } from 'src/app/services/auth/auth.service';

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
    private chatService: ChatService
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
      .subscribe((result: IResponse<IChannelToView>) => {
        console.log(result);
      });
  }
  dismiss = async () => {
    this.modalCtrl.dismiss();
  };
}
