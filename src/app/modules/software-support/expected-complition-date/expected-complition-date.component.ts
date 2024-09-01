import {
  AfterViewInit,
  ChangeDetectorRef,
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
import { DatePipe } from "@angular/common";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import Swal from "sweetalert2";
import { SuccessModalWithRemarkComponent } from "src/app/shared/components/success-modal-with-remark/success-modal-with-remark.component";
import { SoftwareDashboardService } from "src/app/core/services/software-dashboard.service";
@Component({
  selector: "app-expected-complition-date",
  templateUrl: "./expected-complition-date.component.html",
  styleUrls: ["./expected-complition-date.component.scss"],
})
export class ExpectedComplitionDateComponent implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Software Support Dashboard";

  breadCrumbItems: any = [
    { label: "Dashboard" },
    { label: "Ticket List", active: true },
  ];
  payload: any = {
    displayLength: 10,
    displayStart: 0,
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
    SearchAssetName:null
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
    private dropdownService: DropdownService,
    private router: Router,
    private modalService: NgbModal,
    private softwareDashboardService: SoftwareDashboardService,
    private tickketService: TicketService,

    private authService: AuthAssetService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private datePipe: DatePipe,
    private helpDeskService: HelpDeskService,
    private offcanvasService: NgbOffcanvas,
    private menuService: MenuServiceService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.isProject = this.authService.getisProject();

   this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
   if (this.currentUserRole != "Super Admin") {
     if (this.currentUserRole === "Client User") {
       this.router.navigate([
         "/maintenance-management/dashboard/client-dashboard",
       ]);
     }
     if (localStorage.getItem("objectSerachForDashboardExpected")) {
      this.getObjectAfterRefresh();
    } 
   }
   this.loadData();
   this.getDropdownCompanyList();
   this.getDropdownTicketStatusList("TicketAssetStatusForSoftwareDev");
    
  }

  ngOnInit(): void {}


  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    this.softwareDashboardService
      .getV2_TicketListDashWthoutComplDate_ByPagination(
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
    let objectSerachForDashboardExpected: any = {};
    if (this.selectedDropDownCompanyIdValue)
    objectSerachForDashboardExpected.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
    objectSerachForDashboardExpected.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
    objectSerachForDashboardExpected.SearchDepartmentId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
    objectSerachForDashboardExpected.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;    

    if (this.typeTicketNameValue)
    objectSerachForDashboardExpected.SearchTicketTitle = this.typeTicketNameValue;    

    if (this.selectedDropDownTicketStatusIdValue)
    objectSerachForDashboardExpected.SearchTicketStatusId =
      this.selectedDropDownTicketStatusIdValue;     

    if (this.selectedDropDownTicketStatusIdValue)
    objectSerachForDashboardExpected.SearchAssetStatusId =
        this.selectedDropDownTicketStatusIdValue;
    if (this.arrayListDropDownClientList) {
      objectSerachForDashboardExpected.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForDashboardExpected.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }

    if (this.page) {
      objectSerachForDashboardExpected.displayStart = this.pageSize * (this.page - 1);
      objectSerachForDashboardExpected.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForDashboardExpected",
      JSON.stringify(objectSerachForDashboardExpected)
    );
  }

  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForDashboardExpected: any = JSON.parse(
      localStorage.getItem("objectSerachForDashboardExpected")
    );
    this.arrayListDropDownClientList =
    objectSerachForDashboardExpected.arrayListDropDownClientList
        ? objectSerachForDashboardExpected.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
    objectSerachForDashboardExpected.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForDashboardExpected.arrayListDropDownProjectOrDeparmentList
        : [];
    this.arrayListDropDownTicketStatus =
    objectSerachForDashboardExpected.arrayListDropDownTicketStatus
        ? objectSerachForDashboardExpected.arrayListDropDownTicketStatus
        : [];
   
    this.selectedDropDownCompanyIdValue = objectSerachForDashboardExpected.SearchCompanyId
      ? objectSerachForDashboardExpected.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForDashboardExpected.SearchClientId
      ? objectSerachForDashboardExpected.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
    objectSerachForDashboardExpected.SearchDepartmentId
        ? objectSerachForDashboardExpected.SearchDepartmentId
        : null;
    this.selectedDropDownTicketStatusIdValue =
    objectSerachForDashboardExpected.SearchTicketStatusId
        ? objectSerachForDashboardExpected.SearchTicketStatusId
        : null;

        this.selectedDropDownProjectOrDeparmentIdValue = objectSerachForDashboardExpected.SearchProjectId
        ? objectSerachForDashboardExpected.SearchProjectId
        : null;

        this.typeTicketNameValue = objectSerachForDashboardExpected.SearchTicketTitle
      ? objectSerachForDashboardExpected.SearchTicketTitle
      : null;

    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchTicketStatusId = this.selectedDropDownTicketStatusIdValue;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchTicketTitle = this.typeTicketNameValue;
   
    if (objectSerachForDashboardExpected.displayStart) {
      this.payload.displayStart = objectSerachForDashboardExpected.displayStart;
      this.page = objectSerachForDashboardExpected.page;
    }
    this.loadData();
  }

  viewHandler(ticketId: any) {
    this.tickketService.sendTicketId = ticketId;
    this.helpDeskService.pageAction = "";

    this.tickketService.ticketPageAction = "Software Support Dashboard Page";
    this.tickketService.lastStoreTicketRouterName =
      "/software-support/software-dashboard";
    localStorage.setItem(
      "lastStoreTicketRouterName",
      this.tickketService.lastStoreTicketRouterName
    );
    this.router.navigate([
      "/maintenance-management/corrective/ticket/ticket-view",
    ]);
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
      displayLength: 10,
      displayStart: 0,
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
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
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
      .GetClientListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
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
      .GetDepartmentListDrobDown(payload)
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
        this.setObjectBeforeRefesh();
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

  getDropdownTicketStatusList(pageName: any) {
    this.tickketService.getMaintenanceStatus(pageName).subscribe((res: any) => {
      this.arrayListDropDownTicketStatus = res;

    });
  }

  onDropdownTicketStatusValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchTicketStatusId =
      this.selectedDropDownTicketStatusIdValue;
      this.payload.SearchTicketTitle = this.typeTicketNameValue;
    this.loadData();
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
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
    this.payload.SearchTicketTitle = this.typeTicketNameValue;
    this.loadData();
  }

  resetSerachVariableWithModal() {
    this.selectedTicketTagId = null;
    this.selectedRequesterName = null;
    this.selectedRequesterEmail = null;
    this.selectedCreatedDate = null;
    this.selectedOperationType = null;
    (this.payload.SearchTicketNo = this.selectedTicketTagId)(
      (this.payload.SearchRequesterName = this.selectedRequesterName)
    );
    this.payload.SearchRequesterEmail = this.selectedCreatedDate;
    this.payload.SearchRequesterEmail = this.selectedRequesterEmail;
    this.payload.SearchCreatedDate = this.datePipe.transform(
      this.selectedCreatedDate,
      "dd-MM-yyyy"
    );
    this.payload.SearchOperationType = this.selectedOperationType;
    this.loadData();
  }
  submitFilterData() {
    (this.payload.SearchTicketNo = this.selectedTicketTagId),
      (this.payload.SearchRequesterName = this.selectedRequesterName);
    this.payload.SearchRequesterEmail = this.selectedRequesterEmail;
    // this.payload.SearchIssueDescription = this.selectedIssueDescription
    this.payload.SearchCreatedDate = this.datePipe.transform(
      this.selectedCreatedDate,
      "dd-MM-yyyy"
    );
    this.payload.SearchOperationType = this.selectedOperationType;
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

  openAduit(content: any) {
    this.offcanvasService.open(content, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas2",
    });
  }
  currentStatus: number = 0;
  getV2_MaintenanceWorkflowAudit(ticketId: any, content: any, status: any) {
    let payload = {
      TicketId: ticketId,
    };
    this.currentStatus = status;
    this.tickketService
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
  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }

  cancelHandler(ticketId) {}

  openModalcancelHandler(ticketId: any) {
    const modalRef = this.modalService.open(SuccessModalWithRemarkComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      " Are you sure you want to cancel the ticket";
    modalRef.componentInstance.subTitle =
      "Once canceled, the ticket status will be changed to 'canceled' and cannot be changed back.";
    modalRef.componentInstance.subTitle1 = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = "Cancel It";
    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result.value == "success") {
          this.requestHandler(ticketId, result.remark);
        }
      }
    });
  }
  requestHandler(ticketId, remark) {
    let requestData = {
      TicketId: ticketId,
      Remark: remark,
    };
    this.tickketService
      .UpdateV2_TicketCancelation(requestData)
      .subscribe((res: any) => {
        this.success(res);
        this.loadData();
      });
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
}
