import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRoom } from 'src/app/interfaces/room.interface';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
})
export class RoomItemComponent implements OnInit {
  @Input() room: IRoom;
  roomId: string;
  @Output() roomTitleEv: EventEmitter<string> = new EventEmitter<string>();
  channelId: string;
  constructor(private router:Router,private activeRoute:ActivatedRoute,private webSocketService:WebSocketService) { }

  ngOnInit() {
    this.channelId = this.activeRoute.snapshot.paramMap.get('channel_id');
    
    this.webSocketService.joinChannel(this.channelId)
    
    this.roomId =this.activeRoute.snapshot.queryParamMap.get('room');
    this.webSocketService.joinRoom(this.roomId)
    
  }
  selectRoom(roomId) {
    this.router.navigate([], {
      relativeTo:this.activeRoute,
      queryParams:{room:roomId}
    })
    this.roomTitleEv.emit(this.room?.title)
  
}
}
