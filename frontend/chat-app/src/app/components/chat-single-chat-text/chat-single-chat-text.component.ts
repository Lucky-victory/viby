import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IMessageToView } from 'src/app/interfaces/message.interface';

@Component({
  selector: 'chat-single-chat-text',
  templateUrl: './chat-single-chat-text.component.html',
  styleUrls: ['./chat-single-chat-text.component.scss'],
})
export class ChatSingleChatTextComponent implements OnInit {
  @Input() chat:IMessageToView;
  @Input() currentUser = {
    user_id:'1'
  }
  isCurrentUser!: boolean;
isMobile!: boolean;
  constructor(private platform: Platform) {
    this.isMobile = !this.platform.is('desktop');
   }
  ngOnInit(chat = this.chat) {
    this.isCurrentUser = chat?.user?.user_id === this.currentUser?.user_id;
  }

}
