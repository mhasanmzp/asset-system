import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QualityAssurancePage } from './quality-assurance.page';

const routes: Routes = [
  {
    path: '',
    component: QualityAssurancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QualityAssurancePageRoutingModule {}
