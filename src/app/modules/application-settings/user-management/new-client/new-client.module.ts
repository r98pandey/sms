import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewClientRoutingModule } from './new-client-routing.module';
import { AddNewClientComponent } from './add-new-client/add-new-client.component';
import { ListNewClientComponent } from './list-new-client/list-new-client.component';
import { EditNewClientComponent } from './edit-new-client/edit-new-client.component';
import { ViewNewClientComponent } from './view-new-client/view-new-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbToastModule, NgbTooltipModule, NgbAccordionModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewClientComponent } from './new-client.component';
import { LightboxModule } from "ngx-lightbox";
import { DashboardClientComponent } from './dashboard-client/dashboard-client.component';


@NgModule({
  declarations: [
    NewClientComponent,
    AddNewClientComponent,
    ListNewClientComponent,
    EditNewClientComponent,
    ViewNewClientComponent,
    DashboardClientComponent,
  ],
  imports: [
    CommonModule,
    NewClientRoutingModule,
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
    NgbNavModule,
    LightboxModule,
  ],exports:[  ViewNewClientComponent, ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewClientModule {}
