import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
})
export class RoomItemComponent implements OnInit {
  @Input() room: any;
  roomId: string;
  @Output() roomTitleEv: EventEmitter<string> = new EventEmitter<string>();
  channelId: string;
  constructor(private router:Router,private activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.channelId = this.activeRoute.snapshot.paramMap.get('channel_id');
    
    
  this.activeRoute.queryParamMap.subscribe((params) => {
      this.roomId = params.get('room');
        
      })
    
  }
  selectRoom(roomId) {
    this.router.navigate([], {
      relativeTo:this.activeRoute,
      queryParams:{room:roomId}
    })
    this.roomTitleEv.emit(this.room?.title)
  
}
}
