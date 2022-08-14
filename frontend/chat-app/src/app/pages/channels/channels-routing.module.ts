import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelGuard } from 'src/app/guards/channel/channel.guard';

import { ChannelsPage } from './channels.page';

const routes: Routes = [
  {
    path: '',
    canActivate:[ChannelGuard],
    component: ChannelsPage
  },
  {
    path: ':channel_id',
    component: ChannelsPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelsPageRoutingModule {}
