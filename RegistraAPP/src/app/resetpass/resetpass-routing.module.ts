import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetpassPage } from './resetpass.page';

const routes: Routes = [
  {
    path: '',
    component: ResetpassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetpassPageRoutingModule {}
