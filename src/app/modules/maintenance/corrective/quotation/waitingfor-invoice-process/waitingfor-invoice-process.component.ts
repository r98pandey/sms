import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
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
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-waitingfor-invoice-process",
  templateUrl: "./waitingfor-invoice-process.component.html",
  styleUrls: ["./waitingfor-invoice-process.component.scss"],
})
export class WaitingforInvoiceProcessComponent
  implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Quotation";
  breadCrumbItems: any = [
    { label: "Quotation" },
    { label: "Quotation List", active: true },
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
    SearchTicketStatusId: null,
    SearchQuotStatusId: null,
    SearchIsQuotationBilled: null,
  };
  invoiceProcessList = [
    { id: 'Complete', name: "Complete" },
    { id: 'Pending', name: "Pending" },
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
  selectedTicketStatusIdValue: any;
  selectedQuotStatusIdValue: any;
  arrayListDropDownQuotationStatus: any = [];

  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    public helpDeskService: HelpDeskService,
    private offcanvasService: NgbOffcanvas
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.isProject = this.authService.getisProject();
  }
  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
  ngOnInit(): void {
    this.getDropdownCompanyList();
    this.breadCrumbItems = [
      { label: "WorkFlow" },
      { label: "Quotation list ", active: true },
    ];
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    }
    if (localStorage.getItem("objectSerachForInvoiceProcess")) {
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

  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForInvoiceProcess: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForInvoiceProcess.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachForInvoiceProcess.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForInvoiceProcess.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.selectedInvoiceProcessValue)
      objectSerachForInvoiceProcess.SearchIsQuotationBilled =
        this.selectedInvoiceProcessValue

    if (this.arrayListDropDownClientList) {
      objectSerachForInvoiceProcess.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForInvoiceProcess.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }

    if (this.typeQuotationNameValue) {
      objectSerachForInvoiceProcess.SearchQuotName =
        this.typeQuotationNameValue;
    }

    if (this.typeQuotationNumberValue) {
      objectSerachForInvoiceProcess.SearchQuotNo =
        this.typeQuotationNumberValue;
    }

    if (this.typeTicketNameValue) {
      objectSerachForInvoiceProcess.SearchTicketNo =
        this.typeTicketNameValue;
    }
    if (this.page) {
      objectSerachForInvoiceProcess.displayStart = this.pageSize * (this.page - 1);
      objectSerachForInvoiceProcess.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForInvoiceProcess",
      JSON.stringify(objectSerachForInvoiceProcess)
    );
  }


  /**
  * for get object for refesh
  */
  getObjectAfterRefresh() {
    let objectSerachForInvoiceProcess: any = JSON.parse(
      localStorage.getItem("objectSerachForInvoiceProcess")
    );
    this.arrayListDropDownClientList =
      objectSerachForInvoiceProcess.arrayListDropDownClientList
        ? objectSerachForInvoiceProcess.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForInvoiceProcess.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForInvoiceProcess.arrayListDropDownProjectOrDeparmentList
        : [];

    this.selectedDropDownCompanyIdValue = objectSerachForInvoiceProcess.SearchCompanyId
      ? objectSerachForInvoiceProcess.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForInvoiceProcess.SearchClientId
      ? objectSerachForInvoiceProcess.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForInvoiceProcess.SearchProjectId
        ? objectSerachForInvoiceProcess.SearchProjectId
        : null;

    this.selectedInvoiceProcessValue =
      objectSerachForInvoiceProcess.SearchIsQuotationBilled
        ? objectSerachForInvoiceProcess.SearchIsQuotationBilled
        : null;

    this.typeQuotationNameValue =
      objectSerachForInvoiceProcess.SearchQuotName
        ? objectSerachForInvoiceProcess.SearchQuotName
        : null;


    this.typeQuotationNumberValue =
      objectSerachForInvoiceProcess.SearchQuotNo
        ? objectSerachForInvoiceProcess.SearchQuotNo
        : null;

    this.typeTicketNameValue =
      objectSerachForInvoiceProcess.SearchTicketNo
        ? objectSerachForInvoiceProcess.SearchTicketNo
        : null;

    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;

    this.payload.SearchQuotName =
      this.typeQuotationNameValue;
    this.payload.SearchQuotNo =
      this.typeQuotationNumberValue;
    this.payload.SearchTicketNo =
      this.typeTicketNameValue;

    this.payload.SearchIsQuotationBilled = this.selectedInvoiceProcessValue == 'Complete' ? true : this.selectedInvoiceProcessValue == 'Pending' ? false : null;

    if (objectSerachForInvoiceProcess.displayStart) {
      this.payload.displayStart = objectSerachForInvoiceProcess.displayStart;
      this.page = objectSerachForInvoiceProcess.page;
    }
    this.loadData();
  }

  loadData() {
    this.ticketService
      .getV2_MaintenanceGeneralQuotationListOnlyWaitingForInvoice(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.ticketList = res.list;
        console.log("res22::", this.ticketList);
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

  viewHandler(quotationObject: any) {
    this.ticketService.sendTicketId = quotationObject.ticketId;

    this.ticketService.ticketPageAction = "Basic Quotation Page";
    this.ticketService.lastStoreTicketRouterName =
      "maintenance-management/corrective/quotation/list-quotation";
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
      SearchIsQuotationBilled: null,
      SearchTicketStatusId: null,
      SearchQuotStatusId: null,
    };
    localStorage.removeItem("objectSerachForInvoiceProcess")
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
      if (this.currentUserRole === "Client User") {
        this.selectedDropDownCompanyIdValue =
          this.arrayListDropDownCompany[0].companyId;
        this.onDropdownCompanyValueChange("");
      }
      this.setObjectBeforeRefesh();
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
          this.setObjectBeforeRefesh();
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
              this.setObjectBeforeRefesh();
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
    if (this.selectedDropDownClientIdValue){
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
    this.payload.SearchIsQuotationBilled = this.selectedInvoiceProcessValue == 'Complete' ? true : this.selectedInvoiceProcessValue == 'Pending' ? false : null;

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
  @ViewChild("inputerTicketNumber", { static: false })
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
  maintenanceWorkflowAuditList: any = [];
  currentStatus: number = 0;
  getV2_MaintenanceWorkflowAudit(ticketId: any, content: any, status: any) {
    let payload = {
      TicketId: ticketId,
    };
    this.currentStatus = status;
    this.ticketService
      .getV2_MaintenanceWorkflowAudit(payload)
      .subscribe((res) => {
        //console.log(res);
        this.maintenanceWorkflowAuditList = res.data;
        if (this.maintenanceWorkflowAuditList.length != 0) {
          this.openAduit(content);
        } else {
          this.currentStatus = 0;
          this.warning("No Workflow Audit Transaction ");
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

  openAduit(content: any) {
    this.offcanvasService.open(content, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas2",
    });
  }

  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }
}
