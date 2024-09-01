import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";
import { ScheduleVerificationRoutingModule } from './schedule-verification-routing.module';
import { ListScheduleVerificationComponent } from './list-schedule-verification/list-schedule-verification.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbDropdownModule,
  NgbTooltipModule,
  NgbProgressbarModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { CountUpModule } from 'ngx-countup';// Flat Picker
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { FlatpickrModule } from "angularx-flatpickr";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { SimplebarAngularModule } from "simplebar-angular";
import { SharedModule } from "src/app/shared/shared.module";
import { QuotationModule } from "../../corrective/quotation/quotation.module";
import { ServiceOrderModule } from "../../corrective/service-order/service-order.module";
import { DashboardModule } from "../../dashboard/dashboard.module";

import { FullCalendarModule } from "@fullcalendar/angular";
import { LightboxModule } from "ngx-lightbox";


@NgModule({
  declarations: [
    ListScheduleVerificationComponent
  ],
  imports: [
    ScheduleVerificationRoutingModule,
    CommonModule,
    FormsModule,
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
    DashboardModule,
    QuotationModule,
    ServiceOrderModule,
    FullCalendarModule,
    LightboxModule,
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ScheduleVerificationModule { }
