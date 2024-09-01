import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketTypeComponent } from './ticket-type.component';
import { TicketTypeRoutingModule } from './ticket-type-routing-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { TicketTypeListComponent } from './ticket-type-list/ticket-type-list.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormGroup } from '@angular/forms';

@NgModule({
  declarations: [TicketTypeComponent,TicketTypeListComponent],
  imports: [
    CommonModule,
    TicketTypeRoutingModule,
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
    NgbTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TicketTypeModule { }
