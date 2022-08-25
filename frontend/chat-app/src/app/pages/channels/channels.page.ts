import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChatListComponent } from 'src/app/components/chat-list/chat-list.component';
import { IChannel, IChannelToView } from 'src/app/interfaces/channel.interface';
import {
  IMessageToView,
  INewMessage,
} from 'src/app/interfaces/message.interface';

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
  channels: IChannelToView[];
  roomTitle: string = 'no title';
  roomId: string;
  messages: IMessageToView[];
  channelId: string;
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
      this.channels = result.data;
      this.chatService.setChannelsForUser(this.channels);
    });
  }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}
}
