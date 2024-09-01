import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { HelpDeskDashboardComponent } from './help-desk-dashboard/help-desk-dashboard.component';
import { NewTicketListComponent } from './new-ticket-list/new-ticket-list.component';
import { ViewTicketListComponent } from './view-ticket-list/view-ticket-list.component';
import { AssetDashboardComponent } from './asset-dashboard/asset-dashboard.component';
import { WorkflowTicketListComponent } from './workflow-ticket-list/workflow-ticket-list.component';
import { QuotationTicketListComponent } from './quotation-ticket-list/quotation-ticket-list.component';
import { DashboradServiceOrderListComponent } from './dashborad-service-order-list/dashborad-service-order-list.component';
import { TicketListForSignatureComponent } from './ticket-list-for-signature/ticket-list-for-signature.component';
import { NewClientDashboardComponent } from './new-client-dashboard/new-client-dashboard.component';
import { WaitingforGenerateInvoicelistComponent } from "./waitingfor-generate-invoicelist/waitingfor-generate-invoicelist.component";
import { ScheduleListComponent } from "./schedule-list/schedule-list.component";
import { ScheduleDetailsSignatureComponent } from "./schedule-details-signature/schedule-details-signature.component";
import { NewAssetDashbaordComponent } from "./new-asset-dashbaord/new-asset-dashbaord.component";
import { AuditListComponent } from "./audit-list/audit-list.component";
import { AuditListViewComponent } from "./audit-list-view/audit-list-view.component";
import { AssetListDashboardComponent } from "./asset-list-dashboard/asset-list-dashboard.component";
import { AssetViewDashboardComponent } from "./asset-view-dashboard/asset-view-dashboard.component";
import { AssetDeliveredInstalledComponent } from "./asset-delivered-installed/asset-delivered-installed.component";
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { MyTicketComponent } from './my-ticket/my-ticket.component';

const routes: Routes = [
  {
    path: "help-desk-dashboard",
    component: HelpDeskDashboardComponent,
    // canActivate: [RoleGuard],
    // data: { allowedRoles: ['System Administrator', 'superadmin'] } // Specify allowed roles
   
  },
  {
    path: "old-asset-dashboard",
    component: AssetDashboardComponent,
  },
  {
    path: "asset-dashboard",
    component: NewAssetDashbaordComponent,
  },
  {
    path: "audit-list-dashboard",
    component: AuditListComponent,
  },
  {
    path: "test-dashboard",
    component: HelpDeskDashboardComponent,
  },
  {
    path: "client-dashboard",
    component: NewClientDashboardComponent,
    // canActivate: [RoleGuard],
    // data: { allowedRoles: ['client', 'superadmin'] } // Specify allowed roles
  },
  {
    path: "new-ticket-list",
    component: NewTicketListComponent,
  },

  {
    path: "workflow-ticket-list",
    component: WorkflowTicketListComponent,
  },
  {
    path: "quotation-ticket-list",
    component: QuotationTicketListComponent,
  },
  {
    path: "view-new-ticket-list",
    component: ViewTicketListComponent,
  },
  {
    path: "view-audit-list",
    component: AuditListViewComponent,
  },
  {
    path: "asset-list-dashboard",
    component: AssetListDashboardComponent,
  },
  {
    path: "asset-view-dashboard",
    component: AssetViewDashboardComponent,
  },
  {
    path: "asset-delivered-installed-dashboard",
    component: AssetDeliveredInstalledComponent,
  },

  {
    path: "dashboard-servicet-order-list",
    component: DashboradServiceOrderListComponent,
  },
  {
    path: "tech-sigature-ticket-list",
    component: TicketListForSignatureComponent,
  },
  {
    path: "waiting-for-generate-invoice-list",
    component: WaitingforGenerateInvoicelistComponent,
  },
  {
    path: "schedule-list-adminandclient",
    component: ScheduleListComponent,
  },
  {
    path: "schedule-detail-signature-adminandclient",
    component: ScheduleDetailsSignatureComponent,
  },{
    path: "my-ticket",
    component: MyTicketComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "help-desk-dashboard",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
