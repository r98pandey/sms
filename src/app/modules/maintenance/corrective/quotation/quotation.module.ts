import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { AddQuotationComponent } from './add-quotation/add-quotation.component';
import { ViewQuotationComponent } from './view-quotation/view-quotation.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Counter
import { CountUpModule } from 'ngx-countup';// Flat Picker


// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Load Icons
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuotationComponent } from './quotation.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListQuotationComponent } from './list-quotation/list-quotation.component';
import { WaitingforInvoiceProcessComponent } from './waitingfor-invoice-process/waitingfor-invoice-process.component';
import { InvoiceGeneratedComponent } from './invoice-generated/invoice-generated.component';


@NgModule({
  declarations: [
    QuotationComponent,
    AddQuotationComponent,
    ViewQuotationComponent,
    ListQuotationComponent,
    WaitingforInvoiceProcessComponent,
    InvoiceGeneratedComponent
  ],
  imports: [
    CommonModule,
    QuotationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    CountUpModule,
    FlatpickrModule.forRoot(),
    FeatherModule.pick(allIcons),
    SharedModule,
    NgbModule,
    NgbTooltipModule,
    NgSelectModule
  ],
  providers: [
    DatePipe
  ],
  exports: [AddQuotationComponent, ViewQuotationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuotationModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
