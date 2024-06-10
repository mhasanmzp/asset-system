import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtsPage } from './ats.page';

const routes: Routes = [
  {
    path: '',
    component: AtsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtsPageRoutingModule {}
