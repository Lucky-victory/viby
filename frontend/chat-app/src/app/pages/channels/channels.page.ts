import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ChatListComponent } from 'src/app/components/chat-list/chat-list.component';
import { IChannel } from 'src/app/interfaces/channel.interface';
import { IMessage, IMessageToDB, INewMessage } from 'src/app/interfaces/message.interface';
import { IResponse } from 'src/app/interfaces/response.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.page.html',
  styleUrls: ['./channels.page.scss'],
})
export class ChannelsPage implements OnInit {
  private storeUrl: string = '../../../assets/store.json'
  channels: IChannel[];
  roomTitle: string;
  roomId: string;
  rooms: IRoom[];
  channelId: string;
  newMessage: INewMessage;
  @ViewChild(ChatListComponent) ChatListComponent: ChatListComponent;

  constructor(private apiService :ApiService,private activeRoute:ActivatedRoute,private authservice:AuthService) { }

  ngOnInit() {
    this.apiService.get(this.storeUrl).subscribe((result: IResponse) => {
      this.channels = result.channels;
      
      this.activeRoute.paramMap.subscribe((params) => {
        this.channelId = params.get('channel_id')
        
      });
      this.activeRoute.queryParamMap.subscribe((params) => {
        this.roomId = params.get('room');
    
      })
      
    });
    }
  getRoomTitle(title: string){
    this.roomTitle = title;
  }
  acceptNewMessage(message: INewMessage) {
    this.newMessage = message;
    this.saveMessage(message);
    this.ChatListComponent.addNewMessage(message);
  }
  saveMessage(message: INewMessage) {
    const user_id = this.authservice.currentUser?.user_id;
    const messageToSave = {
      ...message,user_id
    }
   
  
  }
 
}
