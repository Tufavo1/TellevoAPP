import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryDrivePage } from './history-drive.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryDrivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryDrivePageRoutingModule {}
