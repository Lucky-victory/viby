import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChannelsPageRoutingModule } from './channels-routing.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ChannelsPage } from './channels.page';

import { ChannelActiveUsersListComponent } from 'src/app/components/channel-active-users-list/channel-active-users-list.component';
import { ChannelActiveUsersItemComponent } from 'src/app/components/channel-active-users-item/channel-active-users-item.component';

import { ChatListComponent } from 'src/app/components/chat-list/chat-list.component';
import { ChatSingleChatAudioComponent } from 'src/app/components/chat-single-chat-audio/chat-single-chat-audio.component';
import { ChatSingleChatTextComponent } from 'src/app/components/chat-single-chat-text/chat-single-chat-text.component';
import { ChannelListComponent } from 'src/app/components/channel-list/channel-list.component';
import { ChannelItemComponent } from 'src/app/components/channel-item/channel-item.component';
import { RoomListComponent } from 'src/app/components/room-list/room-list.component';
import { RoomItemComponent } from 'src/app/components/room-item/room-item.component';
import { NewChannelAddComponent } from 'src/app/components/new-channel-add/new-channel-add.component';

import { DateFormatterModule } from 'src/app/pipes/date-formatter/date-formatter.module';
import { ChatMessageInputComponent } from 'src/app/components/chat-message-input/chat-message-input.component';
import { DomMutationObserverModule } from '../../directives/dom-mutation-observer/dom-mutation-observer.module';
import { LinkifyModule } from 'src/app/pipes/linkify/linkify.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelsPageRoutingModule,
    DomMutationObserverModule,
    DateFormatterModule,
    LinkifyModule,
    PickerModule,
  ],
  declarations: [
    ChannelsPage,
    ChannelListComponent,
    ChannelItemComponent,
    NewChannelAddComponent,
    ChannelActiveUsersListComponent,
    ChannelActiveUsersItemComponent,
    RoomListComponent,
    RoomItemComponent,
  

    
  ],
})
export class ChannelsPageModule {}
