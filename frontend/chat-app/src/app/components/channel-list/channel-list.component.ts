import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IChannel, IChannelToView } from 'src/app/interfaces/channel.interface';
import { IResponse } from 'src/app/interfaces/common.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ChatService } from 'src/app/services/chat/chat.service';

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
  constructor(
    private activeRoute: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService
      .getChannelsForUser()
      .subscribe((result: IResponse<IChannelToView[]>) => {
        console.log(result, 'here');
        this.channels = result.data;
        if (this.channels?.length) {
          this.activeChannel = this.channels[0];

          this.rooms = this.activeChannel.rooms;
        }
      });

    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
    });
  }
}
