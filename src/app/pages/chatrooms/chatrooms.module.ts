import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatroomsPageRoutingModule } from './chatrooms-routing.module';

import { ChatroomsPage } from './chatrooms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatroomsPageRoutingModule
  ],
  declarations: [ChatroomsPage]
})
export class ChatroomsPageModule {}
