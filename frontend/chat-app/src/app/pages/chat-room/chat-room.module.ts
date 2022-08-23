import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatRoomPageRoutingModule } from './chat-room-routing.module';

import { ChatRoomPage } from './chat-room.page';
import { ChatMessageInputComponent } from 'src/app/components/chat-message-input/chat-message-input.component';
import { ChatListComponent } from 'src/app/components/chat-list/chat-list.component';

import { ChatSingleChatTextComponent } from 'src/app/components/chat-single-chat-text/chat-single-chat-text.component';
import { ChatSingleChatAudioComponent } from 'src/app/components/chat-single-chat-audio/chat-single-chat-audio.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { PopoverActionsComponent } from 'src/app/components/popover-actions/popover-actions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatRoomPageRoutingModule,PickerModule
  ],
  declarations: [ChatRoomPage,ChatMessageInputComponent,ChatListComponent,    ChatSingleChatAudioComponent,
    ChatSingleChatTextComponent,PopoverActionsComponent
]
})
export class ChatRoomPageModule {}
