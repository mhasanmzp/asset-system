import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeProfilePageRoutingModule } from './employee-profile-routing.module';
import { ImageCropperModule } from 'ngx-image-cropper';

import { EmployeeProfilePage } from './employee-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    IonicModule,
    EmployeeProfilePageRoutingModule
  ],
  declarations: [EmployeeProfilePage]
})
export class EmployeeProfilePageModule {}
