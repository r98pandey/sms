
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { TicketService } from "src/app/core/services/ticket.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";
import { DatePipe } from "@angular/common";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import Swal from "sweetalert2";
import { SuccessModalWithRemarkComponent } from "src/app/shared/components/success-modal-with-remark/success-modal-with-remark.component";
import { HubConnection } from "@microsoft/signalr";
import { SignalRService } from "src/app/core/services/signal-r.service";
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { ProjectTaskDetailsComponent } from "../../task-management/project-task-details/project-task-details.component";
import { ProjectScheduleViewSubTaskSingleComponent } from "../project-schedule-view-sub-task-single/project-schedule-view-sub-task-single.component";


@Component({
  selector: 'app-chat-bot-my-task',
  templateUrl: './chat-bot-my-task.component.html',
  styleUrl: './chat-bot-my-task.component.scss'
})
export class ChatBotMyTaskComponent implements OnInit, OnChanges {
  isProject: boolean = false;

  payload: any = {
    PageSize: 10,
    PageNumber: 1,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchLocationId: null,
    SearchTicketStatusId: null,
    SearchCategoryId: null,
    SearchSubCategoryId: null,
    SearchTicketTitle: null,
    SearchTicketNo: null,
    // SearchIssueDescription: null,
    SearchRequesterName: null,
    SearchRequesterEmail: null,
    SearchCreatedDate: null,
    SearchOperationType: null,
  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  taskMesageList = [];
  page = 1;
  collectionSize = 0;

  imageUrl: any = environment.apiUrl;
  viewImageValue: any;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownTicketStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownTicketStatusIdValue: any;

  selectedTicketTagId: any;
  selectedRequesterName: any;
  selectedRequesterEmail: any;
  selectedIssueDescription: any;
  selectedCreatedDate: any;
  selectedOperationType: any;

  typeTicketNameValue: any;

  operationList = [
    { name: "Service", operationTypeId: 1 },
    { name: "Incident Report", operationTypeId: 2 },
  ];
  totalCountTicketOnly: any = {
    countTotalTicket: 0,
    countNewTicket: 0,
    countInProgressTicket: 0,
    countResolvedTicket: 0,
    countClosedTicket: 0,
    countOnHoldTicket: 0,
  };
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };

  maintenanceWorkflowAuditList: any;
  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
  constructor(
    private router: Router,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private helpDeskService: HelpDeskService,
    private menuService: MenuServiceService,
    private signalRService: SignalRService,
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone,
    private commonService: CommonFunctionService,
    private commonHttpServiceCallerService: CommonHttpServiceCallerService,
    private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas,
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.isProject = this.authService.getisProject();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.initialiseSignalRFunction();
    if (localStorage.getItem("objectSerachChatOfMyTask")) {
      this.getObjectAfterRefresh();
    } else {
      this.loadData();
    }
  }

  ngOnInit(): void {
    this.initialiseSignalRFunction();
    if (localStorage.getItem("objectSerachChatOfMyTask")) {
      this.getObjectAfterRefresh();
    } else {
      this.loadData();
    }
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.PageSize = this.pageSize;
      this.payload.PageNumber = pageNo;
      this.loadData();
    }
  }

  loadData() {
    let url = 'api/ProjectManagementDash/GetV3_TaskAndSubTaskProgressUpdatesList_Paging'
    this.commonHttpServiceCallerService
      .postWithJsonDataMethod(url,
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.changeDetectorRef.detectChanges();
        this.taskMesageList = res.list;
        if (this.taskMesageList.length > 0) {
          this.totalRecordsFromApi = res.list[0].totalCount;
          this.from = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.to = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.pageSize = this.payload.PageSize;

        } else {
          this.totalRecordsFromApi = 0;
          this.from = 0;
          this.to = 0;
          this.pageSize = this.payload.PageSize;
        }
        this.setObjectBeforeRefesh();
      });
  }
  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachChatOfMyTask: any = JSON.parse(
      localStorage.getItem("objectSerachChatOfMyTask")
    );

    //Payload



    if (objectSerachChatOfMyTask.PageNumber) {
      this.payload.PageNumber = objectSerachChatOfMyTask.PageNumber;
      this.payload.PageSize = objectSerachChatOfMyTask.PageSize;
      this.page = objectSerachChatOfMyTask.page;
    }
    this.loadData();
  }  /**
  * for Set object to refesh
  */
  setObjectBeforeRefesh() {
    let objectSerachChatOfMyTask: any = {};
    console.log("this.page", this.page)
    if (this.page) {
      objectSerachChatOfMyTask.PageSize = this.pageSize;
      objectSerachChatOfMyTask.PageNumber = this.page;
      objectSerachChatOfMyTask.page = this.page;
    }
    localStorage.setItem(
      "objectSerachChatOfMyTask",
      JSON.stringify(objectSerachChatOfMyTask)
    );
  }
  viewHandler(ticket: any) {
    let payload = {
      DiscussionId: ticket.discussionId,
    };
    this.helpDeskService
      .createV2_TicketDiscussionGlobalAudit(payload)
      .subscribe((res: any) => {
        this.ticketService.sendTicketId = ticket.ticketId;
        this.helpDeskService.pageAction = "";

        this.ticketService.ticketPageAction =
          "Message Global Chat Helpdesk Ticket Page";
        this.ticketService.lastStoreTicketRouterName =
          "/maintenance-management/dashboard/help-desk-dashboard";
        localStorage.setItem(
          "lastStoreTicketRouterName",
          this.ticketService.lastStoreTicketRouterName
        );
        this.router.navigate([
          "/maintenance-management/corrective/ticket/ticket-view",
        ]);
      });
  }

  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownTicketStatusIdValue = null;
    this.selectedTicketTagId = null;
    this.selectedRequesterName = null;
    this.selectedRequesterEmail = null;
    this.selectedIssueDescription = null;
    this.selectedCreatedDate = null;
    this.selectedOperationType = null;
    this.typeTicketNameValue = null;
    this.payload = {
      PageSize: 10,
      PageNumber: 1,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchLocationId: null,
      SearchTicketStatusId: null,
      SearchCategoryId: null,
      SearchSubCategoryId: null,
      SearchTicketTitle: null,
      SearchTicketNo: null,
      // SearchIssueDescription: null,
      SearchRequesterName: null,
      SearchRequesterEmail: null,
      SearchCreatedDate: null,
      SearchOperationType: null,
    };

    this.page = 1;
    this.loadData();
  }

  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
  }

  success(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.action,
      text: res.message,
      showConfirmButton: false,
      timer: 1000,
      showCloseButton: true, // Add this line
    });
  }

  removetheWord(str: string) {
    if (str.length >= 14) {
      return str.slice(0, 14) + "...";
    } else {
      return str;
    }
  }
  removetheWordTicketTitle(str: string) {
    if (str.length >= 120) {
      return str.slice(0, 120) + "...";
    } else {
      return str;
    }
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  hubConnection: HubConnection;
  //For SignalR
  initialiseSignalRFunction() {
    // conection start
    this.hubConnection = this.signalRService.getSignLrConnection();
    this.hubConnection.on("V2_TicketingProcess", (data) => {
      if (data.action === "Global Post Message") {
        this.zone.run(() => {
          this.loadData();
        });
      }
    });
  }

  removeToHtml(str) {
    let st = str.replace(/<[^>]+>/g, '');
    return st.replace('<a href="', '')


  }

  returnCurrentStatusClassesStatus(value: any) {
    return this.commonService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any) {
    return this.commonService.getStatusColorCircle(value);
  }


  openViewHandleTask(projectTaskId, projectScheduleObject): void {
    this.commonHttpServiceCallerService.letOpenOffCancvas = true
    const modalRef = this.offcanvasService.open(ProjectTaskDetailsComponent, {
      scroll: false,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4",
    });
    modalRef.componentInstance.ProjectTaskId = projectTaskId;
    modalRef.componentInstance.projectScheduleObject = projectScheduleObject;
    modalRef.result
      .then((result) => {
        setTimeout(() => {
          this.loadData();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.commonHttpServiceCallerService.letOpenOffCancvas = false
          this.resetScroll();
        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
          this.loadData();
          this.offcanvasService.dismiss();
          this.commonHttpServiceCallerService.letOpenOffCancvas = false
          this.modalService.dismissAll()
          this.resetScroll();
        }, 100);
      });



  }
  openViewHandleSubTask(projectTaskId,projectSubTaskId, projectScheduleObject): void {
    this.commonHttpServiceCallerService.letOpenOffCancvas=true
    const modalRef = this.offcanvasService.open(ProjectScheduleViewSubTaskSingleComponent, {
      scroll: false,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4",
    });
    modalRef.componentInstance.ProjectTaskId = projectTaskId;
    modalRef.componentInstance.projectSubTaskId = projectSubTaskId;
    modalRef.componentInstance.projectScheduleObject = projectScheduleObject;
    modalRef.componentInstance.currentsubTaskactiveId = 2;
    
    modalRef.result
      .then((result) => {
        setTimeout(() => {
            this.loadData();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.commonHttpServiceCallerService.letOpenOffCancvas=false
          this.resetScroll();
        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
            this.loadData();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.commonHttpServiceCallerService.letOpenOffCancvas=false
          this.resetScroll();
        }, 100);
      });



  }
  resetScroll() {
    document.body.style.overflow = 'auto';
  }
  
}
