import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ChannelGuard } from './guards/channel/channel.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'channels',
    redirectTo: 'channels/@me',
    pathMatch: 'full',
  },
  {
    path: '@me',

    loadChildren: () =>
      import('./pages/user-profile/user-profile.module').then(
        (m) => m.UserProfilePageModule
      ),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./pages/sign-up/sign-up.module').then((m) => m.SignUpPageModule),
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./pages/sign-in/sign-in.module').then((m) => m.SignInPageModule),
  },

  {
    path: 'channels',

    loadChildren: () =>
      import('./pages/channels/channels.module').then(
        (m) => m.ChannelsPageModule
      ),
  },
  {
    path: 'explore',
    loadChildren: () =>
      import('./pages/explore/explore.module').then((m) => m.ExplorePageModule),
  },

  {
    path: '**',
    loadChildren: () =>
      import('./pages/not-found/not-found.module').then(
        (m) => m.NotFoundPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
