import { IMessageToDB } from './../../interfaces/message.interface';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { AudioPlayer } from 'src/app/services/audio/audio.service';
// import { AudioRecorderService } from 'src/app/services/recorder/recorder.service';
import { v4 as uuidV4 } from 'uuid';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IUserToView } from 'src/app/interfaces/user.interface';

import {
  INewMessage,
  MessageInputStatus,
  IMessageType,
} from 'src/app/interfaces/message.interface';
import { Platform } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Subscription } from 'rxjs';
import { AudioRecorderService } from 'src/app/services/recorder/recorder.service';
import { AudioPlayer } from 'src/app/services/audio/audio.service';

@Component({
  selector: 'chat-message-input',
  templateUrl: './chat-message-input.component.html',
  styleUrls: ['./chat-message-input.component.scss'],
})
export class ChatMessageInputComponent implements OnInit, OnDestroy {
  textMessage: string = '';
  // audioMessage:string|Blob|ArrayBuffer=''
  isEmpty: boolean = true;
  // isRecording: boolean = false;
  private roomId: string;
  private message: IMessageToDB;
  private messageType: IMessageType = 'text';
  private textMessageInputStatus: MessageInputStatus = 'create';
  // private  readonly audioPlayer:AudioPlayer=new AudioPlayer()
  @Output() onMessageSend = new EventEmitter<INewMessage>();
  @ViewChild('textAreaContainer') textAreaContainer: ElementRef<HTMLDivElement>;
  private channelId: string;
  typingUsers: IUserToView[];
  currentUser: IUserToView;
  showEmoji: boolean = false;
  audioPlayer = new AudioPlayer();
  private isMobile: boolean;
  private messageToEditSub: Subscription;
  isRecording: boolean;
  audioMessage: string | Blob | ArrayBuffer;
  constructor(
    private activeRoute: ActivatedRoute,
    private webSocketService: WebSocketService,
    private chatService: ChatService,
    private authService: AuthService,
    private platform: Platform,
    private recoderService: AudioRecorderService
  ) {
    this.isMobile = platform.is('mobile');
  }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params) => {
      this.roomId = params.get('room_id');
      this.channelId = params.get('channel_id');
    });
    // this.webSocketService.onTyping().subscribe((users: IUserToView[]) => {
    //   this.typingUsers = users;
    //   console.log('typing');
    // });
    this.currentUser = this.authService?.currentUser;
    this.messageToEditSub = this.chatService.messageToEdit$.subscribe(
      (message) => {
        this.message = message;
        this.textMessageInputStatus = 'edit';
        this.textMessage = message.content;
      }
    );
  }

  handleKeyDown(event: KeyboardEvent) {
    this.handleEnterKey(event);
    this.checkInput();
    this.handleTyping();
    this.showEmoji = false;
  }
  handleTyping() {
    // this.webSocketService.typing(this.currentUser, this.roomId);
  }
  checkInput() {
    this.isEmpty = this.textMessage === '' && !this.isRecording;
    // this.isEmpty = this.textMessage === '';
  }
  clearInput() {
    this.textMessage = ''.replace(/\n/g, '');
    this.messageType = 'text';
    this.textMessageInputStatus = 'create';
  }
  createMessageObj() {
    //     if (this.messageType === 'audio') {

    //     this.message = {
    //       message_id: uuidV4(),
    //       content: this.audioMessage,
    //       room_id: this.roomId,
    //       attachments:null,
    //       channel_id:this.channelId,
    //       created_at: new Date().getTime(),
    //       type:this.messageType
    //     }

    //       return
    // }
    if (this.textMessageInputStatus === 'edit') {
      this.message.content = this.textMessage;
      this.webSocketService.messageEdit(
        this.message,
        this.roomId,
        this.currentUser
      );

      return;
    }
    this.message = {
      message_id: uuidV4(),
      content: this.textMessage,
      room_id: this.roomId,
      attachments: null,
      channel_id: this.channelId,
      created_at: null,
      type: this.messageType,
      user_id: this.currentUser?.user_id,
    };

    this.webSocketService.newMessage(
      this.roomId,
      this.message,
      this.currentUser
    );

    // this.onMessageSend.emit(this.message);
  }
  handleEnterKey(event: KeyboardEvent) {
    if (event.shiftKey && event.key == 'Enter') {
      return;
    }

    if (event.key === 'Enter' && !this.isMobile) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  addEmoji(event) {
    this.textMessage += event?.emoji?.native;
    this.checkInput();
  }
  toggleEmojiBox() {
    this.showEmoji = !this.showEmoji;
  }
  sendMessage() {
    this.isRecording = false;
    if (this.isEmpty) return;
    this.createMessageObj();
    this.clearInput();
    this.checkInput();
    this.showEmoji = false;
  }
  startRecorder() {
    this.isRecording = true;
    this.messageType = 'audio';
    this.recoderService.start();
    setTimeout(async () => {
      this.recoderService.stop().then((blob) => {
        this.recoderService.getBlobOrBase64(blob, (data) => {
          const src = data as string;
          console.log(src, 'from src');
          this.audioPlayer.create(src);

          this.audioMessage = data;
        });
      });
    }, 4000);
  }
  playAndPause() {
    this.audioPlayer.play();
  }

  ngOnDestroy(): void {
    this.messageToEditSub.unsubscribe();
  }
}
