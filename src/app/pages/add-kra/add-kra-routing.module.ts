import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddKraPage } from './add-kra.page';

const routes: Routes = [
  {
    path: '',
    component: AddKraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddKraPageRoutingModule {}
