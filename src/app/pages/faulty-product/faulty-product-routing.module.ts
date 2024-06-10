import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaultyProductPage } from './faulty-product.page';

const routes: Routes = [
  {
    path: '',
    component: FaultyProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaultyProductPageRoutingModule {}
