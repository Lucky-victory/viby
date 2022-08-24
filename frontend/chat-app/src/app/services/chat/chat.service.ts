import { ApiService } from 'src/app/services/api/api.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IChannel } from 'src/app/interfaces/channel.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import { delay, retry } from 'rxjs/operators';
import {
  IMessageToDB,
  IMessageToView,
} from 'src/app/interfaces/message.interface';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private roomId: string;
  private channelId: string;
  private channels$ = new Subject<IChannel[]>();
  private rooms = new Subject<IRoom[]>();
  rooms$ = this.rooms.asObservable();
  private messageToEdit = new Subject<IMessageToDB>();
  messageToEdit$ = this.messageToEdit.asObservable();
  private readonly retryCount = 3;
  private readonly delayTime = 2000;
  constructor(private apiService: ApiService) {}

  setChannels(channels) {
    this.channels$.next(channels);
    console.log(this.channels$);
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
    return this.apiService.get(`/channels/${channelId}/rooms`);
  }
  setRooms(rooms: IRoom[]) {
    this.rooms.next(rooms);
  }
  setMessageToEdit(message: IMessageToDB) {
    return this.messageToEdit.next(message);
  }
}
