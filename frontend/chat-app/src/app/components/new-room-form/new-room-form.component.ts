import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { IRoom } from 'src/app/interfaces/room.interface';
import { IResponse } from 'src/app/interfaces/common.interface';
import { IChannelToView } from 'src/app/interfaces/channel.interface';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-new-room-form',
  templateUrl: './new-room-form.component.html',
  styleUrls: ['./new-room-form.component.scss'],
})
export class NewRoomFormComponent implements OnInit {
  roomName: string = '';
  messageAllowed: boolean = true;
  isSending: boolean = false;
  isValid: boolean;
  private channelId: string;
  @Input() channel: IChannelToView;
  constructor(
    private modalCtrl: ModalController,
    private chatService: ChatService,
    private activeRoute: ActivatedRoute,
    private utilsService: UtilsService
  ) {}
  ngOnInit(): void {}
  checkInput() {
    this.isValid = this.roomName !== '' && this.roomName.length >= 3;
  }
  createRoom() {
    this.isSending = true;
    if (this.isSending) {
      this.utilsService.showLoader({
        message: 'Creating room',
        spinner: 'circles', duration: 3000
      });
    }
    this.chatService
      .createRoom(this.channel.channel_id, {
        title: this.roomName,
        message_allowed: this.messageAllowed,
      })
      .subscribe((result: IResponse<IRoom>) => {
        this.isSending = false;
        console.log(result);
      });
  }
  dismiss = async () => {
    await this.modalCtrl.dismiss();
  };
}
