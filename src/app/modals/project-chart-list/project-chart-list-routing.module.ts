import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectChartListPage } from './project-chart-list.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectChartListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectChartListPageRoutingModule {}
