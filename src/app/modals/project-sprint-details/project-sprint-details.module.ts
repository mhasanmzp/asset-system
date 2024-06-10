import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectSprintDetailsPageRoutingModule } from './project-sprint-details-routing.module';

import { ProjectSprintDetailsPage } from './project-sprint-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectSprintDetailsPageRoutingModule
  ],
  declarations: [ProjectSprintDetailsPage]
})
export class ProjectSprintDetailsPageModule {}
