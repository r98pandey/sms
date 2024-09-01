import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MyTaskRoutingModule } from './my-task-routing.module';
import { MyTaskListComponent } from './my-task-list/my-task-list.component';
import { CdkDropListGroup, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgbDropdownModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbNavModule, NgbModule, NgbTooltipModule, NgbProgressbarModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { NgStepperModule } from 'angular-ng-stepper';
import { FlatpickrModule, FlatpickrDefaults } from 'angularx-flatpickr';
import { CountUpModule } from 'ngx-countup';
import { DndModule } from 'ngx-drag-drop';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';
import { provideNgxMask } from 'ngx-mask';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';

// Swiper Slider
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { DashboardModule } from '../dashboard/dashboard.module';
import { MaintenanceDocumentionsComponent } from './maintenance-documentions/maintenance-documentions.component';
import { ProjectDocumentComponent } from './project-document/project-document.component';
import { WarrantyDocumentComponent } from './warranty-document/warranty-document.component';
import { ProjectDocumentViewActionComponent } from './project-document-view-action/project-document-view-action.component';
import { ProjectDocumentListActionComponent } from './project-document-list-action/project-document-list-action.component';
import { MaintenanceDocumentionsListComponent } from './maintenance-documentions-list/maintenance-documentions-list.component';
import { MaintenanceDocumentionsViewComponent } from './maintenance-documentions-view/maintenance-documentions-view.component';
import { WarrantyDocumentViewComponent } from './warranty-document-view/warranty-document-view.component';
import { WarrantyDocumentListComponent } from './warranty-document-list/warranty-document-list.component';
import { AttmachmentAgreementWarrantyComponent } from './attmachment-agreement-warranty/attmachment-agreement-warranty.component';
import { MainTaskSubTaskListComponent } from './main-task-sub-task-list/main-task-sub-task-list.component';
import { MainTaskSubTaskComponent } from './main-task-sub-task/main-task-sub-task.component';
import { MainTaskSubTaskViewComponent } from './main-task-sub-task-view/main-task-sub-task-view.component';
import { UploadAttachmentsModalComponent } from './upload-attachments-modal/upload-attachments-modal.component';
import { ProjectScheduleViewWithSubTaskComponent } from './project-schedule-view-with-sub-task/project-schedule-view-with-sub-task.component';
import { MasterFollowListPendingComponent } from './master-follow-list-pending/master-follow-list-pending.component';
import { ProjectSetupModule } from '../project-setup/project-setup.module';
import { TaskManagementModule } from '../task-management/task-management.module';
import { AssignMainTaskSubTaskListComponent } from './assign-main-task-sub-task-list/assign-main-task-sub-task-list.component';
import { StartMainTaskSubTaskListComponent } from './start-main-task-sub-task-list/start-main-task-sub-task-list.component';
import { ProjectScheduleViewSubTaskSingleComponent } from './project-schedule-view-sub-task-single/project-schedule-view-sub-task-single.component';
import { ChatBotMyTaskComponent } from './chat-bot-my-task/chat-bot-my-task.component';
import { AssignTaskAppvovalPendingComponent } from './assign-task-appvoval-pending/assign-task-appvoval-pending.component';
import { NewUserModule } from '../../application-settings/user-management/new-user/new-user.module';

@NgModule({
  declarations: [
    MyTaskListComponent,
    WarrantyDocumentComponent,
    ProjectDocumentComponent,
    MaintenanceDocumentionsComponent,
    ProjectDocumentViewActionComponent,
    ProjectDocumentListActionComponent,
    MaintenanceDocumentionsListComponent,
    MaintenanceDocumentionsViewComponent,
    WarrantyDocumentViewComponent,
    WarrantyDocumentListComponent,
    AttmachmentAgreementWarrantyComponent,
    MainTaskSubTaskListComponent,
    MainTaskSubTaskComponent,
    MainTaskSubTaskViewComponent,
    UploadAttachmentsModalComponent,
    ProjectScheduleViewWithSubTaskComponent,
    MasterFollowListPendingComponent,
    AssignMainTaskSubTaskListComponent,
    StartMainTaskSubTaskListComponent,
    ProjectScheduleViewSubTaskSingleComponent,
    ChatBotMyTaskComponent,
    AssignTaskAppvovalPendingComponent,
    
  ],
  imports: [
    CommonModule,
    MyTaskRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FlatpickrModule.forRoot(),
    SimplebarAngularModule,
    FeatherModule.pick(allIcons),
    NgbNavModule,
    CdkStepperModule,
    NgStepperModule,
    SharedModule,
    LightboxModule,
    CKEditorModule,
    NgxDropzoneModule, NgbModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    DndModule,
    CountUpModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatTableModule,
    NgxMatTimepickerModule,
    MatInputModule,
    NgOptionHighlightModule,
    NgbAccordionModule,
     LeafletModule,
    NewUserModule, 
    SlickCarouselModule,
    ProjectSetupModule,
    NgApexchartsModule,
    NgChartsModule,TaskManagementModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [
    DatePipe,
    provideNgxMask(),
    FlatpickrDefaults
  ],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyTaskModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
