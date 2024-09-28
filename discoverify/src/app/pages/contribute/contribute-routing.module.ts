import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContributePage } from './contribute.page';

const routes: Routes = [
  {
    path: '',
    component: ContributePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContributePageRoutingModule {}
