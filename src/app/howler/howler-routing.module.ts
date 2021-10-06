import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HowlerPage } from './howler.page';

const routes: Routes = [
  {
    path: '',
    component: HowlerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HowlerPageRoutingModule {}
