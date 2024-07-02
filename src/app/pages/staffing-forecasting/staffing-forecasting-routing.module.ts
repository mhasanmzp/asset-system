import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaffingForecastingPage } from './staffing-forecasting.page';

const routes: Routes = [
  {
    path: '',
    component: StaffingForecastingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffingForecastingPageRoutingModule {}
