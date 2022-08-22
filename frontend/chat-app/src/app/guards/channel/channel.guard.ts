import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { ChatService } from 'src/app/services/chat/chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelGuard implements CanActivate {
  channels: any;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private chatService: ChatService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.chatService.getChannelsForUser().then((result: any) => {
      const channels = result.data;
      console.log(channels, 'ch');
      if (channels?.length) {
        this.router.navigate(['/channels', channels[0].channel_id]);
        return true;
      }
    });
  }
}
