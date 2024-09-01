import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MapsAPILoader } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule, GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgbTooltipModule, NgbProgressbarModule, NgbToastModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CountUpModule } from 'ngx-countup';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { LightboxModule } from 'ngx-lightbox';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuotationModule } from '../../maintenance/corrective/quotation/quotation.module';
import { ServiceOrderModule } from '../../maintenance/corrective/service-order/service-order.module';
import { ProjectsStatComponent } from './projects-stat/projects-stat.component';
import { TaskListDashbaordComponent } from './task-list-dashbaord/task-list-dashbaord.component';
import { HelpDeskInternalDisscussionComponent } from './help-desk-global-disscussion/help-desk-internal-disscussion.component';
import { HelpPartChartDashboardComponent } from './help-part-internal-disscussion/help-part-chart-dashboard.component';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';
import { AwaitingDocumentComponent } from './awaiting-document/awaiting-document.component';
import { PlanActivityComponent } from './plan-activity/plan-activity.component';
import { AnticipatingSetupComponent } from './anticipating-setup/anticipating-setup.component';
import { MaintenanceDocumentionsComponent } from './maintenance-documentions/maintenance-documentions.component';
import { WarrantyDocumentComponent } from './warranty-document/warranty-document.component';
import { ProjectDocumentComponent } from './project-document/project-document.component';
import { AnalyticalDashboardComponent } from './analytical-dashboard/analytical-dashboard.component';
import { TaskApprovalListComponent } from './task-approval-list/task-approval-list.component';
import { ProgressDashboardComponent } from './progress-dashboard/progress-dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    DashboardComponent,
    ProjectsStatComponent, 
    TaskListDashbaordComponent,
    HelpPartChartDashboardComponent,
    HelpDeskInternalDisscussionComponent,
     ManagementDashboardComponent,
     AwaitingDocumentComponent,
     PlanActivityComponent,
     AnticipatingSetupComponent,
     MaintenanceDocumentionsComponent,
     WarrantyDocumentComponent,
     ProjectDocumentComponent,
     AnalyticalDashboardComponent,
     TaskApprovalListComponent,
     ProgressDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    CountUpModule,
    NgbToastModule,
    LeafletModule,
    NgbDropdownModule,
    NgbNavModule,
    NgApexchartsModule,
    FlatpickrModule.forRoot(),
    NgbPaginationModule,
    FeatherModule.pick(allIcons),
    SimplebarAngularModule,
    CKEditorModule,
    FlatpickrModule,
    DropzoneModule,
    NgSelectModule,
    SharedModule,
    NgbTypeaheadModule,
    QuotationModule,
    ServiceOrderModule,
    LeafletModule,
    NgbPaginationModule,
    GoogleMapsModule,
    LightboxModule,
    GoogleMap, MapInfoWindow,NgChartsModule, MapMarker ,
     NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [{ provide: MapsAPILoader, useClass: GoogleMapsModule },

    DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule { }
