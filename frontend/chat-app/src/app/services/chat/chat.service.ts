import { ApiService } from 'src/app/services/api/api.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IChannel } from 'src/app/interfaces/channel.interface';
import { IRoom } from 'src/app/interfaces/room.interface';
import { delay, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private roomId: string;
  private channelId: string;
  private channels$ = new Subject<IChannel[]>();
  private rooms = new Subject<IRoom[]>();
  rooms$ = this.rooms.asObservable();
  private readonly retryCount = 3;
  private readonly delayTime = 2000;
  constructor(private apiService: ApiService) {}

  setChannels(channels) {
    this.channels$.next(channels);
    console.log(this.channels$);
  }
  getChannelsForUser() {
    return this.apiService.get('/user/channels').toPromise();
  }
  getChannels() {
    return this.apiService.get(`/channels`).pipe(retry(3));
  }
  getChannel(channelId: string) {
    return this.apiService
      .get(`/channels/${channelId}`)
      .pipe(retry(this.retryCount), delay(this.delayTime))
      .toPromise();
  }
  getRooms(channelId: string) {
    return this.apiService.get(`/channels/${channelId}/rooms`).toPromise();
  }
  setRooms(rooms: IRoom[]) {
    this.rooms.next(rooms);
  }
}
