import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
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
import { PreventiveService } from "../../../../../core/services/preventive.service";
import { forEach } from "lodash";
import Swal from "sweetalert2";
import { SuccessModalWithRemarkComponent } from "src/app/shared/components/success-modal-with-remark/success-modal-with-remark.component";

@Component({
  selector: "app-list-schedule",
  templateUrl: "./list-schedule.component.html",
  styleUrls: ["./list-schedule.component.scss"],
})
export class ListScheduleComponent implements OnInit, AfterViewInit {
  @Output() getCurrentValue = new EventEmitter();

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
    SearchScheduleStatusId: null,
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
  selectedDropDownScheduleStatusIdValue: any;
  selectedRequesterName: any;
  selectedRequesterEmail: any;
  currentUserAccessGroup: any;
  deleteId: any = null;

  typeConfigPreventivePDescription: any;
  typeFrequencyValue: any;
  operationList = [
    { name: "Service", operationTypeId: 1 },
    { name: "Incident Report", operationTypeId: 2 },
  ];
  frequencyList: any = ["Monthly", "Hourly", "Yearly", "Quarterly"];
  arrayListDropDownScheduleStatus: any = [];
  currentUserRole: any = "";
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
  }

  ngOnInit(): void {
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    this.listView =
      sessionStorage.getItem("listView") == null
        ? true
        : sessionStorage.getItem("listView") == "true"
          ? true
          : false;
    this.gridView =
      sessionStorage.getItem("gridView") == null
        ? false
        : sessionStorage.getItem("gridView") == "true"
          ? true
          : false;

    this.getDropdownCompanyList();
    this.getDropdownScheduleStatusList("ScheduleStatus");

    if (this.currentUserRole === "Client User") {
      this.getDropdownScheduleStatusList(
        "ScheduleStatusOnlyApplicationUserClient"
      );
      this.disabledWithAceessGroup = true;
    } else {
      if (localStorage.getItem("objectSerachForScheduleList")) {
        this.getObjectAfterRefresh();
      } else{
        this.loadData();
      }
    }

    // ;
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }
  getDropdownScheduleStatusList(pageName: any) {
    this.preventiveService
      .GetPreventiveStatusList(pageName)
      .subscribe((res: any) => {
        this.arrayListDropDownScheduleStatus = res;
        if (
          JSON.parse(localStorage.getItem("currentUser")).role === "Client User"
        ) {
          this.selectedDropDownScheduleStatusIdValue = 62;
          this.payload.SearchScheduleStatusId =
            this.selectedDropDownScheduleStatusIdValue;
        } else {
          let objectSerachForScheduleList: any = JSON.parse(
            localStorage.getItem("objectSerachForScheduleList")
          );
          this.selectedDropDownScheduleStatusIdValue =
          objectSerachForScheduleList?.SearchScheduleStatusId
            ? objectSerachForScheduleList?.SearchScheduleStatusId
            : null;
    
          // this.selectedDropDownScheduleStatusIdValue = null;
        }
        this.loadData();
      });
  }
  loadData() {
    this.preventiveService
      .getV2_MX_PM_ScheduleList_ServerPaging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.preventiveScheduleList = res.list;
        this.setObjectBeforeRefesh();
        this.currentUserAccessGroup = JSON.parse(
          localStorage.getItem("currentUser")
        ).accessGroupName;
     
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
        this.setObjectBeforeRefesh();
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

  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForScheduleList: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForScheduleList.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachForScheduleList.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForScheduleList.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;


    if (this.selectedDropDownScheduleStatusIdValue)
      objectSerachForScheduleList.SearchScheduleStatusId = this.selectedDropDownScheduleStatusIdValue;

    if (this.arrayListDropDownClientList) {
      objectSerachForScheduleList.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForScheduleList.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }
    if (this.arrayListDropDownScheduleStatus) {
      objectSerachForScheduleList.arrayListDropDownScheduleStatus =
        this.arrayListDropDownScheduleStatus;
    }
   
    if (this.typeFrequencyValue)
      objectSerachForScheduleList.SearchFrequency =
        this.typeFrequencyValue;

    if (this.typeConfigPreventivePDescription)
      objectSerachForScheduleList.SearchConfigPreventivePDescription =
        this.typeConfigPreventivePDescription;

    if (this.page) {
      objectSerachForScheduleList.displayStart = this.pageSize * (this.page - 1);
      objectSerachForScheduleList.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForScheduleList",
      JSON.stringify(objectSerachForScheduleList)
    );
  }

  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForScheduleList: any = JSON.parse(
      localStorage.getItem("objectSerachForScheduleList")
    );
    this.arrayListDropDownClientList =
      objectSerachForScheduleList.arrayListDropDownClientList
        ? objectSerachForScheduleList.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForScheduleList.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForScheduleList.arrayListDropDownProjectOrDeparmentList
        : [];
    this.arrayListDropDownScheduleStatus =
      objectSerachForScheduleList.arrayListDropDownScheduleStatus
        ? objectSerachForScheduleList.arrayListDropDownScheduleStatus
        : [];

    this.selectedDropDownCompanyIdValue = objectSerachForScheduleList.SearchCompanyId
      ? objectSerachForScheduleList.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForScheduleList.SearchClientId
      ? objectSerachForScheduleList.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForScheduleList.SearchProjectId
        ? objectSerachForScheduleList.SearchProjectId
        : null;

    this.selectedDropDownScheduleStatusIdValue =
      objectSerachForScheduleList.SearchScheduleStatusId
        ? objectSerachForScheduleList.SearchScheduleStatusId
        : null;

    this.typeFrequencyValue =
      objectSerachForScheduleList.SearchFrequency
        ? objectSerachForScheduleList.SearchFrequency
        : null;

    this.typeConfigPreventivePDescription =
      objectSerachForScheduleList.SearchConfigPreventivePDescription
        ? objectSerachForScheduleList.SearchConfigPreventivePDescription
        : null;

    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchScheduleStatusId =
      this.selectedDropDownScheduleStatusIdValue;
    this.payload.SearchFrequency = this.typeFrequencyValue;
    this.payload.SearchConfigPreventivePDescription = this.typeConfigPreventivePDescription;

    if (objectSerachForScheduleList.displayStart) {
      this.payload.displayStart = objectSerachForScheduleList.displayStart;
      this.page = objectSerachForScheduleList.page;
    }
    this.loadData();
  }



  viewHandler(scheduleId: any) {
    this.preventiveService.scheduleId = scheduleId;
    this.preventiveService.lastStorePreventiveRouterName = "/maintenance-management/preventive/schedule/list-schedule"

    this.router.navigate([
      "maintenance-management/preventive/schedule/current-schedule",
    ]);
  }
  editHandler(scheduleId: any) {
    this.preventiveService.scheduleId = scheduleId;
    this.preventiveService.lastStorePreventiveRouterName = "/maintenance-management/preventive/schedule/list-schedule"

    this.router.navigate([
      "maintenance-management/preventive/schedule/edit-current-schedule",
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
    this.selectedDropDownScheduleStatusIdValue = null;
   
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchFrequency: null,
      SearchConfigPreventivePDescription: null,
      SearchRequesterEmail: null,
      SearchScheduleStatusId: null,
    };
    if (this.currentUserRole === "Client User") {
      this.resetAfterClientUser();
    } else {
      this.page = 1;
      this.loadData();
    }
  }
  resetAfterClientUser() {
    this.selectedDropDownScheduleStatusIdValue = 62;
    this.payload.SearchScheduleStatusId =
      this.selectedDropDownScheduleStatusIdValue;
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
    if(this.selectedDropDownCompanyIdValue){
    this.getDropdownClientlist();
  }

    this.loadData();
  }

  onDropdownScheduleStatusValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchScheduleStatusId =
      this.selectedDropDownScheduleStatusIdValue;
      this.setObjectBeforeRefesh();
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

  listView: boolean = true;
  gridView: boolean = false;

  onClickView() {
    this.listView = !this.listView;
    this.gridView = !this.gridView;
    sessionStorage.setItem("listView", "" + this.listView);
    sessionStorage.setItem("gridView", "" + this.gridView);
    if (this.listView) {
      this.resetSerachVariable();
    }
    this.getCurrentValue.emit(true)

  }

  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }


  confirmDelete(content: any, scheduleId: any) {
    this.deleteId = scheduleId;
    this.modalService.open(content, { centered: true });
  }

  deleteData(deleteId) {
    this.preventiveService
      .DeletSchduleMaintenance({ scheduleId: deleteId }).subscribe((res: any) => {
        this.successDelete(res);
        this.loadData();
      });
  }

  successDelete(res) {
    //for  Delete spare successfully message
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }


}
