import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectEpicDetailsPage } from './project-epic-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectEpicDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectEpicDetailsPageRoutingModule {}
