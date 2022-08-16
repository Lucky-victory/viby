import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IChannel } from 'src/app/interfaces/channel.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  channel: any;
  @Output() roomTitleEv: EventEmitter<string> = new EventEmitter<string>();
  @Input() activeChannel: IChannel;
  rooms: any[]=[];
  channelId: string;
  roomId: string;
  roomsSample:IRoom[]= [
     
        {
          "room_id": "1",
          channel_id:'2',
          "title": "introduction",
         created_at:new Date().getTime()
        
        
        },
        {
          "room_id": "2",
          channel_id:'2',

          "title": "another room",
    
        created_at:new Date().getTime()
        
        },
        {
          "room_id": "3",
          channel_id:'2',

          "title": "help needed",
        created_at:new Date().getTime()
        
        },  {
          "room_id": "1",
          channel_id:'1',
          "title": "introduction",
        created_at:new Date().getTime()
      
        
        },
        {
          "room_id": "2",
          channel_id:'1',

          "title": "general",
      
        created_at:new Date().getTime()
        
        },
        {
          "room_id": "3",
          "title": "get-help",
          channel_id:'1',
        created_at:new Date().getTime()
        
        
        }
      
  ]
  channels=[
    {
      "channel_id": "1",
      "channel_cover": "https://images.pexels.com/photos/6489667/pexels-photo-6489667.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      "channel_picture": "https://images.pexels.com/photos/3357026/pexels-photo-3357026.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      "title": "Home for all",
      "description":"A home for all channel",
      "is_public":true,

    
  }, {
      "channel_id": "2",
      "channel_cover": "https://images.pexels.com/photos/11071498/pexels-photo-11071498.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      "channel_picture": "https://images.pexels.com/photos/13095218/pexels-photo-13095218.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      "title": "Just a server",
  
      "is_public":true,
  
     
  } ]


   constructor(private router:Router,private activeRoute:ActivatedRoute,private apiServcie:ApiService) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
    })
    // this.channel
    this.rooms =this.roomsSample.filter((room) => room.channel_id === this.channelId);
      if (this.rooms?.length) {
        this.router.navigate([], {
          queryParams:{room:this.rooms[0]?.room_id}
        });
        this.roomTitleEv.emit(this.rooms[0]?.title)
      }
    this.activeRoute.queryParamMap.subscribe((params) => {
      this.roomId = params.get('room');
        
      })
  }
  
  getRoomTitle(title:string) {
    this.roomTitleEv.emit(title)
  
}
}
