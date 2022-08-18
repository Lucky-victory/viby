import { IUserToView } from '../../interfaces/user.interface';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Socket,io } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
import {
  IMessageToView,
  INewMessage,
} from 'src/app/interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private socket: Socket, private activeRoute: ActivatedRoute) {}
  joinRoom(channelId: string, roomId: string, user: IUserToView) {
    // const roomId = this.activeRoute.snapshot.queryParamMap.get('room');
    this.socket.emit('join_room', channelId, roomId, user);
  }
  joinChannel(channelId: string, user: IUserToView) {
    this.socket.emit('join_channel', channelId, user);
  }
  leaveChannel(channelId: string) {}
  newMessage(roomId: string, message: INewMessage, user: IUserToView) {
    this.socket.emit('new_message', message, roomId, user);
  }
  onReceiveMessage(cb: (msg: IMessageToView) => void) {
    this.socket.on('new_message', (message: IMessageToView) => {
      cb(message);
      console.log(message, 'from msocket');
    });
  }
  onMessageEdit(message: IMessageToView) {
    this.socket.emit('edit_message', message);
  }
  typing(user: IUserToView, roomId: string) {
    this.socket.emit('typing', user, roomId);
  }
  onTyping(cb: (users: IUserToView[]) => void) {
    this.socket.on('typing', (users: IUserToView[]) => {
      cb(users);
    });
  }
  stoppedTyping(user: IUserToView, roomId: string) {
    this.socket.emit('stop_typing', user, roomId);
  }
  onStoppedTyping(cb: (users: IUserToView[]) => void) {
    this.socket.on('stop_typing', (users: IUserToView[]) => {
      cb(users);
    });
  }
  onJoinRoom(userId: string) {}
}
