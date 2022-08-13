import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
 @Input() messages = [
    {
      message_id: 1,
      room_id: 1,
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
      room_id: 1,
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
      room_id: 1,
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
  constructor() { }

  ngOnInit() {}

}
