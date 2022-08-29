import { UtilsService } from 'src/app/services/utils/utils.service';
import { IMessageToDB } from './../../interfaces/message.interface';
import omit from 'just-omit';
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
import { debounceTime, delay, retry, switchMap, tap } from 'rxjs/operators';
import { IMessageToView } from 'src/app/interfaces/message.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
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
  private channelId: string;
  private newMessageSub: Subscription;
  private joinRoomSub: Subscription;
  private scrollEvent$: Observable<any>;
  private scrollEventSub: Subscription;
  private connectErrorSub: Subscription;
  private debounceTimeout: number = 300;
  private isScrolledDown: boolean = true;
  private loaderDuration = 4000;
  newAudioMessageSub: Subscription;
  constructor(
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private webSocketService: WebSocketService,
    private chatService: ChatService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
      this.roomId = params.get('room_id');
    });

    this.joinRoomSub = this.webSocketService
      .onJoinRoom()
      .subscribe((messages: IMessageToView[]) => {
        console.log(messages, 'messages');

        this.messages = messages;
      });
    this.newMessageSub = this.webSocketService
      .onNewMessage()
      .subscribe((message: IMessageToView) => {
        this.messages.push(message)
      });
    this.newAudioMessageSub = this.webSocketService
      .onAudioMessage()
      .subscribe((message: IMessageToView) => {
        this.messages.push(message)
      });
    this.webSocketService
      .onMessageEdit()
      .subscribe((message: IMessageToView) => {
        this.messages = this.messages.map((prevMessage) => {
          if (prevMessage.message_id === message?.message_id) {
            return message;
          }
          return prevMessage;
        });
      });
    this.webSocketService
      .onMessageDelete()
      .subscribe((message: IMessageToView) => {
        this.messages = this.messages.filter((prevMessage) => {
          return prevMessage.message_id !== message?.message_id;
        });
      });

    this.connectErrorSub = this.webSocketService
      .onConnectError()
      .subscribe(async () => {
        await this.utilsService.showLoader({
          message: 'Reconnecting...',
          spinner: 'circles',
          duration: this.loaderDuration,
        });
      });
    // setTimeout(async () => {
    //   this.connectErrorSub.unsubscribe();
    //   await this.utilsService.showAlert({
    //     header: 'Network Error',
    //     mode: 'ios',
    //     message: "Couldn't reconnect, check your connection and refresh the page",
    //     buttons: [
    //       {
    //         text: 'Cancel',
    //         role: 'cancel',
    //       },
    //       {
    //         text: 'Refresh',
    //         role: 'reload',
    //         handler: () => {
    //           window.location.reload();
    //         },
    //       },
    //     ],
    //   });
    // }, 15000);
  }
  ngAfterViewInit(): void {
    const elem = this.chatListContainer.nativeElement;

    this.scrollEvent$ = fromEvent(elem, 'scroll');
    this.scrollEventSub = this.scrollEvent$
      .pipe(debounceTime(this.debounceTimeout))
      .subscribe(() => {
        const scrollPosition = elem.scrollTop;
        const totalContentHeight = elem.scrollHeight;
        const viewportHeight = elem.offsetHeight;
        const scrollPoint =
          scrollPosition - (totalContentHeight - viewportHeight);
        const atBottom = Math.abs(scrollPoint) < 100;

        this.isScrolledDown = atBottom;
      });
  }
  ngOnDestroy(): void {
    this.joinRoomSub.unsubscribe();
    this.newMessageSub.unsubscribe();
    this.scrollEventSub.unsubscribe();
    this.connectErrorSub.unsubscribe();
    this.newAudioMessageSub.unsubscribe()
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
  editFunc(chat: IMessageToView) {
    // remove the user property from the object
    const messageToEdit = omit(chat, ['user']) as IMessageToDB;

    this.chatService.setMessageToEdit(messageToEdit);
  }
  deleteFunc = async (chat: IMessageToView) => {
    console.log(chat, 'from delete');
    const { role } = await this.utilsService.showAlert({
      header: 'Delete Message',
      message: 'Are you sure you want to delete this message?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          role: 'destructive',
          handler: () => {
            const user = chat?.user;
            // remove the user property from the message
            const messageToDelete = omit(chat, ['user']) as IMessageToDB;

            this.webSocketService.messageDelete(
              messageToDelete,
              this.roomId,
              user
            );
          },
        },
      ],
    });
    console.log(role);
    if (role === 'destructive') {
    }
  };
}
