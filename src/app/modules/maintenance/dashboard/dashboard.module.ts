import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HelpDeskDashboardComponent } from './help-desk-dashboard/help-desk-dashboard.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule, NgbProgressbarModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbToastModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
// Simple bar
import { SimplebarAngularModule } from 'simplebar-angular';
// Ck Editer
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';
// File Uploads
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
// Ng Select
import { NgSelectModule } from '@ng-select/ng-select';
// Load Icon
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';

import { CountUpModule } from 'ngx-countup';// Flat Picker

import { ProjectsStatComponent } from './projects-stat/projects-stat.component';
import { NewTicketListComponent } from './new-ticket-list/new-ticket-list.component';
import { ViewTicketListComponent } from './view-ticket-list/view-ticket-list.component';
import { QuotationModule } from '../corrective/quotation/quotation.module';
import { AssetDashboardComponent } from './asset-dashboard/asset-dashboard.component';
import { ServiceOrderModule } from '../corrective/service-order/service-order.module';
import { WorkflowTicketListComponent } from './workflow-ticket-list/workflow-ticket-list.component';
import { QuotationTicketListComponent } from './quotation-ticket-list/quotation-ticket-list.component';
import { DashboradServiceOrderListComponent } from './dashborad-service-order-list/dashborad-service-order-list.component';
import { ViewAssetTicketComponent } from './view-asset-ticket/view-asset-ticket.component';
import { ViewIncidentTicketComponent } from './view-incident-ticket/view-incident-ticket.component';
import { ViewWorkorderTicketComponent } from './view-workorder-ticket/view-workorder-ticket.component';
import { TicketListForSignatureComponent } from './ticket-list-for-signature/ticket-list-for-signature.component';
import { SignatureTechComponent } from './signature-tech/signature-tech.component';
import { SignatureClientComponent } from './signature-client/signature-client.component';
import { NewClientDashboardComponent } from './new-client-dashboard/new-client-dashboard.component';
import { WaitingforGenerateInvoicelistComponent } from './waitingfor-generate-invoicelist/waitingfor-generate-invoicelist.component';

import { LightboxModule } from "ngx-lightbox";
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleDetailsSignatureComponent } from './schedule-details-signature/schedule-details-signature.component';
import { SeheduleSignatureComponent } from './sehedule-signature/sehedule-signature.component';
import { NewAssetDashbaordComponent } from './new-asset-dashbaord/new-asset-dashbaord.component';
import { AuditListComponent } from './audit-list/audit-list.component';
import { AuditListViewComponent } from './audit-list-view/audit-list-view.component';
import { AuditSignatureComponent } from './audit-signature/audit-signature.component';
import { AssetListDashboardComponent } from './asset-list-dashboard/asset-list-dashboard.component';
import { AssetViewDashboardComponent } from './asset-view-dashboard/asset-view-dashboard.component';
import { AssetDeliveredInstalledComponent } from './asset-delivered-installed/asset-delivered-installed.component';
import { AssetCriticalComponent } from "./asset-critical/asset-critical.component";
import { ListOverDueNewTicketComponent } from './list-over-due-new-ticket/list-over-due-new-ticket.component';
import { ListOverDueBillingEligibleComponent } from './list-over-due-billing-eligible/list-over-due-billing-eligible.component';
import { ListOverDueInternalQuotationComponent } from './list-over-due-internal-quotation/list-over-due-internal-quotation.component';
import { ListOverDueClientQuotApprovalComponent } from './list-over-due-client-quot-approval/list-over-due-client-quot-approval.component';
import { ListOverDueServiceOrderComponent } from './list-over-due-service-order/list-over-due-service-order.component';
import { ListOverDueTicketQuotRequiredComponent } from './list-over-due-ticket-quot-required/list-over-due-ticket-quot-required.component';
import { ListOverDueTicketExternalAcknowledgeComponent } from './list-over-due-ticket-external-acknowledge/list-over-due-ticket-external-acknowledge.component';
import { ListOverDueTicketInternalAcknowledgeComponent } from './list-over-due-ticket-internal-acknowledge/list-over-due-ticket-internal-acknowledge.component';
import { HelpDeskInternalDisscussionComponent } from "./help-desk-global-disscussion/help-desk-internal-disscussion.component";
import { HelpPartChartDashboardComponent } from "./help-part-internal-disscussion/help-part-chart-dashboard.component";
import { AssetWarrantyListComponent } from './asset-warranty-list/asset-warranty-list.component';
import { AssetExtendedListComponent } from './asset-extended-list/asset-extended-list.component';
import { AssetRMAListComponent } from './asset-rma-list/asset-rma-list.component';
// Google Map
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
// Leaflet Map
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { LatestUpdateticketComponent } from './latest-updateticket/latest-updateticket.component';
import { MyTicketComponent } from './my-ticket/my-ticket.component';

// Component Pages
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};
@NgModule({
  declarations: [
    HelpDeskDashboardComponent,
    ClientDashboardComponent,
    ProjectsStatComponent,
    NewTicketListComponent,
    ViewTicketListComponent,
    AssetDashboardComponent,
    WorkflowTicketListComponent,
    QuotationTicketListComponent,
    DashboradServiceOrderListComponent,
    ViewAssetTicketComponent,
    ViewIncidentTicketComponent,
    ViewWorkorderTicketComponent,
    TicketListForSignatureComponent,
    SignatureTechComponent,
    SignatureClientComponent,
    NewClientDashboardComponent,
    WaitingforGenerateInvoicelistComponent,
    ScheduleListComponent,
    ScheduleDetailsSignatureComponent,
    SeheduleSignatureComponent,
    NewAssetDashbaordComponent,
    AuditListComponent,
    AuditListViewComponent,
    AuditSignatureComponent,
    AssetListDashboardComponent,
    AssetViewDashboardComponent,
    AssetDeliveredInstalledComponent,
    AssetCriticalComponent,
    HelpPartChartDashboardComponent,
    HelpDeskInternalDisscussionComponent,
    ListOverDueNewTicketComponent,
    ListOverDueBillingEligibleComponent,
    ListOverDueInternalQuotationComponent,
    ListOverDueClientQuotApprovalComponent,
    ListOverDueServiceOrderComponent,
    ListOverDueTicketQuotRequiredComponent,
    ListOverDueTicketExternalAcknowledgeComponent,
    ListOverDueTicketInternalAcknowledgeComponent,
    AssetWarrantyListComponent,
    AssetExtendedListComponent,
    AssetRMAListComponent,
    LatestUpdateticketComponent,
    MyTicketComponent,
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
    GoogleMap, MapInfoWindow, MapMarker
  ],
  exports: [ViewIncidentTicketComponent, ViewAssetTicketComponent,HelpPartChartDashboardComponent,
    HelpDeskInternalDisscussionComponent,],
  providers: [{ provide: MapsAPILoader, useClass: GoogleMapsModule },

    DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
