import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeOnboardingPage } from './employee-onboarding.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeOnboardingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeOnboardingPageRoutingModule {}
