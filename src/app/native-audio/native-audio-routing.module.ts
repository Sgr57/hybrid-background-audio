import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NativeAudioPage } from './native-audio.page';

const routes: Routes = [
  {
    path: '',
    component: NativeAudioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NativeAudioPageRoutingModule {}
