import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { IMessageToView } from 'src/app/interfaces/message.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnDestroy, AfterViewInit {
  messages: IMessageToView[] = [];
  private newMessage: IMessageToView;
  @Input() currentUser: IUser;
  @ViewChild('chatListContainer') chatListContainer: ElementRef;
  private roomId: string;
  private channelId: Observable<string>;
  private newMessageSub: Subscription;
  private joinRoomSub: Subscription;
  private scrollEvent$: Observable<any>;
  private scrollEventSub: Subscription;
  private debounceTimeout: number = 300;
  private isScrolledDown: boolean = true;
  constructor(
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    this.channelId = this.activeRoute.paramMap.pipe(
      switchMap((params) => params.get('channel_id'))
    );
    this.activeRoute.queryParamMap.subscribe((params) => {
      this.roomId = params.get('room');
      console.log(this.roomId);

      //this.messages = this.roomMessages.filter((roomMessage) => roomMessage.room_id === this.roomId);
    });

    this.joinRoomSub = this.webSocketService
      .onJoinRoom()
      .subscribe((messages: IMessageToView[]) => {
        console.log(messages, 'messages');

        this.messages = messages;
      });
    this.newMessageSub = this.webSocketService
      .onReceiveMessage()
      .subscribe((message: IMessageToView) => {
        console.log(message);

        this.messages.push(message);
      });
  }
  ngAfterViewInit(): void {
    const elem = this.chatListContainer.nativeElement;
    console.log(elem);

    this.scrollEvent$ = fromEvent(elem, 'scroll');
    this.scrollEventSub = this.scrollEvent$
      .pipe(debounceTime(this.debounceTimeout))
      .subscribe(() => {
        const scrollPosition = elem.scrollTop;
        const totalContentHeight = elem.scrollHeight;
        const viewportHeight = elem.offsetHeight;
        const scrollPoint =
          scrollPosition - (totalContentHeight - viewportHeight);
        const atBottom = Math.abs(scrollPoint) < 30;

        this.isScrolledDown = atBottom;
      });
  }
  ngOnDestroy(): void {
    this.joinRoomSub.unsubscribe();
    this.newMessageSub.unsubscribe();
    this.scrollEventSub.unsubscribe();
  }

  /**
   * Autoscrolls (only if user is scrolled down), the chatListContainer to bottom when a new message is added to the DOM
   */
  scrollToBottom(event: Event) {
    const elem = event as unknown as HTMLDivElement;
    if (this.isScrolledDown) {
      elem.scrollTop = elem.scrollHeight;
    }
  }
  editFunc(chat) {
    console.log(chat, 'from edit');
  }
  deleteFunc(chat) {
    console.log(chat, 'from delete');
  }
}
