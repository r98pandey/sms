import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { HelpDeskService } from "../../../../core/services/help-desk.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  tap,
} from "rxjs";

@Component({
  selector: "app-new-ticket-list",
  templateUrl: "./new-ticket-list.component.html",
  styleUrls: ["./new-ticket-list.component.scss"],
})
export class NewTicketListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isProject: boolean = false;
  label: any = "Help-Desk";
  breadCrumbItems: any = [
    { label: "Ticket" },
    { label: "New Ticket List", active: true },
  ];
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchLocationId: null,
    SearchCategoryId: null,
    SearchSubCategoryId: null,
    SearchTicketTitle: null,
    SearchTicketNo: null,
  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  ticketList = [];
  page = 1;
  collectionSize = 0;

  imageUrl: any = environment.apiUrl;
  viewImageValue: any;
  returnValueMenu: any;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownTicketStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownTicketStatusIdValue: any;

  typeTicketNameValue: any;
  storeTicketStatusId: any;
  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
  constructor(
    private dropdownService: DropdownService,
    private router: Router,
    private modalService: NgbModal,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private helpDeskService: HelpDeskService
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();

    this.storeTicketStatusId = this.helpDeskService.ticketStatusId
      ? this.helpDeskService.ticketStatusId
      : 0;
    if (this.storeTicketStatusId == 0 || this.storeTicketStatusId == null) {
      this.router.navigate([
        "/maintenance-management/dashboard/help-desk-dashboard",
      ]);
    } else {
      this.getDropdownCompanyList();
      this.currentUserRole = JSON.parse(
        localStorage.getItem("currentUser")
      ).role;
      if (this.currentUserRole === "Client User") {
        this.disabledWithAceessGroup = true;
      } else {
        if (localStorage.getItem("objectSerachForNewTicket")) {
          this.getObjectAfterRefresh();

        } else {
          this.loadData();
        }
      }
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem("objectSerachForNewTicket")) {
      this.getObjectAfterRefresh();

    } else {
      this.loadData();
    }
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    this.payload.SearchTicketStatusId = this.storeTicketStatusId;
    if (this.helpDeskService.pageAction === 'New Ticket') {
      this.payload.newTicket = true

    } if (this.helpDeskService.pageAction === 'Awaiting Quotation') {
      this.payload.awaitQuotation = true

    } if (this.helpDeskService.pageAction === 'Waiting For Generate New Service Order') {
      this.payload.generateNewSO = true

    }
    if (this.helpDeskService.pageAction === 'Ticket Acknowledgement for completed service order') {

      this.payload.ticketAcknowledgmentRequest = true
    }
    if (this.helpDeskService.pageAction === 'Total Ticket Quotation Rejected') {
      this.payload.quotationRejected = true
    }

    if (this.helpDeskService.pageAction === 'Total Ticket Quotation Rejected') {
      this.payload.quotationRejected = true
    }

    if (this.helpDeskService.pageAction === "Waiting Client to Close Ticket") {
      this.payload.SearchOperationType = "Service";
      this.payload.pendingForCloseTicketProcess = true
    }
    if (
      this.helpDeskService.pageAction === "Waiting Internal Ticket to Close"
    ) {
      this.payload.SearchisGlobal = false;
      this.payload.pendingForCloseTicketProcessInternal = true

    } if (
      this.helpDeskService.pageAction === "Ticket Verification For Acknowledge Process"
    ) {
      this.payload.SearchisGlobal = false;
    //  this.payload.pendingForCloseTicketProcessInternal = true
       this.payload.ticketVerificationForAcknowledgeProcess = true

    }




    this.ticketService
      .getV2_TicketList_ByPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.ticketList = res.list;
        this.setObjectBeforeRefesh();
        if (this.ticketList.length > 0) {
          this.totalRecordsFromApi = res.list[0].totalCount;
          this.from = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.to = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.pageSize = this.payload.displayLength;
        } else {
          this.totalRecordsFromApi = 0;
          this.from = 0;
          this.to = 0;
          this.pageSize = this.payload.displayLength;
        }
      });
  }

  /**
 * for Set object to refesh
 */
  setObjectBeforeRefesh() {
    let objectSerachForNewTicket: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForNewTicket.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachForNewTicket.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForNewTicket.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;

    if (this.arrayListDropDownClientList) {
      objectSerachForNewTicket.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForNewTicket.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }

    if (this.typeTicketNameValue) {
      objectSerachForNewTicket.SearchTicketTitle =
        this.typeTicketNameValue;
    }

    if (this.page) {
      objectSerachForNewTicket.displayStart = this.pageSize * (this.page - 1);
      objectSerachForNewTicket.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForNewTicket",
      JSON.stringify(objectSerachForNewTicket)
    );
  }

  /**
* for get object for refesh
*/
  getObjectAfterRefresh() {
    let objectSerachForNewTicket: any = JSON.parse(
      localStorage.getItem("objectSerachForNewTicket")
    );
    this.arrayListDropDownClientList =
      objectSerachForNewTicket.arrayListDropDownClientList
        ? objectSerachForNewTicket.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForNewTicket.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForNewTicket.arrayListDropDownProjectOrDeparmentList
        : [];

    this.selectedDropDownCompanyIdValue = objectSerachForNewTicket.SearchCompanyId
      ? objectSerachForNewTicket.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForNewTicket.SearchClientId
      ? objectSerachForNewTicket.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForNewTicket.SearchProjectId
        ? objectSerachForNewTicket.SearchProjectId
        : null;

    this.typeTicketNameValue =
      objectSerachForNewTicket.SearchTicketTitle
        ? objectSerachForNewTicket.SearchTicketTitle
        : null;

    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchTicketTitle = this.typeTicketNameValue;

    if (objectSerachForNewTicket.displayStart) {
      this.payload.displayStart = objectSerachForNewTicket.displayStart;
      this.page = objectSerachForNewTicket.page;
    }
    this.loadData();
  }

  viewHandler(ticketId: any) {
    this.ticketService.sendTicketId = ticketId;
    if (this.helpDeskService.pageAction === "Waiting Client to Close Ticket") {
      this.ticketService.ticketPageAction = "Waiting Client to Close Ticket";
      this.ticketService.lastStoreTicketRouterName =
        "/maintenance-management/dashboard/new-ticket-list";
      localStorage.setItem(
        "lastStoreTicketRouterName",
        this.ticketService.lastStoreTicketRouterName
      );
      this.router.navigate([
        "/maintenance-management/corrective/ticket/ticket-view",
      ]);
    }
    if (this.helpDeskService.pageAction === "Total Ticket Quotation Rejected") {
      this.ticketService.ticketPageAction = "Total Ticket Quotation Rejected";
      this.ticketService.lastStoreTicketRouterName =
        "/maintenance-management/dashboard/new-ticket-list";
      localStorage.setItem(
        "lastStoreTicketRouterName",
        this.ticketService.lastStoreTicketRouterName
      );
      this.router.navigate([
        "/maintenance-management/corrective/ticket/ticket-view",
      ]);
    } else {
      this.ticketService.lastStoreRouterDashboardName =
        "/maintenance-management/dashboard/new-ticket-list";
      this.router.navigate([
        "maintenance-management/dashboard/view-new-ticket-list",
      ]);
    }
  }

  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.arrayListDropDownTicketStatus = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownTicketStatusIdValue = null;
    this.typeTicketNameValue = null;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchLocationId: null,
      SearchCategoryId: null,
      SearchSubCategoryId: null,
      SearchTicketTitle: null,
      SearchTicketNo: null,
    };
    if (this.currentUserRole === "Client User") {
      this.resetAfterClientUser();
    } else {
      this.page = 1;
      this.loadData();
    }
  }
  resetAfterClientUser() {
    this.selectedDropDownCompanyIdValue =
      this.arrayListDropDownCompany[0].companyId;
    this.onDropdownCompanyValueChange("");
    if (this.arrayListDropDownClientList.length != 0) {
      this.selectedDropDownClientIdValue =
        this.arrayListDropDownClientList[0].clientId;
      this.onDropdownClientValueChange("");
    }
    if (this.arrayListDropDownProjectOrDeparmentList.length != 0) {
      if (this.currentUserRole === "Client User") {
        if (this.arrayListDropDownProjectOrDeparmentList.list.length >= 2) {
          this.projectDepartmentFieldDisiabled = false;
        } else {
          this.projectDepartmentFieldDisiabled = true;
          this.selectedDropDownProjectOrDeparmentIdValue =
            this.arrayListDropDownProjectOrDeparmentList[0].departmentId;
          this.onDropdownDepartmentValueChange("");
        }
      }
    }
    this.typeTicketNameValue = null;

  }
  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      this.setObjectBeforeRefesh();
      if (this.currentUserRole === "Client User") {
        this.selectedDropDownCompanyIdValue =
          this.arrayListDropDownCompany[0].companyId;
        this.onDropdownCompanyValueChange("");
      }
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceClientDropDownList(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        this.setObjectBeforeRefesh();
        if (this.currentUserRole === "Client User") {
          this.selectedDropDownClientIdValue =
            this.arrayListDropDownClientList[0].clientId;
          this.onDropdownClientValueChange("");
        }
        this.setObjectBeforeRefesh();
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceDepartmentDropDownList(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownProjectOrDeparmentList = res.list;
        if (res.list.length != 0) {
          if (this.currentUserRole === "Client User") {
            if (res.list.length >= 2) {
              this.projectDepartmentFieldDisiabled = false;
            } else {
              this.projectDepartmentFieldDisiabled = true;
              this.selectedDropDownProjectOrDeparmentIdValue =
                this.arrayListDropDownProjectOrDeparmentList[0].departmentId;
              this.onDropdownDepartmentValueChange("");
            }
          }
        }
      });
    this.setObjectBeforeRefesh();
  }
  onDropdownCompanyValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;

    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.arrayListDropDownProjectOrDeparmentList = [];
    if (this.selectedDropDownCompanyIdValue) {
      this.getDropdownClientlist();
    }

    this.loadData();
  }
  onDropdownClientValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.selectedDropDownClientIdValue) {
      this.getDropdownDepartmentList();
    }
    this.loadData();
  }
  onDropdownDepartmentValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.setObjectBeforeRefesh();
    this.loadData();
  }
  /**
   * End  For Dropdown Company ,client,project
   */
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  @ViewChild("inputerTicketNumber", { static: true })
  inputerTicketNumber: ElementRef;

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.inputerTicketNumber.nativeElement, "input")
      .pipe(
        debounceTime(1000),
        map((event: any) => event.target.value), // Extract the input value
        distinctUntilChanged((prev, curr) => prev === curr || (!prev && !curr)), // Add custom equality check to handle empty values
        tap((searchValue) => {
          //console.log("searchValue", searchValue);
          this.onTypeTicketNameChange();
        })
      )
      .subscribe();
  }
  onTypeTicketNameChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchTicketTitle = this.typeTicketNameValue;
    this.loadData();
  }
  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }
  ngOnDestroy() {
    // this.helpDeskService.ticketStatusId = 0;
  }
}
