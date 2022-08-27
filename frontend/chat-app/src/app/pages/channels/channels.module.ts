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

import { ChannelListComponent } from 'src/app/components/channel-list/channel-list.component';
import { ChannelItemComponent } from 'src/app/components/channel-item/channel-item.component';
import { RoomListComponent } from 'src/app/components/room-list/room-list.component';
import { RoomItemComponent } from 'src/app/components/room-item/room-item.component';
import { NewChannelAddComponent } from 'src/app/components/new-channel-add/new-channel-add.component';

import { DomMutationObserverModule } from '../../directives/dom-mutation-observer/dom-mutation-observer.module';
import { LinkifyModule } from 'src/app/pipes/linkify/linkify.module';
import { ChatRoomGuard } from 'src/app/guards/chat-room/chat-room.guard';
import { ChannelGuard } from 'src/app/guards/channel/channel.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelsPageRoutingModule,
    DomMutationObserverModule,

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
  providers: [ChannelGuard, ChatRoomGuard],
})
export class ChannelsPageModule {}
