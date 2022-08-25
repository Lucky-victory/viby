import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelGuard } from 'src/app/guards/channel/channel.guard';
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
