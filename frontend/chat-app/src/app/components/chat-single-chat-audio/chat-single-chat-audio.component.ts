import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionSheetOptions, Platform, PopoverOptions, RangeCustomEvent } from '@ionic/angular';
import { IResponse } from 'src/app/interfaces/common.interface';
import { IMessageToView } from 'src/app/interfaces/message.interface';
import { IUserToView } from 'src/app/interfaces/user.interface';
import { AudioPlayer } from 'src/app/services/audio/audio.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PopoverActionsComponent } from '../popover-actions/popover-actions.component';
import { UserProfileCardComponent } from '../user-profile-card/user-profile-card.component';

@Component({
  selector: 'chat-single-chat-audio',
  templateUrl: './chat-single-chat-audio.component.html',
  styleUrls: ['./chat-single-chat-audio.component.scss'],
})
export class ChatSingleChatAudioComponent implements OnInit {
  @Input() chat;
   currentUser;
  isCurrentUser!: boolean;
  isMobile!: boolean;
  isPaused!: boolean;
  isLoading!: boolean;
  duration!: number;
  timePlayed: number = 0;
  formattedTimePlayed!: string;
   @Output('ondelete') ondelete = new EventEmitter<IMessageToView>();
  private audioPlayer: AudioPlayer = new AudioPlayer();
  private canDelete: boolean;
  constructor(private platform: Platform,private chatService:ChatService,private utilsService:UtilsService,private authService:AuthService) {
    this.isMobile = !this.platform.is('desktop');
   }
  ngOnInit(chat = this.chat) {
    this.currentUser = this.authService.currentUser;
    this.isCurrentUser = chat?.user?.user_id === this.currentUser?.user_id;
    this.canDelete = this.isCurrentUser;
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
   
      
   this.duration = this.audioPlayer.duration;
 this.formattedTimePlayed = this.audioPlayer.secondsToTime(this.duration);
    
  }
   showActions = async (event, chat: IMessageToView) => {
    const buttons = [];
   
    
    if (this.canDelete) {
      buttons.push({
        text: 'Delete',
        role: 'destructive',
        icon: 'trash-outline',
        data: { id: 'delete' },
      });
    }
    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      data: { id: 'cancel' },
    });
    let options: ActionSheetOptions | PopoverOptions;
    if (this.platform.is('desktop')) {
      options = {
        component: PopoverActionsComponent,
        componentProps: { buttons },
        event,
      };
    } else {
      options = { buttons };
    }
    const { data } = await this.utilsService.showPopoverOrActionSheet(options);
   
    if (data?.id === 'delete') {
      this.deleteFunc(chat);
    }
   };
  deleteFunc(chat) {
      this.ondelete.emit(chat);
  }
  async mobilePress(event, chat: IMessageToView) {
    await this.showActions(event, chat);
  }
  async onAvatarClick({ event, user }) {
    await this.showUserProfile(event, user);
  }
  showUserProfile = async (event, user) => {
    this.chatService
      .getUser(user?.user_id)
      .subscribe(async (result: IResponse<IUserToView>) => {
        const userResult = result.data;

        await this.utilsService.showModalOrPopover({
          component: UserProfileCardComponent,
          componentProps: { user: userResult },
          breakpoints: [0, 0.5, 1],
          initialBreakpoint: 0.5,

          event,
          cssClass: 'user-profile-card',
        });
      });
  };
}
