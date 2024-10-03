import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorviewPageRoutingModule } from './errorview-routing.module';

import { ErrorviewPage } from './errorview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorviewPageRoutingModule
  ],
  declarations: [ErrorviewPage]
})
export class ErrorviewPageModule {}
