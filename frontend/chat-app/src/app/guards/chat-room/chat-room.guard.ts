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
  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const channelId = childRoute.paramMap.get('channel_id');
    console.log(channelId);

    const userId = this.authService.currentUser.user_id;
    this.chatService
      .validateChannelMember(channelId, userId)
      .pipe(
        tap(
          (result: IResponse<{ is_member: boolean }>) =>
            (this.isValidMember = result?.data?.is_member)
        )
      )
      .subscribe((result) => {
        console.log(this.isValidMember);
      });

    if (this.isValidMember) {
    }
    return true;
    // return this.router.navigate(['/not-found']);
  }
  validate(channelId: string) {}
}
