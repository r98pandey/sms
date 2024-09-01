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
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";
import { HelpDeskService } from "src/app/core/services/help-desk.service";

@Component({
  selector: "app-waitingfor-generate-invoicelist",
  templateUrl: "./waitingfor-generate-invoicelist.component.html",
  styleUrls: ["./waitingfor-generate-invoicelist.component.scss"],
})
export class WaitingforGenerateInvoicelistComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  isProject: boolean = false;
  label: any = "Help-Desk";
  breadCrumbItems: any = [
    { label: "Quotation" },
    { label: "Quotation  List", active: true },
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
    SearchTicketStatusId: 32,
    SearchQuotStatusId: null,
    SearchIsQuotationBilled: false,
  };
  invoiceProcessList = [
    { id: true, name: "Complete" },
    { id: false, name: "Pending" },
  ];
  selectedInvoiceProcessValue: any;
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
  selectedTicketStatusIdValue: any;
  selectedQuotStatusIdValue: any;
  arrayListDropDownQuotationStatus: any = [];
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
    this.storeTicketStatusId = this.helpDeskService.pageAction
      ? this.helpDeskService.pageAction
      : "";
    if (this.storeTicketStatusId == "" || this.storeTicketStatusId == null) {
      this.router.navigate([
        "/maintenance-management/dashboard/help-desk-dashboard",
      ]);
    } else {
      this.loadData();
      this.getDropdownCompanyList();
      this.getDropdownTicketStatusList("TicketQuotationStatus");
      this.getDropdownQuotationStatusList("QuotationStatus");
    }
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "WorkFlow" },
      { label: "Quotation list ", active: true },
    ];
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {

    if (this.helpDeskService.pageAction === 'Waiting for Generate Invoice') {
      this.payload.quotationToProceedFinance = true

    }
    this.ticketService
      .getV2_MaintenanceGeneralQuotationList(
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

    this.ticketService.ticketPageAction = "Basic Quotation Page";
    this.ticketService.lastStoreTicketRouterName =
      "maintenance-management/dashboard/waiting-for-generate-invoice-list";
    localStorage.setItem(
      "lastStoreTicketRouterName",
      this.ticketService.lastStoreTicketRouterName
    );

    this.router.navigate([
      "maintenance-management/corrective/ticket/ticket-view",
    ]);
  }

  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownTicketStatusIdValue = null;
    this.typeQuotationNumberValue = null;
    this.typeQuotationNameValue = null;
    this.typeTicketNameValue = null;
    this.selectedInvoiceProcessValue = null;
    this.selectedQuotStatusIdValue = null;
    this.selectedTicketStatusIdValue = null;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchQuotName: null,
      SearchTicketNo: null,
      SearchQuotNo: null,
      SearchIsQuotationBilled: false,
      SearchTicketStatusId: 32,
      SearchQuotStatusId: null,
    };
    this.page = 1;
    this.loadData();
  }
  resetSerachVariableWithModal() {
    this.selectedQuotStatusIdValue = null;
    this.selectedTicketStatusIdValue = null;
    (this.payload.SearchTicketStatusId = this.selectedTicketStatusIdValue),
      (this.payload.SearchQuotStatusId = this.selectedQuotStatusIdValue);
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

  onDropdownInvoiceProcessChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchIsQuotationBilled = this.selectedInvoiceProcessValue;
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

  openFilter(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.submitFilterData();
        },
        (reason) => {
          this.submitFilterData();
        }
      );
  }

  submitFilterData() {
    (this.payload.SearchTicketStatusId = this.selectedTicketStatusIdValue),
      (this.payload.SearchQuotStatusId = this.selectedQuotStatusIdValue);
    this.loadData();
  }

  getDropdownTicketStatusList(pageName: any) {
    this.ticketService.getMaintenanceStatus(pageName).subscribe((res: any) => {
      this.arrayListDropDownTicketStatus = res;
    });
  }
  getDropdownQuotationStatusList(pageName: any) {
    this.ticketService.getMaintenanceStatus(pageName).subscribe((res: any) => {
      this.arrayListDropDownQuotationStatus = res;
    });
  }

  getReturnQuotationNoColor(quotation) {
    if (quotation.ticketStatusId == 32 && quotation.isQuotationBilled) {
      return "link-danger";
    } else {
      return "link-primary";
    }
  }
  ngOnDestroy() {
    // this.helpDeskService.pageAction = null;
  }

  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }
}
