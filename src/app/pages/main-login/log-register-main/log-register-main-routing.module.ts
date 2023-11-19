import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogRegisterMainPage } from './log-register-main.page';

const routes: Routes = [
  {
    path: '',
    component: LogRegisterMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogRegisterMainPageRoutingModule {}
