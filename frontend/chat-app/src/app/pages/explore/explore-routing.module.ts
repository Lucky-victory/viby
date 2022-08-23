import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreGuard } from 'src/app/guards/explore/explore.guard';

import { ExplorePage } from './explore.page';

const routes: Routes = [
  {
    path: '',
    component: ExplorePage,
    canActivate:[ExploreGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorePageRoutingModule {}
