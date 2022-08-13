import { Component, Input, OnInit } from '@angular/core';
import { Platform, RangeCustomEvent } from '@ionic/angular';
import { AudioService } from 'src/app/services/audio/audio.service';

@Component({
  selector: 'chat-single-chat-audio',
  templateUrl: './chat-single-chat-audio.component.html',
  styleUrls: ['./chat-single-chat-audio.component.scss'],
})
export class ChatSingleChatAudioComponent implements OnInit {
  @Input() chat;
  @Input() currentUser = {
    user_id: 1
  };
  isCurrentUser!: boolean;
  isMobile!: boolean;
  isPaused!: boolean;
  isLoading!: boolean;
  duration!: number;
  timePlayed: number = 0;
  formattedTimePlayed!:string;
  constructor(private platform: Platform,private audioService:AudioService) {
    this.isMobile = !this.platform.is('desktop');
   }
 ngOnInit(chat = this.chat) {
   this.isCurrentUser = chat?.user?.user_id === this.currentUser?.user_id;
   const audioSrc = chat?.content;
   this.audioService.setSrc(audioSrc);
   this.isPaused = this.audioService.paused;
   this.isLoading = this.audioService.isLoading;
   this.loadEventHandlers();

 }
  async playAndPause() {
   
   if (this.isPaused) {
     await this.play();
    }
    else {
    this.pause();
    }
  }
  async play() {
     await this.audioService.play();
     this.isPaused = false;
  }
  pause() {
     this.audioService.pause();
     this.isPaused = true;
  }
  private loadEventHandlers() {
    this.audioService.on('loadedmetadata', () => {
   this.duration = this.audioService.duration;
 this.formattedTimePlayed = this.audioService.secondsToTime(this.duration);
    });
    this.audioService.on('timeupdate', () => {
      this.updateTimePlayed();
    });
    this.audioService.on('ended', () => {
      this.audioEnd();
    });
  }
  private updateTimePlayed() {
    this.timePlayed = this.audioService.currentTime;
    this.formattedTimePlayed = this.audioService.secondsToTime(this.timePlayed);
  }
  seekAudio(ev: Event) {
    const value = (ev as RangeCustomEvent).detail.value;
    
    this.audioService.currentTime = value as number;

  }
  private audioEnd() {
    this.pause()
  
  }
}
