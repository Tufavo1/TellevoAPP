import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaytripPageRoutingModule } from './paytrip-routing.module';

import { PaytripPage } from './paytrip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaytripPageRoutingModule
  ],
  declarations: [PaytripPage]
})
export class PaytripPageModule {}
