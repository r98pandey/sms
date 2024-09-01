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
import { AttendanceService } from "src/app/core/services/attendance.service";

@Component({
  selector: "app-daily-attendance",
  templateUrl: "./daily-attendance.component.html",
  styleUrls: ["./daily-attendance.component.scss"],
})
export class DailyAttendanceComponent implements OnInit, AfterViewInit {
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  globalCompanyId: string;
  userList: any[] = [];
  searchName: string;
  label: any = "Attendance";
  getAbsentList: any[] = [];
  imageUrl: any = environment.apiUrl;
  currentDate = new Date();
  selectionbyDateRange: boolean = false
  breadCrumbItems: any = [
    { label: "Attendance" },
    { label: "Daily Attendance", active: true },
  ];
  apiUrl: string;
  isProjectVisible: boolean = false;
  displayLength: number = 10;
  deleteEmpId: string;
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchFromDateTime: null,
    SearchToDateTime: null,
    SearchFromDateTimeSingle: null,
    SearchDesignation: null,
    SearchFullName: null,
    SearchCheckIn: null,
    SearchCheckOut: null,
  };
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  longitude = 101.693207;
  latitude = 3.140853;
  markers = [{ latitude: 52.228973, longitude: 20.728218 }];
  typeChecking: any = "Check-In";
  staffDailyAttendanceCountList: any = {
    'absentEmployees': 0,
    'checkInEmployees': 0,
    'checkOutEmployees': 0,
    'workFromHome': 0,
    'workFromOffice': 0,
    'workFromOnSite': 0,
  };
  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
  };
  userData: any;
  constructor(
    private userService: UserProfileService,
    private attendanceService: AttendanceService,
    private dropdownServices: DropdownService,
    private modalService: NgbModal,
    private router: Router,
    private modal: NgbModal,
    private commonService: CommonFunctionService,
    private menuService: MenuServiceService,
    private lightbox: Lightbox,
    private datePipe: DatePipe,
    private commonFunctionService: CommonFunctionService,
    private offcanvasService: NgbOffcanvas
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);

    this.apiUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.getAccessGroup();
    this.getV2_StaffDailyAttendanceCount();
    if (localStorage.getItem("objectSerachForAttendance")) {
      this.getObjectAfterRefresh();
    } else {
      this.loadData();
    }
  }

  getV2_StaffDailyAttendanceCount() {
    this.attendanceService.getV2_StaffDailyAttendanceCount().subscribe((res: any) => {
      this.staffDailyAttendanceCountList = res.data

    })
  }



  loadData() {
    this.attendanceService
      .getV2_DailyAttendance_ByPagination(
        this.commonService.clean(this.payload)
      )
      .subscribe(
        (res: any) => {

          this.userList = res.list; console.log(this.userList);
          this.setObjectBeforeRefesh();
          if (this.userList.length > 0) {
            this.userList = this.userList.filter((item) => {
              let foundItemArray: any[] = this.userList?.filter(
                (el) => el.id == item.id
              );
              if (foundItemArray.length > 0) item["checked"] = true;
              return 1;
            });
          }
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
  setObjectBeforeRefesh() {
    let objectSerachForAttendance: any = {};
    if (this.selectedDateRangeValue) {
      objectSerachForAttendance.SearchFromDateTime = this.selectedDateRangeValue
    } if (this.selectedDateValue) {
      objectSerachForAttendance.SearchFromDateTimeSingle = this.selectedDateValue
    }


    if (this.selectionbyDateRange == true || this.selectionbyDateRange == false) {
      objectSerachForAttendance.selectionbyDateRange = this.selectionbyDateRange + ''
    }
    if (this.accessGroupList) {
      objectSerachForAttendance.accessGroupList =
        this.accessGroupList;
    }
    if (this.activeCard) {
      objectSerachForAttendance.activeCard =
        this.activeCard;
    }
    if (this.activeCard == 'CheckIn') {
      objectSerachForAttendance.SearchCheckIn =
        this.activeCard;
    }

    if (this.activeCard == 'CheckOut') {
      objectSerachForAttendance.SearchCheckOut =
        this.activeCard;
    }

    if (this.selectedAccessGroupValue) {
      objectSerachForAttendance.SearchDesignation = this.selectedAccessGroupValue;
    }
    if (this.searchName) {
      objectSerachForAttendance.SearchFullName = this.searchName
    }
    if (this.activeCard == 'Office' || this.activeCard == 'Home' || this.activeCard == 'On-Site') {
      objectSerachForAttendance.SearchTaskType = this.activeCard;
    }

    if (this.page) {
      objectSerachForAttendance.displayStart = this.pageSize * (this.page - 1);
      objectSerachForAttendance.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForAttendance",
      JSON.stringify(objectSerachForAttendance)
    );
  }

  /**
  * for get object for refesh
  */
  getObjectAfterRefresh() {
    let objectSerachForAttendance: any = JSON.parse(
      localStorage.getItem("objectSerachForAttendance")
    );
    this.selectedDateValue = objectSerachForAttendance.SearchFromDateTimeSingle
    this.selectedDateRangeValue.from = objectSerachForAttendance.selectedDateRangeValueFrom
    this.selectedDateRangeValue.to = objectSerachForAttendance.selectedDateRangeValueTo

    this.activeCard = objectSerachForAttendance.activeCard ? objectSerachForAttendance.activeCard : ''
    this.selectionbyDateRange = objectSerachForAttendance.selectionbyDateRange
    this.accessGroupList = objectSerachForAttendance.accessGroupList
      ? objectSerachForAttendance.accessGroupList
      : [];

    this.selectedAccessGroupValue = objectSerachForAttendance.SearchDesignation
      ? objectSerachForAttendance.SearchDesignation
      : null;

    this.searchName = objectSerachForAttendance.SearchFullName
      ? objectSerachForAttendance.SearchFullName
      : null;

    if (this.activeCard == 'Office' || this.activeCard == 'Home' || this.activeCard == 'On-Site') {
      this.activeCard = objectSerachForAttendance.SearchTaskType;
      this.payload.SearchTaskType = this.activeCard;
    }
    this.payload.SearchDesignation = this.selectedAccessGroupValue;
    this.payload.SearchFullName = this.searchName;
    if (this.selectedDateValue) {
      this.payload.SearchFromDateTimeSingle = this.datePipe.transform(
        this.selectedDateValue,
        "yyyy-MM-dd"
      );
    }
    if (this.selectedDateRangeValue.to) {
      this.payload.SearchFromDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.from,
        "yyyy-MM-dd"
      );
      this.payload.SearchToDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.to,
        "yyyy-MM-dd"
      );
    }
    if (this.activeCard == 'CheckIn') {
      this.payload.SearchCheckIn = true;
    }

    if (this.activeCard == 'CheckOut') {
      this.payload.SearchCheckOut = true;

    }
    if (objectSerachForAttendance.displayStart) {
      this.payload.displayStart = objectSerachForAttendance.displayStart;
      this.page = objectSerachForAttendance.page;
    }
    this.loadData();

  }

  onEmployeeNameChangeHandler(event: any) {
    this.payload.SearchFullName = this.searchName;
    this.page = 1;
    this.payload.displayStart = this.displayLength * (this.page - 1);
    this.loadData();
  }
  resetSerachVariable() {
    this.searchName = null;
    this.selectedRoleIdValue = null;
    this.selectedAccessGroupValue = null;
    this.activeCard = null;
    this.selectedDateValue = null;
    this.selectionbyDateRange = false
    this.selectedDateRangeValue = {
      from: null,
      to: null,
    };
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchFromDateTime: null,
      SearchFromDateTimeSingle: null,
      SearchToDateTime: null,
      SearchDesignation: null,
      SearchFullName: null,
      SearchCheckIn: null,
      SearchCheckOut: null,
    };
    this.loadData();
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

  clearFilter() {
    this.selectedDateValue = null;
    this.selectedDateRangeValue = {
      from: null,
      to: null,
    };
    this.onChangeSelectedDateValueRange();
    this.onChangeSelectedDateValue();
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

  rolesList: any = [];
  accessGroupList: any = [];

  loading = {
    role: false,
    accessGroup: false,
  };
  selectedRoleIdValue: any = null;
  selectedAccessGroupValue: any = null;
  selectedPortalEnable: any = null;
  selectedMobileEnable: any = null;
  selectedDateValue: any = null;
  selectedDateRangeValue: any = {
    from: null,
    to: null,
  };
  mobileYesNoArray = [
    {
      id: true,
      name: "Mobile Enable",
    },
    {
      id: false,
      name: "Mobile Disable",
    },
  ];
  portalYesNoArray = [
    {
      id: true,
      name: "Portal Enable",
    },
    {
      id: false,
      name: "Portal Disable",
    },
  ];
  getRoles() {
    this.userService.GetRoleList().subscribe({
      next: (res: any) => {
        this.rolesList = res.data;
      },
    });
  }
  getAccessGroup() {
    this.loading.accessGroup = true;
    this.userService.getAccessGroupMasterAll().subscribe({
      next: (res: any) => {
        this.loading.accessGroup = false;
        this.accessGroupList = res.data;
        this.setObjectBeforeRefesh();
      },

    });
  }
  // onTypeRole(event) {
  //   this.selectedAccessGroupValue = null;
  //   this.accessGroupList = [];
  //   this.payload.SearchAccessGroupId = this.selectedRoleIdValue;
  //   this.payload.SearchDesignation = this.selectedAccessGroupValue;
  //   this.loadData();
  //   if (event) this.getAccessGroup(event.id);
  // }
  onTypeAccessGroup(event) {
    this.selectedAccessGroupValue = event ? event.name : null;
    this.payload.SearchDesignation = this.selectedAccessGroupValue;
    this.loadData();
  }

  onChangeselectionbyDateRange() {
    this.selectedDateValue = null;
    this.selectedDateRangeValue = {
      from: null,
      to: null,
    };
    this.payload.SearchFromDateTime = null;
    this.payload.SearchFromDateTimeSingle = null;
    this.payload.SearchToDateTime = null
    this.page = 1;
    this.payload.displayStart = this.displayLength * (this.page - 1);
    this.loadData();

  }
  onChangeSelectedDateValue() {
    this.payload.SearchFromDateTimeSingle = this.datePipe.transform(
      this.selectedDateValue,
      "yyyy-MM-dd"
    );

    this.page = 1;
    this.payload.displayStart = this.displayLength * (this.page - 1);
    this.loadData();
  }
  onChangeSelectedDateValueRange() {
    console.log(this.selectedDateRangeValue, "this.selectedDateRangeValue")
    if (this.selectedDateRangeValue.to) {
      this.payload.SearchFromDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.from,
        "yyyy-MM-dd"
      );
      this.payload.SearchToDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.to,
        "yyyy-MM-dd"
      );
      this.page = 1;
      this.payload.displayStart = this.displayLength * (this.page - 1);
      this.loadData();
    } else {

    }

  }
  downloadReport(value) {
    let payload: any = {};
    let newDate = new Date();
    let reportName = "Attendance ";
    if (this.selectedDateValue) {
      payload.SearchFromDateTimeSingle = this.datePipe.transform(
        this.selectedDateValue,
        "yyyy-MM-dd"
      );
    }
    if (this.selectedDateRangeValue.to) {
      payload.SearchFromDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.from,
        "yyyy-MM-dd"
      );
      payload.SearchToDateTime = this.datePipe.transform(
        this.selectedDateRangeValue.to,
        "yyyy-MM-dd"
      );
    }
    payload.SearchDesignation = this.selectedAccessGroupValue;
    payload.RenderFormat = value;
    payload.SearchFullName = this.searchName;
    console.log(payload);
    this.attendanceService
      .getDailyAttendanceReport(this.commonFunctionService.clean(payload))
      .subscribe((data: Blob) => {
        const filename =
          value === "PDF"
            ? reportName + newDate + ".pdf"
            : reportName + newDate + ".xls";
        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    //}
  }

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

  activeCard: any = '';
  onCardClickActiveCheckIn(type: any) {
    this.activeCard = type;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchDesignation: null,
      SearchCheckIn: true
    };
    localStorage.removeItem("objectSerachForAttendance");
    this.loadData();
  }

  onCardClickActiveCheckout(type: any) {
    this.activeCard = type;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchDesignation: null,
      SearchCheckOut: true
    };
    localStorage.removeItem("objectSerachForAttendance");
    this.loadData();
  }

  onCardClickActiveTaskType(type: any) {
    this.activeCard = type;

    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchDesignation: null,
      SearchTaskType: type
    };
    localStorage.removeItem("objectSerachForAttendance");
    this.loadData();
  }

  filteredAbsentList: any[] = [];
  AbsentSearchText: string = "";
  filterAbsent(event) {
    this.filteredAbsentList = this.getAbsentList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
  }
  clearTeach(event) {
    this.AbsentSearchText = "";
    this.filteredAbsentList = this.getAbsentList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );

  }


  GetV2_StaffAbsentListPost(content: any) {
    this.modalService.open(content, { size: "lg", centered: true });
    this.attendanceService
      .GetV2_StaffAbsentList(
        this.commonService.clean(this.payload)
      )
      .subscribe(
        (res: any) => {
          this.getAbsentList = res.list;
          this.filteredAbsentList = this.getAbsentList;
          console.log(this.filteredAbsentList);
        },
        (err) => {
          //console.log(err);
        }
      );
  }

  returnCurrentStatusClassesStatus(value: any) {
    return this.commonFunctionService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any) {
    return this.commonFunctionService.getStatusColorCircle(value);
  }

}
