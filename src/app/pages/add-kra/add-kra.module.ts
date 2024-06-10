import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddKraPageRoutingModule } from './add-kra-routing.module';

import { AddKraPage } from './add-kra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,ReactiveFormsModule,
    AddKraPageRoutingModule
  ],
  declarations: [AddKraPage]
})
export class AddKraPageModule {}
