import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { DashboardPage } from './dashboard.page';
import { ProjectReportComponent } from '../../components/project-report/project-report.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { AssignedTicketComponent } from 'src/app/components/assigned-ticket/assigned-ticket.component';
import { AssignedConveyanceComponent } from 'src/app/components/assigned-conveyance/assigned-conveyance.component';
import { CmfPageComponent } from 'src/app/components/cmf-page/cmf-page.component';
import { ProjectWiseTaskComponent } from '../../components/project-wise-task/project-wise-task.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    IonicModule,
    DashboardPageRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    ReactiveFormsModule,
  ],
  declarations: [
    DashboardPage,
    CmfPageComponent,
    ProjectReportComponent,
    AssignedTicketComponent,
    AssignedConveyanceComponent,
    ProjectWiseTaskComponent,
  ],
})
export class DashboardPageModule {}

