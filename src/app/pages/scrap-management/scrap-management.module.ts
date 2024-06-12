import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScrapManagementPageRoutingModule } from './scrap-management-routing.module';

import { ScrapManagementPage } from './scrap-management.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrapManagementPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ScrapManagementPage]
})
export class ScrapManagementPageModule {}
