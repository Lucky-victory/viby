import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  roomId: any;
  channelId: any;
  constructor(
    private utilsService: UtilsService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
      this.routeChange(this.channelId, this.roomId);
    });
    this.activeRoute.queryParamMap.subscribe((params) => {
      this.roomId = params.get('room');
      this.routeChange(this.channelId, this.roomId);
    });
  }
  routeChange(channelId: string, roomId: string) {
    console.log(channelId, 'channelid');
    console.log(roomId, 'roomid');
  }
  showAction = async () => {
    await this.utilsService.showActionSheet();
  };
}
