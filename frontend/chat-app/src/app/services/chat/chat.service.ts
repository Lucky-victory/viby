import { ApiService } from 'src/app/services/api/api.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IChannel } from 'src/app/interfaces/channel.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private roomId: string;
  private channelId: string;
  private channels$ = new Subject<IChannel[]>();

  constructor(private apiService: ApiService) {}

  setChannels(channels) {
    this.channels$.next(channels);
    console.log(this.channels$);
  }
  getChannels() {
    return this.apiService.get('/channels').toPromise();
  }
  getChannel(channelId: string) {
    return this.apiService.get(`/channels/${channelId}`).toPromise();
  }
  getRooms(channelId: string) {
    return this.apiService.get(`/channels/${channelId}/rooms`).toPromise();
  }
}
