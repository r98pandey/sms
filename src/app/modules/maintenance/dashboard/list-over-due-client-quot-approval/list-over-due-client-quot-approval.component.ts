import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-list-over-due-client-quot-approval",
  templateUrl: "./list-over-due-client-quot-approval.component.html",
  styleUrls: ["./list-over-due-client-quot-approval.component.scss"],
})
export class ListOverDueClientQuotApprovalComponent implements OnChanges {
  @Input() listOverDueClientQuotApproval: any[];
  isProject: boolean = false;
  imageUrl = environment.apiUrl;
  constructor(
    private ticketService: TicketService,
    private helpDeskService: HelpDeskService,
    private router: Router,
    private commonFunctionService: CommonFunctionService,
    private authService: AuthAssetService
  ) {
    this.isProject = this.authService.getisProject();
  }
  ngOnChanges(changes: SimpleChanges): void {}
  viewHandler(ticketId: any) {
    this.ticketService.sendTicketId = ticketId;
    this.helpDeskService.pageAction = "";

    this.ticketService.ticketPageAction =
      "List Over Due Client Quotation Approval";
    this.ticketService.lastStoreTicketRouterName =
      "/maintenance-management/dashboard/help-desk-dashboard";
    localStorage.setItem(
      "lastStoreTicketRouterName",
      this.ticketService.lastStoreTicketRouterName
    );
    this.router.navigate([
      "/maintenance-management/corrective/ticket/ticket-view",
    ]);
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  returnWorkFlowStatusBadgeClasses(id: any) {
    return this.commonFunctionService.returnWorkFlowStatusBadgeClasses(id);
  }
  removetheWordName(str: string) {
    if (str.length >= 30) {
      return str.slice(0, 30) + "...";
    } else {
      return str;
    }
  }
}
