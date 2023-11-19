import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryDrivePageRoutingModule } from './history-drive-routing.module';

import { HistoryDrivePage } from './history-drive.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryDrivePageRoutingModule
  ],
  declarations: [HistoryDrivePage]
})
export class HistoryDrivePageModule {}
