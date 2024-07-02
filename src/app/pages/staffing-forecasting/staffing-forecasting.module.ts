import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaffingForecastingPageRoutingModule } from './staffing-forecasting-routing.module';

import { StaffingForecastingPage } from './staffing-forecasting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaffingForecastingPageRoutingModule
  ],
  declarations: [StaffingForecastingPage]
})
export class StaffingForecastingPageModule {}
