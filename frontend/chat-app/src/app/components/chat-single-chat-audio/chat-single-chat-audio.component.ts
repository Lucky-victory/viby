import { Component, Input, OnInit } from '@angular/core';
import { Platform, RangeCustomEvent } from '@ionic/angular';
import { AudioPlayer } from 'src/app/services/audio/audio.service';

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
  formattedTimePlayed!: string;
  private audioPlayer: AudioPlayer = new AudioPlayer();
  constructor(private platform: Platform,) {
    this.isMobile = !this.platform.is('desktop');
   }
 ngOnInit(chat = this.chat) {
   this.isCurrentUser = chat?.user?.user_id === this.currentUser?.user_id;
   const audioSrc = chat?.content;
   this.audioPlayer.src = audioSrc;
   this.isPaused = this.audioPlayer.paused;
   this.isLoading = this.audioPlayer.isLoading;
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
     await this.audioPlayer.play();
     this.isPaused = false;
  }
  pause() {
     this.audioPlayer.pause();
     this.isPaused = true;
  }
  private loadEventHandlers() {
    this.audioPlayer.on('load', () => {
      console.log(this.audioPlayer.duration,'in load');
    })
    this.audioPlayer.on('loadedmetadata', () => {
      this.loadMetaData();
    });
    this.audioPlayer.on('timeupdate', () => {
      this.updateTimePlayed();
    });
    this.audioPlayer.on('ended', () => {
      this.audioEnd();
    });
  }
  private updateTimePlayed() {
    this.timePlayed = this.audioPlayer.currentTime;
    this.formattedTimePlayed = this.audioPlayer.secondsToTime(this.timePlayed);
  }
  seekAudio(ev: Event) {
    const value = (ev as RangeCustomEvent).detail.value;
    
    this.audioPlayer.currentTime = value as number;

  }
  private audioEnd() {
    this.pause()
  
  }
  private loadMetaData() {
     console.log(this.audioPlayer.duration);
      
   this.duration = this.audioPlayer.duration;
 this.formattedTimePlayed = this.audioPlayer.secondsToTime(this.duration);
    
  }
}
