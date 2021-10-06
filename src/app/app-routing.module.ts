import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'native-audio',
    loadChildren: () => import('./native-audio/native-audio.module').then( m => m.NativeAudioPageModule)
  },
  {
    path: 'howler',
    loadChildren: () => import('./howler/howler.module').then( m => m.HowlerPageModule)
  },
  {
    path: '',
    redirectTo: 'native-audio',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
