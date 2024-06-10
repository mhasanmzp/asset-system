import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectStoryDetailsPageRoutingModule } from './project-story-details-routing.module';

import { ProjectStoryDetailsPage } from './project-story-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectStoryDetailsPageRoutingModule
  ],
  declarations: [ProjectStoryDetailsPage]
})
export class ProjectStoryDetailsPageModule {}
