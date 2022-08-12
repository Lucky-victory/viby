import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'chat-single-chat-audio',
  templateUrl: './chat-single-chat-audio.component.html',
  styleUrls: ['./chat-single-chat-audio.component.scss'],
})
export class ChatSingleChatAudioComponent implements OnInit {
  @Input() chat;

  constructor() { }

  ngOnInit() {}

}
