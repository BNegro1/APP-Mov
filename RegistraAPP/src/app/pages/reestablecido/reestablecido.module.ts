import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReestablecidoPageRoutingModule } from './reestablecido-routing.module';

import { ReestablecidoPage } from './reestablecido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReestablecidoPageRoutingModule
  ],
  declarations: [ReestablecidoPage]
})
export class ReestablecidoPageModule {}
