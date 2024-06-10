import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectTaskDetailsPage } from './project-task-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectTaskDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectTaskDetailsPageRoutingModule {}
