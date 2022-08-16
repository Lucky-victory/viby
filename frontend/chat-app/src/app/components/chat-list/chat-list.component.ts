import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMessage, IMessageToView, INewMessage } from 'src/app/interfaces/message.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  messages: IMessageToView[] ;
  private newMessage: IMessageToView;
  @Input() currentUser: IUser;
 roomMessages:IMessageToView[] = [
    {
      message_id: '1',
      room_id: '2',
      channel_id:'2',
      content: "Hi there",
      attachments: null,
      type: "text",
      created_at: new Date('2022-08-11T04:45').getTime(),
      user:{
        user_id: '1',
        profile_picture: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=300',
        fullname: 'Jane mark',
        username: 'jane_mark',
     cover_picture:''
      }
    }, 
    {
      message_id: '1',
      room_id: '1',
      channel_id:'2',
      content: 'https://raw.githubusercontent.com/Lucky-victory/zplayer/master/songs/angels-like-you.mp3',
      attachments: null,
      type: "audio",
      created_at: new Date('2022-08-12T04:45').getTime(),
      user:{
        user_id: '2',
        profile_picture: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=300',
        fullname: 'Jane mark',
        username: 'jane_mark',
     cover_picture:''
     
      }
    }, {
      
      message_id:'2',
      room_id: '1',
      channel_id:'1',
      content: "Hi over there",
      attachments: null,
      type: "text",
      created_at: new Date().getTime(),
   user:{
        user_id: '2',
        profile_picture: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=600',
        fullname: 'Paul Give',
     username: 'paul_give',
     cover_picture:''

      }
    }
  ];
 private roomId: string;
  private channelId: string;
  constructor(private activeRoute: ActivatedRoute,private apiService:ApiService,private webSocketService:WebSocketService,private authService:AuthService) {
    
   }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params)=> {
      this.channelId = params.get('channel_id');
    this.activeRoute.queryParamMap.subscribe((params)=> {
      this.roomId = params.get('room');
      console.log(this.roomId);
      
      this.messages = this.roomMessages.filter((roomMessage) => roomMessage.room_id === this.roomId);
    })
       this.webSocketService.onReceiveMessage((message) => {
      this.messages.push(message);
      
    })
    })
  }
  addNewMessage(message:INewMessage){
    // const msg = message;
    // if (msg) {
    //   // this.newMessage = {
    //   //   ...msg,user:
    //   //   this.authService?.currentUser
    //   // }
    //   // console.log(this.newMessage,'new');
      
      
    // }
   

}
}
