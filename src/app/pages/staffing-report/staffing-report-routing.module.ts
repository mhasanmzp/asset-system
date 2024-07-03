import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaffingReportPage } from './staffing-report.page';

const routes: Routes = [
  {
    path: '',
    component: StaffingReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffingReportPageRoutingModule {}
