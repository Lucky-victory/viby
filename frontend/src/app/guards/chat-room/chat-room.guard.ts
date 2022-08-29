import { ChatService } from 'src/app/services/chat/chat.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IResponse } from 'src/app/interfaces/common.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomGuard implements CanActivate {
  private isValidMember: boolean;
  constructor(
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService
  ) {}
  async canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const channelId = childRoute.paramMap.get('channel_id');
 

    const userId = this.authService?.currentUser?.user_id;
    const result = (await this.chatService
      .validateChannelMember(channelId, userId)
      .toPromise()) as IResponse<{ is_member: boolean }>;
    this.isValidMember = result?.data?.is_member;
    if (this.isValidMember) {
      return true;
    }
    return this.router.navigate(['/not-found']);
  }
}
