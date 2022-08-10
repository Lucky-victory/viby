import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelActiveUsersItemModule } from '../channel-active-users-item/channel-active-users-item.module';
import { ChannelActiveUsersListComponent } from './channel-active-users-list.component';



@NgModule({
    
  declarations: [
    ChannelActiveUsersListComponent

  ],
  imports: [
    CommonModule,ChannelActiveUsersItemModule
  ],
  exports: [
    ChannelActiveUsersListComponent
  ]
})
export class ChannelActiveUsersListModule { }
