import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReestablecidoPage } from './reestablecido.page';

const routes: Routes = [
  {
    path: '',
    component: ReestablecidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReestablecidoPageRoutingModule {}
