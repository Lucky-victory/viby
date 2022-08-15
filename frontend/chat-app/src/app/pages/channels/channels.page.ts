import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ChatListComponent } from 'src/app/components/chat-list/chat-list.component';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.page.html',
  styleUrls: ['./channels.page.scss'],
})
export class ChannelsPage implements OnInit {
  storeUrl: string = '../../../assets/store.json'
  servers: any;
  roomTitle: string;
  roomId:string;
  channelId: string;
  newMessage: any = {};
  @ViewChild(ChatListComponent) ChatListComponent: ChatListComponent;

  constructor(private apiService :ApiService,private activeRoute:ActivatedRoute,private authservice:AuthService) { }

  ngOnInit() {
    this.apiService.get(this.storeUrl).subscribe((result: any) => {
      this.servers = result.servers;
      
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
  acceptNewMessage(message: any) {
    this.newMessage = message;
    this.saveMessage(message);
    this.ChatListComponent.addNewMessage(message);
  }
  saveMessage(message: any={}) {
    const user_id = this.authservice.currentUser?.user_id;
    const messageToSave = {
      ...message,user_id
    }
   
  console.log(messageToSave,' to save')
}
}
