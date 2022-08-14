import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
})
export class RoomItemComponent implements OnInit {
  @Input() room: any;
  roomId: string;
  channelId: string;
  constructor(private router:Router,private activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
        
      })
    this.activeRoute.queryParamMap.subscribe((params) => {
      this.roomId = params.get('room');
        
      })
  }
  selectRoom(roomId) {
    this.router.navigate([], {
      relativeTo:this.activeRoute,
   queryParams:{room:roomId}
 })
  
}
}
