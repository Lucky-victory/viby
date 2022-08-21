import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IChannel } from 'src/app/interfaces/channel.interface';
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
  channels: IChannel[];
  channelId: string;
  activeChannel: IChannel;
  rooms: IRoom[];
  constructor(
    private activeRoute: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService.getChannels().then((result: IResponse<IChannel[]>) => {
      console.log(result, 'here');
      this.channels = result.data;
      if (this.channels?.length) {
        this.activeChannel = this.channels[0];
        this.chatService
          .getRooms(this.activeChannel?.channel_id)
          .then((result: IResponse<IRoom[]>) => {
            this.rooms = result.data;
          });
      }
    });

    // use the active channelId to fetch rooms
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
      // now use the channeelID
    });
  }
}
