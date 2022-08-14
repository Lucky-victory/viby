import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  channel: any;
  rooms: any[]=[];
  channelId: string;
  roomId: string;
  channels=[
    {
      "channel_id": "1",
      "channel_cover": "https://images.pexels.com/photos/6489667/pexels-photo-6489667.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      "channel_picture": "https://images.pexels.com/photos/3357026/pexels-photo-3357026.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      "title": "Home for all",
      "description":"A home for all channel",
      "members": ["userid1", "userid2"],
      "isPublic":true,
      "permission": {
        "owner": true,
        "moderator": true
      },
      "moderators": ["userid1","userid2"],
      "rooms": [
        {
          "room_id": "1",
          "title": "introduction",
          "message_allowed": false
        
        },
        {
          "room_id": "2",
          "title": "general",
          "message_allowed": true
        
        },
        {
          "room_id": "3",
          "title": "get-help",
          "message_allowed": true
        
        }
      ]
  }, {
      "channel_id": "2",
      "channel_cover": "https://images.pexels.com/photos/11071498/pexels-photo-11071498.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      "channel_picture": "https://images.pexels.com/photos/13095218/pexels-photo-13095218.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      "title": "Just a server",
      "members": ["userid1", "userid2"],
      "isPublic":true,
      "permission": {
        "owner": true,
        "moderator": true
      },
      "moderators": ["userid1","userid2"],
      "rooms": [
        {
          "room_id": "1",
          "title": "introduction",
          "message_allowed": false
        
        },
        {
          "room_id": "2",
          "title": "another room",
          "message_allowed": true
        
        },
        {
          "room_id": "3",
          "title": "help needed",
          "message_allowed": true
        
        }
      ]
  } ]


   constructor(private router:Router,private activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
      this.channel = this.channels.find((channel) => channel.channel_id === this.channelId);
      this.rooms = this.channel?.rooms;
      if (this.rooms?.length) {
        this.router.navigate([], {
          queryParams:{room:this.rooms[0].room_id}
        })
      }
      })
    this.activeRoute.queryParamMap.subscribe((params) => {
      this.roomId = params.get('room');
        
      })
  }
  

}
