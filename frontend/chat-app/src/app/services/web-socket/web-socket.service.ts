import { Injectable } from '@angular/core';
import { Socket,io } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor() { }
  joinRoom(roomId: string) {
    
  }
  joinChannel(channelId:string) {
    
  }
  leaveChannel(channelId:string) {
    
  }
  sendMessage(roomId: string,message:object) {
  
}
}
