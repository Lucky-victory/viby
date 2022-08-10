import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChannelsPageRoutingModule } from './channels-routing.module';

import { ChannelsPage } from './channels.page';
import { ChannelActiveUsersListModule } from 'src/app/components/channel-active-users-list/channel-active-users-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelsPageRoutingModule,ChannelActiveUsersListModule
  ],
  declarations: [ChannelsPage]
})
export class ChannelsPageModule {}
