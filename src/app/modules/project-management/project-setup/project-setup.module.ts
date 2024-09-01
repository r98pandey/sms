import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProjectSetupRoutingModule } from './project-setup-routing.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { ListProjectComponent } from './list-project/list-project.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbNavModule, NgbModule, NgbProgressbarModule, NgbTooltipModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { provideNgxMask } from 'ngx-mask';
import { LightboxModule } from 'ngx-lightbox';
// Ck Editer
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { NgxDropzoneModule } from 'ngx-dropzone';
import { TenderComponent } from './tender/tender.component';
import { TechnicalProposalComponent } from './technical-proposal/technical-proposal.component';
import { ProjectScheduleComponent } from './project-schedule/project-schedule.component';
import { MaterialRequestApprovalComponent } from './material-request-approval/material-request-approval.component';
import { AwardEvaluationComponent } from './award-evaluation/award-evaluation.component';
import { ProjectKickOffComponent } from './project-kick-off/project-kick-off.component';
import { RequestWorkInspectionComponent } from './request-work-inspection/request-work-inspection.component';
import { TAndCUatComponent } from './t-and-c-uat/t-and-c-uat.component';
import { DlpComponent } from './dlp/dlp.component';
import { WarrentyPeriodComponent } from './warrenty-period/warrenty-period.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { NewAddProjectComponent } from './new-add-project/new-add-project.component';
import { CountUpModule } from 'ngx-countup';
import { DndModule } from 'ngx-drag-drop';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { SiteVisitComponent } from './site-visit/site-visit.component';
import { MatTableModule } from '@angular/material/table';
// Flat Picker
import { FlatpickrDefaults, FlatpickrModule } from "angularx-flatpickr";
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatInputModule } from '@angular/material/input';
import { TodoListComponent } from './todo-list/todo-list.component';
import { InviteMemberComponent } from './invite-member/invite-member.component';
import { AddFollowComponent } from './add-follow/add-follow.component';
import { ViewEventFullDetailsComponent } from './view-event-full-details/view-event-full-details.component';
import { UploadeAttachmentsComponent } from './uploade-attachments/uploade-attachments.component';
import { EditUploadAttachementsComponent } from './edit-upload-attachements/edit-upload-attachements.component';
import { AddNewProccessComponent } from './add-new-proccess/add-new-proccess.component';
import { ViewNewProccessComponent } from './view-new-proccess/view-new-proccess.component';
import { UploadDocumentWithDocumentComponent } from './upload-document-with-document/upload-document-with-document.component';
import { AddRwifFormComponent } from './add-rwif-form/add-rwif-form.component';
import { RwifComponent } from './rwif/rwif.component';
import { EditRwifFormComponent } from './edit-rwif-form/edit-rwif-form.component';
import { GenerateRFWIFormComponent } from './generate-rfwiform/generate-rfwiform.component';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { RfwiformUploaderComponent } from './rfwiform-uploader/rfwiform-uploader.component';
import { ViewRwifFormComponent } from './view-rwif-form/view-rwif-form.component';
import { MaintenanceAgreementComponent } from './maintenance-agreement/maintenance-agreement.component';
import { AddMaintenanceAgreementModelComponent } from './add-maintenance-agreement-model/add-maintenance-agreement-model.component';
import { ViewMaintenanceAgreementComponent } from './view-maintenance-agreement/view-maintenance-agreement.component';
import { AttmachmentAgreementComponent } from './attmachment-agreement/attmachment-agreement.component';
import { AddUploadMainateaanceAttachmentComponent } from './add-upload-mainateaance-attachment/add-upload-mainateaance-attachment.component';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { WarrantyListComponent } from './warranty-list/warranty-list.component';
import { AddWarrantyComponent } from './add-warranty/add-warranty.component';
import { ViewWarrantyComponent } from './view-warranty/view-warranty.component';
import { ListAttchamentWarrantyComponent } from './list-attchament-warranty/list-attchament-warranty.component';
import { AddUploadAttchamentWarrantyComponent } from './add-upload-attchament-warranty/add-upload-attchament-warranty.component';
import { ListAccessRightComponent } from './list-access-right/list-access-right.component';
import { AddAccessRightComponent } from './add-access-right/add-access-right.component';
import { NewUserModule } from '../../application-settings/user-management/new-user/new-user.module';
import { ShownInternalExternalMatainanceComponent } from './shown-internal-external-matainance/shown-internal-external-matainance.component';
import { MytaskAccessRightModalInternalExternalMatainanceComponent } from './mytask-access-right-modal-internal-external-matainance/mytask-access-right-modal-internal-external-matainance.component';
import { WorkflowModule } from '../../application-settings/workflow/workflow.module';
import { TaskManagementModule } from '../task-management/task-management.module';
import { ProjectTaskMonthYearWiseProjectIdComponent } from './project-task-month-year-wise-project-id/project-task-month-year-wise-project-id.component';
import { PreventiveMonthYearWiseProjectIdComponent } from './preventive-month-year-wise-project-id/preventive-month-year-wise-project-id.component';
import { CorrectiveMonthYearWiseProjectIdComponent } from './corrective-month-year-wise-project-id/corrective-month-year-wise-project-id.component';

