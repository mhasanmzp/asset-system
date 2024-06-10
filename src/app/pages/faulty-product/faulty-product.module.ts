import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaultyProductPageRoutingModule } from './faulty-product-routing.module';

import { FaultyProductPage } from './faulty-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaultyProductPageRoutingModule
  ],
  declarations: [FaultyProductPage]
})
export class FaultyProductPageModule {}
