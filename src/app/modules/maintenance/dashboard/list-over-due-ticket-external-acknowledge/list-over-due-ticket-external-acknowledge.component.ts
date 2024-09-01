import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";

@Component({
  selector: "app-list-over-due-ticket-external-acknowledge",
  templateUrl: "./list-over-due-ticket-external-acknowledge.component.html",
  styleUrls: ["./list-over-due-ticket-external-acknowledge.component.scss"],
})
export class ListOverDueTicketExternalAcknowledgeComponent
  implements OnChanges
{
  @Input() listOverDueTicketExternalAcknowledge: any[];
  isProject: boolean = false;
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

    this.ticketService.ticketPageAction = "List Over Due New Ticket Page";
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
}
