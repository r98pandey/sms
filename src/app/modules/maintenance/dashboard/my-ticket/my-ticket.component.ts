
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
  selector: 'app-my-ticket',
  templateUrl: './my-ticket.component.html',
  styleUrl: './my-ticket.component.scss'
})
export class MyTicketComponent  implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Maintenance Management";

  breadCrumbItems: any = [
    { label: "My Ticket" },
    { label: "My Ticket List", active: true },
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
    SearchRequesterEmail: this.authService.getUserID(),
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
    if (localStorage.getItem("objectSerachForMyTicket")) {
      this.getObjectAfterRefresh();
    } else {
      this.loadData();
    }

  }

  getV2_TotalCountTicketOnly_MyTicket() {
    let payload = { ...this.payload };
    // delete payload.displayLength;
    // delete payload.displayStart;
    // delete payload.SearchTicketStatusId;

    this.ticketService.getV2_TotalCountTicketOnly_MyTicket(payload).subscribe((res: any) => {
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
      .getV2_TicketList_ByPagination_OnlyMyTicket(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.setObjectBeforeRefesh();
        this.getV2_TotalCountTicketOnly_MyTicket();
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
    this.selectedRequesterEmail = this.authService.getUserID();
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
      SearchRequesterEmail: this.authService.getUserID(),
      SearchCreatedDateFrom: null,
      SearchCreatedDateTo: null,
      SearchTicketType: null,
      SearchPriority: null,
      SearchIsGlobal: null,
      SearchIsBillable: null,
      SearchTicketTypeId: null,
      SearchOperationType: null,
    };
    localStorage.removeItem("objectSerachForMyTicket");
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
    this.selectedRequesterEmail = this.authService.getUserID();
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
    this.payload.SearchRequesterEmail = this.authService.getUserID();
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
    this.payload.SearchRequesterEmail = this.authService.getUserID();
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
    let objectSerachForMyTicket: any = {};
    //Company
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForMyTicket.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    //Client Value
    if (this.selectedDropDownClientIdValue)
      objectSerachForMyTicket.SearchClientId = this.selectedDropDownClientIdValue;
    //Client list
    if (this.arrayListDropDownClientList) {
      objectSerachForMyTicket.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    //ProjectOrDeparment Value
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForMyTicket.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    //ProjectOrDeparment list
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForMyTicket.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }
    //urgent Value
    if (this.selectedUrgentValue)
      objectSerachForMyTicket.SearchPriority = this.selectedUrgentValue;
    //urgent list
    if (this.urgentList) {
      objectSerachForMyTicket.urgentList = this.urgentList;
    }

    //TicketTagId Value
    if (this.selectedTicketTagId)
      objectSerachForMyTicket.SearchTicketNo = this.selectedTicketTagId;
    
    //CreatedDate
    if (this.selectedCreatedDate)
      objectSerachForMyTicket.SearchCreatedDate = this.selectedCreatedDate;
    //OperationType;
    if (this.selectedOperationType)
      objectSerachForMyTicket.SearchOperationType = this.selectedOperationType;
    //TicketNameValue
    if (this.selectedDropDownTicketStatusIdValue)
      objectSerachForMyTicket.SearchTicketStatusId =
        this.selectedDropDownTicketStatusIdValue;
    //TicketStatus list;
    if (this.arrayListDropDownTicketStatus)
      objectSerachForMyTicket.arrayListDropDownTicketStatus =
        this.arrayListDropDownTicketStatus;
    //TicketNameValue
    if (this.typeTicketNameValue)
      objectSerachForMyTicket.SearchTicketTitle = this.typeTicketNameValue;

    //TicketTypeId  list;
    if (this.masterTicketTypeList)
      objectSerachForMyTicket.masterTicketTypeList = this.masterTicketTypeList;

    //TicketTypeId  Value;
    if (this.selectedDropDownTicketTypeIdValue) {
      objectSerachForMyTicket.SearchTicketTypeId =
        this.selectedDropDownTicketTypeIdValue;
    }
    //TicketType Value;
    if (this.selectedTicketType) {
      objectSerachForMyTicket.SearchTicketType = this.selectedTicketType;
    }
    // IsGlobal Value
    if (this.selectedIsGlobal) {
      objectSerachForMyTicket.SearchIsGlobal = this.selectedIsGlobal;
    }
    if (this.selectedIsBillable) {
      objectSerachForMyTicket.SearchIsBillable = this.selectedIsBillable;
    }
    //activeCard
    if (this.activeCard) {
      objectSerachForMyTicket.activeCard = this.activeCard;
    }
    if (this.page) {
      objectSerachForMyTicket.displayStart = this.pageSize * (this.page - 1);
      objectSerachForMyTicket.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForMyTicket",
      JSON.stringify(objectSerachForMyTicket)
    );
  }
  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForMyTicket: any = JSON.parse(
      localStorage.getItem("objectSerachForMyTicket")
    );

    //Company Value
    this.selectedDropDownCompanyIdValue = objectSerachForMyTicket.SearchCompanyId
      ? objectSerachForMyTicket.SearchCompanyId
      : null;
    //Client List
    this.arrayListDropDownClientList =
      objectSerachForMyTicket.arrayListDropDownClientList
        ? objectSerachForMyTicket.arrayListDropDownClientList
        : [];
    //Client Value
    this.selectedDropDownClientIdValue = objectSerachForMyTicket.SearchClientId
      ? objectSerachForMyTicket.SearchClientId
      : null;
    //ProjectOrDeparment List
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForMyTicket.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForMyTicket.arrayListDropDownProjectOrDeparmentList
        : [];
    //ProjectOrDeparment Value
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForMyTicket.SearchProjectId
        ? objectSerachForMyTicket.SearchProjectId
        : null;

    //urgent list
    this.urgentList = objectSerachForMyTicket.urgentList
      ? objectSerachForMyTicket.urgentList
      : [];

    //urgent Value
    this.selectedUrgentValue = objectSerachForMyTicket.SearchPriority
      ? objectSerachForMyTicket.SearchPriority
      : null;

    //TicketStatus list;
    this.arrayListDropDownTicketStatus =
      objectSerachForMyTicket.arrayListDropDownTicketStatus
        ? objectSerachForMyTicket.arrayListDropDownTicketStatus
        : [];

    //TicketStatus Value;
    this.selectedDropDownTicketStatusIdValue =
      objectSerachForMyTicket.SearchTicketStatusId
        ? objectSerachForMyTicket.SearchTicketStatusId
        : null;

    //TicketTagId Value
    this.selectedTicketTagId = objectSerachForMyTicket.SearchTicketNo
      ? objectSerachForMyTicket.SearchTicketNo
      : null;
    //TicketTypeId  list;
    this.masterTicketTypeList = objectSerachForMyTicket.masterTicketTypeList
      ? objectSerachForMyTicket.masterTicketTypeList
      : [];

    //TicketTypeId  Value;
    this.selectedDropDownTicketTypeIdValue =
      objectSerachForMyTicket.SearchTicketTypeId
        ? objectSerachForMyTicket.SearchTicketTypeId
        : null;

    //RequesterName
    // this.selectedRequesterName = objectSerachForMyTicket.SearchRequesterName
    //   ? objectSerachForMyTicket.SearchRequesterName
    //   : null;

    //RequesterEmail
    // this.selectedRequesterEmail = objectSerachForMyTicket.SearchRequesterEmail
    //   ? objectSerachForMyTicket.SearchRequesterEmail
    //   : null;

    //CreatedDate
    this.selectedCreatedDate = objectSerachForMyTicket.SearchCreatedDate
      ? objectSerachForMyTicket.SearchCreatedDate
      : null;
    //OperationType;
    this.selectedOperationType = objectSerachForMyTicket.SearchOperationType
      ? objectSerachForMyTicket.SearchOperationType
      : null;
    //TicketNameValue
    this.typeTicketNameValue = objectSerachForMyTicket.SearchTicketTitle
      ? objectSerachForMyTicket.SearchTicketTitle
      : null;

    this.selectedTicketType = objectSerachForMyTicket.SearchTicketType
      ? objectSerachForMyTicket.SearchTicketType
      : null;

    // IsGlobal Value
    this.selectedIsGlobal = objectSerachForMyTicket.SearchIsGlobal
      ? objectSerachForMyTicket.SearchIsGlobal
      : null;

    if (this.selectedIsGlobal) {
      this.onClickisGlobal(this.selectedIsGlobal)
    }

    //activeCard
    this.activeCard =
      objectSerachForMyTicket.activeCard ? objectSerachForMyTicket.activeCard : null;


    // selectedIsBillable Value
    this.selectedIsBillable = objectSerachForMyTicket.SearchIsBillable
      ? objectSerachForMyTicket.SearchIsBillable
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
    this.payload.SearchRequesterEmail = this.authService.getUserID();
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

    if (objectSerachForMyTicket.displayStart) {
      this.payload.displayStart = objectSerachForMyTicket.displayStart;
      this.page = objectSerachForMyTicket.page;
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
    localStorage.removeItem("objectSerachForMyTicket");
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
