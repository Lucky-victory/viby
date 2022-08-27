import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  IUserAvatarSize,
  IUserToView,
} from 'src/app/interfaces/user.interface';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements AfterViewInit {
  @Input() size: IUserAvatarSize = 'small';
  /**
   * CSS positioning, rel=relativr,abs=absolute
   */
  @Input() position: 'rel' | 'abs' = 'rel';
  /**
   * when true, adds a click event to the avatar
   */
  @Input() border: boolean = true;
  @Input() addEvent: boolean = true;
  @Input() user: IUserToView;
  @Input() showStatus: boolean = true;
  @Output() avatarClick = new EventEmitter();
  @ViewChild('userAvatar') userAvatar: ElementRef<HTMLDivElement>;
  constructor() {}

  ngAfterViewInit(): void {
    if (this.addEvent) {
      const elem = this.userAvatar.nativeElement;
      elem.addEventListener('click', (event) => {
        this.onAvatarClick(event, this.user);
      });
    }
  }
  onAvatarClick(event: Event, user: IUserToView) {
    console.log(user, 'in avatar');

    this.avatarClick.emit({ event, user });
  }
}
