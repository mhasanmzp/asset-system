import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectTypeListPage } from './project-type-list.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectTypeListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectTypeListPageRoutingModule {}
