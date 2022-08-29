import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IChannel, IChannelToView } from 'src/app/interfaces/channel.interface';

import { IRoom } from 'src/app/interfaces/room.interface';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss'],
})
export class ChannelListComponent implements OnInit {
  channels: IChannelToView[];
  channelId: string;
  activeChannel: IChannelToView;
  rooms: IRoom[];
  currentUser: IUserToView;
  constructor(
    private activeRoute: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.chatService.channelsForUser$.subscribe((channels) => {
      this.channels = channels;
    });

    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
    });
  }
}
