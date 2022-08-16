import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Socket,io } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
import { IMessageToView, INewMessage } from 'src/app/interfaces/message.interface';
import { IUser } from 'src/app/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(private socket:Socket,private activeRoute:ActivatedRoute) { }
  joinRoom(roomId: string) {
    // const roomId = this.activeRoute.snapshot.queryParamMap.get('room');
    this.socket.emit('join_room',roomId)
  }
  joinChannel(channelId:string) {
    this.socket.emit('join_channel',channelId)
    
  }
  leaveChannel(channelId:string) {
    
  }
  onNewMessage(roomId: string,message:INewMessage,user:IUser) {
  this.socket.emit('new_message',message,roomId,user)
}
onReceiveMessage(cb:(msg:IMessageToView) => void) {
  this.socket.on('receive_message', (message:IMessageToView) => {
    cb(message)
    console.log(message,'from msocket')
  })
  
}
  onMessageEdit(message:IMessageToView) {
     this.socket.emit('edit_message',message)
  }
  onUserJoin(userId:string) {
}
}
