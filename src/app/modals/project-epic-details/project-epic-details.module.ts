import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectEpicDetailsPageRoutingModule } from './project-epic-details-routing.module';

import { ProjectEpicDetailsPage } from './project-epic-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectEpicDetailsPageRoutingModule
  ],
  declarations: [ProjectEpicDetailsPage]
})
export class ProjectEpicDetailsPageModule {}
