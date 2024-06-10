import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeOnboardingPageRoutingModule } from './employee-onboarding-routing.module';

import { EmployeeOnboardingPage } from './employee-onboarding.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeOnboardingPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EmployeeOnboardingPage]
})
export class EmployeeOnboardingPageModule {}
