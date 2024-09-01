
export class TicketModule { }
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbTooltipModule, NgbProgressbarModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatInputModule } from '@angular/material/input';

// Counter
// Flat Picker
import {FlatpickrModule } from 'angularx-flatpickr';


// Simple Bar
import { SimplebarAngularModule } from 'simplebar-angular';

// Load Icons
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

// Component pages
import { TicketRoutingModule } from './ticket-routing.module';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';

import {DatePipe} from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FeatherModule } from 'angular-feather';
import { NgSelectModule } from '@ng-select/ng-select';
import { allIcons } from 'angular-feather/icons';
import { ListTicketComponent } from './list-ticket/list-ticket.component';
import { DashboardModule } from '../../dashboard/dashboard.module';
import { QuotationModule } from "../quotation/quotation.module";
import { ViewWorkorderTicketComponent } from "./view-workorder-ticket/view-workorder-ticket.component";
import { ServiceOrderModule } from "../service-order/service-order.module";
import { LightboxModule } from "ngx-lightbox";
import { PrintViewTicketComponent } from "./print-view-ticket/print-view-ticket.component";
import { NgxPrintElementModule } from "ngx-print-element";
import { CatalogPageUploadComponent } from './catalog-page-upload/catalog-page-upload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CountUpModule } from 'ngx-countup';


const toolbar= [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'],                                         // remove formatting button

    ['link', 'image', 'video']                         // link and image, video
  ]

@NgModule({
  declarations: [
    AddTicketComponent,
    ViewTicketComponent,
    ListTicketComponent,
    ViewWorkorderTicketComponent,
    PrintViewTicketComponent, CatalogPageUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TicketRoutingModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgbTooltipModule,
    CountUpModule,
    FlatpickrModule.forRoot(),
    SimplebarAngularModule,
    SharedModule,
    NgbProgressbarModule,
    NgbNavModule,
    FeatherModule.pick(allIcons),
    CKEditorModule,
    NgSelectModule,
    DashboardModule,
    QuotationModule,
    ServiceOrderModule,
    LightboxModule,
    NgxPrintElementModule,
    NgxDropzoneModule,
    NgxMatTimepickerModule,
    MatInputModule
    
  ],
  providers:[
  DatePipe
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TicketsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
