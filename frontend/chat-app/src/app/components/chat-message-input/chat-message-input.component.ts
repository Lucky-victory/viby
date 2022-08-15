import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AudioPlayer } from 'src/app/services/audio/audio.service';
import { AudioRecorderService } from 'src/app/services/recorder/recorder.service';
import { v4 as uuidV4 } from 'uuid';
@Component({
  selector: 'chat-message-input',
  templateUrl: './chat-message-input.component.html',
  styleUrls: ['./chat-message-input.component.scss'],
})
export class ChatMessageInputComponent implements OnInit {
  textMessage: string = '';
  isEmpty: boolean = true;
  isRecording: boolean = false;
  roomId: string;
  message: any;
  private  readonly audioPlayer:AudioPlayer=new AudioPlayer()
  @Output() onNewMessage = new EventEmitter<any>();
  private channelId: string;
  constructor(private activeRoute:ActivatedRoute, private recorderService:AudioRecorderService) { }

  ngOnInit() { 
    this.activeRoute.queryParamMap.subscribe((params)=>{
      this.roomId = params.get('room');
    })
    this.activeRoute.paramMap.subscribe((params) => {
      this.channelId = params.get('channel_id');
    });
  }
  
  handleKeyUp(event:KeyboardEvent) {
  
    this.handleEnterKey(event)
    this.checkInput();
  }
  checkInput() {
    this.isEmpty = this.textMessage === '';
    
  }
  clearInput() {
    this.textMessage = '';
  }
  createMessageObj() {

    this.message = {
      message_id: uuidV4(),
      content: this.textMessage,
      room_id: this.roomId,
      channel_id:this.channelId,
      created_at: new Date().getTime(),
      type:'text'
    }
    console.log(this.message);
    this.onNewMessage.emit(this.message);
    
  }
  handleEnterKey(event:KeyboardEvent) {
    if (event.shiftKey && event.key == 'Enter') {
      return
    }
    if ( event.key === 'Enter') {
      event.preventDefault();
    this.sendMessage()
    }
  }
  sendMessage() {
    if (this.isEmpty) return;
    this.createMessageObj();
    this.clearInput()
  }
  startRecorder() {
    this.isRecording = true;
    this.recorderService.start();
    setTimeout(async () => {
      await this.recorderService.stop();
      this.recorderService.getBlobOrBase64((data) => {
        console.log(data, 'from input');
        this.audioPlayer.create(data as string);
      })
    },4000)

  }
  playAndPause() {
    this.audioPlayer.play();
  }
}
