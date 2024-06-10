import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProjectDetailsPageRoutingModule } from './project-details-routing.module';

import { ProjectDetailsPage } from './project-details.page';
import { QuillModule } from 'ngx-quill'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    IonicModule,
    ReactiveFormsModule,
    ProjectDetailsPageRoutingModule
  ],
  declarations: [ProjectDetailsPage]
})
export class ProjectDetailsPageModule {}
