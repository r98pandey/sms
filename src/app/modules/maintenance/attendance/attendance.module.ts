import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { DailyAttendanceComponent } from './daily-attendance/daily-attendance.component';
import { TaskAttendanceComponent } from './task-attendance/task-attendance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbToastModule, NgbTooltipModule, NgbAccordionModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LightboxModule } from 'ngx-lightbox';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { ShownMapLocationComponent } from './shown-map-location/shown-map-location.component';
import { MapsAPILoader } from '@agm/core';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { CountUpModule } from 'ngx-countup';
import { MonthYearWiseListComponent } from './month-year-wise-list/month-year-wise-list.component';
import { CorrectiveMonthYearWiseComponent } from './corrective-month-year-wise/corrective-month-year-wise.component';
import { PreventiveMonthYearWiseComponent } from './preventive-month-year-wise/preventive-month-year-wise.component';
import { ProjectTaskMonthYearWiseComponent } from './project-task-month-year-wise/project-task-month-year-wise.component';

@NgModule({
  declarations: [
    DailyAttendanceComponent,
    TaskAttendanceComponent,
    ShownMapLocationComponent,
    MonthYearWiseListComponent,
    CorrectiveMonthYearWiseComponent,
    PreventiveMonthYearWiseComponent,
    ProjectTaskMonthYearWiseComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FlatpickrModule.forRoot(),
    SharedModule,
    SimplebarAngularModule,
    CountUpModule,
    FeatherModule.pick(allIcons),
    NgbToastModule,
    NgSelectModule,
    NgbTooltipModule,
    NgbAccordionModule,
    NgbNavModule,
    GoogleMapsModule,
    LightboxModule,
    GoogleMap, MapInfoWindow, MapMarker
  ],
  providers: [
    { provide: MapsAPILoader, useClass: GoogleMapsModule },
    DatePipe
  ],
 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AttendanceModule { }
