import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { ChatService } from 'src/app/services/chat/chat.service';
import { IResponse } from 'src/app/interfaces/common.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import { SeoService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  roomId: string;
  channelId: string;
  currentUser: IUserToView;
  pageTitle: string;
  constructor(
    private utilsService: UtilsService,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private webSocketService: WebSocketService,
    private chatService: ChatService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
      this.roomId = params.get('room_id');
      this.routeChange(this.channelId, this.roomId);
    });
    this.currentUser = this.authService.currentUser;
    this.seoService.title$.subscribe((title) => {
      this.pageTitle = title;
    });
    this.webSocketService.connect();
  }

  routeChange(channelId: string, roomId: string) {
    this.chatService
      .getRooms(channelId)
      .subscribe((result: IResponse<IRoom[]>) => {
        this.chatService.setRooms(result.data);
      });
    this.chatService
      .getMembersInRoom(roomId)
      .subscribe((result: IResponse<IUserToView[]>) => {
        console.log(result, 'members');

        this.chatService.setMembersInRoom(result.data);
      });
    // this.webSocketService.connect();
    this.webSocketService.onConnect().subscribe(() => {
      console.log('connected');
    });

    this.webSocketService.joinRoom(
      this.channelId,
      this.roomId,
      this.currentUser
    );
  }
  showAction = async () => {
    await this.utilsService.showActionSheet();
  };
}
