import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectSprintDetailsPage } from './project-sprint-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectSprintDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectSprintDetailsPageRoutingModule {}
