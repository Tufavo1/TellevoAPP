import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterVehiclePageRoutingModule } from './register-vehicle-routing.module';

import { RegisterVehiclePage } from './register-vehicle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterVehiclePageRoutingModule
  ],
  declarations: [RegisterVehiclePage]
})
export class RegisterVehiclePageModule {}
