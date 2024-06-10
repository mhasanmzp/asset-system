import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectChartListPageRoutingModule } from './project-chart-list-routing.module';

import { ProjectChartListPage } from './project-chart-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectChartListPageRoutingModule
  ],
  declarations: [ProjectChartListPage]
})
export class ProjectChartListPageModule {}
