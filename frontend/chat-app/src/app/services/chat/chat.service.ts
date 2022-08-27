import { ApiService } from 'src/app/services/api/api.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IChannel, IChannelToView } from 'src/app/interfaces/channel.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import { delay, retry } from 'rxjs/operators';
import {
  IMessageToDB,
  IMessageToView,
} from 'src/app/interfaces/message.interface';
import { IUserToView } from 'src/app/interfaces/user.interface';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private roomId: string;
  private channelId: string;
  private channels$ = new Subject<IChannelToView[]>();
  private channelsForUser = new Subject<IChannelToView[]>();
  channelsForUser$ = this.channelsForUser.asObservable();
  private rooms = new Subject<IRoom[]>();
  rooms$ = this.rooms.asObservable();
  private messageToEdit = new Subject<IMessageToDB>();
  messageToEdit$ = this.messageToEdit.asObservable();
  private messageToDelete = new Subject<IMessageToDB>();
  messageToDelete$ = this.messageToEdit.asObservable();
  private membersInRoom = new Subject<IUserToView[]>();
  membersInRoom$ = this.membersInRoom.asObservable();
  private readonly retryCount = 3;
  private readonly delayTime = 2000;
  constructor(private apiService: ApiService) {}
  /**
   * check if the user accessing a channel url is a member of that channel
   * @param userId
   * @returns
   */
  validateChannelMember(channelId: string, userId: string) {
    return this.apiService.post(`/channels/${channelId}/member`, {
      user_id: userId,
    });
  }
  setChannels(channels) {
    this.channels$.next(channels);
  }
  getChannelsForUser() {
    return this.apiService.get('/user/channels');
  }
  getChannels() {
    return this.apiService
      .get(`/channels`)
      .pipe(retry(this.retryCount), delay(this.delayTime));
  }
  getChannel(channelId: string) {
    return this.apiService
      .get(`/channels/${channelId}`)
      .pipe(retry(this.retryCount), delay(this.delayTime));
  }
  getRooms(channelId: string) {
    return this.apiService
      .get(`/channels/${channelId}/rooms`)
      .pipe(retry(this.retryCount), delay(this.delayTime));
  }
  getMembersInChannel(channelId: string) {
    return this.apiService
      .get(`/channels/${channelId}/members`)
      .pipe(retry(this.retryCount), delay(this.delayTime));
  }
  getMembersInRoom(roomId: string) {
    return this.apiService
      .get(`/rooms/${roomId}/members`)
      .pipe(retry(this.retryCount), delay(this.delayTime));
  }
  setRooms(rooms: IRoom[]) {
    this.rooms.next(rooms);
  }
  setChannelsForUser(channels: IChannelToView[]) {
    this.channelsForUser.next(channels);
  }
  setMessageToEdit(message: IMessageToDB) {
    return this.messageToEdit.next(message);
  }
  setMessageToDelete(message: IMessageToDB) {
    return this.messageToDelete.next(message);
  }
  setMembersInRoom(members: IUserToView[]) {
    return this.membersInRoom.next(members);
  }
  addFriend(userId: string) {
    return this.apiService.post('/user/friends', { user_id: userId });
  }
  getUser(userId: string) {
    return this.apiService.get(`/user/others/${userId}`);
  }
  createRoom(channelId: string) {
    return this.apiService.post(`/rooms/${channelId}`);
  }
  createChannel(channelId: string) {
    return this.apiService.post(`/rooms/${channelId}`);
  }
}
