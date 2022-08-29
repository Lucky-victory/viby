import { ApiService } from 'src/app/services/api/api.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  IChannel,
  IChannelToView,
  INewChannel,
} from 'src/app/interfaces/channel.interface';
import { INewRoom, IRoom } from 'src/app/interfaces/room.interface';
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
  private channels = new Subject<IChannelToView[]>();
  channels$ = this.channels.asObservable();
  private channel = new Subject<IChannelToView>();
  channel$ = this.channel.asObservable();
  private channelsForUser = new Subject<IChannelToView[]>();
  channelsForUser$ = this.channelsForUser.asObservable();
  private rooms = new Subject<IRoom[]>();
  rooms$ = this.rooms.asObservable();
  private room = new Subject<IRoom>();
  room$ = this.room.asObservable();
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
    this.channels.next(channels);
  }
  getChannelsForUser() {
    return this.apiService.get('/user/channels');
  }
  getChannels() {
    return this.apiService
      .get(`/channels`)
      .pipe(retry(this.retryCount), delay(this.delayTime));
  }
  setChannel(channel: IChannelToView) {
    this.channel.next(channel);
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
  getRoom(roomId: string) {
    return this.apiService
      .get(`/rooms/${roomId}`)
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
  setRoom(room: IRoom) {
    this.room.next(room);
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
  createRoom(channelId: string, newRoom: INewRoom) {
    return this.apiService.post(`/rooms/${channelId}`, newRoom);
  }
  createChannel(channel: INewChannel) {
    return this.apiService.post(`/channels`, channel);
  }
}
