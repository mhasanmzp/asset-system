import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScrapManagementPage } from './scrap-management.page';

const routes: Routes = [
  {
    path: '',
    component: ScrapManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScrapManagementPageRoutingModule {}
