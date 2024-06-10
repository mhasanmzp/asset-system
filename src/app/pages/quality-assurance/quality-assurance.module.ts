import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QualityAssurancePageRoutingModule } from './quality-assurance-routing.module';

import { QualityAssurancePage } from './quality-assurance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QualityAssurancePageRoutingModule
  ],
  declarations: [QualityAssurancePage]
})
export class QualityAssurancePageModule {}
