import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbNav } from "@ng-bootstrap/ng-bootstrap";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { CommonFunctionService } from "../../../../shared/Service-common/common-function.service";
import { environment } from "../../../../../environments/environment";
import Swal from "sweetalert2";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { ServiceOrderService } from "../../../../core/services/service-order.service";
import { QuotationService } from "../../../../core/services/quotation.service";
import { Q } from "@fullcalendar/core/internal-common";
import { Lightbox } from "ngx-lightbox";
import { event } from "jquery";
import { SpinnerVisibilityService } from "ng-http-loader";

import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { FileUploadComponent } from "src/app/shared/components/file-upload/file-upload.component";
import { UploadAllTypeDocumentComponent } from "src/app/shared/components/upload-all-type-document/upload-all-type-document.component";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";

@Component({
  selector: "app-view-ticket-list",
  templateUrl: "./view-ticket-list.component.html",
  styleUrls: ["./view-ticket-list.component.scss"],
  animations: [
    trigger("blink", [
      state(
        "start1",
        style({
          background: "lavender",
          opacity: 0.5,
        })
      ),
      state(
        "end1",
        style({
          background: "inherit",
          opacity: 1,
        })
      ),
      transition("start1 <=> end1", [animate("0.9s")]),
    ]),
    trigger("blink2", [
      state(
        "start2",
        style({
          background: "lavender",

          opacity: 0.5,
        })
      ),
      state(
        "end2",
        style({
          background: "inherit",
          opacity: 1,
        })
      ),
      transition("start2 <=> end2", [animate("0.9s")]),
    ]),
  ],
})
export class ViewTicketListComponent
  implements OnInit, AfterViewChecked, OnDestroy {
  isProject: any;
  activeId: number = 1;
  imageUrl: any = environment.apiUrl;
  maxCharMessage: number = 2000;
  breadCrumbItems = [
    { label: "Ticket" },
    { label: "Ticket View", active: true },
  ];
  maxCharsBillingEligibilityDecision = 300;

  maxCharsDecision = 300;
  storeTicketId: any;
  ticketData: any = [];
  MessageContain: any = "";
  ticketDisscusionArrayList: any = [];
  maintenanceWorkflowAuditList: any = [];
  generateServiceOrderTabShown: boolean = true;
  generateQuotationTabShown: boolean = false;
  @ViewChild("isQuotationGenerateFalse", { static: true })
  isQuotationGenerateFalse: ElementRef;
  @ViewChild("isQuotationGenerateTrue", { static: true })
  isQuotationGenerateTrue: ElementRef;
  @ViewChild("isQuotationGenerateMessageForQuotationPending", { static: true })
  isQuotationGenerateMessageForQuotationPending: ElementRef;
  @ViewChild("isQuotationGenerateMessageForApprove", { static: true })
  isQuotationGenerateMessageForApprove: ElementRef;
  @ViewChild("isQuotationGenerateMessageForQuotationInReview", { static: true })
  isQuotationGenerateMessageForQuotationInReview: ElementRef;
  @ViewChild("isNoBillingEligibilityDecision", { static: true })
  isNoBillingEligibilityDecision: ElementRef;
  @ViewChild("isYesBillingEligibilityDecision", { static: true })
  isYesBillingEligibilityDecision: ElementRef;
  @ViewChild("successDataModalIsBilling", { static: true })
  successDataModalIsBilling: ElementRef;
  @ViewChild("iscloseTicketModalPopup", { static: true })
  iscloseTicketModalPopup: ElementRef;
  @ViewChild("isAcknowledgeTicketModalPopup", { static: true })
  isAcknowledgeTicketModalPopup: ElementRef;

  @ViewChild("isVerifyTicketModalPopup", { static: true })
  isVerifyTicketModalPopup: ElementRef;

  selectedTicketDocumentArray: any = [];
  viewQuotationTabShown: boolean = false;
  storeWorkflowObject: any;
  billingEligibilityDecisionRemarkValue: any = null;
  ticketObjectInBillingWorkFlow: any;
  quotationObjectWorkFlow: any;
  viewQuationApproveReviewButtons: boolean = false;
  quotationObjectFromTheDashbaordWorkFlowTable: any = {};
  assetTicketItem: any = [];
  ticketReportIncident: any = [];
  defaultNavActiveId: number;
  ticketWorkOder: any = [];
  ticketWOTechAssignment: any;
  ticketWOStartEndTask: any;
  @ViewChild("customNav") customNav: NgbNav; // Reference to the ngbNav component
  @ViewChild("defaultNav") defaultNav: NgbNav; // Reference to the ngbNav component
  updateTicketCloseVisiable: boolean = false;
  rejectViewQuotation: boolean = false;
  updateTicketAcknowledgeVisiable: boolean = false;

  siteVisitDateTimeValue: boolean = true;
  shownQuotation: boolean = true;
  takenAction: number = 0;
  selectePasteUplaodArray: any = [];
  shownVerifyButton: boolean = false;
  selecteTicketVideoArray: any[] = [];
  internalFileValue: any;
  globalFileValue: any;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    private commonFunctionService: CommonFunctionService,
    private helpDeskService: HelpDeskService,
    private serviceOrderService: ServiceOrderService,
    private quotationService: QuotationService,
    private lightbox: Lightbox,
    private spinner: SpinnerVisibilityService
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();
    this.storeTicketId = this.ticketService.sendTicketId
      ? this.ticketService.sendTicketId
      : 0;
    if (this.storeTicketId == 0 || this.storeTicketId == null) {
      let lastRouter = this.ticketService.lastStoreRouterDashboardName;
      this.router.navigate([lastRouter]);
    } else {
      this.getTicketDetails(this.storeTicketId);

      this.getV2_ServiceOrder_Tech_TaskListAndDetail(this.storeTicketId);

      this.getV2_MaintenanceWorkflowAudit(this.storeTicketId);
      this.getV2_TicketDocument(this.storeTicketId);
    }
  }
  callingApi() {
    this.getTicketDetails(this.storeTicketId);
    this.getV2_ServiceOrder_Tech_TaskListAndDetail(this.storeTicketId);
    this.getV2_MaintenanceWorkflowAudit(this.storeTicketId);
    this.getV2_TicketDocument(this.storeTicketId);
  }

  ngOnInit(): void {
    this.defaultNavActiveId = 1;
  }

  getTicketDetails(ticketId: any) {
    let payload = {
      TicketId: ticketId,
    };
    this.ticketService
      .getV2_TicketingAndIncidentListDetail(payload)
      .subscribe((res: any) => {
        Object.keys(res.data).forEach((key) => {
          console.log("ticket res", res);
          if (res.data[key] === null) {
            res.data[key] = [];
          }
        });


        this.ticketData = res.data.mX_Ticketing ? [res.data.mX_Ticketing] : [];

        console.log("ticket", this.ticketData);
        this.assetTicketItem = res.data.mX_TicketItem
          ? res.data.mX_TicketItem
          : [];
        this.ticketReportIncident =
          res.data.mX_ReportIncident.length != 0
            ? [res.data.mX_ReportIncident]
            : [];
        this.getChatData();
        this.getV2_TicketImagesList(this.storeTicketId);
        this.getV2_TicketVideo(this.storeTicketId);
        this.initaliseTypeForNewTicketStatus(
          this.ticketData[0]?.ticketStatusId
        );
      });

  }

  getV2_ServiceOrder_Tech_TaskListAndDetail(TicketId) {
    let payload = {
      TicketId: TicketId,
    };
    this.helpDeskService
      .getV2_ServiceOrder_Tech_TaskListAndDetail(payload)
      .subscribe((res: any) => {
        //console.log("chanfes", res);
        Object.keys(res.list).forEach((key) => {
          if (res.list[key] === null) {
            res.list[key] = [];
          }
        });
        this.ticketWorkOder = res.list.mX_WorkOder ? res.list.mX_WorkOder : [];
        this.ticketWOTechAssignment = res.list.mX_WOTechAssignment
          ? res.list.mX_WOTechAssignment
          : [];
        this.ticketWOStartEndTask = res.list.mx_WOStartEndTask
          ? res.list.mx_WOStartEndTask
          : [];
      });
  }
  getUpdateListValue(event) {
    this.getTicketDetails(this.storeTicketId);
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }



  ticketDisscusionTotalRecordsFromApi: number = 0;
  ticketDisscusionFrom: number = 0;
  ticketDisscusionTo: number = 0;
  ticketDisscusionPageSize: number = 10;
  getV2_TicketDisscusion_ServerPaging(
    displayLength: number = 10,
    startIndex: Number = 0
  ) {
    let payload = {
      ticketId: this.storeTicketId,
      displayLength: displayLength,
      displayStart: startIndex,
    };
    this.ticketService
      .getV2_TicketDisscusion_ServerPaging(payload)
      .subscribe((res: any) => {
        if (res.list.length > 0) {
          this.ticketDisscusionArrayList = res.list;
          this.ticketDisscusionTotalRecordsFromApi = res.list[0].totalCount;
          this.ticketDisscusionFrom = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.ticketDisscusionTo = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.ticketDisscusionPageSize = displayLength;
        } else if (
          this.ticketDisscusionArrayList.length == 0 &&
          res.list.length == 0
        ) {
          // this.ticketDisscusionPage = 1;
          this.ticketDisscusionTotalRecordsFromApi = 0;
          this.ticketDisscusionFrom = 0;
          this.ticketDisscusionTo = 0;
          this.ticketDisscusionPageSize = displayLength;
        }
      });
  }
  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  warning(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: res,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  openRequestBillingEligibilityModalUp(successModal: any) {
    this.modalService.open(successModal, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  successAfterRequstedBilling(ticketId: any) {
    let payload = {
      ProjectId: this.ticketData[0].projectId,
      TicketId: ticketId,
    };
    this.ticketService
      .requestBillingEligibilityProcess_V2(payload)
      .subscribe((res: any) => {
        if (res.isQuotationGenerate == false) {
          this.isQuotationGenerateFalseModal(this.isQuotationGenerateFalse);
        } else {
          this.isQuotationGenerateTrueModal(this.isQuotationGenerateTrue);
        }
      });
  }


  goback() {
    let lastRouter = this.ticketService.lastStoreRouterDashboardName;
    this.router.navigate([lastRouter]);
  }
  isQuotationGenerateFalseModal(content: any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }
  isQuotationGenerateTrueModal(content: any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  startQuotationGenerateInCaseTrue(storeTicketId) {
    this.generateQuotationTabShown = true;
    this.generateServiceOrderTabShown = false;
    this.viewQuotationTabShown = false;
    //this.customNav.activeId = 4;
    this.activeId = 4;
  }

  getSubmitAfterGernateServiceOrderValue(event) {
    // //console.log(event);
    //console.log(this.helpDeskService.ticketStatusId, "hg");
    this.router.navigate(["/maintenance-management/dashboard/new-ticket-list"]);
  }

  getupdateStatusAssetList(event: any) {
    if (event) {
      this.getTicketDetails(this.storeTicketId);
      this.getV2_ServiceOrder_Tech_TaskListAndDetail(this.storeTicketId);

      this.defaultNavActiveId = 1;
    }
  }
  initaliseTypeForNewTicketStatus(ticketStatusId) {
    // New ticket process

    this.defaultNavActiveId = 1;
    if (ticketStatusId == 48) {
      this.generateServiceOrderTabShown = true;
      this.generateQuotationTabShown = false;
      this.viewQuotationTabShown = false;
    }

    // Billing Eligibility Process Account manger will make the desccision the ticket is billable or non billable
    else if (ticketStatusId == 51) {
      this.generateServiceOrderTabShown = false;
      this.generateQuotationTabShown = false;
      this.viewQuotationTabShown = false;
    }
    // to generate the quotation after billing eliablity process
    else if (ticketStatusId == 53) {
      this.generateServiceOrderTabShown = false;
      this.generateQuotationTabShown = true;
      //this.customNav.activeId = 4;
      this.activeId = 4;
      this.viewQuotationTabShown = false;
    }
    // quotation in review and Proccess for account manger to review or Approve
    else if (ticketStatusId == 54) {
      this.quotationObjectFromTheDashbaordWorkFlowTable = {
        ...this.helpDeskService.workflowObject,
      };
      this.quotationObjectWorkFlow = {
        ...this.ticketService.quotationObjectWorkFlow,
      };
      if (
        this.quotationObjectWorkFlow.quotId === 0 ||
        this.quotationObjectWorkFlow.quotId == null
      ) {
        let lastRouter = this.ticketService.lastStoreRouterDashboardName;
        this.router.navigate([lastRouter]);
      } else {
        this.generateServiceOrderTabShown = false;
        this.generateQuotationTabShown = false;
        this.viewQuotationTabShown = true;
        ////this.customNav.activeId = 6;
        this.activeId = 6;
        this.viewQuationApproveReviewButtons = true;
        this.getV2_MX_QuotationNoListOnlyByTicketId(this.storeTicketId);
      }
    }
    // quotation in review and Proccess for account manger to review or Approve client
    else if (ticketStatusId == 55) {
      this.quotationObjectFromTheDashbaordWorkFlowTable = {
        ...this.helpDeskService.workflowObject,
      };
      this.quotationObjectWorkFlow = {
        ...this.ticketService.quotationObjectWorkFlow,
      };
      if (
        this.quotationObjectWorkFlow.quotId === 0 ||
        this.quotationObjectWorkFlow.quotId == null
      ) {
        let lastRouter = this.ticketService.lastStoreRouterDashboardName;
        this.router.navigate([lastRouter]);
      } else {
        this.generateServiceOrderTabShown = false;
        this.generateQuotationTabShown = false;
        this.viewQuotationTabShown = true;
        // //this.customNav.activeId = 6;
        this.activeId = 6;
        this.viewQuationApproveReviewButtons = true;
        this.getV2_MX_QuotationNoListOnlyByTicketId(this.storeTicketId);
      }
    }
    //Waiting For Generate New Service Order .tickets have been approved and are Awaiting Service Order Generation.
    else if (ticketStatusId == 52) {
      this.generateServiceOrderTabShown = true;
      this.generateQuotationTabShown = false;
      this.viewQuotationTabShown =
        this.ticketData[0]?.isBillingRequired === true ? true : false;
    }
    else if (ticketStatusId == 29) {
      if (
        this.helpDeskService.pageAction ==
        "Assign Member & Site Visit Date Time"
      ) {
        this.siteVisitDateTimeValue = false;
        this.getV2_ServiceOrderDetailOnly(this.storeTicketId);
      }
    } else if (ticketStatusId == 31) {
      if (this.helpDeskService.pageAction == "Waiting Client to Close Ticket") {
        this.updateTicketCloseVisiable = true;
        this.generateServiceOrderTabShown = false;
        this.generateQuotationTabShown = false;
        let currentUserRole = JSON.parse(
          localStorage.getItem("currentUser")
        ).role;
        //console.log(JSON.parse(localStorage.getItem("currentUser")));
        if (currentUserRole === "Client User") {
          if (
            JSON.parse(localStorage.getItem("currentUser")).accessGroupName ===
            "Application User"
          ) {
            this.viewQuotationTabShown = false;
          } else {
            this.viewQuotationTabShown = true;
          }
        } else {
          if (currentUserRole == "System Administrator") {
            this.viewQuotationTabShown = true;
          } else if (currentUserRole == "Asset Administrator") {
            this.viewQuotationTabShown = true;
          } else if (currentUserRole == "Management") {
            this.viewQuotationTabShown = true;
          } else {
            this.viewQuotationTabShown = false;
          }
        }
      }
      if (
        this.helpDeskService.pageAction == "Waiting Internal Ticket to Close"
      ) {
        this.updateTicketCloseVisiable = true;
        this.generateServiceOrderTabShown = false;
        this.generateQuotationTabShown = false;
        let currentUserRole = JSON.parse(
          localStorage.getItem("currentUser")
        ).role;
        //console.log(JSON.parse(localStorage.getItem("currentUser")));
        if (currentUserRole === "Client User") {
          if (
            JSON.parse(localStorage.getItem("currentUser")).accessGroupName ===
            "Application User"
          ) {
            this.viewQuotationTabShown = false;
          } else {
            this.viewQuotationTabShown = true;
          }
        } else {
          if (currentUserRole == "System Administrator") {
            this.viewQuotationTabShown = true;
          } else if (currentUserRole == "Asset Administrator") {
            this.viewQuotationTabShown = true;
          } else if (currentUserRole == "Management") {
            this.viewQuotationTabShown = true;
          } else {
            this.viewQuotationTabShown = false;
          }
        }
      }
    }


    else if (ticketStatusId == 61) {
      if (
        this.helpDeskService.pageAction ==
        "Ticket Acknowledgement for completed service order"
      ) {
        this.updateTicketAcknowledgeVisiable = true;
        this.generateServiceOrderTabShown = false;
        this.generateQuotationTabShown = false;
        this.getV2_MX_QuotationNoListOnlyByTicketId(this.storeTicketId);
        let currentUserRole = JSON.parse(
          localStorage.getItem("currentUser")
        ).role;

        if (currentUserRole === "Client User") {
          if (
            JSON.parse(localStorage.getItem("currentUser")).accessGroupName ===
            "Application User"
          ) {
            this.viewQuotationTabShown = false;
          } else {
            this.viewQuotationTabShown = true;
          }
        } else {
          if (currentUserRole == "System Administrator") {
            this.viewQuotationTabShown = true;
          } else if (currentUserRole == "Asset Administrator") {
            this.viewQuotationTabShown = true;
          } else if (currentUserRole == "Management") {
            this.viewQuotationTabShown = true;
          } else {
            this.viewQuotationTabShown = false;
          }
        }
      }
    }
    else if (ticketStatusId == 72) {
      if (this.helpDeskService.pageAction == 'Ticket Verification For Acknowledge Process') {
        this.shownVerifyButton = true;
        this.generateServiceOrderTabShown = false;
        this.generateQuotationTabShown = false;
        this.getV2_MX_QuotationNoListOnlyByTicketId(this.storeTicketId);
        let currentUserRole = JSON.parse(
          localStorage.getItem("currentUser")
        ).role;

        if (currentUserRole === "Client User") {
          if (
            JSON.parse(localStorage.getItem("currentUser")).accessGroupName ===
            "Application User"
          ) {
            this.viewQuotationTabShown = false;
          } else {
            this.viewQuotationTabShown = true;
          }
        } else {
          if (currentUserRole == "System Administrator") {
            this.viewQuotationTabShown = true;
          } else if (currentUserRole == "Asset Administrator") {
            this.viewQuotationTabShown = true;
          } else if (currentUserRole == "Management") {
            this.viewQuotationTabShown = true;
          } else {
            this.viewQuotationTabShown = false;
          }
        }
      }
    }

    let currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (currentUserRole === "Client User") {
      if (
        JSON.parse(localStorage.getItem("currentUser")).accessGroupName ===
        "Application User"
      ) {
        this.shownQuotation = false;
        this.activeId = 1;
        //this.customNav.activeId = 1;
      }
    }
    if (currentUserRole === "Help Desk") {
      this.shownQuotation = false;
      this.activeId = 1;
      //this.customNav.activeId = 1;
    }
    if (currentUserRole === "Technition") {
      this.shownQuotation = false;
      this.activeId = 1;
      //this.customNav.activeId = 1;
    }
  }
  totalQuotationCountList: any = [];
  totalQuotationCount: any = 0;
  quotationCount: any = 1;
  ticketQuotation: any = {};
  ticketQuotationItem: any = [];
  getV2_MX_QuotationNoListOnlyByTicketId(TicketId) {
    let payload = {
      TicketId: TicketId,
    };
    this.quotationService
      .getV2_MX_QuotationNoListOnlyByTicketId(payload)
      .subscribe((res: any) => {
        //console.log(res.objList);
        this.totalQuotationCountList = res.objList;
        this.totalQuotationCount = this.totalQuotationCountList.length;
        if (this.totalQuotationCount > 1) {
          this.rejectViewQuotation = true;
          this.getV2_MX_QuotationAndItemDetails(
            this.totalQuotationCountList[0].quotId
          );
        }
      });
  }
  getV2_MX_QuotationAndItemDetails(QuotId: any) {
    let pay = {
      QuotId: QuotId,
    };
    this.quotationService
      .getV2_MX_QuotationAndItemDetails(pay)
      .subscribe((res: any) => {
        this.ticketQuotation = res.objList.mX_Quotation;
        this.ticketQuotationItem = res.objList.mX_quotationItem;
      });
  }

  nextQuotation() {
    if (this.quotationCount > 1) {
      this.quotationCount--;
    }
    this.getV2_MX_QuotationAndItemDetails(
      this.totalQuotationCountList[this.quotationCount - 1].quotId
    );
  }

  previousQuotation() {
    if (this.quotationCount < this.totalQuotationCount) {
      this.quotationCount++;
    }
    this.getV2_MX_QuotationAndItemDetails(
      this.totalQuotationCountList[this.quotationCount - 1].quotId
    );
  }
  serviceOrderDetailOnlyObject: any;
  getV2_ServiceOrderDetailOnly(ticketId) {
    let paylod = {
      ticketId: ticketId,
    };
    this.serviceOrderService
      .getV2_ServiceOrderDetailOnly(paylod)
      .subscribe((res: any) => {
        this.serviceOrderDetailOnlyObject = res.data;
        this.generateServiceOrderTabShown = true;
        this.generateQuotationTabShown = false;
        this.viewQuotationTabShown =
          this.ticketData[0]?.isBillingRequired === true ? true : false;
        //this.customNav.activeId = 5;
        this.activeId = 5;
      });
  }

  getResponseAfterSubmitQuotation(event) {
    if (event.ticketStatusId == 52 && event.quotStatusId == 56) {
      this.openModalUpForQuotationApprove();
    } else if (event.ticketStatusId == 54 && event.quotStatusId == 54) {
      this.openModalUpForQuotationInReview();
    }
  }

  generateServiceOrderAfterQuotation() {
    this.getTicketDetails(this.storeTicketId);

    this.viewQuotationTabShown = true;
    this.generateServiceOrderTabShown = true;
    this.generateQuotationTabShown = false;
    //this.customNav.activeId = 5;
    this.activeId = 5;
  }

  openModalUpForQuotationApprove() {
    this.modalService
      .open(this.isQuotationGenerateMessageForApprove, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          this.generateServiceOrderAfterQuotation();
        },
        (reason) => {
          //console.log(reason);
          this.storeTicketId = 0;
          this.router.navigate([
            "/maintenance-management/dashboard/new-ticket-list",
          ]);
        }
      );
  }
  openModalUpForQuotationInReview() {
    this.modalService
      .open(this.isQuotationGenerateMessageForQuotationInReview, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          // this.generateServiceOrderAfterQuotation()
        },
        (reason) => {
          //console.log(reason);
          this.storeTicketId = 0;
          this.router.navigate([
            "/maintenance-management/dashboard/new-ticket-list",
          ]);
        }
      );
  }

  openModalIsNoBillingEligibilityDecision() {
    this.billingEligibilityDecisionRemarkValue = null;
    this.storeWorkflowObject = {};
    this.ticketObjectInBillingWorkFlow = {};
    this.successDataModalIsBillingMessageObject = {
      name: "",
      remark: "",
    };
    this.modalService
      .open(this.isNoBillingEligibilityDecision, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          this.updateReviewerApproverBillingEligibilityProcess("Rejected");
        },
        (reason) => { }
      );
  }

  openModalIsYesBillingEligibilityDecision() {
    this.billingEligibilityDecisionRemarkValue = null;
    this.storeWorkflowObject = {};
    this.ticketObjectInBillingWorkFlow = {};
    this.successDataModalIsBillingMessageObject = {
      name: "",
      remark: "",
    };
    this.modalService
      .open(this.isYesBillingEligibilityDecision, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          this.updateReviewerApproverBillingEligibilityProcess("Approved");
        },
        (reason) => { }
      );
  }
  successDataModalIsBillingMessageObject: any = {};

  updateReviewerApproverBillingEligibilityProcess(actionStatus: any) {
    this.storeWorkflowObject = { ...this.helpDeskService.workflowObject };
    this.ticketObjectInBillingWorkFlow = {
      ...this.ticketService.ticketObjectInBillingWorkFlow,
    };
    let payload = {
      MasterWorkflowItemId:
        this.ticketObjectInBillingWorkFlow.masterWorkflowItemId,
      ApproverType: this.storeWorkflowObject.approverType,
      ActionStatus: actionStatus,
      WfProcessCreationId:
        this.ticketObjectInBillingWorkFlow.wfProcessCreationId,
      WfProcessCreationDetailId:
        this.ticketObjectInBillingWorkFlow.wfProcessCreationDetailId,
      Remark: this.billingEligibilityDecisionRemarkValue,
    };
    //console.log(payload, "payload");
    this.ticketService
      .updateReviewerApproverBillingEligibilityProcess(payload)
      .subscribe((res: any) => {
        this.billingEligibilityDecisionRemarkValue = null;
        if (res.code == "200" && res.message == "Success Non-Billable") {
          this.successDataModalIsBillingMessageObject = {
            name: "Ticket successfully verified Billing eligibility process.",
            remark:
              'The ticket has been updated as "Non-Billable" and is now ready for generating a Service Order.Please check under "My Task - Service Order Pending"',
          };
          this.successModalForIsBilling();
        } else if (res.code == "200" && res.message == "Success Billable") {
          this.successDataModalIsBillingMessageObject = {
            name: "Ticket successfully verified Billing eligibility process.",
            remark:
              'The ticket is eligible for billing and has been escalated to the quotation process.Please check at "My Task - Awaiting Quotation"',
          };
          this.successModalForIsBilling();
        } else if (res.code == "200" && res.message == "Success") {
          this.successDataModalIsBillingMessageObject = {
            name: "Ticket successfully verified Billing eligibility process.",
            remark:
              "The ticket has passed billing eligibility verification and has been escalated for the next review or approval step in accordance with the workflow.",
          };
          this.successModalForIsBilling();
        } else {
        }
      });
  }
  successModalForIsBilling() {
    this.modalService
      .open(this.successDataModalIsBilling, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          this.router.navigate([
            "/maintenance-management/dashboard/workflow-ticket-list",
          ]);
        },
        (reason) => { }
      );
  }

  refreshThePage() {
    this.defaultNavActiveId = 1;
    this.getTicketDetails(this.storeTicketId);
    this.getV2_ServiceOrder_Tech_TaskListAndDetail(this.storeTicketId);
    this.getChatData();
  }
  updateTicKetCloseRemarkValue: any = '';
  updateTicKetAcknowledgeRemarkValue: any;


  verifyTicketRemarkValue: any = '';
  updateTicketClose(remark: any) {
    let data: any = JSON.parse(localStorage.getItem("currentUser"));
    let payload = {
      ticketId: this.ticketService.sendTicketId,
      ticketClosedRemark: remark,
      ticketAcknoledgeDesig: data?.accessGroupName,
    };
    this.ticketService
      .getV2_UpdateTicketClose(payload)
      .subscribe((res: any) => {
        this.success(res);
        let lastRouter = this.ticketService.lastStoreRouterDashboardName;
        this.router.navigate([lastRouter]);
      });
  }
  updateTicketAcknowledge(remark: any) {
    let data: any = JSON.parse(localStorage.getItem("currentUser"));
    let payload = {
      ticketId: this.ticketService.sendTicketId,
      ticketClosedRemark: remark,
      ticketAcknoledgeDesig: data?.accessGroupName,
      isGlobal: this.ticketData[0].isGlobal,
    };
    this.ticketService
      .getV2_UpdateTicketAcknolodge(payload)
      .subscribe((res: any) => {
        this.success(res);
        let lastRouter = this.ticketService.lastStoreRouterDashboardName;
        this.router.navigate([lastRouter]);
      });
  }
  verifyTicketAcknowledge(remark: any) {
    let data: any = JSON.parse(localStorage.getItem("currentUser"));
    let payload = {
      ticketId: this.ticketService.sendTicketId,
      TicketVerifiedRemark: remark,
      TicketVerifiedDesig: data?.accessGroupName,
    };
    this.ticketService
      .getV2_UpdateTicketVerification(payload)
      .subscribe((res: any) => {
        this.success(res);
        let lastRouter = this.ticketService.lastStoreRouterDashboardName;
        this.router.navigate([lastRouter]);
      });
  }

  closeTicketModalPopup() {
    this.modalService
      .open(this.iscloseTicketModalPopup, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
        },
        (reason) => { }
      );
  }

  acknowledgeTicketModalPopup() {
    this.modalService
      .open(this.isAcknowledgeTicketModalPopup, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {

        },
        (reason) => { }
      );
  }

  AfterSubmit(type) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to " + type + " this ticket ?";
    modalRef.componentInstance.buttonName = type + " It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          if (type == 'Acknowledged') {
            this.updateTicketAcknowledge(this.updateTicKetAcknowledgeRemarkValue);
          }
          else if (type == 'Close') {
            this.updateTicketClose(this.updateTicKetCloseRemarkValue);

          } else if (type == 'Verify') {
            this.verifyTicketAcknowledge(this.verifyTicketRemarkValue);
          }
          this.modalService.dismissAll();


        }
      }
    });

  }
  verifyTicketModalPopup() {
    this.modalService
      .open(this.isVerifyTicketModalPopup, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {

        },
        (reason) => { }
      );
  }
  getV2_MaintenanceWorkflowAudit(ticketId: any) {
    let payload = {
      TicketId: ticketId,
    };
    this.ticketService
      .getV2_MaintenanceWorkflowAudit(payload)
      .subscribe((res) => {
        this.maintenanceWorkflowAuditList = res.data;
      });
  }

  ngOnDestroy() {
    this.ticketService.sendTicketId = 0;
  }

  goBack() {
    let lastRouter = this.ticketService.lastStoreRouterDashboardName;
    this.router.navigate([lastRouter]);
  }

  open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }

  mainDiscussion = 1;
  MessageContainGlobal: any = "";


  submitChat() {

    const formdata = new FormData();
    formdata.append("TicketId", this.storeTicketId);
    formdata.append("IsClient", this.authService.getRole() === "Client User" ? 'true' : 'false');
    formdata.append("AccessGroup", this.authService.getaccessGroupName());
    if (this.MessageContain) {
      formdata.append("MessageContain", this.MessageContain.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>'));
    }
    if (this.internalFileValue) {
      formdata.append("FileType", this.internalFileValue.fileType);
      formdata.append("file", this.internalFileValue.file, this.internalFileValue.file.name); // Assuming single file upload

    }
    this.ticketService.CreateV2_TicketDiscussion_FormData(formdata).subscribe((res) => {
      this.takenAction = 2;
      this.scrollToTop();
      this.refreshThePage();
      this.resetDelete('internalFile');

      this.MessageContain = "";
      this.success(res);
      this.mainDiscussion = 2; this.internalFileValue = null
    });

  }

  submitChatGlobal() {

    const formdata = new FormData();
    formdata.append("TicketId", this.storeTicketId);
    formdata.append("IsClient", this.authService.getRole() === "Client User" ? 'true' : 'false');
    formdata.append("AccessGroup", this.authService.getaccessGroupName());
    if (this.MessageContainGlobal) {
      formdata.append("MessageContain", this.MessageContainGlobal.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>'));
    }
    if (this.globalFileValue) {
      formdata.append("FileType", this.globalFileValue.fileType);
      formdata.append("file", this.globalFileValue.file, this.globalFileValue.file.name); // Assuming single file upload

    }
    this.ticketService.CreateV2_TicketDiscussionGlobal_FormData(formdata).subscribe((res) => {
      this.takenAction = 1;
      this.scrollToTopGlobal();
      this.refreshThePage();
      this.resetDelete('globalFile')
      this.MessageContainGlobal = "";
      this.success(res);
      this.mainDiscussion = 1;
      this.globalFileValue = null
    });

  }

  shownOffInternalChat: boolean = true;
  shownOffGlobalChat: boolean = true;
  getChatData() {
    if (
      JSON.parse(localStorage.getItem("currentUser")).role === "Client User"
    ) {
      this.shownOffInternalChat = false;
      this.shownOffGlobalChat = true;
      this.mainDiscussion = 1;
      this.getV2_TicketDisscusionGlobal_ServerPaging();
    } else {
      if (this.ticketData[0]?.isGlobal) {
        this.mainDiscussion = 1;
        this.getV2_TicketDisscusion_ServerPaging();
        this.getV2_TicketDisscusionGlobal_ServerPaging();
      } else {
        this.mainDiscussion = 2;
        this.shownOffGlobalChat = false;

        this.getV2_TicketDisscusion_ServerPaging();
      }
    }

    if (this.takenAction == 2) {
      this.mainDiscussion = 2;
    } else if (this.takenAction == 1) {
      this.mainDiscussion = 1;
    } else {
      this.takenAction = 0;
    }
  }
  ticketDisscusionTotalRecordsFromApiGlobal: number = 0;
  ticketDisscusionFromGlobal: number = 0;
  ticketDisscusionToGlobal: number = 0;
  ticketDisscusionPageSizeGlobal: number = 10;
  ticketDisscusionArrayListGlobal: any = [];

  getV2_TicketDisscusionGlobal_ServerPaging(
    displayLength: number = 500,
    startIndex: Number = 0
  ) {
    let payload = {
      ticketId: this.storeTicketId,
      displayLength: displayLength,
      displayStart: startIndex,
    };
    this.ticketService
      .getV2_TicketDisscusionGlobal_ServerPaging(payload)
      .subscribe((res: any) => {
        if (res.list.length > 0) {
          this.ticketDisscusionArrayListGlobal = res.list;
          this.ticketDisscusionTotalRecordsFromApiGlobal =
            res.list[0].totalCount;
          this.ticketDisscusionFromGlobal = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.ticketDisscusionToGlobal = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.ticketDisscusionPageSizeGlobal = displayLength;
        } else if (
          this.ticketDisscusionArrayListGlobal.length == 0 &&
          res.list.length == 0
        ) {
          // this.ticketDisscusionPage = 1;
          this.ticketDisscusionTotalRecordsFromApiGlobal = 0;
          this.ticketDisscusionFromGlobal = 0;
          this.ticketDisscusionToGlobal = 0;
          this.ticketDisscusionPageSizeGlobal = displayLength;
        }
      });
  }

  scrollContainerGlobal: any;
  @ViewChild("scrollframeGlobal", { static: false })
  scrollFrameGlobal: ElementRef;
  scrollContainer: any;
  @ViewChild("scrollframe", { static: false })
  scrollFrame: ElementRef;

  ngAfterViewInit(): void { }
  ngAfterViewChecked(): void {
    if (this.ticketDisscusionArrayListGlobal.length != 0) {
      if (this.scrollFrameGlobal && !this.scrollContainerGlobal) {
        this.scrollContainerGlobal = this.scrollFrameGlobal.nativeElement;
      }
    }
    if (this.ticketDisscusionArrayList.length != 0) {
      if (this.scrollFrame && !this.scrollContainer) {
        this.scrollContainer = this.scrollFrame.nativeElement;
      }
    }
  }

  scrollToTopGlobal() {
    if (this.scrollContainerGlobal) {
      this.scrollContainerGlobal.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }
  scrollToTop() {
    if (this.scrollContainer) {
      this.scrollContainer.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  onNavChange(event) {
    if (event.activeId == 1) {
      this.takenAction = 2;
    } else if (event.activeId == 2) {
      this.takenAction = 1;
    } else {
      this.takenAction = 0;
    }
  }

  openTheActiveTab(event) {
    console.log(event);

    if (event.title == "Service Order") {
      if (event.background != "warning") {
        if (this.generateQuotationTabShown) {
          this.activeId = 4;
        } else if (this.generateServiceOrderTabShown) {
          this.activeId = 5;
        }
        else if (this.ticketWorkOder?.length != 0 && this.ticketData.length != 0) {
          this.activeId = 3;
        }
        else {
          this.activeId = 1;
          this.defaultNavActiveId = 1;
        }
      }
    } else if (event.title == "Task") {
      if (event.background != "warning") {
        if (this.ticketWorkOder?.length != 0 && this.ticketData.length != 0) {
          this.activeId = 3;
        }
      }
    } else if (event.title == "Internal Verification") {
      if (event.background != "warning") {
        this.activeId = 1;
        this.defaultNavActiveId = 1;
        this.startBlinkingInternal();
      }
    } else if (event.title == "Client Verification") {
      if (event.background != "warning") {
        if (event.client == "Second") {
          this.activeId = 1;
          this.defaultNavActiveId = 2;
        } else {
          this.activeId = 1;
          this.defaultNavActiveId = 1;
          this.startBlinkingClient();
        }
      }
    } else if (event.title == "Billing Verification") {
      this.activeId = 1;
      this.defaultNavActiveId = 3;
    } else if (event.title == "Ticket Created") {
      this.activeId = 1;
      this.defaultNavActiveId = 1;
    } else if (event.title == "Quotation") {
      if (event.background != "warning") {
        if (this.ticketQuotation?.length != 0 && this.shownQuotation) {
          if (this.generateQuotationTabShown) {
            this.activeId = 4
          } else if (this.viewQuotationTabShown) {
            this.activeId = 6;
          }
          // =true

        }
      }
    } else if (event.title == "Quotation Internal Verification") {
      this.activeId = 1;
      this.defaultNavActiveId = 3;
    } else if (event.title == "Quotation Client Verification") {
      this.activeId = 1;
      this.defaultNavActiveId = 3;
    } else if (event.title == "Tech Signature Process") {
      if (event.background != "warning") {
        this.activeId = 1;
        this.defaultNavActiveId = 2;
      }
    }
  }
  blinkStateClient = "end2";
  blinkStateInternal = "end1";
  startBlinkingInternal() {
    this.blinkStateInternal = "start1";
    setTimeout(() => {
      this.blinkStateInternal = "end1";
    }, 1000);
  }
  startBlinkingClient() {
    this.blinkStateClient = "start2";
    setTimeout(() => {
      this.blinkStateClient = "end2";
    }, 1000);
  }


  getV2_TicketImagesList(ticketId) {
    console.log("ticketId", ticketId);
    let payload = {
      TicketId: ticketId
    }
    this.ticketService.getV2_TicketImagesList(payload).subscribe((rss) => {
      console.log("rss", rss);
      this.selectePasteUplaodArray = rss.objImage ? rss.objImage : []

      if (this.ticketData.length) {
        if (this.ticketData[0].pic1_URL)
          this.selectePasteUplaodArray.push({
            imageBase64Url: this.ticketData[0].pic1_URLBase64,
            imageUrl: this.ticketData[0].pic1_URL,
            ticketId: this.ticketData[0].ticketId,
            ticketImageId: 0
          })
        if (this.ticketData[0].pic2_URL)
          this.selectePasteUplaodArray.push({
            imageBase64Url: this.ticketData[0].pic2_URLBase64,
            imageUrl: this.ticketData[0].pic2_URL,
            ticketId: this.ticketData[0].ticketId,
            ticketImageId: 0
          })

      }
    })

  }

  openAllCopyPasteImage(image, index): void {
    let _albums: any = [];
    image.map((i) => {
      _albums.push(
        {
          src: this.imageUrl + i.imageUrl,
          caption: "",
          thumb: "thumb",
        }
      );
    })

    this.lightbox.open(_albums, index, {
      showImageNumberLabel: true,
      showRotate: true,
      showZoom: true,
    });
  }


  getV2_TicketVideo(ticketId) {
    this.selecteTicketVideoArray = [];
    let payload = {
      TicketId: ticketId
    }
    this.ticketService.getV2_TicketVideo(payload).subscribe((rss) => {
      this.selecteTicketVideoArray = rss.list ? rss.list : [];
      console.log("vdo view::", this.selecteTicketVideoArray);
    })

  }
  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;

  storeInfomationVideo: any = '';
  linkVideo: any = '';
  openModaVideeo(link, content) {
    this.storeInfomationVideo = link
    this.linkVideo = environment.apiUrl + link.fileURL;
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    modalRef.result.then((result) => {
      if (result) {
        if (result == "confirm") {

        }
      }
    });
  }
  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }
  playPause() {
    var myVideo: any = document.getElementById("my_video_1");
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }

  getV2_TicketDocument(ticketId) {
    let payload = {
      TicketId: ticketId
    }
    this.ticketService.getV2_TicketDocument(payload).subscribe((rss) => {
      this.selectedTicketDocumentArray = rss.list ? rss.list : []
    })
    console.log("view ss::", this.selectedTicketDocumentArray);
  }


  downloadFIle(file: any) {
    let con = file.fileName.split(".")
    let payload = {
      FileURL: file.fileURL,
      ContentType: 'application/' + con[con.length - 1]
    }
    this.ticketService.downloadTikcetFile(payload).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.download = file.fileName;
      link.href = window.URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    });

  }



  openUploaadDocument(listOfDocumentAlreadyUpload: any = [], type: any) {
    const modalRef = this.modalService.open(FileUploadComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.TicketId = this.storeTicketId;
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.listOfDocumentAlreadyUpload = listOfDocumentAlreadyUpload

    modalRef.result
      .then((result) => {
        if (result.code == '200') {
          if (type == 'File') {
            this.getV2_TicketDocument(this.storeTicketId)
          }

          else {
            this.getV2_TicketVideo(this.storeTicketId)
          }
        }
      })
      .catch((result) => {
        console.log("result", result)

      });


  }

  returnCurrentStatusClassesStatus(value: any) {
    return this.commonFunctionService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any) {
    return this.commonFunctionService.getStatusColorCircle(value);
  }
  openUploadInternal() {
    const modalRef = this.modalService.open(UploadAllTypeDocumentComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    modalRef.result.then((result) => {
      if (result) {
        if (result.type == "upload") {

          this.internalFileValue = result;
        }
      }
    });
  }

  openUploadGlobal() {
    const modalRef = this.modalService.open(UploadAllTypeDocumentComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    modalRef.result.then((result) => {
      if (result) {
        if (result.type == "upload") {
          this.globalFileValue = result;
        }
      }
    });
  }
  onCurrentChatDection: boolean = true;
  ondectionChange() {
    this.onCurrentChatDection = false;
    this.globalFileValue = null;
    this.internalFileValue = null;

  }
  onFileSelected(event: any, type: any) {
    this.internalFileValue = null;
    this.globalFileValue = null
    const file = event.target.files[0];
    console.log(file, "ss")
    if (file) {
      if (type == 'global') {
        this.globalFileValue = {
          file: file,
          fileType: this.getFileType(file)
        }
      } else {
        this.internalFileValue = {
          file: file,
          fileType: this.getFileType(file)
        }
      }
    }
  }
  getFileType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension) {
      return 'Unknown';
    }
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov'];
    const zipExtensions = ['zip'];
    const rarExtensions = ['rar'];
    const dwgExtensions = ['dwg'];

    if (imageExtensions.includes(extension)) {
      return 'Image';
    } else if (documentExtensions.includes(extension)) {
      return 'Document';
    } else if (videoExtensions.includes(extension)) {
      return 'Video';
    } else if (zipExtensions.includes(extension)) {
      return 'Zip';
    } else if (rarExtensions.includes(extension)) {
      return 'Rar';
    } else if (dwgExtensions.includes(extension)) {
      return 'Dwg';
    } else {
      return 'Unknown';
    }
  }
  deltefileMedia() {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You are about to delete a File?";
    modalRef.componentInstance.subTitle =
      "You won't be able to revert this!";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.globalFileValue = null;
          this.internalFileValue = null
          this.resetDelete('internalFile');
          this.resetDelete('globalFile')

        }
      }
    });

  }
  getFileIcon(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension) {
      return 'Unknown';
    }
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov'];
    const zipExtensions = ['zip'];
    const rarExtensions = ['rar'];

    if (imageExtensions.includes(extension)) {
      return 'ri-image-line b2';
    } else if (documentExtensions.includes(extension)) {
      return "ri-file-line";
    } else if (videoExtensions.includes(extension)) {
      return 'ri-video-line';
    } else if (zipExtensions.includes(extension)) {
      return 'ri-folder-zip-line';
    } else if (rarExtensions.includes(extension)) {
      return 'ri-survey-fill';
    } else {
      return 'ri-file-list-line';
    }
  }

  resetDelete(id) {
    const fileInput: any = document.getElementById(id);
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }
}
