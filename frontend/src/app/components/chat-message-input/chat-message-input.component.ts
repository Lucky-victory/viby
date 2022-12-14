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
import { IRoom } from 'src/app/interfaces/room.interface';

@Component({
  selector: 'chat-message-input',
  templateUrl: './chat-message-input.component.html',
  styleUrls: ['./chat-message-input.component.scss'],
})
export class ChatMessageInputComponent implements OnInit, OnDestroy {
  textMessage: string = '';
  isEmpty: boolean = true;
  private roomId: string;
  private message: IMessageToDB;
  private messageType: IMessageType = 'text';
  messageNotAllowed: boolean = true;
  activeRoom: IRoom;
  private textMessageInputStatus: MessageInputStatus = 'create';
  private readonly audioPlayer: AudioPlayer = new AudioPlayer();
  @ViewChild('textAreaContainer') textAreaContainer: ElementRef<HTMLDivElement>;
  private channelId: string;
  typingUsers: IUserToView[];
  currentUser: IUserToView;
  showEmoji: boolean = false;
  private isMobile: boolean;
  private messageToEditSub: Subscription;
  isRecording: boolean;
  isOwner: boolean;
  audioMessage: File | Blob ;
  isPlaying: boolean;
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
    this.currentUser = this.authService?.currentUser;
    this.activeRoute.paramMap.subscribe((params) => {
      this.roomId = params.get('room_id');
      this.channelId = params.get('channel_id');
    });
    this.chatService.room$.subscribe((room) => {
      this.activeRoom = room;
      this.isOwner = this.currentUser.user_id === room?.owner_id;
      this.messageNotAllowed = !room?.message_allowed && !this.isOwner;
    });
    // this.webSocketService.onTyping().subscribe((users: IUserToView[]) => {
    //   this.typingUsers = users;
    //   console.log('typing');
    // });
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
    this.isEmpty = (this.textMessage === '' && !this.isRecording);
    // this.isEmpty = this.textMessage === '';
  }
  clearInput() {
    this.textMessage = ''.replace(/\n/g, '');
    this.messageType = 'text';
    this.textMessageInputStatus = 'create';
  }
  createMessageObj() {
    if (this.messageType === 'audio') {
      this.message = {
        message_id: uuidV4(),
        content: null,
        room_id: this.roomId,
        attachments: null,
        channel_id: this.channelId,
        created_at: null,
        type: this.messageType,
        user_id: this.currentUser?.user_id,
      };
      console.log(this.message);
      
this.webSocketService.audioMessage(
  this.message,
  this.audioMessage,
  this.roomId,
      this.currentUser
    );
      return;
    }
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
  dropRecord() {
    this.isRecording = false;
    this.audioPlayer.stop();
    this.clearInput()
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
    this.checkInput();
    
    // if (this.isEmpty) return;
    this.createMessageObj();
    this.clearInput();
    this.dropRecord();
    this.showEmoji = false;
  }
  startRecorder(event: Event) {
    this.isRecording = true;
    this.messageType = 'audio';
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      
      console.log(file);
      
      this.audioMessage = file;
      this.recoderService.getBlobOrBase64(file, (data) => {
          const src = data as string;
          this.audioPlayer.create(src);
        
        
        });
        
      }
  }
  playAndPause() {
    if (this.isPlaying) {
      this.audioPlayer.pause();
      this.isPlaying = false;
      return
    }
    this.audioPlayer.play();
    this.isPlaying = true;
  }

  ngOnDestroy(): void {
    this.messageToEditSub.unsubscribe();
  }
}
