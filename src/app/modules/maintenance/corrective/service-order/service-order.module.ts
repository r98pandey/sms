
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDropdownModule, NgbModule, NgbNavModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AddServiceOrderComponent } from './add-service-order/add-service-order.component';
import { ListServiceOrderComponent } from './list-service-order/list-service-order.component';
import { ServiceOrderRoutingModule } from './service-order-routing.module';
// Counter
import { CountUpModule } from 'ngx-countup';// Flat Picker

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';
// Simple Bar
import { SimplebarAngularModule } from 'simplebar-angular';
// Load Icons
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
// Component pages
import { DatePipe } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/core/pipes/pipe-module';
import { TaskEndServiceOrderComponent } from './task-end-service-order/task-end-service-order.component';
import { EndTastCreatedComponent } from './end-tast-created/end-tast-created.component';
import { TechnicianComponent } from './technician/technician.component';
import { LightboxModule } from "ngx-lightbox";
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AddServiceOrderComponent,
    ListServiceOrderComponent,
    TaskEndServiceOrderComponent,
    EndTastCreatedComponent,
    TechnicianComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ServiceOrderRoutingModule,
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
    DropzoneModule,
    NgSelectModule,
    NgbModule,
    PipesModule,
    LightboxModule,
    NgxMatTimepickerModule,
    MatInputModule
  ],
  exports: [
    AddServiceOrderComponent,
    TaskEndServiceOrderComponent,
    EndTastCreatedComponent,
  ],
  providers: [DatePipe, NgbActiveModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ServiceOrderModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
