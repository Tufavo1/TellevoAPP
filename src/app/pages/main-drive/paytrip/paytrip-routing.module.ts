import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaytripPage } from './paytrip.page';

const routes: Routes = [
  {
    path: '',
    component: PaytripPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaytripPageRoutingModule {}
