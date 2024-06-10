import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScrapManagementPageRoutingModule } from './scrap-management-routing.module';

import { ScrapManagementPage } from './scrap-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrapManagementPageRoutingModule
  ],
  declarations: [ScrapManagementPage]
})
export class ScrapManagementPageModule {}
