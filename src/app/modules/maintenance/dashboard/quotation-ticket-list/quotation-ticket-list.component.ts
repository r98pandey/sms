



import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { HelpDeskService } from '../../../../core/services/help-desk.service';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from "rxjs";

@Component({
  selector: "app-quotation-ticket-list",
  templateUrl: "./quotation-ticket-list.component.html",
  styleUrls: ["./quotation-ticket-list.component.scss"],
})
export class QuotationTicketListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  isProject: boolean = false;
  label: any = "Help-Desk";
  breadCrumbItems: any = [
    { label: "WorkFlow" },
    { label: "WorkFlow Quotation List", active: true },
  ];
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    QuotStatusId: null,
    SearchQuotName: null,
    SearchTicketNo: null,
    SearchQuotNo: null,
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
  typeQuotationNumberValue: any;
  typeQuotationNameValue: any;
  storeTicketStatusId: any;
  storeWorkflowObject: any;
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
    public helpDeskService: HelpDeskService
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();
    this.storeWorkflowObject = { ...this.helpDeskService.workflowObject };
    this.storeTicketStatusId = this.storeWorkflowObject.statusId
      ? this.storeWorkflowObject.statusId
      : 0;
    if (this.helpDeskService.pageAction) {
      this.getDropdownCompanyList();
      this.breadCrumbItems = [
        { label: "WorkFlow" },
        { label: this.storeWorkflowObject.workflowName, active: true },
      ];
      this.currentUserRole = JSON.parse(
        localStorage.getItem("currentUser")
      ).role;
      if (this.currentUserRole === "Client User") {
        this.disabledWithAceessGroup = true;
      } else {
        this.loadData();
      }
    } else {
      this.router.navigate([
        "/maintenance-management/dashboard/help-desk-dashboard",
      ]);
    }
    // if (this.storeTicketStatusId == 0 || this.storeTicketStatusId == null) {
    //  } else {
    // }
  }

  ngOnInit(): void {}

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    if (this.helpDeskService.pageAction == "Workflow Page") {
      this.payload.QuotStatusId = this.storeTicketStatusId;
      this.payload.SearchIsComplete = false;
      this.payload.searchQuotationWorkflowStatusId =
        this.storeWorkflowObject.ticketWorkFlowStatusId;
    } else if (
      this.helpDeskService.pageAction == "Waiting for Generate Invoice"
    ) {
      this.payload.SearchIsQuotationBilled = false;
      this.payload.SearchIsComplete = true;
      this.payload.QuotStatusId = 56;
    }
    this.ticketService
      .getV2_MaintenanceWorkflowQuotationList(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.ticketList = res.list;
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

  viewHandler(quotationObject: any) {
    this.ticketService.sendTicketId = quotationObject.ticketId;
    this.ticketService.quotationObjectWorkFlow = { ...quotationObject };
    this.ticketService.lastStoreRouterDashboardName =
      "/maintenance-management/dashboard/quotation-ticket-list";
    this.router.navigate([
      "maintenance-management/dashboard/view-new-ticket-list",
    ]);
  }

  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.arrayListDropDownTicketStatus = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownTicketStatusIdValue = null;
    this.typeQuotationNumberValue = null;
    this.typeQuotationNameValue = null;
    this.typeTicketNameValue = null;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchQuotName: null,
      SearchTicketNo: null,
      SearchQuotNo: null,
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
  }
  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
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
        if (this.currentUserRole === "Client User") {
          this.selectedDropDownClientIdValue =
            this.arrayListDropDownClientList[0].clientId;
          this.onDropdownClientValueChange("");
        }
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
    if(this.selectedDropDownCompanyIdValue){
    this.getDropdownClientlist();}

    this.loadData();
  }
  onDropdownClientValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
      if(this.selectedDropDownClientIdValue){
    this.getDropdownDepartmentList();
  }
    this.loadData();
  }
  onDropdownDepartmentValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.loadData();
  }
  /**
   * End  For Dropdown Company ,client,project
   */
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  returnWorkFlowStatusBadgeClasses(id: any) {
    return this.commonFunctionService.returnWorkFlowStatusBadgeClasses(id);
  }

  @ViewChild("inputerQuotationName", { static: true })
  inputerQuotationName: ElementRef;
  @ViewChild("inputerQuotationUmber", { static: true })
  inputerQuotationUmber: ElementRef;
  @ViewChild("inputerTicketNumber", { static: true })
  inputerTicketNumber: ElementRef;
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.inputerTicketNumber.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeTicketNameChange();
        })
      )
      .subscribe();

    fromEvent(this.inputerQuotationUmber.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeQuotationNumberValueChange();
        })
      )
      .subscribe();
    fromEvent(this.inputerQuotationName.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeQuotationNameValueChange();
        })
      )
      .subscribe();
  }

  onTypeQuotationNameValueChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchQuotName = this.typeQuotationNameValue;
    this.loadData();
  }
  onTypeQuotationNumberValueChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchQuotNo = this.typeQuotationNumberValue;
    this.loadData();
  }
  onTypeTicketNameChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchTicketNo = this.typeTicketNameValue;
    this.loadData();
  }

  ngOnDestroy() {
    // this.helpDeskService.workflowObject = {};
  }

  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }
}
