import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HowlerPageRoutingModule } from './howler-routing.module';

import { HowlerPage } from './howler.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HowlerPageRoutingModule
  ],
  declarations: [HowlerPage]
})
export class HowlerPageModule {}
