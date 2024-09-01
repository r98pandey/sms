import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreventiveRoutingModule } from './preventive-routing.module';
import { PreventiveComponent } from './preventive.component';


@NgModule({
  declarations: [PreventiveComponent],
  imports: [
    CommonModule,
    PreventiveRoutingModule
  ]
})
export class PreventiveModule { }
