import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GrnPageRoutingModule } from './grn-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';



import { GrnPage } from './grn.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrnPageRoutingModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ],
  declarations: [GrnPage]
})
export class GrnPageModule {}
