import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ChatListComponent } from 'src/app/components/chat-list/chat-list.component';
import { IChannel } from 'src/app/interfaces/channel.interface';
import {

  INewMessage,
} from 'src/app/interfaces/message.interface';
import { IResponse } from 'src/app/interfaces/response.interface';
import { IRoom } from 'src/app/interfaces/room.interface';

import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.page.html',
  styleUrls: ['./channels.page.scss'],
})
export class ChannelsPage implements OnInit {
  private storeUrl: string = '../../../assets/store.json';
  channels: IChannel[];
  roomTitle: string;
  roomId: string;

  channelId: string;
  newMessage: INewMessage;

  constructor(
    private apiService: ApiService,
    private activeRoute: ActivatedRoute,
    private authservice: AuthService,
    private readonly webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    this.apiService.get(this.storeUrl).subscribe((result: IResponse) => {
      this.channels = result.channels;

      this.activeRoute.paramMap.subscribe((params) => {
        this.channelId = params.get('channel_id');
      });
      this.activeRoute.queryParamMap.subscribe((params) => {
        this.roomId = params.get('room');
      });
    });
  }
  getRoomTitle(title: string) {
    this.roomTitle = title;
  }
  acceptNewMessage(message: INewMessage) {
    this.newMessage = message;
    this.saveMessage(message);
  }
  saveMessage(message: INewMessage) {
    const user = this.authservice.currentUser;
    const user_id = user?.user_id;
    const messageToSave = {
      ...message,
      user_id,
    };
    this.webSocketService.newMessage(this.roomId, messageToSave, user);
  }
}
