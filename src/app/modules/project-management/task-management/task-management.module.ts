import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TaskManagementRoutingModule } from './task-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbTooltipModule, NgbProgressbarModule, NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CountUpModule } from 'ngx-countup';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { LightboxModule } from 'ngx-lightbox';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddTaskModalComponent } from './add-task-modal/add-task-modal.component';
import { AddSubTaskModalComponent } from './add-sub-task-modal/add-sub-task-modal.component';
import { ProjectScheduleListComponent } from './project-schedule-list/project-schedule-list.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SubTaskViewComponent } from './sub-task-view/sub-task-view.component';
import { ProjectScheduleViewWithTaskComponent } from './project-schedule-view-with-task/project-schedule-view-with-task.component';
import { ProjectScheduleViewWithSubTaskComponent } from './project-schedule-view-with-sub-task/project-schedule-view-with-sub-task.component';
import { AddProjectScheduleComponent } from './add-project-schedule/add-project-schedule.component';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { SubTaskListModalComponent } from './sub-task-list-modal/sub-task-list-modal.component';
import { UploadAttachmentsModalComponent } from './upload-attachments-modal/upload-attachments-modal.component';
import { ProjectTaskDetailsComponent } from './project-task-details/project-task-details.component';
import { ProjectTaskSubTaskDocumentUploadComponent } from './project-task-sub-task-document-upload/project-task-sub-task-document-upload.component';
import { TimeEntriesListComponent } from './time-entries-list/time-entries-list.component';
import { PmProjectScheduleComponent } from './pm-project-schedule/pm-project-schedule.component';
import { ProjectTaskApporvalAccesRightComponent } from './project-task-apporval-acces-right/project-task-apporval-acces-right.component';


@NgModule({
  declarations: [
    AddTaskModalComponent,
    AddSubTaskModalComponent,
    ProjectScheduleListComponent,
    SubTaskViewComponent,
    ProjectScheduleViewWithTaskComponent,
    ProjectScheduleViewWithSubTaskComponent,
    AddProjectScheduleComponent,
    SubTaskListModalComponent,
    UploadAttachmentsModalComponent,
    ProjectTaskDetailsComponent,
    ProjectTaskSubTaskDocumentUploadComponent,
    TimeEntriesListComponent,
    PmProjectScheduleComponent,
    ProjectTaskApporvalAccesRightComponent,

  ],
  imports: [
    CommonModule,
    TaskManagementRoutingModule,
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
    FullCalendarModule,NgbAccordionModule,
    LightboxModule, NgApexchartsModule, NgOptionHighlightModule
  ],
  exports: [AddTaskModalComponent,
    AddSubTaskModalComponent,
    ProjectScheduleListComponent,
    SubTaskViewComponent,
    ProjectScheduleViewWithTaskComponent,
    ProjectScheduleViewWithSubTaskComponent,
    AddProjectScheduleComponent,
    SubTaskListModalComponent,
    UploadAttachmentsModalComponent,
    ProjectTaskDetailsComponent,
    ProjectTaskSubTaskDocumentUploadComponent,
    TimeEntriesListComponent,PmProjectScheduleComponent],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TaskManagementModule { }
