import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssetGridViewPage } from './asset-grid-view.page';

const routes: Routes = [
  {
    path: '',
    component: AssetGridViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetGridViewPageRoutingModule {}
