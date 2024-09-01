import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SpareRoutingModule } from './spare-routing.module';
import { SpareComponent } from './spare.component';
import { FormSpareComponent } from './form-spare/form-spare.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbAccordionModule, NgbTooltipModule, NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ViewSpareComponent } from './view-spare/view-spare.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpareListComponent } from './spare-list/spare-list.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CountUpModule } from 'ngx-countup';// Flat Picker
import { LightboxModule } from "ngx-lightbox";
import { ReadyStockSpareListComponent } from './ready-stock-spare-list/ready-stock-spare-list.component';
import { EolSpareListComponent } from './eol-spare-list/eol-spare-list.component';
import { InServiceSpareComponent } from './in-service-spare/in-service-spare.component';
@NgModule({
  declarations: [
    SpareComponent,
    FormSpareComponent,
    ViewSpareComponent,
    SpareListComponent,
    ReadyStockSpareListComponent,
    EolSpareListComponent,
    InServiceSpareComponent,
  ],
  imports: [
    CommonModule,
    SpareRoutingModule,
    
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    
    NgbAccordionModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    SharedModule,
    CountUpModule,
    FlatpickrModule.forRoot(),
    LightboxModule,
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SpareModule {}
