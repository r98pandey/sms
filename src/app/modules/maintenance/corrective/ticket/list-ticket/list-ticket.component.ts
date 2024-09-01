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

@Component({
  selector: "app-list-ticket",
  templateUrl: "./list-ticket.component.html",
  styleUrls: ["./list-ticket.component.scss"],
})
export class ListTicketComponent implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Maintenance Management";

  breadCrumbItems: any = [
    { label: "Ticket" },
    { label: "Ticket List", active: true },
  ];
  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
  };
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
    SearchRequesterName: null,
    SearchRequesterEmail: null,
    SearchCreatedDateFrom: null,
    SearchCreatedDateTo: null,
    SearchTicketType: null,
    SearchPriority: null,
    SearchIsGlobal: null,
    SearchIsBillable: null,
    SearchTicketTypeId: null,
    SearchOperationType: null,
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
  selectedCreatedDate: any = {
    from: null,
    to: null,
  };
  selectedOperationType: any;

  typeTicketNameValue: any;


  operationList = [
    { name: "Service", operationTypeId: 1, disabled: false },
    { name: "Incident Report", operationTypeId: 2, disabled: false },
    { name: "Bug", operationTypeId: 3, disabled: false },
    { name: "New Requirement", operationTypeId: 4, disabled: false },



  ];
  ticketTypeList = ["Hardware", "Non-Hardware"];
  isGlobalList = ["Internal", "Global"];
  isBillableList = [
    { name: "Billable", disabled: false },
    { name: "Non-Billable", disabled: false },
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
  urgentList: any = [];
  selectedUrgentValue: any = null;
  selectedTicketType: any = null;
  selectedIsGlobal: any = null;
  selectedIsBillable: any = null;
  masterTicketTypeList: any = [];
  isDeviceRelated: boolean;
  selectedDropDownTicketTypeIdValue: any;
  activeCard: any = null
  constructor(
    private dropdownService: DropdownService,
    private router: Router,
    private modalService: NgbModal,
    private ticketService: TicketService,
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
  }

  ngOnInit(): void {
    setTimeout((res) => {
      let url = this.router.url;
      this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    }, 2000);

    this.getDropdownCompanyList();
    this.getMX_MasterUrgentTypeList();

    this.getDropdownTicketStatusList("Ticket");
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    }
    if (localStorage.getItem("objectSerachForTicket")) {
      this.getObjectAfterRefresh();
    } else {
      this.loadData();
    }

  }

  getV2_TotalCountTicketOnly() {
    let payload = { ...this.payload };
    // delete payload.displayLength;
    // delete payload.displayStart;
    // delete payload.SearchTicketStatusId;

    this.ticketService.getV2_TotalCountTicketOnly_new(payload).subscribe((res: any) => {
      this.totalCountTicketOnly = res.data;
    });
  }
  getMX_MasterUrgentTypeList(): void {
    this.ticketService
      .getMX_MasterUrgentTypeList()
      .subscribe((response: any) => {
        if (response) {
          this.urgentList = response?.data;
          this.setObjectBeforeRefesh();
        }
      });
  }
  navigateToAdd() {
    this.ticketService.accessRight = true;
    this.router.navigate([
      "/maintenance-management/corrective/ticket/add-ticket",
    ]);
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    this.ticketService
      .getV2_TicketingtList_ByPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.setObjectBeforeRefesh();
        this.getV2_TotalCountTicketOnly();
        this.ticketList = res.list;
        console.log("ticket cat::", this.ticketList);
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

  viewHandler(ticketId: any) {
    this.ticketService.sendTicketId = ticketId;
    this.helpDeskService.pageAction = "";

    this.ticketService.ticketPageAction = "Basic Ticket Page";
    this.ticketService.lastStoreTicketRouterName =
      "/maintenance-management/corrective/ticket/list-ticket";
    localStorage.setItem(
      "lastStoreTicketRouterName",
      this.ticketService.lastStoreTicketRouterName
    );
    this.router.navigate([
      "/maintenance-management/corrective/ticket/ticket-view",
    ]);
  }

  editHandler(ticketId: any) {
    this.ticketService.sendTicketId = ticketId;
    this.router.navigate([
      "/maintenance-management/corrective/ticket/edit-ticket",
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
    this.selectedCreatedDate = {
      from: null,
      to: null,
    };
    this.selectedOperationType = null;
    this.typeTicketNameValue = null;
    this.selectedTicketType = null;
    this.selectedIsGlobal = null;
    this.selectedIsBillable = null;
    this.selectedUrgentValue = null;
    this.selectedDropDownTicketTypeIdValue = null;
    this.activeCard = null
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
      SearchRequesterName: null,
      SearchRequesterEmail: null,
      SearchCreatedDateFrom: null,
      SearchCreatedDateTo: null,
      SearchTicketType: null,
      SearchPriority: null,
      SearchIsGlobal: null,
      SearchIsBillable: null,
      SearchTicketTypeId: null,
      SearchOperationType: null,
    };
    localStorage.removeItem("objectSerachForTicket");
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
      this.selectedDropDownClientIdValue = this.arrayListDropDownClientList[0].clientId;
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
    this.payload.SearchProjectId =this.selectedDropDownProjectOrDeparmentIdValue;
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
    this.loadData();
  }
  /**
   * End  For Dropdown Company ,client,project
   */

  getDropdownTicketStatusList(pageName: any) {
    this.ticketService.getMaintenanceStatus(pageName).subscribe((res: any) => {
      this.arrayListDropDownTicketStatus = res;
      this.setObjectBeforeRefesh();
    });
  }

  onDropdownTicketStatusValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchTicketStatusId =
      this.selectedDropDownTicketStatusIdValue;
    this.activeCard = null
    this.loadData();
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  @ViewChild("inputerTicketNumber", { static: false })
  inputerTicketNumber: ElementRef;

  ngAfterViewInit() {
    // server-side Search
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
    this.selectedCreatedDate = {
      from: null,
      to: null,
    };
    this.selectedTicketType = null;
    this.selectedUrgentValue = null;
    this.selectedDropDownTicketTypeIdValue = null;
    this.selectedIsBillable = null;
    this.selectedOperationType = null;
    this.selectedIsGlobal = null;
    this.payload.SearchTicketNo = this.selectedTicketTagId;
    this.payload.SearchRequesterName = this.selectedRequesterName;
    this.payload.SearchRequesterEmail = this.selectedRequesterEmail;
    this.payload.SearchPriority = this.selectedUrgentValue;
    this.payload.SearchTicketType = this.selectedTicketType;
    this.payload.SearchTicketTypeId = this.selectedDropDownTicketTypeIdValue;
    this.payload.SearchCreatedDateFrom = null;
    this.payload.SearchCreatedDateTo = null;
    this.payload.SearchTicketType = null;
    this.payload.SearchIsBillable = null;
    this.payload.SearchOperationType = null;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.activeCard = null;
    this.operationList = [];
    this.operationList = [
      { name: "Service", operationTypeId: 1, disabled: false },
      { name: "Incident Report", operationTypeId: 2, disabled: false },
      { name: "Bug", operationTypeId: 3, disabled: false },
      { name: "New Requirement", operationTypeId: 4, disabled: false },



    ];
    this.loadData();
  }
  submitFilterData() {
    this.payload.SearchTicketNo = this.selectedTicketTagId;
    this.payload.SearchRequesterName = this.selectedRequesterName;
    this.payload.SearchRequesterEmail = this.selectedRequesterEmail;
    this.payload.SearchPriority = this.selectedUrgentValue;
    this.payload.SearchTicketType = this.selectedTicketType;
    this.payload.SearchTicketTypeId = this.selectedDropDownTicketTypeIdValue;
    this.payload.SearchIsBillable = this.selectedIsBillable;
    this.payload.SearchOperationType = this.selectedOperationType;
    this.payload.SearchIsGlobal = this.selectedIsGlobal;
    this.payload.SearchCreatedDateFrom = this.selectedCreatedDate?.from ? this.datePipe.transform(
      this.selectedCreatedDate.from,
      "dd-MM-yyyy"
    ) : null;
    this.payload.SearchCreatedDateTo = this.selectedCreatedDate?.to ? this.datePipe.transform(
      this.selectedCreatedDate.to,
      "dd-MM-yyyy"
    ) : null;

    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);

    this.loadData();
  }
  openFilter(content: any) {
    const modalRef = this.offcanvasService.open(content, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas3",
    });

    modalRef.result
      .then((result) => {
        this.submitFilterData();
      })
      .catch((error) => {
        this.submitFilterData();
      });
    // this.modalService
    //   .open(content, {
    //     ariaLabelledBy: "modal-basic-title",
    //     centered: true,
    //     backdrop: "static",
    //     keyboard: false,
    //   })
    //   .result.then(
    //     (result) => {
    //       this.submitFilterData();
    //     },
    //     (reason) => {
    //       this.submitFilterData();
    //     }
    //   );
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
    this.ticketService
      .getV2_MaintenanceWorkflowAudit(payload)
      .subscribe((res) => {
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

  cancelHandler(ticketId) { }

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
    this.ticketService
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
  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForTicket: any = {};
    //Company
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForTicket.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    //Client Value
    if (this.selectedDropDownClientIdValue)
      objectSerachForTicket.SearchClientId = this.selectedDropDownClientIdValue;
    //Client list
    if (this.arrayListDropDownClientList) {
      objectSerachForTicket.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    //ProjectOrDeparment Value
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForTicket.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    //ProjectOrDeparment list
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForTicket.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }
    //urgent Value
    if (this.selectedUrgentValue)
      objectSerachForTicket.SearchPriority = this.selectedUrgentValue;
    //urgent list
    if (this.urgentList) {
      objectSerachForTicket.urgentList = this.urgentList;
    }

    //TicketTagId Value
    if (this.selectedTicketTagId)
      objectSerachForTicket.SearchTicketNo = this.selectedTicketTagId;
    //RequesterName
    if (this.selectedRequesterName)
      objectSerachForTicket.SearchRequesterName = this.selectedRequesterName;
    //RequesterEmail
    if (this.selectedRequesterEmail) {
      objectSerachForTicket.SearchRequesterEmail = this.selectedRequesterEmail;
    }
    //CreatedDate
    if (this.selectedCreatedDate)
      objectSerachForTicket.SearchCreatedDate = this.selectedCreatedDate;
    //OperationType;
    if (this.selectedOperationType)
      objectSerachForTicket.SearchOperationType = this.selectedOperationType;
    //TicketNameValue
    if (this.selectedDropDownTicketStatusIdValue)
      objectSerachForTicket.SearchTicketStatusId =
        this.selectedDropDownTicketStatusIdValue;
    //TicketStatus list;
    if (this.arrayListDropDownTicketStatus)
      objectSerachForTicket.arrayListDropDownTicketStatus =
        this.arrayListDropDownTicketStatus;
    //TicketNameValue
    if (this.typeTicketNameValue)
      objectSerachForTicket.SearchTicketTitle = this.typeTicketNameValue;

    //TicketTypeId  list;
    if (this.masterTicketTypeList)
      objectSerachForTicket.masterTicketTypeList = this.masterTicketTypeList;

    //TicketTypeId  Value;
    if (this.selectedDropDownTicketTypeIdValue) {
      objectSerachForTicket.SearchTicketTypeId =
        this.selectedDropDownTicketTypeIdValue;
    }
    //TicketType Value;
    if (this.selectedTicketType) {
      objectSerachForTicket.SearchTicketType = this.selectedTicketType;
    }
    // IsGlobal Value
    if (this.selectedIsGlobal) {
      objectSerachForTicket.SearchIsGlobal = this.selectedIsGlobal;
    }
    if (this.selectedIsBillable) {
      objectSerachForTicket.SearchIsBillable = this.selectedIsBillable;
    }
    //activeCard
    if (this.activeCard) {
      objectSerachForTicket.activeCard = this.activeCard;
    }
    if (this.page) {
      objectSerachForTicket.displayStart = this.pageSize * (this.page - 1);
      objectSerachForTicket.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForTicket",
      JSON.stringify(objectSerachForTicket)
    );
  }
  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForTicket: any = JSON.parse(
      localStorage.getItem("objectSerachForTicket")
    );

    //Company Value
    this.selectedDropDownCompanyIdValue = objectSerachForTicket.SearchCompanyId
      ? objectSerachForTicket.SearchCompanyId
      : null;
    //Client List
    this.arrayListDropDownClientList =
      objectSerachForTicket.arrayListDropDownClientList
        ? objectSerachForTicket.arrayListDropDownClientList
        : [];
    //Client Value
    this.selectedDropDownClientIdValue = objectSerachForTicket.SearchClientId
      ? objectSerachForTicket.SearchClientId
      : null;
    //ProjectOrDeparment List
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForTicket.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForTicket.arrayListDropDownProjectOrDeparmentList
        : [];
    //ProjectOrDeparment Value
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForTicket.SearchProjectId
        ? objectSerachForTicket.SearchProjectId
        : null;

    //urgent list
    this.urgentList = objectSerachForTicket.urgentList
      ? objectSerachForTicket.urgentList
      : [];

    //urgent Value
    this.selectedUrgentValue = objectSerachForTicket.SearchPriority
      ? objectSerachForTicket.SearchPriority
      : null;

    //TicketStatus list;
    this.arrayListDropDownTicketStatus =
      objectSerachForTicket.arrayListDropDownTicketStatus
        ? objectSerachForTicket.arrayListDropDownTicketStatus
        : [];

    //TicketStatus Value;
    this.selectedDropDownTicketStatusIdValue =
      objectSerachForTicket.SearchTicketStatusId
        ? objectSerachForTicket.SearchTicketStatusId
        : null;

    //TicketTagId Value
    this.selectedTicketTagId = objectSerachForTicket.SearchTicketNo
      ? objectSerachForTicket.SearchTicketNo
      : null;
    //TicketTypeId  list;
    this.masterTicketTypeList = objectSerachForTicket.masterTicketTypeList
      ? objectSerachForTicket.masterTicketTypeList
      : [];

    //TicketTypeId  Value;
    this.selectedDropDownTicketTypeIdValue =
      objectSerachForTicket.SearchTicketTypeId
        ? objectSerachForTicket.SearchTicketTypeId
        : null;

    //RequesterName
    this.selectedRequesterName = objectSerachForTicket.SearchRequesterName
      ? objectSerachForTicket.SearchRequesterName
      : null;

    //RequesterEmail
    this.selectedRequesterEmail = objectSerachForTicket.SearchRequesterEmail
      ? objectSerachForTicket.SearchRequesterEmail
      : null;

    //CreatedDate
    this.selectedCreatedDate = objectSerachForTicket.SearchCreatedDate
      ? objectSerachForTicket.SearchCreatedDate
      : null;
    //OperationType;
    this.selectedOperationType = objectSerachForTicket.SearchOperationType
      ? objectSerachForTicket.SearchOperationType
      : null;
    //TicketNameValue
    this.typeTicketNameValue = objectSerachForTicket.SearchTicketTitle
      ? objectSerachForTicket.SearchTicketTitle
      : null;

    this.selectedTicketType = objectSerachForTicket.SearchTicketType
      ? objectSerachForTicket.SearchTicketType
      : null;

    // IsGlobal Value
    this.selectedIsGlobal = objectSerachForTicket.SearchIsGlobal
      ? objectSerachForTicket.SearchIsGlobal
      : null;

    if (this.selectedIsGlobal) {
      this.onClickisGlobal(this.selectedIsGlobal)
    }

    //activeCard
    this.activeCard =
      objectSerachForTicket.activeCard ? objectSerachForTicket.activeCard : null;


    // selectedIsBillable Value
    this.selectedIsBillable = objectSerachForTicket.SearchIsBillable
      ? objectSerachForTicket.SearchIsBillable
      : null;

    //Payload



    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchTicketStatusId =
      this.selectedDropDownTicketStatusIdValue;
    this.payload.SearchTicketTitle = this.typeTicketNameValue;
    this.payload.SearchTicketNo = this.selectedTicketTagId;
    this.payload.SearchRequesterName = this.selectedRequesterName;
    this.payload.SearchRequesterEmail = this.selectedRequesterEmail;
    this.payload.SearchPriority = this.selectedUrgentValue;
    this.payload.SearchTicketType = this.selectedTicketType;
    this.payload.SearchIsGlobal = this.selectedIsGlobal;
    this.payload.SearchIsBillable = this.selectedIsBillable;
    this.payload.SearchTicketTypeId = this.selectedDropDownTicketTypeIdValue;

    this.payload.SearchCreatedDateFrom = this.selectedCreatedDate?.from ? this.datePipe.transform(
      this.selectedCreatedDate.from,
      "dd-MM-yyyy"
    ) : null;

    this.payload.SearchCreatedDateTo = this.selectedCreatedDate?.to ? this.datePipe.transform(
      this.selectedCreatedDate.to,
      "dd-MM-yyyy"
    ) : null;

    this.payload.SearchOperationType = this.selectedOperationType;

    if (objectSerachForTicket.displayStart) {
      this.payload.displayStart = objectSerachForTicket.displayStart;
      this.page = objectSerachForTicket.page;
    }
    this.loadData();
  }

  ticketTypeHandler(event): void {
    if (event?.typeName === "Hardware") {
      this.isDeviceRelated = true;
      this.getMX_MasterTicketType(this.isDeviceRelated);
    } else {
      this.isDeviceRelated = false;
      this.getMX_MasterTicketType(this.isDeviceRelated);
    }
  }
  getMX_MasterTicketType(isDeviceRelated: any): void {
    this.ticketService
      .getMX_MasterTicketType(isDeviceRelated)
      .subscribe((response: any) => {
        if (response) {
          this.masterTicketTypeList = response?.list;
          this.setObjectBeforeRefesh();
        }
      });
  }


  onCardClickActive(type: any, statusId: any) {
    this.activeCard = type;

    // this.arrayListDropDownClientList = [];
    // this.arrayListDropDownProjectOrDeparmentList = [];
    // this.selectedDropDownCompanyIdValue = null;
    // this.selectedDropDownClientIdValue = null;
    // this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownTicketStatusIdValue = statusId;
    // this.selectedTicketTagId = null;
    // this.selectedRequesterName = null;
    // this.selectedRequesterEmail = null;
    // this.selectedIssueDescription = null;
    // this.selectedCreatedDate = {
    //   from: null,
    //   to: null,
    // };
    // this.selectedOperationType = null;
    // this.typeTicketNameValue = null;
    // this.selectedTicketType = null;
    // this.selectedIsGlobal = null;
    // this.selectedIsBillable = null;
    // this.selectedUrgentValue = null;
    // this.selectedDropDownTicketTypeIdValue = null;

    // this.payload = {
    //   displayLength: 10,
    //   displayStart: 0,
    //   SearchCompanyId: null,
    //   SearchClientId: null,
    //   SearchProjectId: null,
    //   SearchLocationId: null,
    //   SearchTicketStatusId: this.selectedDropDownTicketStatusIdValue,
    //   SearchCategoryId: null,
    //   SearchSubCategoryId: null,
    //   SearchTicketTitle: null,
    //   SearchTicketNo: null,
    //   SearchRequesterName: null,
    //   SearchRequesterEmail: null,
    //   SearchCreatedDateFrom: null,
    //   SearchCreatedDateTo: null,
    //   SearchTicketType: null,
    //   SearchPriority: null,
    //   SearchIsGlobal: null,
    //   SearchIsBillable: null,
    //   SearchTicketTypeId: null,
    //   SearchOperationType: null,
    // };
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchTicketStatusId = this.selectedDropDownTicketStatusIdValue;
    localStorage.removeItem("objectSerachForTicket");
    if (this.currentUserRole === "Client User") {
      this.resetAfterClientUser();
    } else {
      this.page = 1;
      this.loadData();
    }

  }


  onClickisGlobal(event, onSite: any = false) {
    if (onSite) {
      this.selectedOperationType = null;
      this.selectedIsBillable = null;
    }
    if (event == 'Global') {
      this.operationList[1].disabled = false;
      this.operationList[2].disabled = true;
      this.operationList[3].disabled = true;
      this.isBillableList[1].disabled = false
      this.isBillableList[0].disabled = false
      this.operationList = [...this.operationList];
      this.isBillableList = [...this.isBillableList]
    } else if (event == 'Internal') {

      this.operationList[1].disabled = true;
      this.operationList[2].disabled = false;
      this.operationList[3].disabled = false;
      this.isBillableList[0].disabled = true;
      this.isBillableList[1].disabled = false
      this.operationList = [...this.operationList]
      this.isBillableList = [...this.isBillableList]
    } else {
      this.operationList[1].disabled = false;
      this.operationList[2].disabled = false;
      this.operationList[3].disabled = false;
      this.operationList[0].disabled = false;
      this.isBillableList[0].disabled = false
      this.isBillableList[1].disabled = false
      this.operationList = [...this.operationList];
      this.isBillableList = [...this.isBillableList]
    }
    if (onSite) {
      this.page = 1;
      this.payload.SearchIsGlobal = this.selectedIsGlobal ? this.selectedIsGlobal : null;
      this.payload.SearchOperationType = this.selectedOperationType ? this.selectedOperationType : null;
      this.payload.SearchIsBillable = this.selectedIsBillable ? this.selectedIsBillable : null;
      this.payload.displayStart = this.pageSize * (this.page - 1);
      this.loadData();
    } else {
      this.setObjectBeforeRefesh();
    }


  }

  onChangeOperationType() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchOperationType = this.selectedOperationType ? this.selectedOperationType : null;
    this.payload.SearchIsBillable = this.selectedIsBillable ? this.selectedIsBillable : null;
    this.loadData();

  }
  onChangeIsBillable() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchIsBillable = this.selectedIsBillable ? this.selectedIsBillable : null;

    this.loadData();

  }
}
