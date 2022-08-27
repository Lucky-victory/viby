import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelGuard } from 'src/app/guards/channel/channel.guard';
import { ChatRoomGuard } from 'src/app/guards/chat-room/chat-room.guard';
// import { ChannelGuard } from 'src/app/guards/channel/channel.guard';

import { ChannelsPage } from './channels.page';

const routes: Routes = [
  {
    path: '',
    component: ChannelsPage,
    children: [
      {
        path: '@me',

        loadChildren: () =>
          import('../user-profile/user-profile.module').then(
            (m) => m.UserProfilePageModule
          ),
      },

      {
        path: ':channel_id/:room_id',
        canActivate: [ChatRoomGuard],
        loadChildren: () =>
          import('../chat-room/chat-room.module').then(
            (m) => m.ChatRoomPageModule
          ),
      },
      {
        path: '',
        redirectTo: '@me',
        pathMatch: 'full',
      },
      {
        path: '@me',

        loadChildren: () =>
          import('../user-profile/user-profile.module').then(
            (m) => m.UserProfilePageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelsPageRoutingModule {}
