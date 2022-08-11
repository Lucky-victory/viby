import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChannelsPageRoutingModule } from './channels-routing.module';

import { ChannelsPage } from './channels.page';

import { ChannelActiveUsersListComponent } from 'src/app/components/channel-active-users-list/channel-active-users-list.component';
import { ChannelActiveUsersItemComponent } from 'src/app/components/channel-active-users-item/channel-active-users-item.component';
import { ChatSingleChatComponent } from 'src/app/components/chat-single-chat/chat-single-chat.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelsPageRoutingModule,
  ],
  declarations: [ChannelsPage,ChannelActiveUsersListComponent,ChatSingleChatComponent, ChannelActiveUsersItemComponent]
})
export class ChannelsPageModule {}
