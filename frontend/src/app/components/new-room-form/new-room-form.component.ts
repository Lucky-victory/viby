import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router:Router,
    private utilsService: UtilsService
  ) {}
  ngOnInit(): void {}
  checkInput() {
    this.isValid = this.roomName !== '' && this.roomName.length >= 3;
  }
  createRoom() {
    this.isSending = true;
  
      
    
    this.chatService
      .createRoom(this.channel?.channel_id, {
        title: this.roomName,
        message_allowed: this.messageAllowed,
      })
      .subscribe(async (result: IResponse<IRoom>) => {
        this.isSending = false;
        if (result.data) {
          this.utilsService.showToast({
            message: 'Room created successfully'
        ,duration:1000  });
          await this.dismiss();
          setTimeout(() => {
            
            this.router.navigate(['/channels', result.data?.channel_id,result?.data?.room_id]);
          },1500)
      }
      }, (error) => {
        this.isSending = false;
        this.utilsService.showAlert({
          message:error,header:"Error:"
        })
      });
  }
  dismiss = async () => {
    await this.modalCtrl.dismiss();
  };
}
