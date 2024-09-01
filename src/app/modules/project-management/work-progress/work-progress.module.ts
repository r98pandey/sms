import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { WorkProgressRoutingModule } from './work-progress-routing.module';
import { AddProjectWorkProgressComponent } from './add-project-work-progress/add-project-work-progress.component';
import { AddSubTaskWorkProgressComponent } from './add-sub-task-work-progress/add-sub-task-work-progress.component';
import { AddTaskModalWorkProgressComponent } from './add-task-modal-work-progress/add-task-modal-work-progress.component';
import { PmProjectWorkProgressComponent } from './pm-project-work-progress/pm-project-work-progress.component';
import { ProjectWorkProgressListComponent } from './project-work-progress-list/project-work-progress-list.component';
import { ProjectWorkProgressViewWithSubTaskComponent } from './project-work-progress-view-with-sub-task/project-work-progress-view-with-sub-task.component';
import { ProjectWorkProgressViewWithTaskComponent } from './project-work-progress-view-with-task/project-work-progress-view-with-task.component';
import { ProjectWorkProgressTaskDetailsComponent } from './project-work-progress-task-details/project-work-progress-task-details.component';
import { ProjectWorkProgressSubTaskDocumentUploadComponent } from './project-work-progress-sub-task-document-upload/project-work-progress-sub-task-document-upload.component';
import { SubTaskWorkProgressListModalComponent } from './sub-task-work-progress-list-modal/sub-task-work-progress-list-modal.component';
import { SubTaskWorkProgressViewComponent } from './sub-task-work-progress-view/sub-task-work-progress-view.component';
import { TimeEntriesWorkProgressListComponent } from './time-entries-work-progress-list/time-entries-work-progress-list.component';
import { UploadAttachmentsWorkProgressModalComponent } from './upload-attachments-work-progress-modal/upload-attachments-work-progress-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbTooltipModule, NgbProgressbarModule, NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
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
import { AddProjectScheduleComponent } from '../task-management/add-project-schedule/add-project-schedule.component';
import { AddSubTaskModalComponent } from '../task-management/add-sub-task-modal/add-sub-task-modal.component';
import { AddTaskModalComponent } from '../task-management/add-task-modal/add-task-modal.component';
import { PmProjectScheduleComponent } from '../task-management/pm-project-schedule/pm-project-schedule.component';
import { ProjectScheduleListComponent } from '../task-management/project-schedule-list/project-schedule-list.component';
import { ProjectScheduleViewWithSubTaskComponent } from '../task-management/project-schedule-view-with-sub-task/project-schedule-view-with-sub-task.component';
import { ProjectScheduleViewWithTaskComponent } from '../task-management/project-schedule-view-with-task/project-schedule-view-with-task.component';
import { ProjectTaskDetailsComponent } from '../task-management/project-task-details/project-task-details.component';
import { ProjectTaskSubTaskDocumentUploadComponent } from '../task-management/project-task-sub-task-document-upload/project-task-sub-task-document-upload.component';
import { SubTaskListModalComponent } from '../task-management/sub-task-list-modal/sub-task-list-modal.component';
import { SubTaskViewComponent } from '../task-management/sub-task-view/sub-task-view.component';
import { TimeEntriesListComponent } from '../task-management/time-entries-list/time-entries-list.component';
import { UploadAttachmentsModalComponent } from '../task-management/upload-attachments-modal/upload-attachments-modal.component';
import { WorkProgressProjectTaskApporvalAccesRightComponent } from './work-progress-project-task-apporval-acces-right/work-progress-project-task-apporval-acces-right.component';


@NgModule({
  declarations: [
    AddProjectWorkProgressComponent,
    AddSubTaskWorkProgressComponent,
    AddTaskModalWorkProgressComponent,
    PmProjectWorkProgressComponent,
    ProjectWorkProgressListComponent,
    ProjectWorkProgressViewWithSubTaskComponent,
    ProjectWorkProgressViewWithTaskComponent,
    ProjectWorkProgressTaskDetailsComponent,
    ProjectWorkProgressSubTaskDocumentUploadComponent,
    SubTaskWorkProgressListModalComponent,
    SubTaskWorkProgressViewComponent,
    TimeEntriesWorkProgressListComponent,
    UploadAttachmentsWorkProgressModalComponent,
    WorkProgressProjectTaskApporvalAccesRightComponent
  ],
  imports: [
    CommonModule,
    WorkProgressRoutingModule,
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
    FullCalendarModule,
    LightboxModule, NgApexchartsModule, NgOptionHighlightModule,NgbAccordionModule
  ],
  exports: [],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WorkProgressModule { }
