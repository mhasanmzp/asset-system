import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { OverlayModule } from '@angular/cdk/overlay';


import { ProjectTaskDetailsPageRoutingModule } from './project-task-details-routing.module';

import { ProjectTaskDetailsPage } from './project-task-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OverlayModule,
    ProjectTaskDetailsPageRoutingModule
  ],
  declarations: [ProjectTaskDetailsPage]
})
export class ProjectTaskDetailsPageModule {}
