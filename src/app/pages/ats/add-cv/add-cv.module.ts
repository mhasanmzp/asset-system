import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCVPageRoutingModule } from './add-cv-routing.module';

import { AddCVPage } from './add-cv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCVPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddCVPage]
})
export class AddCVPageModule {}