@NgModule({
  declarations: [
    AddProjectComponent,
    ListProjectComponent,
    ViewProjectComponent,
    EditProjectComponent,
    TenderComponent,
    TechnicalProposalComponent,
    ProjectScheduleComponent,
    MaterialRequestApprovalComponent,
    AwardEvaluationComponent,
    ProjectKickOffComponent,
    RequestWorkInspectionComponent,
    TAndCUatComponent,
    DlpComponent,
    WarrentyPeriodComponent,
    MaintenanceComponent,
    NewAddProjectComponent,
    SiteVisitComponent,
    TodoListComponent,
    InviteMemberComponent,
    AddFollowComponent,
    ViewEventFullDetailsComponent,
    UploadeAttachmentsComponent,
    EditUploadAttachementsComponent,
    AddNewProccessComponent,
    ViewNewProccessComponent,
    UploadDocumentWithDocumentComponent,
    AddRwifFormComponent,
    RwifComponent,
    EditRwifFormComponent,
    GenerateRFWIFormComponent,
    RfwiformUploaderComponent,
    ViewRwifFormComponent,
    MaintenanceAgreementComponent,
    AddMaintenanceAgreementModelComponent,
    ViewMaintenanceAgreementComponent,
    AttmachmentAgreementComponent,
    AddUploadMainateaanceAttachmentComponent,
    WarrantyListComponent,
    AddWarrantyComponent,
    ViewWarrantyComponent,
    ListAttchamentWarrantyComponent,
    AddUploadAttchamentWarrantyComponent,
    ListAccessRightComponent,
    AddAccessRightComponent,
    ShownInternalExternalMatainanceComponent,
    MytaskAccessRightModalInternalExternalMatainanceComponent,
    ProjectTaskMonthYearWiseProjectIdComponent,
    PreventiveMonthYearWiseProjectIdComponent,
    CorrectiveMonthYearWiseProjectIdComponent,

  ],
  imports: [
    CommonModule,
    ProjectSetupRoutingModule,
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
    NewUserModule,
    WorkflowModule,
    TaskManagementModule
  ],
  providers: [
    DatePipe,
    provideNgxMask(),
    FlatpickrDefaults
  ],
  exports: [ViewEventFullDetailsComponent, AddFollowComponent,MaintenanceAgreementComponent,WarrantyListComponent,
    AddWarrantyComponent,
    ViewWarrantyComponent,
    ListAttchamentWarrantyComponent,
    AddUploadAttchamentWarrantyComponent,
    ListAccessRightComponent,
    AddAccessRightComponent,TodoListComponent,ViewEventFullDetailsComponent
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectSetupModule { 
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
