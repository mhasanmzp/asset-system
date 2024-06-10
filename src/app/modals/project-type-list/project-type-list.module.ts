import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectTypeListPageRoutingModule } from './project-type-list-routing.module';

import { ProjectTypeListPage } from './project-type-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectTypeListPageRoutingModule
  ],
  declarations: [ProjectTypeListPage]
})
export class ProjectTypeListPageModule {}
