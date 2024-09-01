import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { DatePipe } from "@angular/common";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { PreventiveService } from "src/app/core/services/preventive.service";
@Component({
  selector: "app-schedule-list",
  templateUrl: "./schedule-list.component.html",
  styleUrls: ["./schedule-list.component.scss"],
})
export class ScheduleListComponent implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Preventive Management";
  breadCrumbItems: any = [
    { label: "Schedule" },
    { label: "Schedule List", active: true },
  ];
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchFrequency: null,
    SearchConfigPreventivePDescription: null,
    SearchRequesterEmail: null,
  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  preventiveScheduleList = [];
  page = 1;
  collectionSize = 0;

  imageUrl: any = environment.apiUrl;
  viewImageValue: any;
  returnValueMenu: any;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;

  selectedRequesterName: any;
  selectedRequesterEmail: any;

  typeConfigPreventivePDescription: any;
  typeFrequencyValue: any;
  operationList = [
    { name: "Service", operationTypeId: 1 },
    { name: "Incident Report", operationTypeId: 2 },
  ];
  frequencyList: any = ["Monthly", "Hourly", "Yearly", "Quarterly"];
  storeScheduleStatusId: any;

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
    private datePipe: DatePipe,
    private helpDeskService: HelpDeskService,
    private preventiveService: PreventiveService
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();

    this.storeScheduleStatusId = this.helpDeskService.scheduleStatusId
      ? this.helpDeskService.scheduleStatusId
      : 0;
    if (this.storeScheduleStatusId == 0 || this.storeScheduleStatusId == null) {
      if (this.helpDeskService.scheduleTypeAdminAndClient == "Admin") {
        this.router.navigate([
          "/maintenance-management/dashboard/help-desk-dashboard",
        ]);
      } else if (this.helpDeskService.scheduleTypeAdminAndClient == "Client") {
        this.router.navigate([
          "/maintenance-management/dashboard/client-dashboard",
        ]);
      } else {
        this.router.navigate([
          "/maintenance-management/dashboard/help-desk-dashboard",
        ]);
      }
    } else {
      this.getDropdownCompanyList();
      this.currentUserRole = JSON.parse(
        localStorage.getItem("currentUser")
      ).role;
      if (this.currentUserRole === "Client User") {
        this.disabledWithAceessGroup = true;
      } else {
        this.loadData();
      }
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
    this.payload.searchScheduleStatusId = this.storeScheduleStatusId;
    if (this.helpDeskService.pageAction === 'Schedule Completion Acknowlegement Admin') {
      this.payload.pmScheduleCompletionAcknowlegementAdmin = true

    }if (this.helpDeskService.pageAction === 'Schedule Completion Acknowlegement Client') {
      this.payload.pmScheduleCompletionAcknowlegementClient = true

    }
    
  
    if (this.helpDeskService.scheduleTypeAdminAndClient == "Admin") {
      this.payload.searchIsAcknowledgeByAdmin = true;
    } else {
      this.payload.SearchIsAcknowledgeByClient = true;
    }
    this.helpDeskService
      .getV2_MX_PM_ScheduleList_ServerPaging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.preventiveScheduleList = res.list;
        if (this.preventiveScheduleList.length > 0) {
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

  loadData_celender() {
    this.preventiveService
      .getV2_MX_PM_ScheduleList_ServerPaging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.preventiveScheduleList = res.list;
        if (this.preventiveScheduleList.length > 0) {
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

  viewHandler(scheduleId: any) {
    this.preventiveService.scheduleId = scheduleId;
    this.router.navigate([
      "maintenance-management/dashboard/schedule-detail-signature-adminandclient",
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
    this.typeFrequencyValue = null;
    this.typeConfigPreventivePDescription = null;
    this.selectedRequesterEmail = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;

    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchFrequency: null,
      SearchConfigPreventivePDescription: null,
      SearchRequesterEmail: null,
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
  @ViewChild("inputerRequesterName", { static: true })
  inputerRequesterName: ElementRef;

  @ViewChild("inputerCreatedDate", { static: true })
  inputerCreatedDate: ElementRef;

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.inputerRequesterName.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeRequesterNameChange();
        })
      )
      .subscribe();
  }
  onTypeRequesterNameChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchConfigPreventivePDescription =
      this.typeConfigPreventivePDescription;
    this.loadData();
  }
  onChangeFrequencyValueChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchFrequency = this.typeFrequencyValue;
    this.loadData();
  }

  submitFilterData() {
    this.payload.SearchConfigPreventivePDescription =
      this.selectedRequesterName;
    this.payload.SearchRequesterEmail = this.selectedRequesterEmail;
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
  returnIcon(value) {
    let color;
    if ("Quarterly" == value) {
      color = "text-danger";
    } else if ("Monthly" == value) {
      color = "text-info";
    } else if ("Hourly" == value) {
      color = "text-success";
    } else if ("Yearly" == value) {
      color = "text-primary";
    }

    return "mdi-alpha-" + value[0].toLowerCase() + "-box-outline" + " " + color;
  }

  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }
}
