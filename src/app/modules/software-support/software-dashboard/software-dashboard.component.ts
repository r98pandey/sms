import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
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
import { event } from 'jquery';

@Component({
  selector: "app-software-dashboard",
  templateUrl: "./software-dashboard.component.html",
  styleUrls: ["./software-dashboard.component.scss"],
})
export class SoftwareDashboardComponent implements OnInit {
  isProject: boolean = false;
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





  }

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
    this.sendingCard =
      objectSerachForDashboard.sendingCard
        ? objectSerachForDashboard.sendingCard
        : {
          type: null,
          statusId: null
        };


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
    console.log("this.activeCard", this.activeCard)

    this.getV2_TotalCountTicketOnlySoftwareSupportDash(this.payload);
  }


  ngOnInit(): void {
    if (localStorage.getItem("softwareSupportDashboardActiveTab")) {
      this.activeIdTabs = Number(localStorage.getItem("softwareSupportDashboardActiveTab"))
    }
    if (localStorage.getItem("objectSerachForDashboard")) {
      this.getObjectAfterRefresh();
    } else {
      this.getV2_TotalCountTicketOnlySoftwareSupportDash(this.payload);
    }
    // this.getV2_TotalCountTicketOnlySoftwareSupportDash(this.payload);
    // if (localStorage.getItem("objectSerachForDashboard")) {
    //   this.getObjectAfterRefresh();
    // }
  }

  sendLoadApi(event) {
    this.getV2_TotalCountTicketOnlySoftwareSupportDash(event);
  }

  getV2_TotalCountTicketOnlySoftwareSupportDash(payload: any) {
    this.softwareDashboardService
      .getV2_TotalCountTicketOnlySoftwareSupportDash(payload)
      .subscribe((res: any) => {
        this.totalCountTicketOnly = res.data;

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

  onTabChange(event) {
    localStorage.setItem("softwareSupportDashboardActiveTab", String(event))
    // this.activeCard=''
  }
  activeCard: any = null;
  sendingCard: any = {
    type: null,
    statusId: null
  }
  onCardClickActive(type: any, statusId: any) {

    this.sendingCard = {
      type: type,
      statusId: statusId

    }
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

    }
    this.setObjectBeforeRefesh();



  }
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


    if (this.sendingCard)
      objectSerachForDashboard.sendingCard =
        this.sendingCard;



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
  resetAfterClientUser() {
    this.selectedDropDownCompanyIdValue =
      this.arrayListDropDownCompany[0].companyId;

    if (this.arrayListDropDownClientList.length != 0) {
      this.selectedDropDownClientIdValue =
        this.arrayListDropDownClientList[0].clientId;

    }
    if (this.arrayListDropDownProjectOrDeparmentList.length != 0) {
      if (this.currentUserRole === "Client User") {
        if (this.arrayListDropDownProjectOrDeparmentList.list.length >= 2) {
          this.projectDepartmentFieldDisiabled = false;
        } else {
          this.projectDepartmentFieldDisiabled = true;
          this.selectedDropDownProjectOrDeparmentIdValue =
            this.arrayListDropDownProjectOrDeparmentList[0].departmentId;

        }
      }
    }
  }

  handleCardClick(event) {
    // Handle the event from child component
  }

  sendAfterClear($event) {
    this.onCardClickActive($event.type, $event.statusId)
  }
}
