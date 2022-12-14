import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IChannelToView } from 'src/app/interfaces/channel.interface';
import { ChatService } from 'src/app/services/chat/chat.service';
import { SeoService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'channel-item',
  templateUrl: './channel-item.component.html',
  styleUrls: ['./channel-item.component.scss'],
})
export class ChannelItemComponent implements OnInit {
  isActive: boolean;
  @Input() channel: IChannelToView;
  channelId: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
    });
  }

  navigateToRoom(channel: IChannelToView) {
    const firstRoom = channel.rooms[0];
    this.router.navigate([
      '/channels',
      channel?.channel_id,
      firstRoom?.room_id,
    ]);
    this.seoService.setTitle(firstRoom.title);
    this.chatService.setRooms(channel?.rooms);
  }
}
