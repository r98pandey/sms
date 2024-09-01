import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HumanResourceRoutingModule } from './human-resource-routing.module';
import { DashboardHumanResourceComponent } from './dashboard-human-resource/dashboard-human-resource.component';

@NgModule({
  declarations: [
    DashboardHumanResourceComponent
  ],
  imports: [
    CommonModule,
    HumanResourceRoutingModule
  ]
})
export class HumanResourceModule { }
