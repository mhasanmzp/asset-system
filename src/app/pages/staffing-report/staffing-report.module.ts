import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaffingReportPageRoutingModule } from './staffing-report-routing.module';

import { StaffingReportPage } from './staffing-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaffingReportPageRoutingModule
  ],
  declarations: [StaffingReportPage]
})
export class StaffingReportPageModule {}
