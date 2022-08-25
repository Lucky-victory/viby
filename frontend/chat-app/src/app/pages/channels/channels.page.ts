import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChatListComponent } from 'src/app/components/chat-list/chat-list.component';
import { IChannel } from 'src/app/interfaces/channel.interface';
import {
  IMessageToView,
  INewMessage,
} from 'src/app/interfaces/message.interface';
import { IResponse } from 'src/app/interfaces/response.interface';
import { IRoom } from 'src/app/interfaces/room.interface';

import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-channels',
  templateUrl: './channels.page.html',
  styleUrls: ['./channels.page.scss'],
})
export class ChannelsPage implements OnInit, AfterViewInit, OnDestroy {
  channels: IChannel[];
  roomTitle: string = 'no title';
  roomId: string;
  messages: IMessageToView[];
  channelId: string;
  newMessage: INewMessage;
  rooms: IRoom[];
  rooms$: Observable<IRoom[]>;
  constructor(
    private apiService: ApiService,
    private chatService: ChatService,
    private activeRoute: ActivatedRoute,
    private authservice: AuthService,
    private readonly webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    this.chatService.getChannelsForUser().subscribe((result: any) => {
      console.log(result, 'here');
      this.channels = result.data;
    });
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
      this.roomId = params.get('room_id');
    });
  }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}
  getRoomTitle(title: string) {
    this.roomTitle = title;
  }
  acceptNewMessage(message: INewMessage) {
    this.newMessage = message;
    this.saveMessage(message);
  }
  saveMessage(message: INewMessage) {}
}
