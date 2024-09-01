import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientProjectManagementRoutingModule } from './client-project-management-routing.module';
import { AddClientProjectManagementComponent } from './add-client-project-management/add-client-project-management.component';
import { ListClientProjectManagementComponent } from './list-client-project-management/list-client-project-management.component';
import { ViewClientProjectManagementComponent } from './view-client-project-management/view-client-project-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbToastModule, NgbTooltipModule, NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientProjectManagementComponent } from './client-project-management.component';
import { PmProspectListComponent } from './pm-prospect-list/pm-prospect-list.component';


@NgModule({
  declarations: [
    AddClientProjectManagementComponent,
    ListClientProjectManagementComponent,
    ViewClientProjectManagementComponent,
    ClientProjectManagementComponent,
    
    PmProspectListComponent
  ],
  imports: [
    CommonModule,
    ClientProjectManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
     
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FlatpickrModule,
    SharedModule,
    SimplebarAngularModule,
    
    FeatherModule.pick(allIcons),
    NgbToastModule,
    NgSelectModule,
    NgbTooltipModule,
    
    NgbAccordionModule,
    NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientProjectManagementModule { }
