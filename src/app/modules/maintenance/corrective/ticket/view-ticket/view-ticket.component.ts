import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { DecimalPipe, Location } from "@angular/common";
import { Observable, map } from 'rxjs';
import { NgbModal, NgbNav, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { TicketService } from "src/app/core/services/ticket.service";
import { Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { environment } from "src/environments/environment";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import Swal from "sweetalert2";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { QuotationService } from "src/app/core/services/quotation.service";
import { Lightbox } from "ngx-lightbox";

import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FileUploadComponent } from "src/app/shared/components/file-upload/file-upload.component";
import { UploadAllTypeDocumentComponent } from "src/app/shared/components/upload-all-type-document/upload-all-type-document.component";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
@Component({
  selector: "app-view-ticket",
  templateUrl: "./view-ticket.component.html",
  styleUrls: ["./view-ticket.component.scss"],
  providers: [DecimalPipe],
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

/**
 * Overview Component
 */
export class ViewTicketComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  blinkStateClient = "end2";
  blinkStateInternal = "end1";
  defaultNavActiveId: number = 1;
  ticketData: any = [];
  assetTicketItem: any = [];
  ticketReportIncident: any = [];
  ticketQuotation: [];
  ticketQuotationItem: [];
  ticketWorkOder: [];
  ticketWOTechAssignment: [];
  ticketWOStartEndTask: [];
  maxCharsDecision = 300;
  breadCrumbItems = [
    { label: "Ticket" },
    { label: "Ticket View", active: true },
  ];
  quotationCount: any = 1;
  totalQuotationCount: any = 0;
  totalQuotationCountList: any = [];
  storeFullData: any;
  storeTicketId: any;
  isProject: any;
  activeId: number = 1;
  imageUrl: any = environment.apiUrl;
  viewQuotationTabShown: boolean = false;
  deleteId: any;
  public Editor = ClassicEditor;
  @ViewChild("customNav") customNav: NgbNav; // Reference to the ngbNav component
  @ViewChild("defaultNav") defaultNav: NgbNav; // Reference to the ngbNav component
  @ViewChild("iscloseTicketModalPopup", { static: true })
  iscloseTicketModalPopup: ElementRef;
  updateTicketCloseVisiable: boolean = false;
  maintenanceWorkflowAuditList: any = [];
  generateQuotationTabShown: boolean = false;
  resubmitButtonView: boolean = false;
  shownQuotation: boolean = true;
  maxCharMessage: number = 2000;
  MessageContain: any = "";
  MessageContainGlobal: any = "";
  takenAction: number = 0;
  selectePasteUplaodArray: any = [];
  selectedTicketDocumentArray: any = [];
  selecteTicketVideoArray: any[] = [];
  globalFileValue: any;
  internalFileValue: any;
  loginById: any;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    private commonFunctionService: CommonFunctionService,
    private helpDeskService: HelpDeskService,
    private quotationService: QuotationService,
    private lightbox: Lightbox,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone,
    private location: Location
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();

    this.storeTicketId = this.ticketService.sendTicketId
      ? this.ticketService.sendTicketId
      : 0;
    if (this.storeTicketId == 0 || this.storeTicketId == null) {
      this.location.back();
      let lastRouter = this.ticketService.lastStoreTicketRouterName;
      this.router.navigate([lastRouter]);
    } else {
      this.getTicketDetails(this.storeTicketId);

      this.getV2_TicketDocument(this.storeTicketId)

      this.getV2_MaintenanceWorkflowAudit(this.storeTicketId);
    }
  }

  ngOnInit(): void {
    this.loginById=this.authService.getFullName()
    this.breadCrumbItems = [
      { label: "Ticket" },
      { label: "Ticket View", active: true },
    ];
    this.firsttime = false;
    this.defaultNavActiveId = 1;
  }
  refreshThePage() {
    this.defaultNavActiveId = 1;
    this.getTicketDetails(this.storeTicketId);
  }

  getupdateStatusAssetList(event: any) {
    this.getTicketDetails(this.storeTicketId, "delete");
  }

  getTicketDetails(ticketId: any, checkType: any = "Normal", serviceType = '') {
    let payload = {
      TicketId: ticketId,
    };
    this.ticketService
      .getV2_TicketingAssetIncidentQuotWorkorderTask(payload)
      .subscribe((res: any) => {
        Object.keys(res.data).forEach((key) => {
          if (res.data[key] === null) {
            res.data[key] = [];
          }
        });
        this.storeFullData = res;
        this.ticketData = res.data.mX_Ticketing ? [res.data.mX_Ticketing] : [];
        this.assetTicketItem = res.data.mX_TicketItem
          ? res.data.mX_TicketItem
          : [];
        this.ticketReportIncident =
          res.data.mX_ReportIncident.length != 0
            ? [res.data.mX_ReportIncident]
            : [];
        this.ticketQuotation = res.data.mX_Quotation
          ? res.data.mX_Quotation
          : [];
        this.ticketQuotationItem = res.data.mX_quotationItem
          ? res.data.mX_quotationItem
          : [];
        this.ticketWorkOder = res.data.mX_WorkOder ? res.data.mX_WorkOder : [];
        this.ticketWOTechAssignment = res.data.mX_WOTechAssignment
          ? res.data.mX_WOTechAssignment
          : [];
        this.ticketWOStartEndTask = res.data.mx_WOStartEndTask
          ? res.data.mx_WOStartEndTask
          : [];


        this.getChatData();
        this.getV2_TicketDisscusion_ServerPaging();
        this.getV2_TicketDisscusionGlobal_ServerPaging();
        this.getV2_TicketImagesList(this.storeTicketId);
        this.getV2_TicketVideo(this.storeTicketId);
        if (checkType == "Normal") {
          this.initaliseTypeForNewTicketStatus(
            this.ticketService.ticketPageAction
          );
        }
        if (res.listExtraQuot.length != 0) {
          this.totalQuotationCountList = res.listExtraQuot;
          this.totalQuotationCount = this.totalQuotationCountList.length;
          this.getV2_MX_QuotationAndItemDetails(
            this.totalQuotationCountList[0].quotId
          );
        }
        this.shownQuotation = true;
        let currentUserRole = JSON.parse(
          localStorage.getItem("currentUser")
        ).role;
        if (currentUserRole === "Client User") {
          if (
            JSON.parse(localStorage.getItem("currentUser"))?.accessGroupName ===
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

        if (serviceType == 'Service') {
          this.activeId = 3;
        }
        // Here the New Thing Added 
        if (this.onMainNavChangeTab) {
          this.activeId = this.onMainNavChangeTab
        }

        if(this.helpDeskService.pageAction==='Incident Tech Sign'){
          this.activeId=1;
          this.defaultNavActiveId=2

         }   if(this.helpDeskService.pageAction==='Incident Client Sign'){
          this.activeId=1;
          this.defaultNavActiveId=2

         }
         
      });
  }
  onCurrentChatDection: boolean = true;
  ondectionChange() {
    this.onCurrentChatDection = false;
    this.globalFileValue = null;
    this.internalFileValue = null;

  }
  ticketDisscusionTotalRecordsFromApi: number = 0;
  ticketDisscusionFrom: number = 0;
  ticketDisscusionTo: number = 0;
  ticketDisscusionPageSize: number = 10;
  ticketDisscusionArrayList: any = [];
  ticketDisscusionPage: number = 1;
  getV2_TicketDisscusion_ServerPaging(
    displayLength: number = 500,
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
          this.ticketDisscusionTotalRecordsFromApi = res.list[0].totalCount;
          this.ticketDisscusionArrayList = res.list;

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
          this.ticketDisscusionPage = 1;
          this.ticketDisscusionTotalRecordsFromApi = 0;
          this.ticketDisscusionFrom = 0;
          this.ticketDisscusionTo = 0;
          this.ticketDisscusionPageSize = displayLength;
        }
      });
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

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  initaliseTypeForNewTicketStatus(pageAction: any) {
    //this.customNav.activeId = 1;
    if (pageAction == "Basic Service Page") {
      //this.customNav.activeId = 3;
      this.activeId = 3;
    } else if (pageAction == "Basic Quotation Page") {
      //this.customNav.activeId = 6;
      this.activeId = 6;
    } else if (pageAction == "Waiting Client to Close Ticket") {
      this.updateTicketCloseVisiable = true;
    } else if (pageAction == "Total Ticket Quotation Rejected") {
      //this.customNav.activeId = 6;
      this.activeId = 6;
      this.resubmitButtonView = true;
    } else {
      //this.customNav.activeId = 1;
      this.activeId = 1;
    }
  }
  getUpdateListValue(event) {

    this.getTicketDetails(this.storeTicketId, 'Normal', 'Service');

  }

  getResubmittedQuotationValue(event) {
    //console.log("event", event);
    this.generateQuotationTabShown = event;
    //this.customNav.activeId = 4;
    this.activeId = 4;
    this.resubmitButtonView = false;

  }

  getUpadateIncident(event) {
    //console.log(event);
    this.getTicketDetails(this.storeTicketId, "delete");
  }
  updateTicKetCloseRemarkValue: any = '';
  closeTicketModalPopup() {
    this.modalService
      .open(this.iscloseTicketModalPopup, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          this.updateTicketClose(this.updateTicKetCloseRemarkValue);
        },
        (reason) => { }
      );
  }

  updateTicketClose(remark: any) {
    let payload = {
      ticketId: this.ticketService.sendTicketId,
      ticketClosedRemark: remark,
    };
    this.ticketService
      .getV2_UpdateTicketClose(payload)
      .subscribe((res: any) => {
        this.success(res);
        let lastRouter = this.ticketService.lastStoreRouterDashboardName;
        this.router.navigate([lastRouter]);
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

  getV2_MaintenanceWorkflowAudit(ticketId: any) {
    let payload = {
      TicketId: ticketId,
    };
    this.ticketService
      .getV2_MaintenanceWorkflowAudit(payload)
      .subscribe((res) => {
        this.maintenanceWorkflowAuditList = res.data ? res.data : [];
      });
  }

  getResponseAfterSubmitQuotation(event) {
    this.getTicketDetails(this.storeTicketId);
    this.getV2_MaintenanceWorkflowAudit(this.storeTicketId);
    this.activeId = 6;
    this.generateQuotationTabShown = false;
    this.resubmitButtonView = false;

  }

  ngOnDestroy() {
    // this.ticketService.sendTicketId = 0;
  }

  goBack() {
    this.location.back();
    let lastRouter = this.ticketService.lastStoreTicketRouterName;
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

  fullSMModal(fullscreen: any) {
    this.modalService.open(fullscreen, {
      size: "fullscreen",
      centered: true,
    });
  }

  printReport() {
    this.ngZone.runOutsideAngular(() => {

      setTimeout(() => {
        try {
          document.execCommand("print", false, null);
        } catch {
          window.print();
        }
        this.ngZone.run(() => {
          console.log("Print operation completed");
        });
      }, 50);
    });
  }
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
  mainDiscussion = 1;
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

  isNearBottom = true;
  scrollContainerGlobal: any;
  @ViewChild("scrollframeGlobal", { static: false })
  scrollFrameGlobal: ElementRef;
  scrollContainer: any;
  @ViewChild("scrollframe", { static: false })
  scrollFrame: ElementRef;
  @ViewChildren("item") itemElements: QueryList<any>;
  firsttime: boolean = true;

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

  // private isUserNearBottom(): boolean {
  //   const threshold = 150;
  //   const position =
  //     this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
  //   const height = this.scrollContainer.scrollHeight;
  //   return position > height - threshold;
  // }

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
  // scrolled(event: any): void {
  //   this.isNearBottom = this.isUserNearBottom();
  //   if (this.scrollContainer.scrollTop == 0) {
  //     this.getV2_TicketDisscusion_ServerPaging(
  //       this.ticketDisscusionPageSize,
  //       this.ticketDisscusionTo
  //     );
  //     if (!this.firsttime) {
  //       this.firsttime = !this.firsttime;
  //     }
  //   }
  //   if (this.firsttime) {
  //     if (this.isNearBottom) {
  //       this.firsttime = false;
  //       //console.log("End");
  //     }
  //   }
  // }
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
      if (
        this.ticketService.ticketPageAction ==
        "Software Support Dashboard Page"
      ) {
        this.generateQuotationTabShown = false;
        this.shownQuotation = false;
        if (this.ticketData[0]?.isGlobal) {
          this.mainDiscussion = 1;
          this.shownOffGlobalChat = true;

        } else {
          this.mainDiscussion = 2;
          this.shownOffGlobalChat = false;

        }
      } else {
        // 
        if (this.ticketData[0]?.isGlobal) {
          this.mainDiscussion = 1;
          this.shownOffGlobalChat = true;
          this.shownOffInternalChat = true;

        } else {
          this.mainDiscussion = 2;
          this.shownOffGlobalChat = false;
          this.shownOffInternalChat = true;

        }
      }

      if (this.onCurrentChatDection) {
        if (
          this.ticketService.ticketPageAction ==
          "Message Internal Chat Helpdesk Ticket Page"
        ) {
          this.mainDiscussion = 2;
        }
        if (
          this.ticketService.ticketPageAction ==
          "Message Global Chat Helpdesk Ticket Page"
        ) {
          this.mainDiscussion = 1;
        }
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
          this.activeId = 6;
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
  returnHtml(htmlString: any) {
    let sanitizedHtml: any
    return sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }


  getV2_TicketImagesList(ticketId) {
    this.selectePasteUplaodArray = [];
    let payload = {
      TicketId: ticketId
    }
    this.ticketService.getV2_TicketImagesList(payload).subscribe((rss) => {
      this.selectePasteUplaodArray = rss.objImage ? rss.objImage : [];
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

    if (link.attachmentURL) {
      this.linkVideo = environment.apiUrl + link.attachmentURL;
    } else {
      this.linkVideo = environment.apiUrl + link.fileURL;
    }
    //this.linkVideo = environment.apiUrl + link.fileURL;
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

    console.log("aaaaaa::", this.selectedTicketDocumentArray);

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

  onMainNavChangeTab: number;
  onMainNavChange(changeEvent: NgbNavChangeEvent) {
    this.onMainNavChangeTab = changeEvent.nextId;
    this.getTicketDetails(this.storeTicketId);
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

  storeInfomationImage: any = '';
  linkImage: any = '';
  openModaImage(link: any, content: any) {
    this.storeInfomationImage = link
    this.linkImage = environment.apiUrl + link.attachmentURL;
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


  editiorDescription: any
  openModalPopup(content: any, description): void {
    this.editiorDescription = description;
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
  }


  submitDescription() {
    let requestData: any = {
      TicketId: this.storeTicketId,
      IssueDescription: this.editiorDescription
    };
    this.ticketService.UpdateV2_MX_TicketingIssueDescription(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.getTicketDetails(this.storeTicketId);
      },
      (err) => {
        this.error(err);
      }
    );

  }

  error(err: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err,
      showConfirmButton: false,
      timer: 1000,
    });
  }
}
