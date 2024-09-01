import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowComponent } from './workflow.component';
import { ListworkflowComponent } from './listworkflow/listworkflow.component';
import { WorkflowRoutingModule } from './workflow-routing-module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { SharedModule } from '../../../shared/shared.module';
import { PmConfigurationComponent } from './pm-configuration/pm-configuration.component';



@NgModule({
  declarations: [WorkflowComponent, ListworkflowComponent, ConfigurationComponent, PmConfigurationComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
     
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    SharedModule,
    NgbNavModule
  ],exports:[
    WorkflowComponent, ListworkflowComponent, ConfigurationComponent ,PmConfigurationComponent 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkflowModule { }
