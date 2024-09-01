import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

import { SCHEDULERoutingModule } from "./schedule-routing.module";
import { ListScheduleComponent } from "./list-schedule/list-schedule.component";
import { ViewScheduleComponent } from "./view-schedule/view-schedule.component";
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
import { CheckScheduleComponent } from './check-schedule/check-schedule.component';
import { CalenderScheduleComponent } from "./calender-schedule/calender-schedule.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import { LightboxModule } from "ngx-lightbox";
import { ViewPrintScheduleComponent } from './view-print-schedule/view-print-schedule.component';
import { CurrentScheduleComponent } from './current-schedule/current-schedule.component';
import { ViewPrintScheduleWithImageComponent } from './view-print-schedule-with-image/view-print-schedule-with-image.component';
import { AwaitingCureentScheduleComponent } from "./awaiting-cureent-schedule/awaiting-cureent-schedule.component";
import { EditCurrentScheduleComponent } from "./edit-current-schedule/edit-current-schedule.component";
import { MainComponentListComponent } from './main-component-list/main-component-list.component';

@NgModule({
  declarations: [
    ListScheduleComponent,
    ViewScheduleComponent,
    CheckScheduleComponent,
    CalenderScheduleComponent,
    ViewPrintScheduleComponent,
    CurrentScheduleComponent,
    ViewPrintScheduleWithImageComponent,
    AwaitingCureentScheduleComponent,
    EditCurrentScheduleComponent,
    MainComponentListComponent
  ],
  imports: [
    CommonModule,
    SCHEDULERoutingModule,
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
export class SCHEDULEModule {}
