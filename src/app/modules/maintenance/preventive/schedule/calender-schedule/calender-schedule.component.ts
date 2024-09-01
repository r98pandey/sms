import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  SimpleChanges,
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
  CalendarOptions,
  EventApi,
} from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
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
import { FullCalendarComponent } from "@fullcalendar/angular";
@Component({
  selector: "app-calender-schedule",
  templateUrl: "./calender-schedule.component.html",
  styleUrls: ["./calender-schedule.component.scss"],
})
export class CalenderScheduleComponent implements OnInit, AfterViewInit {
  @ViewChild("calendar") calendarComponent: FullCalendarComponent;

  isProject: boolean = false;
  label: any = "Preventive Management";
  breadCrumbItems: any = [
    { label: "Schedule" },
    { label: "Schedule List", active: true },
  ];
  isLoading: boolean = false; // Flag to prevent multiple API calls

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: "",
      center: "title",
      right: "prevYear,prev,next,nextYear",
    },
    initialView: "dayGridMonth",
    themeSystem: "bootstrap",
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: false,
    dayMaxEvents: true,
    eventsSet: this.handleEvents.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  currentEvents: EventApi[] = [];
  calendarApi: any;

  payload: any = {
    MonthlyDate: null,
    YearlyDate: null,
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
  curentMonth: any;
  selectedMonth: any;
  selectedYear: any;
  shownCalendor: boolean = false;
  @Output() getCurrentValue = new EventEmitter();

  calendarEvents: any[] = [];
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
    private preventiveService: PreventiveService, private cdr: ChangeDetectorRef
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isLoading) {

      this.getDropdownCompanyList()
      
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

      if (this.currentUserRole === "Client User") {
        this.getDropdownScheduleStatusList(
          "ScheduleStatusOnlyApplicationUserClient"
        );
        this.disabledWithAceessGroup = true;
      } else {
        if (localStorage.getItem("objectSerachForScheduleCalenderList")) {
            this.getObjectAfterRefresh();

        } else {
          const dateMonth = new Date().getMonth() + 1;
          this.payload.MonthlyDate = dateMonth;
          this.payload.YearlyDate = new Date().getFullYear();
          this.loadDataCalendar();
          this.getDropdownCompanyList();
          this.getDropdownScheduleStatusList("ScheduleStatus");
    
        }
      }
    }
  }




  loadDataCalendar() {
    this.isLoading = true;
    this.preventiveService
      .getV2_MX_PM_ScheduleList_Calendor(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.preventiveScheduleList = res.list;
        this.setObjectBeforeRefesh()
        this.shownCalendor = true;
        this.updateCalendarEvents();
        this.isLoading = false;
      },
        (error) => {
          this.isLoading = false;
          console.error("Error loading calendar data:", error);
        });
  }

  updateCalendarEvents() {
    const newEvents = this.preventiveScheduleList.map(
      (evt: any) => ({
        date: this.maketheFormat(evt.scheduleDate),
        title: evt.configPreventivePDescription,
        location: "test",
        description: "test",
        className: "bg-primary-subtle",
        scheduleId: evt.scheduleId,
      })
    );

    // Check if the new events are different from the current events
    if (JSON.stringify(newEvents) !== JSON.stringify(this.calendarEvents)) {
      this.calendarEvents = newEvents;
      this.calendarOptions.events = this.calendarEvents;
      this.cdr.detectChanges();
      console.log("Calendar Events Updated: ", this.calendarEvents);
    }
  }

  ngOnInit(): void {
    if (!this.isLoading) {

      this.getDropdownCompanyList()
      
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

    
      if (this.currentUserRole === "Client User") {
        this.getDropdownScheduleStatusList(
          "ScheduleStatusOnlyApplicationUserClient"
        );
        this.disabledWithAceessGroup = true;
      } else {
        if (localStorage.getItem("objectSerachForScheduleCalenderList")) {
          this.getObjectAfterRefresh();
        } else {
          const dateMonth = new Date().getMonth() + 1;
          this.payload.MonthlyDate = dateMonth;
          this.payload.YearlyDate = new Date().getFullYear();
          this.loadDataCalendar();
          this.getDropdownScheduleStatusList("ScheduleStatus");
    
        }
      }
    }

    // ;
  }

  maketheFormat(dateStr: string): string {
    const parts = dateStr.split(" ");
    if (parts[0]) {
      const date = new Date(parts[0]);
      return date.toISOString();
    }
    return '';
  }

  handleEvents(events: any) {
    console.log("hh")
    this.currentEvents = events;
    this.calendarApi = this.calendarComponent?.getApi();

    const currentDate = this.calendarApi?.getDate();
    this.selectedYear = currentDate?.getFullYear();
    this.selectedMonth = currentDate?.getMonth() + 1;

    if (this.selectedYear && this.selectedMonth) {
      this.payload.MonthlyDate = this.selectedMonth;
      this.payload.YearlyDate = this.selectedYear;
      if (!this.isLoading) {
        this.loadDataCalendar();
      }
    }
  }

  handleEventClick(clickInfo: any) {
    this.viewHandler(clickInfo.event.extendedProps["scheduleId"]);
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
          let objectSerachForScheduleCalenderList: any = JSON.parse(
            localStorage.getItem("objectSerachForScheduleCalenderList")
          );
          this.selectedDropDownScheduleStatusIdValue =
            objectSerachForScheduleCalenderList?.SearchScheduleStatusId
              ? objectSerachForScheduleCalenderList?.SearchScheduleStatusId
              : null;

          // this.selectedDropDownScheduleStatusIdValue = null;
        }
        this.loadDataCalendar();
      });
  }




  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForScheduleCalenderList: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForScheduleCalenderList.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachForScheduleCalenderList.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForScheduleCalenderList.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;


    if (this.selectedDropDownScheduleStatusIdValue)
      objectSerachForScheduleCalenderList.SearchScheduleStatusId = this.selectedDropDownScheduleStatusIdValue;

    if (this.arrayListDropDownClientList) {
      objectSerachForScheduleCalenderList.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForScheduleCalenderList.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }
    if (this.arrayListDropDownScheduleStatus) {
      objectSerachForScheduleCalenderList.arrayListDropDownScheduleStatus =
        this.arrayListDropDownScheduleStatus;
    }

    if (this.typeFrequencyValue)
      objectSerachForScheduleCalenderList.SearchFrequency =
        this.typeFrequencyValue;

    if (this.typeConfigPreventivePDescription)
      objectSerachForScheduleCalenderList.SearchConfigPreventivePDescription =
        this.typeConfigPreventivePDescription;

        if (this.selectedMonth)
          objectSerachForScheduleCalenderList.MonthlyDate =
            this.selectedMonth;
        if (this.selectedYear)
          objectSerachForScheduleCalenderList.YearlyDate = this.selectedYear;
    
    localStorage.setItem(
      "objectSerachForScheduleCalenderList",
      JSON.stringify(objectSerachForScheduleCalenderList)
    );
  }

  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    const dateMonth = new Date().getMonth() + 1;

    let objectSerachForScheduleCalenderList: any = JSON.parse(
      localStorage.getItem("objectSerachForScheduleCalenderList")
    );
    this.arrayListDropDownClientList =
      objectSerachForScheduleCalenderList.arrayListDropDownClientList
        ? objectSerachForScheduleCalenderList.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForScheduleCalenderList.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForScheduleCalenderList.arrayListDropDownProjectOrDeparmentList
        : [];
    this.arrayListDropDownScheduleStatus =
      objectSerachForScheduleCalenderList.arrayListDropDownScheduleStatus
        ? objectSerachForScheduleCalenderList.arrayListDropDownScheduleStatus
        : [];

    this.selectedDropDownCompanyIdValue = objectSerachForScheduleCalenderList.SearchCompanyId
      ? objectSerachForScheduleCalenderList.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForScheduleCalenderList.SearchClientId
      ? objectSerachForScheduleCalenderList.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForScheduleCalenderList.SearchProjectId
        ? objectSerachForScheduleCalenderList.SearchProjectId
        : null;

    this.selectedDropDownScheduleStatusIdValue =
      objectSerachForScheduleCalenderList.SearchScheduleStatusId
        ? objectSerachForScheduleCalenderList.SearchScheduleStatusId
        : null;

    this.typeFrequencyValue =
      objectSerachForScheduleCalenderList.SearchFrequency
        ? objectSerachForScheduleCalenderList.SearchFrequency
        : null;

    this.typeConfigPreventivePDescription =
      objectSerachForScheduleCalenderList.SearchConfigPreventivePDescription
        ? objectSerachForScheduleCalenderList.SearchConfigPreventivePDescription
        : null;

    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchScheduleStatusId =
      this.selectedDropDownScheduleStatusIdValue;
    this.payload.SearchFrequency = this.typeFrequencyValue;
    this.payload.SearchConfigPreventivePDescription = this.typeConfigPreventivePDescription;
    this.selectedMonth =objectSerachForScheduleCalenderList.MonthlyDate
        ? objectSerachForScheduleCalenderList.MonthlyDate
        : dateMonth;

    this.selectedYear =
      objectSerachForScheduleCalenderList.YearlyDate
        ? objectSerachForScheduleCalenderList.YearlyDate
        : new Date().getFullYear();
    this.payload.MonthlyDate = this.selectedMonth;
    this.payload.YearlyDate = this.selectedYear;
    
    
    this.loadDataCalendar()
  
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
    const dateMonth = new Date().getMonth() + 1;
    this.selectedMonth = dateMonth;
    this.selectedYear = new Date().getFullYear();
    this.payload = {
      MonthlyDate: null,
      YearlyDate: null,
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

      this.loadDataCalendar();
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
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
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

    this.loadDataCalendar();
  }

  onDropdownScheduleStatusValueChange($event) {
    
    this.payload.SearchScheduleStatusId =
      this.selectedDropDownScheduleStatusIdValue;
    this.setObjectBeforeRefesh();
    this.loadDataCalendar();
  }

  onDropdownClientValueChange($event) {
  
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
      if(this.selectedDropDownClientIdValue){
    this.getDropdownDepartmentList();
  }
    this.loadDataCalendar();
  }
  onDropdownDepartmentValueChange($event) {
    
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.loadDataCalendar();
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
  @ViewChild('calendar') calendarElementRef: ElementRef;

  ngAfterViewInit() {
    // server-side search

    if (this.preventiveScheduleList.length) {
      this.updateCalendarEvents();
    }
    setTimeout(() => {
      if (this.calendarElementRef) {
        const calendarApi = (this.calendarElementRef.nativeElement as any).getApi();
        const date = new Date(this.selectedYear, this.selectedMonth - 1, 1); // month is 0-based, so subtract 1
        calendarApi.gotoDate(date); // Navigate to the specified date
      } else {
        console.error('Calendar component is not initialized');
      }
    }, 0);
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      const date = new Date(this.selectedYear, this.selectedMonth - 1, 1); // month is 0-based, so subtract 1
      calendarApi.gotoDate(date); // Navigate to the specified date
    }
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
    
    this.payload.SearchConfigPreventivePDescription =
      this.typeConfigPreventivePDescription;
    this.loadDataCalendar();
  }
  onChangeFrequencyValueChange() {
  
    this.payload.SearchFrequency = this.typeFrequencyValue;
    this.loadDataCalendar();
  }

  submitFilterData() {
    this.payload.SearchConfigPreventivePDescription =
      this.selectedRequesterName;
    this.payload.SearchRequesterEmail = this.selectedRequesterEmail;
    this.loadDataCalendar();
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
        this.loadDataCalendar();
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
