import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NativeAudioPageRoutingModule } from './native-audio-routing.module';

import { NativeAudioPage } from './native-audio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NativeAudioPageRoutingModule
  ],
  declarations: [NativeAudioPage]
})
export class NativeAudioPageModule {}
