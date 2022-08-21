import { IUserToView } from '../../interfaces/user.interface';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Socket,io } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
import {
  IMessageToView,
  INewMessage,
} from 'src/app/interfaces/message.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private newMessage$ = new Subject<IMessageToView>();
  private joinRoom$ = new Subject<IMessageToView[]>();
  constructor(private socket: Socket) {}
  joinRoom(channelId: string, roomId: string, user: IUserToView) {
    this.socket.emit('join_room', channelId, roomId, user);
  }
  joinChannel(channelId: string, user: IUserToView) {
    this.socket.emit('join_channel', channelId, user);
  }
  connect() {
    return this.socket.connect();
  }
  onJoinChannel() {
    return this.socket.fromOneTimeEvent('join_channel');
  }
  leaveChannel(channelId: string) {}
  newMessage(roomId: string, message: INewMessage, user: IUserToView) {
    this.socket.emit('new_message', message, roomId, user);
  }
  onReceiveMessage() {
    return this.socket.fromEvent('new_message');
  }
  onMessageEdit(message: IMessageToView) {
    this.socket.emit('edit_message', message);
  }
  typing(user: IUserToView, roomId: string) {
    this.socket.emit('typing', user, roomId);
  }
  onTyping() {
    return this.socket.fromEvent('typing');
  }
  stoppedTyping(user: IUserToView, roomId: string) {
    this.socket.emit('stop_typing', user, roomId);
  }
  onStoppedTyping(cb: (users: IUserToView[]) => void) {
    this.socket.on('stop_typing', (users: IUserToView[]) => {
      cb(users);
    });
  }
  onJoinRoom() {
    return this.socket.fromEvent('join_room');
  }
}
