import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormArray,
  Validators,
} from "@angular/forms";

import Swal from "sweetalert2";
import { DatePipe } from "@angular/common";
import { restApiService } from "src/app/core/services/rest-api.service";
import { ServiceOrderService } from "src/app/core/services/service-order.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { environment } from "src/environments/environment";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";

@Component({
  selector: "app-list-service-order",
  templateUrl: "./list-service-order.component.html",
  styleUrls: ["./list-service-order.component.scss"],
  providers: [DecimalPipe],
})
export class ListServiceOrderComponent implements OnInit, AfterViewInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  serviceOrderList: any[] = [];

  selectedCreatedDate: any;
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchWOStatusId: null,
    SearchTicketNo: null,
    SearchWONo: null,
    SearchWOName: null,
    SearchOperationType: null,
    SearchSupportType: null,
    SearchUrgencyTypeId: null,
    SearchExpWrkStartDate: null,
    SearchCreatedDate: null,
  };
  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
  };
  totalCountServiceOrderOnly: any = {
    countTotalSO: 0,
    countPendingSO: 0,
    countInProgressSO: 0,
    countCompletedSO: 0,
    countOnHoldSO: 0,
  };
  isProject: any;
  selectedDropDownWOStatusIdValue: any;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownTicketStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownOperationValue: any;
  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  ticketList = [];
  page = 1;
  collectionSize = 0;
  supportTypeAarry = ["On-Site", "Remote", "Phone Call"];

  imageUrl: any = environment.apiUrl;
  typeServiceOrderValue: any;

  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  priorityList: any[] = [];
  selectedPriority: any = null;

  constructor(
    private modalService: NgbModal,
    private serviceOrderService: ServiceOrderService,
    private formBuilder: UntypedFormBuilder,
    private ApiService: restApiService,
    private datePipe: DatePipe,
    private commonService: CommonFunctionService,
    private authService: AuthAssetService,
    private dropdownServices: DropdownService,
    private commonFunctionService: CommonFunctionService,
    private ticketService: TicketService,
    public router: Router,
    private helpDeskService: HelpDeskService,
    private offcanvasService: NgbOffcanvas,
    private menuService: MenuServiceService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.isProject = this.authService.getisProject();
  }
  operationList = [
    { name: "Service", operationTypeId: 1, disabled: false },
    { name: "Incident Report", operationTypeId: 2, disabled: false },
    { name: "Bug", operationTypeId: 3, disabled: false },
    { name: "New Requirement", operationTypeId: 4, disabled: false },

  ];
  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Service Order" },
      { label: "Service Order List", active: true },
    ];

    this.getV2_TotalCountServiceOrderOnly();
    this.getDropdownCompanyList();
    this.getDropdownTicketStatusList("ServiceOrder");
    this.getMX_MasterUrgentTypeList();
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    }
    if (localStorage.getItem("objectSerachForServiceOrder")) {
      this.getObjectAfterRefresh();
    } else {
      this.loadData();
    }


  }

  onTypeServiceOrderNameChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchWOName = this.typeServiceOrderValue;
    this.loadData();
  }
  @ViewChild("inputerServiceName", { static: true })
  inputerServiceName: ElementRef;

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.inputerServiceName.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeServiceOrderNameChange();
        })
      )
      .subscribe();
  }

  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForServiceOrder: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForServiceOrder.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachForServiceOrder.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForServiceOrder.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.selectedDropDownOperationValue)
      objectSerachForServiceOrder.SearchOperationType =
        this.selectedDropDownOperationValue;

    if (this.selectedDropDownWOStatusIdValue)
      objectSerachForServiceOrder.SearchWOStatusId =
        this.selectedDropDownWOStatusIdValue;


    if (this.activeCard)
      objectSerachForServiceOrder.activeCard =
        this.activeCard;

    if (this.arrayListDropDownClientList) {
      objectSerachForServiceOrder.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownTicketStatus) {
      objectSerachForServiceOrder.arrayListDropDownTicketStatus =
        this.arrayListDropDownTicketStatus;
    }


    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForServiceOrder.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }
    //TicketNameValue
    if (this.typeServiceOrderValue)
      objectSerachForServiceOrder.SearchWOName = this.typeServiceOrderValue;


    if (this.selectedTicketNo)
      objectSerachForServiceOrder.SearchTicketNo = this.selectedTicketNo;


    if (this.selectedWONo)
      objectSerachForServiceOrder.SearchWONo = this.selectedWONo;


    if (this.selectedDropDownOperationValue)
      objectSerachForServiceOrder.SearchOperationType = this.selectedDropDownOperationValue;


    if (this.selectedSupportType)
      objectSerachForServiceOrder.SearchSupportType = this.selectedSupportType;

    if (this.selectedPriority) {
      objectSerachForServiceOrder.SearchUrgencyTypeId = this.selectedPriority;

    }
    if (this.selectedExpWrkStartDate) {
      objectSerachForServiceOrder.SearchExpWrkStartDate = this.selectedExpWrkStartDate;

    }

    if (this.selectedCreatedDate) {
      objectSerachForServiceOrder.SearchCreatedDate = this.selectedCreatedDate;

    }


    if (this.page) {
      objectSerachForServiceOrder.displayStart = this.pageSize * (this.page - 1);
      objectSerachForServiceOrder.page = this.page;
    }





    localStorage.setItem(
      "objectSerachForServiceOrder",
      JSON.stringify(objectSerachForServiceOrder)
    );
  }

  /**
  * for get object for refesh
  */
  getObjectAfterRefresh() {
    let objectSerachForServiceOrder: any = JSON.parse(
      localStorage.getItem("objectSerachForServiceOrder")
    );
    this.arrayListDropDownClientList =
      objectSerachForServiceOrder.arrayListDropDownClientList
        ? objectSerachForServiceOrder.arrayListDropDownClientList
        : [];
    this.activeCard =
      objectSerachForServiceOrder.activeCard ? objectSerachForServiceOrder.activeCard : ''

    this.arrayListDropDownTicketStatus =
      objectSerachForServiceOrder.arrayListDropDownTicketStatus
        ? objectSerachForServiceOrder.arrayListDropDownTicketStatus
        : [];



    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForServiceOrder.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForServiceOrder.arrayListDropDownProjectOrDeparmentList
        : [];

    this.selectedDropDownCompanyIdValue = objectSerachForServiceOrder.SearchCompanyId
      ? objectSerachForServiceOrder.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForServiceOrder.SearchClientId
      ? objectSerachForServiceOrder.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForServiceOrder.SearchProjectId
        ? objectSerachForServiceOrder.SearchProjectId
        : null;
    this.selectedDropDownWOStatusIdValue =
      objectSerachForServiceOrder.SearchWOStatusId
        ? objectSerachForServiceOrder.SearchWOStatusId
        : null;

    //TicketNameValue
    this.typeServiceOrderValue = objectSerachForServiceOrder.SearchWOName
      ? objectSerachForServiceOrder.SearchWOName
      : null;

    this.selectedTicketNo = objectSerachForServiceOrder.SearchTicketNo
      ? objectSerachForServiceOrder.SearchTicketNo
      : null;
    this.selectedWONo = objectSerachForServiceOrder.SearchWONo
      ? objectSerachForServiceOrder.SearchWONo
      : null;
    this.selectedDropDownOperationValue = objectSerachForServiceOrder.SearchOperationType
      ? objectSerachForServiceOrder.SearchOperationType
      : null;
    this.selectedSupportType = objectSerachForServiceOrder.SearchSupportType
      ? objectSerachForServiceOrder.SearchSupportType
      : null;

    this.selectedPriority = objectSerachForServiceOrder.SearchUrgencyTypeId
      ? objectSerachForServiceOrder.SearchUrgencyTypeId
      : null;

    this.selectedExpWrkStartDate = objectSerachForServiceOrder.SearchExpWrkStartDate
      ? objectSerachForServiceOrder.SearchExpWrkStartDate
      : null;

    this.selectedCreatedDate = objectSerachForServiceOrder.SearchCreatedDate
      ? objectSerachForServiceOrder.SearchCreatedDate
      : null;


    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchWOStatusId = this.selectedDropDownWOStatusIdValue;
    this.payload.SearchWOName = this.typeServiceOrderValue;
    this.payload.SearchWONo = this.selectedWONo;
    this.payload.SearchOperationType = this.selectedDropDownOperationValue;
    this.payload.SearchUrgencyTypeId = this.selectedPriority;;
    this.payload.SearchSupportType = this.selectedSupportType;
    this.payload.SearchTicketNo = this.selectedTicketNo;
    this.payload.SearchExpWrkStartDate = this.selectedExpWrkStartDate ?
      this.datePipe.transform(
        this.selectedExpWrkStartDate,
        "dd-MM-yyyy"
      )
      : null;
    this.payload.SearchCreatedDate = this.selectedCreatedDate ?
      this.datePipe.transform(
        this.selectedCreatedDate,
        "dd-MM-yyyy"
      )
      : null;




    if (objectSerachForServiceOrder.displayStart) {
      this.payload.displayStart = objectSerachForServiceOrder.displayStart;
      this.page = objectSerachForServiceOrder.page;
    }
    this.loadData();
  }

  getDropdownTicketStatusList(pageName: any) {
    this.ticketService.getMaintenanceStatus(pageName).subscribe((res: any) => {
      this.arrayListDropDownTicketStatus = res;
    });
  }
  onDropdownTicketStatusValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchWOStatusId = this.selectedDropDownWOStatusIdValue;
    this.loadData();
    this.activeCard = ''
  }

  viewHandler(ticketId: any) {
    this.ticketService.sendTicketId = ticketId;
    this.helpDeskService.pageAction = "";
    this.ticketService.ticketPageAction = "Basic Service Page";
    this.ticketService.lastStoreTicketRouterName =
      "/maintenance-management/corrective/service-order/list-service-order";
    localStorage.setItem(
      "lastStoreTicketRouterName",
      this.ticketService.lastStoreTicketRouterName
    );

    this.router.navigate([
      "/maintenance-management/corrective/ticket/ticket-view",
    ]);
  }
  loadData() {
    this.serviceOrderService
      .getWoList(this.commonFunctionService.clean(this.payload))
      .subscribe((res: any) => {
        this.serviceOrderList = res.list;
        console.log("res:::", this.serviceOrderList);
        this.setObjectBeforeRefesh();
        if (this.serviceOrderList.length > 0) {
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
  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  getV2_TotalCountServiceOrderOnly() {
    this.serviceOrderService
      .getV2_TotalCountServiceOrderOnly()
      .subscribe((res: any) => {
        this.totalCountServiceOrderOnly = res.data;
      });
  }
  getTicketStatus(id) {
    return this.commonService.returnStatusBadgeClasses(id);
  }

  /**
   * Confirmation mail model
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  deleteData(id: any) { }

  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownOperationValue = null;
    this.selectedDropDownWOStatusIdValue = null;
    this.selectedTicketNo = null;
    this.selectedWONo = null;
    this.selectedDropDownOperationValue = null;
    this.selectedSupportType = null;
    this.typeServiceOrderValue = null;
    this.activeCard = ''
    this.selectedExpWrkStartDate = null;
    this.selectedPriority = null;
    this.selectedCreatedDate = null
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchWOStatusId: null,
      SearchTicketNo: null,
      SearchWONo: null,
      SearchWOName: null,
      SearchOperationType: null,
      SearchSupportType: null,
      SearchUrgencyTypeId: null,
      SearchExpWrkStartDate: null,
      SearchCreatedDate: null,
    };
    localStorage.removeItem(
      "objectSerachForServiceOrder")

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
        }
        this.setObjectBeforeRefesh();
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
      SearchProjectId: this.selectedDropDownProjectOrDeparmentIdValue,
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
    if (this.selectedDropDownClientIdValue) { this.getDropdownDepartmentList(); }
    this.loadData();
  }
  onDropdownDepartmentValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);

    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.loadData();
  }

  onDropdownOperationValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);

    this.payload.SearchOperationType = this.selectedDropDownOperationValue;
    // this.loadData();
  }
  /**
   * End  For Dropdown Company ,client,project
   */
  selectedTicketNo: any = null;
  selectedWONo: any = null;

  selectedSupportType: any = null;
  selectedExpWrkStartDate: any = null;
  resetSerachVariableWithModal() {
    this.selectedTicketNo = null;
    this.selectedWONo = null;
    this.selectedSupportType = null;
    this.selectedExpWrkStartDate = null;
    this.selectedCreatedDate = null;
    this.selectedPriority = null;
    this.selectedDropDownOperationValue = null;
    (this.payload.SearchTicketNo = this.selectedTicketNo),
      (this.payload.SearchWONo = this.selectedWONo);
    this.payload.SearchOperationType = this.selectedDropDownOperationValue;
    this.payload.SearchSupportType = this.selectedSupportType;
    this.payload.SearchUrgencyTypeId = this.selectedPriority;
    this.payload.SearchExpWrkStartDate = this.selectedExpWrkStartDate;
    this.payload.SearchCreatedDate = this.selectedCreatedDate;
    this.loadData();
  }
  submitFilterData() {
    (this.payload.SearchTicketNo = this.selectedTicketNo),
      (this.payload.SearchWONo = this.selectedWONo);
    this.payload.SearchOperationType = this.selectedDropDownOperationValue;
    this.payload.SearchSupportType = this.selectedSupportType;
    this.payload.SearchUrgencyTypeId = this.selectedPriority;
    this.payload.SearchExpWrkStartDate = this.selectedExpWrkStartDate ?
      this.datePipe.transform(
        this.selectedExpWrkStartDate,
        "dd-MM-yyyy"
      )
      : null;
    this.payload.SearchCreatedDate = this.selectedCreatedDate ?
      this.datePipe.transform(
        this.selectedCreatedDate,
        "dd-MM-yyyy"
      )
      : null;

    this.loadData();
  }
  openFilter(content: any) {
    this.offcanvasService
      .open(content, {
        scroll: true,
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvas3",
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


  activeCard: any = '';
  onCardClickActive(type: any, statusId: any) {
    this.activeCard = type;
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownOperationValue = null;
    this.selectedDropDownWOStatusIdValue = statusId;
    this.selectedTicketNo = null;
    this.selectedWONo = null;
    this.selectedDropDownOperationValue = null;
    this.selectedSupportType = null;
    this.typeServiceOrderValue = null;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchWOStatusId: statusId,
      SearchTicketNo: null,
      SearchWONo: null,
      SearchWOName: null,
      SearchOperationType: null,
      SearchSupportType: null,
      SearchUrgencyTypeId: null,

    };
    localStorage.removeItem(
      "objectSerachForServiceOrder")

    if (this.currentUserRole === "Client User") {
      this.resetAfterClientUser();
    } else {
      this.page = 1;
      this.loadData();
    }
  }



  getMX_MasterUrgentTypeList(): void {
    this.ticketService
      .getMX_MasterUrgentTypeList()
      .subscribe((response: any) => {
        if (response) {
          this.priorityList = response?.data;
        }
      });
  }
}
