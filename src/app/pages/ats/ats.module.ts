import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtsPageRoutingModule } from './ats-routing.module';

import { AtsPage } from './ats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtsPageRoutingModule
  ],
  declarations: [AtsPage]
})
export class AtsPageModule {}
