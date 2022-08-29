import { IUserToView } from '../../interfaces/user.interface';
import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';
import {
  IMessageToDB,
  INewMessage,
} from 'src/app/interfaces/message.interface';


@Injectable({
  providedIn: 'root',
})
export class WebSocketService {

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
  onConnect() {
    return this.socket.fromEvent('connect');
  }
  onJoinChannel() {
    return this.socket.fromOneTimeEvent('join_channel');
  }
  leaveChannel(channelId: string) {}
  newMessage(roomId: string, message: INewMessage, user: IUserToView) {
    this.socket.emit('new_message', message, roomId, user);
  }
  onNewMessage() {
    return this.socket.fromEvent('new_message');
  }
  audioMessage( message: INewMessage,file:File|Blob,roomId: string, user: IUserToView) {
    this.socket.emit('audio_message', message,file, roomId, user);
  }
  onAudioMessage() {
    return this.socket.fromEvent('audio_message');
  }

  messageEdit(message: IMessageToDB, roomId: string, user: IUserToView) {
    this.socket.emit('edit_message', message, roomId, user);
  }
  messageDelete(message: IMessageToDB, roomId: string, user: IUserToView) {
    this.socket.emit('delete_message', message, roomId, user);
  }
  onMessageEdit() {
    return this.socket.fromEvent('edit_message');
  }
  onMessageDelete() {
    return this.socket.fromEvent('delete_message');
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
  onStoppedTyping(cb: (users: IUserToView) => void) {
    this.socket.on('stop_typing', (users: IUserToView) => {
      cb(users);
    });
  }
  onJoinRoom() {
    return this.socket.fromEvent('join_room');
  }
  onConnectError() {
    return this.socket.fromEvent('connect_error');
  }
  off(eventName: string) {
    return this.socket.removeListener(eventName);
  }
}
