import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorviewPage } from './errorview.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorviewPageRoutingModule {}
