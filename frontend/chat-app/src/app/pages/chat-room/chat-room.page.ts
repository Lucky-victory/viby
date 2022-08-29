import { Observable } from 'rxjs';
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
import { IChannelToView } from 'src/app/interfaces/channel.interface';

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
  title$: Observable<string>;
  activeRoom: IRoom;
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
      console.log(title, 'page title');
    });
    this.chatService.room$.subscribe((room) => {
      this.activeRoom = room;
    });
  }

  routeChange(channelId: string, roomId: string) {
    this.getRooms(channelId);
    this.getMembersInRoom(roomId);
    this.getRoom(roomId);
    this.getChannel(channelId);
    this.connectToSocket();
  }
  private getRooms(channelId: string) {
    this.chatService
      .getRooms(channelId)
      .subscribe((result: IResponse<IRoom[]>) => {
        this.chatService.setRooms(result.data);
      });
  }
  private getMembersInRoom(roomId: string) {
    this.chatService
      .getMembersInRoom(roomId)
      .subscribe((result: IResponse<IUserToView[]>) => {
        this.chatService.setMembersInRoom(result.data);
      });
  }
  private getRoom(roomId: string) {
    this.chatService.getRoom(roomId).subscribe((result: IResponse<IRoom>) => {
      this.chatService.setRoom(result.data);
    });
  }
  private connectToSocket() {
    this.webSocketService.connect();
    this.webSocketService.onConnect().subscribe(() => {
      console.log('connected');
    });
    this.webSocketService.joinRoom(
      this.channelId,
      this.roomId,
      this.currentUser
    );
  }
  private getChannel(channelId: string) {
    this.chatService
      .getChannel(channelId)
      .subscribe((result: IResponse<IChannelToView>) => {
        this.chatService.setChannel(result.data);
      });
  }
}
