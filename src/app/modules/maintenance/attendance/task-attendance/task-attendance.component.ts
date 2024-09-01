
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { filter, fromEvent } from "rxjs";
import { DepartmentService } from "src/app/core/services/department.service";
import { EmployeeService } from "src/app/core/services/employee.service";
import { LocalStoreService } from "src/app/core/services/local-store.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { Lightbox } from "ngx-lightbox";
import { DatePipe } from "@angular/common";
import { AuditService } from "src/app/core/services/audit.service";
import { PreventiveService } from "src/app/core/services/preventive.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";

@Component({
  selector: "app-task-attendance",
  templateUrl: "./task-attendance.component.html",
  styleUrls: ["./task-attendance.component.scss"],
})
export class TaskAttendanceComponent implements OnInit, AfterViewInit {
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  globalCompanyId: string;
  userList: any[] = [];
  searchName: string;
  label: any = "Task Attendance";
  breadCrumbItems: any = [
    { label: "Attendance" },
    { label: "Task Attendance", active: true },
  ];
  selectedTaskType: any = null;
  taskTypeList = ["Audit", "Corrective", "Preventive"];
  apiUrl: string;
  isProjectVisible: boolean = false;
  displayLength: number = 10;
  deleteEmpId: string;
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchFullName: null,
    SearchAccessGroupId: null,
    SearchTaskType: null,
    SearchFromDateTime: null,
    SearchToDateTime: null,

  };

  selectedDateRangeValue: any = {
    from: null,
    to: null,
  };

  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: null;
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  constructor(
    private userService: UserProfileService,
    private dropdownServices: DropdownService,
    private modalService: NgbModal,
    private router: Router,
    private modal: NgbModal,
    private commonService: CommonFunctionService,
    private menuService: MenuServiceService,
    private lightbox: Lightbox,
    private datePipe: DatePipe,
    private offcanvasService: NgbOffcanvas, private preventiveService: PreventiveService,
    private auditService: AuditService,
    private ticketService: TicketService,
    private authService: AuthAssetService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);

    this.apiUrl = environment.apiUrl;
  }
  isProject: boolean = false;

  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
  ngOnInit(): void {
    this.isProject = this.authService.getisProject();
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    }
    this.getDropdownCompanyList();

  }
  getAccessGroup() {
    this.loading.accessGroup = true;
    this.userService.getAccessGroupMasterAll().subscribe({
      next: (res: any) => {
        this.accessGroupList = res.data;
        this.setobjectSerachForTaskAttendanceUserList()
      },

    });
  }

  getDropdownCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      this.getAccessGroup()
      if (JSON.parse(localStorage.getItem("objectSerachForTaskAttendanceUserList"))) {
        let objectSerachForTaskAttendanceUserList = JSON.parse(localStorage.getItem("objectSerachForTaskAttendanceUserList"))
        this.selectedDropDownCompanyIdValue = objectSerachForTaskAttendanceUserList.SearchCompanyId
          ? objectSerachForTaskAttendanceUserList.SearchCompanyId
          : null;
        this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
        this.getDropdownClientlist();
        this.getobjectSerachForTaskAttendanceUserList();
      } else {
        this.selectedDropDownCompanyIdValue =
          this.arrayListDropDownCompany[0].companyId;
        this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
        this.getDropdownClientlist();
        this.loadData();
      }
      this.setobjectSerachForTaskAttendanceUserList();

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
  loadData() {
    this.userService
      .getV2_TaskAttendance_ByPagination(this.commonService.clean(this.payload))
      .subscribe(
        (res: any) => {
          this.userList = res.list;
          this.setobjectSerachForTaskAttendanceUserList();
          if (this.userList.length > 0) {
            this.totalRecords = res.list[0].totalCount;
            this.from = res.list.reduce(
              (min, p) => (p.rowNum < min ? p.rowNum : min),

              res.list[0].rowNum
            );

            this.to = res.list.reduce(
              (max, p) => (p.rowNum > max ? p.rowNum : max),

              res.list[0].rowNum
            );
            this.pageSize = this.displayLength;
          } else {
            this.totalRecords = 0;
            this.from = 0;
            this.to = 0;
            this.pageSize = this.displayLength;
          }
        },
        (err) => {
          //console.log(err);
        }
      );
  }

  pageChange(pageNo): void {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  /**
   * for Set object to refesh
   */
  setobjectSerachForTaskAttendanceUserList() {
    let objectSerachForTaskAttendanceUserList: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForTaskAttendanceUserList.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachForTaskAttendanceUserList.SearchClientId = this.selectedDropDownClientIdValue;
    //Client list
    if (this.arrayListDropDownClientList) {
      objectSerachForTaskAttendanceUserList.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    //ProjectOrDeparment Value
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForTaskAttendanceUserList.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    //ProjectOrDeparment list
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForTaskAttendanceUserList.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }

    if (this.accessGroupList) {
      objectSerachForTaskAttendanceUserList.accessGroupList = this.accessGroupList
    }

    if (this.selectedTaskType) {
      objectSerachForTaskAttendanceUserList.SearchTaskType = this.selectedTaskType
    }

    if (this.selectedAccessGroupValue) {
      objectSerachForTaskAttendanceUserList.SearchAccessGroupId = this.selectedAccessGroupValue
    }


    if (this.selectedDateRangeValue.to) {

      objectSerachForTaskAttendanceUserList.selectedDateRangeValueTo = this.selectedDateRangeValue.to
      objectSerachForTaskAttendanceUserList.selectedDateRangeValueFrom = this.selectedDateRangeValue.from
      objectSerachForTaskAttendanceUserList.SearchFromDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.from,
        "dd-MM-yyyy"
      );
      objectSerachForTaskAttendanceUserList.SearchToDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.to,
        "dd-MM-yyyy"
      );

    }
    if (this.searchName) {
      objectSerachForTaskAttendanceUserList.SearchFullName = this.searchName
    }

    if (this.page) {
      objectSerachForTaskAttendanceUserList.displayStart = this.pageSize * (this.page - 1);
      objectSerachForTaskAttendanceUserList.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForTaskAttendanceUserList",
      JSON.stringify(objectSerachForTaskAttendanceUserList)
    );
  }

  /**
  * for get object for refesh
  */
  getobjectSerachForTaskAttendanceUserList() {
    let objectSerachForTaskAttendanceUserList: any = JSON.parse(
      localStorage.getItem("objectSerachForTaskAttendanceUserList")
    );
    // this.selectedDateRangeValue.from = objectSerachForTaskAttendanceUserList.selectedDateRangeValueFrom
    // this.selectedDateRangeValue.to = objectSerachForTaskAttendanceUserList.selectedDateRangeValueTo

    this.selectedDateRangeValue = {
      from: objectSerachForTaskAttendanceUserList.selectedDateRangeValueFrom,
      to: objectSerachForTaskAttendanceUserList.selectedDateRangeValueTo,
    };

    this.arrayListDropDownClientList =
      objectSerachForTaskAttendanceUserList.arrayListDropDownClientList
        ? objectSerachForTaskAttendanceUserList.arrayListDropDownClientList
        : [];
    //Client Value
    this.selectedDropDownClientIdValue = objectSerachForTaskAttendanceUserList.SearchClientId
      ? objectSerachForTaskAttendanceUserList.SearchClientId
      : null;
    //ProjectOrDeparment List
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForTaskAttendanceUserList.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForTaskAttendanceUserList.arrayListDropDownProjectOrDeparmentList
        : [];
    //ProjectOrDeparment Value
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForTaskAttendanceUserList.SearchProjectId
        ? objectSerachForTaskAttendanceUserList.SearchProjectId
        : null;



    this.accessGroupList =
      objectSerachForTaskAttendanceUserList.accessGroupList
        ? objectSerachForTaskAttendanceUserList.accessGroupList
        : [];
    this.selectedDropDownCompanyIdValue = objectSerachForTaskAttendanceUserList.SearchCompanyId
      ? objectSerachForTaskAttendanceUserList.SearchCompanyId
      : null;

    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForTaskAttendanceUserList.SearchProjectId
        ? objectSerachForTaskAttendanceUserList.SearchProjectId
        : null;


    this.selectedAccessGroupValue =
      objectSerachForTaskAttendanceUserList.SearchAccessGroupId
        ? objectSerachForTaskAttendanceUserList.SearchAccessGroupId
        : null;



    this.searchName =
      objectSerachForTaskAttendanceUserList.SearchFullName
        ? objectSerachForTaskAttendanceUserList.SearchFullName
        : null;
    this.selectedTaskType =
      objectSerachForTaskAttendanceUserList.SearchTaskType
        ? objectSerachForTaskAttendanceUserList.SearchTaskType
        : null;
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchAccessGroupId = this.selectedAccessGroupValue;
    this.payload.SearchTaskType = this.selectedTaskType;


    this.payload.SearchFullName = this.searchName;
    if (this.selectedDateRangeValue.to) {
      this.payload.SearchFromDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.from,
        "dd-MM-yyyy"
      );
      this.payload.SearchToDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.to,
        "dd-MM-yyyy"
      );
    }

    if (objectSerachForTaskAttendanceUserList.displayStart) {
      this.payload.displayStart = objectSerachForTaskAttendanceUserList.displayStart;
      this.page = objectSerachForTaskAttendanceUserList.page;
    }
    this.loadData();
  }


  onChangeSelectedDateValue() {
    if (this.selectedDateRangeValue.to) {
      this.payload.SearchFromDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.from,
        "dd-MM-yyyy"
      );
      this.payload.SearchToDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.to,
        "dd-MM-yyyy"
      );
    } else {
      this.payload.SearchFromDateTime = null;
      this.payload.SearchToDateTime = null;
    } this.page = 1;
    this.payload.displayStart = this.displayLength * (this.page - 1);
    this.loadData();
  }

  openModalActiveDeactive(value: any, status: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Do you want to " + status + " this  profile ";
    modalRef.componentInstance.subTitle = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = status + " It";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          this.updateUserActiveInActive(value, status);
        }
      }
    });
  }

  updateUserActiveInActive(userId: any, ProfileStatus: any) {
    let paylyoad = {
      Id: userId,
      ProfileStatus: ProfileStatus,
    };
    this.userService.updateUserActiveInActive(paylyoad).subscribe((res) => {
      this.loadData();
      this.success(res);
    });
  }

  onEmployeeNameChangeHandler(event: any) {
    this.payload.SearchFullName = this.searchName;
    this.page = 1;
    this.payload.displayStart = this.displayLength * (this.page - 1);
    this.loadData();
  }

  goToEdit(emp: any) {
    this.router.navigate([
      "/application-settings/asset-handler/asset-handler-edit",
    ]);
  }

  deleteHandler() {
    let requestData = {
      employeeId: parseInt(this.deleteEmpId),
    };
    // this.userService.dele(requestData).subscribe(
    //   (res: any) => {
    //     this.page = 1;
    //     (this.payload.displayStart = this.displayLength * (this.page - 1)),
    //       this.loadData();
    //     this.modal.dismissAll();
    //     this.success(res);
    //   },
    //   (err: any) => {
    //     //console.log("error", err);
    //   }
    // );
  }

  confirmDelete(content: any, id: any) {
    this.deleteEmpId = id;
    this.modalService.open(content, { centered: true });
  }
  clearFilter() {

    this.selectedDateRangeValue = {
      from: null,
      to: null,
    };
    this.onChangeSelectedDateValue();
  }

  resetSerachVariable() {
    this.searchName = null;
    this.selectedDropDownCompanyIdValue = this.arrayListDropDownCompany[0].companyId;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedAccessGroupValue = null;
    this.selectedDateRangeValue = {
      from: null,
      to: null,
    };
    this.selectedTaskType = null;
    this.page = 1;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: this.selectedDropDownCompanyIdValue,

      SearchClientId: null,
      SearchProjectId: null,
      SearchFullName: null,
      SearchAccessGroupId: null,

      SearchTaskType: null,
      SearchFromDateTime: null,
      SearchToDateTime: null,
    };
    localStorage.removeItem("objectSerachForTicket");
    this.getDropdownClientlist();
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

  success(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  @ViewChild("inputer", { static: true }) input: ElementRef;
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onEmployeeNameChangeHandler(true);
        })
      )
      .subscribe();
  }

  navigateToForm() {
    this.userService.accessRight = true;
    this.router.navigate(["/application-settings/user-management/user/add"]);
  }
  navigateToView(id) {
    UserProfileService.selectedUserId = id;
    this.router.navigate(["/application-settings/user-management/user/view"]);
  }
  deleteId = null;
  deleteUser(modal, id) {
    this.deleteId = id;
    this.modalService.open(modal, { centered: true });
  }

  deleteData(id: any) {
    //for deleting the company
    this.userService
      .postDeleteUser({
        Id: id,
      })
      .subscribe(
        (res) => {
          this.page = 1;
          this.payload.displayStart = this.displayLength * (this.page - 1);
          this.loadData();
        },
        (err) => {
          //console.log("error", err);
        }
      );
  }

  navigateToEdit(userId?: any) {
    UserProfileService.selectedUserId = userId;
    this.router.navigate(["/application-settings/user-management/user/edit"]);
  }

  openModalCreateConf(value: any, fullName: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Do you want to reset " + fullName + " password?";
    modalRef.componentInstance.subTitle = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = "Reset It";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          this.resetPassword(value);
        }
      }
    });
  }

  resetPassword(username: any) {
    this.userService.resetPassword(username).subscribe((res: any) => {
      this.success(res);
    });
  }
  open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }

  // Enchament new Thing


  accessGroupList: any = [];

  loading = {
    role: false,
    accessGroup: false,
  };

  selectedAccessGroupValue: any = null;



  onSearchTaskType(event) {
    this.payload.SearchTaskType = this.selectedTaskType;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.loadData();
  }
  onTypeAccessGroup(event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchAccessGroupId = this.selectedAccessGroupValue;
    this.loadData();
  }


  ccurentStatusActive(date) {
    const specificDateIST: any = new Date(date);
    const specificDateMYT: any = new Date(
      specificDateIST.toLocaleString("en-US")
    );
    const currentDateMYT: any = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kuala_Lumpur",
    });
    const currentDateMYTObject: any = new Date(currentDateMYT);
    const timeDifferenceMinutes =
      (currentDateMYTObject - specificDateMYT) / (1000 * 60);
    const isWithinLimit = Math.abs(timeDifferenceMinutes) <= 10;

    return isWithinLimit;
  }

  longitude = 101.693207;
  latitude = 3.140853;
  markers = [{ latitude: 52.228973, longitude: 20.728218 }];
  typeChecking: any = "Check-In";
  userData: any;
  openAduit(content: any, valueTo, type: any, user: any) {
    const coordinatesArray = valueTo.split("|");
    this.latitude = Number(coordinatesArray[0]);
    this.longitude = Number(coordinatesArray[1]);
    this.userData = user
    this.typeChecking = type;

    this.offcanvasService.open(content, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4",
    });
  }






  viewHandleMap(storeMapData) {

    if (storeMapData.taskType == 'Corrective') {
      this.ticketService.sendTicketId = storeMapData.uniquedId;

      this.ticketService.ticketPageAction = "Basic Service Page";
      this.ticketService.lastStoreTicketRouterName =
        "maintenance-management/attendance/task-attendance";
      localStorage.setItem(
        "lastStoreTicketRouterName",
        this.ticketService.lastStoreTicketRouterName
      );
      this.router.navigate([
        "/maintenance-management/corrective/ticket/ticket-view",
      ]);
    } else if (storeMapData.taskType == 'Preventive') {
      this.preventiveService.scheduleId = storeMapData.uniquedId;;
      this.preventiveService.lastStorePreventiveRouterName = "maintenance-management/attendance/task-attendance"
      this.router.navigate([
        "maintenance-management/preventive/schedule/current-schedule",
      ]);
    } else if (storeMapData.taskType == 'Audit') {
      this.auditService.auditId = storeMapData.uniquedId;;
      this.router.navigate(["asset-management/audit-management/audit/viewaudit"]);
    } else {

    }
  }
}
