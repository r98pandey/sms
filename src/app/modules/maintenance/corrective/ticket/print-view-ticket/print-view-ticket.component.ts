import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  NgxPrintElementService,
  Config,
  NgxPrintElementModule,
} from "ngx-print-element";
import { CompanyService } from "src/app/core/services/company.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-print-view-ticket",
  templateUrl: "./print-view-ticket.component.html",
  styleUrls: ["./print-view-ticket.component.scss"],
})
export class PrintViewTicketComponent implements OnInit, OnChanges {
  @Input() storeDataTicket: any = {};
  @Input() selectePasteUplaodArray: any = [];
  @Input() ticketDisscusionArrayListGlobal: any = [];
  @Input() ticketDisscusionArrayList: any = [];
  @Input() totalQuotationCountList: any = [];
  @Input() shownOffInternalChat: boolean = false;
  ticketData: any = [];
  @Input() maintenanceWorkflowAuditList = [];
  incidentList: any = [];
  assetTicketList: any = [];
  ticketWOTechAssignment: any = [];
  ticketWOStartEndTask: any = [];
  ticketWorkOder: any = [];
  imageUrl = environment.apiUrl;
  @ViewChild("printRef") printRefValue!: ElementRef<HTMLTableElement>;
  companyData: any = {};
  constructor(
    public print: NgxPrintElementService,
    private commonFunctionService: CommonFunctionService,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    console.log("storeDataTicket", this.storeDataTicket)
    this.ticketData = this.storeDataTicket.data.mX_Ticketing
      ? [this.storeDataTicket.data.mX_Ticketing]
      : [];

    this.incidentList =
      Object.keys(this.storeDataTicket.data.mX_ReportIncident).length != 0
        ? this.storeDataTicket.data.mX_ReportIncident
        : [];

    this.assetTicketList = this.storeDataTicket.data.mX_TicketItem
      ? this.storeDataTicket.data.mX_TicketItem
      : [];

    this.ticketWOTechAssignment = this.storeDataTicket.data.mX_WOTechAssignment
      ? this.storeDataTicket.data.mX_WOTechAssignment
      : [];
    this.ticketWOStartEndTask = this.storeDataTicket.data.mx_WOStartEndTask
      ? this.storeDataTicket.data.mx_WOStartEndTask
      : [];

    this.ticketWorkOder = this.storeDataTicket.data.mX_WorkOder
      ? this.storeDataTicket.data.mX_WorkOder
      : [];
    // let payload: any = {};
    // payload.companyId = Number(this.ticketData[0]?.companyId);
    // this.getViewData(payload);
  }

  getViewData(paylod: any) {
    this.companyService.getCompanyDetail(paylod).subscribe((res: any) => {
      this.companyData = res?.data;
      ////console.log(this.companyData);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.ticketData = this.storeDataTicket.data.mX_Ticketing
      ? [this.storeDataTicket.data.mX_Ticketing]
      : [];
    this.incidentList =
      Object.keys(this.storeDataTicket.data.mX_ReportIncident).length != 0
        ? this.storeDataTicket.data.mX_ReportIncident
        : [];

    this.assetTicketList = this.storeDataTicket.data.mX_TicketItem
      ? this.storeDataTicket.data.mX_TicketItem
      : [];
    this.ticketWOTechAssignment = this.storeDataTicket.data.mX_WOTechAssignment
      ? this.storeDataTicket.data.mX_WOTechAssignment
      : [];
    this.ticketWOStartEndTask = this.storeDataTicket.data.mx_WOStartEndTask
      ? this.storeDataTicket.data.mx_WOStartEndTask
      : [];

    this.ticketWorkOder = this.storeDataTicket.data.mX_WorkOder
      ? this.storeDataTicket.data.mX_WorkOder
      : [];
    let payload: any = {};
    payload.companyId = Number(this.ticketData[0]?.companyId);
    this.getViewData(payload);
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
}
