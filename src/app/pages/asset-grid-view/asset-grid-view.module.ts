import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssetGridViewPageRoutingModule } from './asset-grid-view-routing.module';

import { AssetGridViewPage } from './asset-grid-view.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssetGridViewPageRoutingModule,Ng2SearchPipeModule
  ],
  declarations: [AssetGridViewPage]
})
export class AssetGridViewPageModule {}
