import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogRegisterMainPageRoutingModule } from './log-register-main-routing.module';

import { LogRegisterMainPage } from './log-register-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogRegisterMainPageRoutingModule
  ],
  declarations: [LogRegisterMainPage]
})
export class LogRegisterMainPageModule {}
