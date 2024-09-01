
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
import { SoftwareDashboardService } from "src/app/core/services/software-dashboard.service";

@Component({
  selector: 'app-assigned-ticket-list',
  templateUrl: './assigned-ticket-list.component.html',
  styleUrl: './assigned-ticket-list.component.scss'
})
export class AssignedTicketListComponent  implements OnInit, AfterViewInit ,OnChanges{
  isProject: boolean = false;
  @Input() sendingCard:any;
  @Output() sendAfterClear = new EventEmitter();

  label: any = "Software Support Dashboard";
  num: number = 0;
  activeIdTabs: number = 1;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
  };
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
  };
  @Output() AfterLoadApi = new EventEmitter();
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

  typeTicketNameValue: string = '';
  operationList = [
    { name: "Service", operationTypeId: 1, disabled: false },
    { name: "Incident Report", operationTypeId: 2, disabled: false },
    { name: "Bug", operationTypeId: 3, disabled: false },
    { name: "New Requirement", operationTypeId: 4, disabled: false },

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
    }

    

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("this.sendingCard",this.sendingCard)
    if(this.sendingCard){
      this.onCardClickActive(this.sendingCard.type,this.sendingCard.statusId)
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem("softwareSupportDashboardActiveTab")) {
      this.activeIdTabs = Number(localStorage.getItem("softwareSupportDashboardActiveTab"))
    }
    this.getDropdownCompanyList();
  
    this.getDropdownTicketStatusList("TicketAssetStatusForSoftwareDev");
    if (localStorage.getItem("objectSerachForDashboard")) {
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
    this.softwareDashboardService
      .getV2_TicketListSoftwareDeveloperDash_ByPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.ticketList = res.list;
        this.AfterLoadApi.emit(this.payload)
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
    let objectSerachForDashboard: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForDashboard.SearchCompanyId = this.selectedDropDownCompanyIdValue;

    if (this.arrayListDropDownClientList) {
      objectSerachForDashboard.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForDashboard.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }
    if (this.selectedDropDownClientIdValue)
      objectSerachForDashboard.SearchClientId = this.selectedDropDownClientIdValue;

    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForDashboard.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;

    if (this.typeTicketNameValue)
      objectSerachForDashboard.SearchTicketTitle = this.typeTicketNameValue;

    if (this.selectedDropDownTicketStatusIdValue)
      objectSerachForDashboard.SearchTicketStatusId =
        this.selectedDropDownTicketStatusIdValue;



    if (this.selectedRequesterName) {
      objectSerachForDashboard.SearchRequesterName = this.selectedRequesterName
    }

    if (this.selectedRequesterEmail) {
      objectSerachForDashboard.SearchRequesterEmail = this.selectedRequesterEmail
    }



    if (this.selectedTicketTagId) {
      objectSerachForDashboard.SearchTicketNo = this.selectedTicketTagId
    }
    if (this.selectedCreatedDate) {
      objectSerachForDashboard.SearchCreatedDate = this.selectedCreatedDate
    }


    if (this.selectedOperationType) {
      objectSerachForDashboard.SearchOperationType = this.selectedOperationType
    }
    if (this.activeCard) {
      objectSerachForDashboard.activeCard = this.activeCard;
    }

    if (this.page) {
      objectSerachForDashboard.displayStart = this.pageSize * (this.page - 1);
      objectSerachForDashboard.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForDashboard",
      JSON.stringify(objectSerachForDashboard)
    );
  }

  /**
  * for get object for refesh
  */
  getObjectAfterRefresh() {
    let objectSerachForDashboard: any = JSON.parse(
      localStorage.getItem("objectSerachForDashboard")
    );
    this.arrayListDropDownClientList =
      objectSerachForDashboard.arrayListDropDownClientList
        ? objectSerachForDashboard.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForDashboard.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForDashboard.arrayListDropDownProjectOrDeparmentList
        : [];
    this.arrayListDropDownTicketStatus =
      objectSerachForDashboard.arrayListDropDownTicketStatus
        ? objectSerachForDashboard.arrayListDropDownTicketStatus
        : [];

    this.typeTicketNameValue = objectSerachForDashboard.SearchTicketTitle
      ? objectSerachForDashboard.SearchTicketTitle
      : '';

    this.selectedDropDownCompanyIdValue = objectSerachForDashboard.SearchCompanyId
      ? objectSerachForDashboard.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForDashboard.SearchClientId
      ? objectSerachForDashboard.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForDashboard.SearchProjectId
        ? objectSerachForDashboard.SearchProjectId
        : null;

    this.selectedDropDownTicketStatusIdValue =
      objectSerachForDashboard.SearchTicketStatusId
        ? objectSerachForDashboard.SearchTicketStatusId
        : null;


    this.selectedRequesterName =
      objectSerachForDashboard.SearchRequesterName
        ? objectSerachForDashboard.SearchRequesterName
        : null;
    this.selectedRequesterEmail =
      objectSerachForDashboard.SearchRequesterEmail
        ? objectSerachForDashboard.SearchRequesterEmail
        : null;


    this.selectedTicketTagId =
      objectSerachForDashboard.SearchTicketNo
        ? objectSerachForDashboard.SearchTicketNo
        : null;

    this.selectedCreatedDate =
      objectSerachForDashboard.SearchCreatedDate
        ? objectSerachForDashboard.SearchCreatedDate
        : null;

  //activeCard
  this.activeCard =
  objectSerachForDashboard.activeCard ? objectSerachForDashboard.activeCard : null;


    this.selectedOperationType =
      objectSerachForDashboard.SearchOperationType
        ? objectSerachForDashboard.SearchOperationType
        : null;
    this.payload.SearchTicketNo = this.selectedTicketTagId
    this.payload.SearchRequesterName = this.selectedRequesterName
    this.payload.SearchRequesterEmail = this.selectedCreatedDate;
    this.payload.SearchRequesterEmail = this.selectedRequesterEmail;
    this.payload.SearchCreatedDate = this.datePipe.transform(
      this.selectedCreatedDate,
      "dd-MM-yyyy"
    );
    this.payload.SearchOperationType = this.selectedOperationType;
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchTicketStatusId = this.selectedDropDownTicketStatusIdValue;
    this.payload.SearchTicketTitle = this.typeTicketNameValue;
    if (objectSerachForDashboard.displayStart) {
      this.payload.displayStart = objectSerachForDashboard.displayStart;
      this.page = objectSerachForDashboard.page;
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
    this.sendingCard={
      type:null,
      statusId:null
    }
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
    this.activeCard=''
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
    localStorage.removeItem('this.selectedCreatedDate')
    if (this.currentUserRole === "Client User") {
      this.resetAfterClientUser();
    } else {
      this.page = 1;
      this.loadData();
    }

    this.sendAfterClear.emit(this.sendingCard)
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
    if( this.selectedDropDownCompanyIdValue){
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
      if( this.selectedDropDownClientIdValue){
    this.getDropdownDepartmentList();}
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

  getDropdownTicketStatusList(pageName: any) {
    this.tickketService.getMaintenanceStatus(pageName).subscribe((res: any) => {
      this.arrayListDropDownTicketStatus = res;
      this.setObjectBeforeRefesh();
    });
  }

  onDropdownTicketStatusValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchTicketStatusId =
      this.selectedDropDownTicketStatusIdValue;
      this.activeCard=null
    this.loadData();
    this.setObjectBeforeRefesh();
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  // @ViewChild("inputerTicketNumber", { static: true })
  // inputerTicketNumber!: ElementRef;

  // @ViewChild('input[type=search]', { static: true })
  @ViewChild('inputerTicketNumber') inputerTicketNumber!: ElementRef;

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
    if (this.inputerTicketNumber) {
      fromEvent(this.inputerTicketNumber.nativeElement, "input")
        .pipe(
          filter(Boolean),
          debounceTime(1000),
          distinctUntilChanged(),
          tap((event: Event) => {
            const value = (event.target as HTMLInputElement).value;
            this.onTypeTicketNameChange();
          })
        )
        .subscribe();
    }
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
    this.payload.SearchTicketNo = this.selectedTicketTagId
    this.payload.SearchRequesterName = this.selectedRequesterName
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
    this.setObjectBeforeRefesh();
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
        this.setObjectBeforeRefesh();
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

  onTabChange(event) {
    localStorage.setItem("softwareSupportDashboardActiveTab", String(event))
    // this.activeCard=''
  }
  activeCard:any=null
  onCardClickActive(type: any, statusId: any) {
    this.activeCard = type;

    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownTicketStatusIdValue = statusId;
    this.selectedTicketTagId = null;
    this.selectedRequesterName = null;
    this.selectedRequesterEmail = null;
    this.selectedIssueDescription = null;
    this.selectedCreatedDate =null;
    this.selectedOperationType = null;
    this.typeTicketNameValue = null;
   

    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchLocationId: null,
      SearchTicketStatusId: this.selectedDropDownTicketStatusIdValue,
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


}
