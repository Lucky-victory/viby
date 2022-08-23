import { Component, OnInit } from '@angular/core';
import { IChannelToView } from 'src/app/interfaces/channel.interface';
import { IResponse } from 'src/app/interfaces/common.interface';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  channels: IChannelToView[] = [];

  constructor(
    private apiService: ApiService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService
      .getChannels()
      .subscribe((result: IResponse<IChannelToView[]>) => {
        this.channels = result.data;
      });
  }
  joinChannel(channel: IChannelToView) {
    this.apiService
      .get(`/channels/${channel?.channel_id}/join`)
      .subscribe((result: IResponse<IUserToView>) => {
        console.log('joined:', result);
      });
  }
}
