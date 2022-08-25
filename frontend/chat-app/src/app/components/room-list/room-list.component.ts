import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IChannel } from 'src/app/interfaces/channel.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { SeoService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  channel: any;
  @Output() roomTitleEv: EventEmitter<string> = new EventEmitter<string>();
  @Input() activeChannel: IChannel;
  rooms: IRoom[] = [];
  channelId: string;
  roomId: string;
  roomsSample: IRoom[];

  constructor(
    private router: Router,

    private apiServcie: ApiService,
    private chatService: ChatService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.chatService.rooms$.subscribe((rooms) => {
      this.rooms = rooms;
      console.log(rooms, 'rooms in room list');
    });
    // this.seoService.setTitle(firstRoom.title);
    // this.roomTitleEv.emit(firstRoom.title);
  }

  getRoomTitle(title: string) {
    this.roomTitleEv.emit(title);
  }
}
