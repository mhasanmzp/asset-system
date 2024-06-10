import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GrnPageRoutingModule } from './grn-routing.module';

import { GrnPage } from './grn.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrnPageRoutingModule
  ],
  declarations: [GrnPage]
})
export class GrnPageModule {}
