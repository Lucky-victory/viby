import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private roomId: string;
  private channelId: string;
  constructor(private activeRoute: ActivatedRoute) { }
  
  
}


