import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  messages: any[] = [];
  
 roomMessages = [
    {
      message_id: 1,
      room_id: '2',
      content: "Hi there",
      attachments: null,
      type: "text",
      created_at: new Date('2022-08-11T04:45').getTime(),
      user:{
        user_id: 1,
        profile_picture: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=300',
        fullname: 'Jane mark',
     username:'jane_mark'
      }
    }, 
    {
      message_id: 1,
      room_id: '1',
      content: 'https://raw.githubusercontent.com/Lucky-victory/zplayer/master/songs/angels-like-you.mp3',
      attachments: null,
      type: "audio",
      created_at: new Date('2022-08-12T04:45').getTime(),
      user:{
        user_id: 1,
        profile_picture: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=300',
        fullname: 'Jane mark',
     username:'jane_mark'
      }
    }, {
      
      message_id: 2,
      room_id: '1',
      content: "Hi over there",
      attachments: null,
      type: "text",
      created_at: new Date().getTime(),
   user:{
        user_id: 2,
        profile_picture: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=600',
        fullname: 'Paul Give',
username:'paul_give'
      }
    }
  ];
  roomId: string;
  constructor(private activeRoute: ActivatedRoute,private apiService:ApiService,private webSocketService:WebSocketService) {
    
   }

  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((params)=> {
      this.roomId = params.get('room');
      
      this.messages = this.roomMessages.filter((roomMessage) => roomMessage.room_id===this.roomId)
    })
  }

}
