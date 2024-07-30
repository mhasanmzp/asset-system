import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaffingReportPageRoutingModule } from './staffing-report-routing.module';

import { StaffingReportPage } from './staffing-report.page';

import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaffingReportPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [StaffingReportPage]
})
export class StaffingReportPageModule {}
