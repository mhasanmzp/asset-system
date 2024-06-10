import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatroomsPage } from './chatrooms.page';

const routes: Routes = [
  {
    path: '',
    component: ChatroomsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatroomsPageRoutingModule {}
