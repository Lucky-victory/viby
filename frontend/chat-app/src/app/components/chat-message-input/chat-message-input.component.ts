import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { AudioPlayer } from 'src/app/services/audio/audio.service';
// import { AudioRecorderService } from 'src/app/services/recorder/recorder.service';
import { v4 as uuidV4 } from 'uuid';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import {  IUserToView } from 'src/app/interfaces/user.interface';

import {
  
  INewMessage,
  MessageInputStatus,
  IMessageType,
} from 'src/app/interfaces/message.interface';

@Component({
  selector: 'chat-message-input',
  templateUrl: './chat-message-input.component.html',
  styleUrls: ['./chat-message-input.component.scss'],
})
export class ChatMessageInputComponent implements OnInit {
  textMessage: string = '';
  // audioMessage:string|Blob|ArrayBuffer=''
  isEmpty: boolean = true;
  // isRecording: boolean = false;
  private roomId: string;
  private message: INewMessage;
  private messageType: IMessageType = 'text';
  private textMessageInputStatus: MessageInputStatus = 'create';
  // private  readonly audioPlayer:AudioPlayer=new AudioPlayer()
  @Output() onMessageSend = new EventEmitter<INewMessage>();
  private channelId: string;
  typingUsers: IUserToView[];
  constructor(
    private activeRoute: ActivatedRoute,
    private webSocketService: WebSocketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((params) => {
      this.roomId = params.get('room');
    });
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
    });
    this.webSocketService.onTyping().subscribe((users:IUserToView[]) => {
      this.typingUsers = users;
      console.log('typing');
    });
  }

  handleKeyUp(event: KeyboardEvent) {
    this.handleEnterKey(event);
    this.checkInput();
    this.handleTyping();
  }
  handleTyping() {
    const user = this.authService.currentUser;
    this.webSocketService.typing(user, this.roomId);
    
      
    
  }
  checkInput() {
    // this.isEmpty = this.textMessage === '' && !this.isRecording;
    this.isEmpty = this.textMessage === '';
  }
  clearInput() {
    this.textMessage = '';
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

    //     this.onMessageSend.emit(this.message);
    //       return
    // }
    this.message = {
      message_id: uuidV4(),
      content: this.textMessage,
      room_id: this.roomId,
      attachments: null,
      channel_id: this.channelId,
      created_at: null,
      type: this.messageType,
    };
    console.log(this.message, 'here at input');

    this.onMessageSend.emit(this.message);
  }
  handleEnterKey(event: KeyboardEvent) {
    if (event.shiftKey && event.key == 'Enter') {
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }
  sendMessage() {
    // this.isRecording = false;
    if (this.isEmpty) return;
    this.createMessageObj();
    this.clearInput();
    this.checkInput();
  }
  // startRecorder() {
  //   this.isRecording = true;
  //   this.messageType = 'audio';
  //   this.recorderService.start();
  //   setTimeout(async () => {
  //     this.recorderService.stop().then((blob) => {

  //       this.recorderService.getBlobOrBase64(blob,(data) => {
  //         const src=(data as string)
  //         console.log(src, 'from src');
  //       this.audioPlayer.create(src);

  //       this.audioMessage = data;
  //     })
  //   });
  //   },4000)

  // }
  // playAndPause() {
  //   this.audioPlayer.play();
  // }
}
