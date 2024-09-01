
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
import { HelpDeskService } from '../../../../core/services/help-desk.service';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from "rxjs";

@Component({
  selector: "app-workflow-ticket-list",
  templateUrl: "./workflow-ticket-list.component.html",
  styleUrls: ["./workflow-ticket-list.component.scss"],
})
export class WorkflowTicketListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  isProject: boolean = false;
  label: any = "Help-Desk";
  breadCrumbItems: any = [
    { label: "WorkFlow" },
    { label: "WorkFlow Ticket List", active: true },
  ];
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchTicketName: null,
    TicketStatusId: null,
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
  storeWorkflowObject: any;
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
    this.storeWorkflowObject = { ...this.helpDeskService.workflowObject };
    this.storeTicketStatusId = this.storeWorkflowObject.statusId
      ? this.storeWorkflowObject.statusId
      : 0;
    if (this.storeTicketStatusId == 0 || this.storeTicketStatusId == null) {
      this.router.navigate([
        "/maintenance-management/dashboard/help-desk-dashboard",
      ]);
    } else {
      this.loadData();
      this.getDropdownCompanyList();
      this.breadCrumbItems = [
        { label: "WorkFlow" },
        { label: this.storeWorkflowObject.workflowName, active: true },
      ];
    }
  }

  ngOnInit(): void {}

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    this.payload.TicketStatusId = this.storeTicketStatusId;
     this.payload.searchTicketWorkFlowStatusId =
       this.storeWorkflowObject.ticketWorkFlowStatusId;

    this.ticketService
      .getV2_MaintenanceWorkflowTicketList(
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

  viewHandler(ticketObject: any) {
    this.ticketService.sendTicketId = ticketObject.ticketId;
    this.ticketService.ticketObjectInBillingWorkFlow = { ...ticketObject };
    this.ticketService.lastStoreRouterDashboardName =
      "/maintenance-management/dashboard/workflow-ticket-list";
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
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchTicketName: null,
    };
    this.page = 1;
    this.loadData();
  }
  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
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
    this.getDropdownDepartmentList();}
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
  }

  onTypeTicketNameChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchTicketName = this.typeTicketNameValue;
    this.loadData();
  }

  ngOnDestroy() {
    // this.helpDeskService.workflowObject = {};
  }
}
