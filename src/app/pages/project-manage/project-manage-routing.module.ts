import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectManagePage } from './project-manage.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectManagePageRoutingModule {}
