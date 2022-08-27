import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

import { IChannel, IChannelToView } from 'src/app/interfaces/channel.interface';
import { IMessageToView } from 'src/app/interfaces/message.interface';

import { IRoom } from 'src/app/interfaces/room.interface';

import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

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
    private chatService: ChatService,
    private activeRoute: ActivatedRoute,
    private authservice: AuthService
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
