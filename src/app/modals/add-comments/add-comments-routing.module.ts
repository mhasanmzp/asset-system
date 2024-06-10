import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCommentsPage } from './add-comments.page';

const routes: Routes = [
  {
    path: '',
    component: AddCommentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCommentsPageRoutingModule {}
