import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IChannel, IChannelToView } from 'src/app/interfaces/channel.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { SeoService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  activeChannel: IChannelToView;
  rooms: IRoom[] = [];
  channelId: string;
  roomId: string;
isOwner:boolean=false;
currentUser:IUserToView;
  constructor(
    private chatService: ChatService,
    private seoService: SeoService,private authService:AuthService
  ) {}

  ngOnInit() {
    this.currentUser=this.authService.currentUser;
    this.chatService.rooms$.subscribe((rooms) => {
      this.rooms = rooms;
     
    });
    this.chatService.channel$.subscribe((channel) => {
      this.activeChannel = channel;
      this.isOwner=channel?.owner_id==this.currentUser?.user_id;
    });
  }
}
