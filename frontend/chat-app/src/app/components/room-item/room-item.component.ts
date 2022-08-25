import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRoom } from 'src/app/interfaces/room.interface';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SeoService } from 'src/app/services/seo/seo.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
})
export class RoomItemComponent implements OnInit {
  @Input() room: IRoom;
  roomId: string;
  currentUser: IUserToView;
  @Output() roomTitleEv: EventEmitter<string> = new EventEmitter<string>();
  channelId: string;
  clickCount: number = 0;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
      this.roomId = params.get('room_id');
      // this.webSocketService.joinChannel(this.channelId, this.currentUser);
    });
  }
  selectRoom(room: IRoom) {
    this.roomTitleEv.emit(room?.title);
    this.seoService.setTitle(room?.title);
  }
}
