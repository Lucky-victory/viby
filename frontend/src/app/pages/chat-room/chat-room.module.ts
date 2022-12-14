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
import { DateFormatterModule } from 'src/app/pipes/date-formatter/date-formatter.module';
import { LinkifyModule } from 'src/app/pipes/linkify/linkify.module';
import { LongPressModule } from 'src/app/directives/long-press/long-press.module';
import { PopoverActionsComponent } from 'src/app/components/popover-actions/popover-actions.component';
import { DomMutationObserverModule } from 'src/app/directives/dom-mutation-observer/dom-mutation-observer.module';
import { UserProfileCardComponent } from 'src/app/components/user-profile-card/user-profile-card.component';
import { UserAvatarComponent } from 'src/app/components/user-avatar/user-avatar.component';
import { MarkdownifyModule } from 'src/app/pipes/markdownify/markdownify.module';
import { ChatRoomGuard } from 'src/app/guards/chat-room/chat-room.guard';
import { UserAvatarModule } from 'src/app/components/user-avatar/user-avatar.module';
import { NewChannelFormComponent } from 'src/app/components/new-channel-form/new-channel-form.component';
import { NewRoomFormModule } from 'src/app/components/new-room-form/new-room-form.module';
import { NewChannelFormModule } from 'src/app/components/new-channel-form/new-channel-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatRoomPageRoutingModule,
    PickerModule,
    DateFormatterModule,
    LinkifyModule,
    LongPressModule,
    MarkdownifyModule,
    DomMutationObserverModule,
    UserAvatarModule,
    NewRoomFormModule,
    NewChannelFormModule,
  ],
  declarations: [
    ChatRoomPage,
    ChatMessageInputComponent,
    ChatListComponent,
    ChatSingleChatAudioComponent,
    ChatSingleChatTextComponent,
    PopoverActionsComponent,
    UserProfileCardComponent,
  ],
  providers: [ChatRoomGuard],
})
export class ChatRoomPageModule {}
