import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";

import { NewUserRoutingModule } from './new-user-routing.module';
import { NewUserComponent } from './new-user/new-user.component';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { ListNewUserComponent } from './list-new-user/list-new-user.component';
import { EditNewUserComponent } from './edit-new-user/edit-new-user.component';
import { ViewNewUserComponent } from './view-new-user/view-new-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbToastModule, NgbTooltipModule, NgbAccordionModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormGroup } from '@angular/forms';
import { LightboxModule } from "ngx-lightbox";
import { ViewClientUserNavComponent } from './view-client-user-nav/view-client-user-nav.component';
import { VersionThirdAddNewUserComponent } from './version-third-add-new-user/version-third-add-new-user.component';
import { GoogleMapsModule, GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { CountUpModule } from 'ngx-countup';
import { NgChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ViewNewUserWithidComponent } from './view-new-user-withid/view-new-user-withid.component';

@NgModule({
  declarations: [
    NewUserComponent,
    AddNewUserComponent,
    ListNewUserComponent,
    EditNewUserComponent,
    ViewNewUserComponent,
    ViewClientUserNavComponent,
    VersionThirdAddNewUserComponent,
    ViewNewUserWithidComponent,
  ],
  imports: [
    CommonModule,
    NewUserRoutingModule,
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
    GoogleMap, MapInfoWindow, MapMarker,
    NgApexchartsModule,
    NgChartsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  
  ],exports:[    ViewNewUserComponent,
    ViewClientUserNavComponent],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewUserModule {}
