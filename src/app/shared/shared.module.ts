import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgbNavModule,
  NgbAccordionModule,
  NgbDropdownModule,
  NgbPaginationModule,
  NgbModule,
  NgbActiveModal,
  NgbToastModule,
} from "@ng-bootstrap/ng-bootstrap";
import { BreadcrumbsComponent } from "./components/breadcrumbs/breadcrumbs.component";
import { ScrollspyDirective } from "./directives/scrollspy.directive";
import { AvatarPhotoComponent } from "./components/avatar-photo/avatar-photo.component";
// Load Icon
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";
import { TableViewComponent } from "./components/table-view/table-view.component";
import { PageLayoutComponent } from "./components/page-layout/page-layout.component";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { CommonFilterComponent } from "./components/common-filter/common-filter.component";
import { CommonAssetListComponent } from "./components/common-asset-list/common-asset-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { SimplebarAngularModule } from "simplebar-angular";
import { AdvanceFilterComponent } from "./components/advance-filter/advance-filter.component";
import { CrmStatComponent } from "./components/crm-stat/crm-stat.component";
import { CountUpModule } from 'ngx-countup'; import { DeleteModalComponent } from "./components/delete-modal/delete-modal.component";
import { SuccessModalComponent } from "./components/success-modal/success-modal.component";
import { MessageModalComponent } from "./components/message-modal/message-modal.component";
import { SignaturePadComponent } from "./components/signature-pad/signature-pad.component";
import { SignaturePadModule } from "angular2-signaturepad";
import { NewAssetListCommonComponent } from "./components/new-asset-list-common/new-asset-list-common.component";
import { AssetViewComponent } from "./components/asset-view/asset-view.component";
import { AuditChartComponent } from "./components/audit-chart/audit-chart.component";
import { ToastsContainer } from "./Service-common/toasts-container.component";
import { ViewQuotationTicketComponent } from "./components/view-quotation-ticket/view-quotation-ticket.component";
import { NgxPrintElementModule } from "ngx-print-element";
import { NewUserListComponent } from "./components/new-user-list/new-user-list.component";
import { AssetAuditViewComponent } from "./components/asset-audit-view/asset-audit-view.component";
import { NotMatchAssetComponent } from "./components/not-match-asset/not-match-asset.component";
import { SuccessModalWithRemarkComponent } from "./components/success-modal-with-remark/success-modal-with-remark.component";
import { DeliveryAssetListCommonComponent } from "./components/delivery-asset-list-common/delivery-asset-list-common.component";
import { AssetAuditChartComponent } from "./components/asset-audit-chart/asset-audit-chart.component";
import { TaskEndAuditComponent } from "./components/task-end-audit/task-end-audit.component";
import { FlowChartWithDigramComponent } from "./components/flow-chart-with-digram/flow-chart-with-digram.component";
import { TaskEndComponent } from "./components/task-end/task-end.component";
import { PrintQuotationTicketComponent } from './components/print-quotation-ticket/print-quotation-ticket.component';
import { ChecklistComponent } from "./components/checklist/checklist.component";
import { TechnicianListModalComponent } from './components/technician-list-modal/technician-list-modal.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { NgxDropzoneModule } from "ngx-dropzone";
import { NewGetV2UserListApplicationComponent } from "./components/new-get-v2-user-list-application/new-get-v2-user-list-application.component";
import { DisposableAssetListComponent } from './components/disposable-asset-list/disposable-asset-list.component';
import { ChatMeaasgeFileComponent } from './components/chat-meaasge-file/chat-meaasge-file.component';
import { UploadAllTypeDocumentComponent } from './components/upload-all-type-document/upload-all-type-document.component';
import { ProjectFileUploadWithoutTypeComponent } from './components/project-file-upload-without-type/project-file-upload-without-type.component';
import { StartandstropModaalComponent } from './components/startandstrop-modaal/startandstrop-modaal.component';
import { WebcamModule } from "ngx-webcam";
import { WebcamComponent } from "./components/webcam/webcam.component";
import { UpdateStatusComponent } from './components/update-status/update-status.component';
import { TechnicianAuditComponent } from './components/technician-audit/technician-audit.component';
import { CreateClientMemberDymiComponent } from './components/create-client-member-dymi/create-client-member-dymi.component';
import { SharedProjectListComponent } from './components/shared-project-list/shared-project-list.component';
import { NftStatComponent } from "../modules/project-management/my-task/nft-stat/nft-stat.component";


@NgModule({
  declarations: [
    BreadcrumbsComponent,
    AvatarPhotoComponent,
    ScrollspyDirective,
    TableViewComponent,
    PageLayoutComponent,
    PaginationComponent,
    CommonFilterComponent,
    CommonAssetListComponent,
    AdvanceFilterComponent,
    CrmStatComponent,
    DeleteModalComponent,
    SuccessModalComponent,
    MessageModalComponent,
    SignaturePadComponent,
    NewAssetListCommonComponent,
    AssetViewComponent,
    AuditChartComponent,
    ViewQuotationTicketComponent,
    ToastsContainer,
    NewUserListComponent,
    NotMatchAssetComponent,
    AssetAuditViewComponent,
    SuccessModalWithRemarkComponent,
    DeliveryAssetListCommonComponent,
    AssetAuditChartComponent,
    TaskEndAuditComponent,
    FlowChartWithDigramComponent,
    TaskEndComponent,
    PrintQuotationTicketComponent,
    ChecklistComponent,
    TechnicianListModalComponent,
    FileUploadComponent,
    NewGetV2UserListApplicationComponent,
    DisposableAssetListComponent,
    ChatMeaasgeFileComponent,
    UploadAllTypeDocumentComponent,
    ProjectFileUploadWithoutTypeComponent,
    WebcamComponent,
    StartandstropModaalComponent,
    UpdateStatusComponent,
    TechnicianAuditComponent,
    CreateClientMemberDymiComponent,
    SharedProjectListComponent, NftStatComponent,
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbModule,
    NgSelectModule,
    SimplebarAngularModule,
    SignaturePadModule,
    NgbToastModule,
    NgxPrintElementModule,
    CountUpModule,
    NgxDropzoneModule, WebcamModule
  ],
  exports: [
    BreadcrumbsComponent,
    AvatarPhotoComponent,
    CommonAssetListComponent,
    CrmStatComponent,
    DeleteModalComponent,
    SuccessModalComponent,
    SuccessModalWithRemarkComponent,
    MessageModalComponent,
    SignaturePadComponent,
    NewAssetListCommonComponent,
    AssetViewComponent,
    AuditChartComponent,
    ViewQuotationTicketComponent,
    ToastsContainer,
    NewUserListComponent,
    NotMatchAssetComponent,
    AssetAuditViewComponent,
    DeliveryAssetListCommonComponent,
    AssetAuditChartComponent,
    TaskEndAuditComponent,
    FlowChartWithDigramComponent,
    TaskEndComponent,
    TechnicianAuditComponent,
    PrintQuotationTicketComponent,
    ChecklistComponent,
    TechnicianListModalComponent,
    FileUploadComponent,
    NewGetV2UserListApplicationComponent,
    ChatMeaasgeFileComponent,
    UploadAllTypeDocumentComponent,
    ProjectFileUploadWithoutTypeComponent,
    StartandstropModaalComponent,
    WebcamComponent,
    UpdateStatusComponent,
    CreateClientMemberDymiComponent, NftStatComponent
  ],
  //  providers: [NgbActiveModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
