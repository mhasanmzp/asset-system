import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCVPage } from './add-cv.page';

const routes: Routes = [
  {
    path: '',
    component: AddCVPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCVPageRoutingModule {}
