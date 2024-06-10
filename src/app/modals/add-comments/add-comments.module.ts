import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddCommentsPageRoutingModule } from './add-comments-routing.module';

import { AddCommentsPage } from './add-comments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCommentsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddCommentsPage]
})
export class AddCommentsPageModule {}
