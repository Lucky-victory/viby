import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {

  constructor(private utilsService:UtilsService) { }

  ngOnInit() {
  }
  async showAction() {
      await this.utilsService.showActionSheet()
    
  }
}
