
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { forEach } from "lodash";
import { Lightbox } from "ngx-lightbox";
import { AuditService } from "src/app/core/services/audit.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { PreventiveService } from "src/app/core/services/preventive.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { CommonHttpServiceCallerService } from '../../../../../core/services/common-http-service-caller.service';
import { DecimalPipe, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-view-new-user-withid',
  templateUrl: './view-new-user-withid.component.html',
  styleUrl: './view-new-user-withid.component.scss'
})
export class ViewNewUserWithidComponent implements OnInit {
  productionUrl: string = environment.apiUrl;
  isProject: any;
  userData: any = {};
  companyList: any = [];
  rolesList: any = {};
  accessGroupList: any = {};
  projectList: any = {};
  technitionsAttendanceTransactionDaily_ByStaffList: any = [];
  titleAndContentArrayCreated: any = {};
  titleAndContentArrayDelete: any = {};
  isMaintenanceModuleValue: boolean = false;
  apiUrl: any = environment.apiUrl;
  label: any = "Staff";
  breadCrumbItems: any = [
    { label: "User Management" },
    { label: "Staff Detail", active: true },
  ];

  currentMonthName: any = '';
  officeFormattedTime: string = '00 hrs : 00 min';
  homeFormattedTime: string = '00 hrs : 00 min';
  grandTotalFormattedTime: string = '00 hrs : 00 min';
  onSiteFormattedTime: string = '00 hrs : 00 min';
  attendanceWorkingHoursByCurrentList: any[] = [];
  myDailyAttendance_AttendAndAbsent = {
    "totalDaysAttended": 0,
    "totalDaysAbsent": 0
  }
  myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage = {
    "currentMonthHoursMinutes": "00 Hrs : 00 Min",
    "previousMonthHoursMinutes": "00 Hrs : 00 Min",
    "percentageDifference": 0,
    "changeIndicator": ""
  }
  myDailyProjectWorkingHoursByCurrentAndPreviusPercentage = {
    "currentMonthHoursMinutes": "00 Hrs : 00 Min",
    "previousMonthHoursMinutes": "00 Hrs : 00 Min",
    "percentageDifference": 0,
    "changeIndicator": ""
  }
  selectedUserId: string;
  constructor(
    private userService: UserProfileService,
    private dropDownService: DropdownService,
    private departmentService: DepartmentService,
    private commonFunctionService: CommonFunctionService,
    private authAssetService: AuthAssetService,
    private router: Router,
    private modalService: NgbModal,
    private lightbox: Lightbox,
    private offcanvasService: NgbOffcanvas, private preventiveService: PreventiveService,
    private auditService: AuditService,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService,
    private location: Location, private route: ActivatedRoute

  ) {

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedUserId = params.get('id');
      this.isProject = this.authAssetService.getisProject();
      this.getUserDetail(this.selectedUserId);
      this.GetV3_ProjectManagement_MyTask_ByUserId(this.selectedUserId);
      this.getV2_TechnitionsAttendanceTransactionDaily_ByStaff(this.selectedUserId);
    });
    this.isMaintenanceModuleValue = this.authAssetService.getIsMaintenanceModule()


  }

  clickSend(sendValue) {
    let payload: any = {
      FullName: sendValue.fullName,
      EmailId: sendValue.email,
    };
    this.userService.getRequestActivationCode(payload).subscribe((res) => {
      this.success(res);
      this.getUserDetail(this.selectedUserId);
      this.getV2_TechnitionsAttendanceTransactionDaily_ByStaff(this.selectedUserId);
    });
  }


  getV2_TechnitionsAttendanceTransactionDaily_ByStaff(userId) {
    let payload = {
      techId: userId,
    };
    this.userService
      .getV2_TechnitionsAttendanceTransactionDaily_ByStaff(payload)
      .subscribe((res: any) => {
        this.technitionsAttendanceTransactionDaily_ByStaffList = res.obj;

      });
  }




  getUserDetail(id) {
    this.userService.getUserListByUserId(id).subscribe({
      next: (res: any) => {
        const userData = res.data;
        this.userData = userData;

      },
    });
  }




  goBack() {
    this.location.back()
    // if (this.router.url.includes('employee-profile-view')) {
    //   this.router.navigate(["/application-settings/user-management/user/employee-profile-list"]);
    // } else {
    //   this.router.navigate(["/application-settings/user-management/user/list"]);
    // }
  }

  longitude = 101.693207;
  latitude = 3.140853;
  markers = [{ latitude: 52.228973, longitude: 20.728218 }];
  typeChecking: any = "Check-In";

  openMapView(content: any, Longitude: any, Latitude: any, type: any, user: any) {
    this.latitude = Number(Latitude);
    this.longitude = Number(Longitude);
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


  openModalConNofication(value: any) {
    let data = {
      title:
        "Please confirm that you want to email this user a notification link ",
      subTitle: "",
    };
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = data.title;
    modalRef.componentInstance.subTitle = data.subTitle;
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.clickSend(value);
        }
      }
    });
  }
  GetV3_ProjectManagement_MyTask_ByUserId(userId) {
    let payload = {
      techId: userId,
    };

    let url = 'api/ProjectManagementDash/GetV3_ProjectManagement_MyTask_ByUserId'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe((res: any) => {
      this.assignTheValueIntoFormattedTime(res.myDailyAttendanceWorkingHours);
      this.myDailyAttendance_AttendAndAbsent = res.myDailyAttendance_AttendAndAbsent;
      this.myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage = res.myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage;
      this.myDailyProjectWorkingHoursByCurrentAndPreviusPercentage = res.myDailyProjectWorkingHoursByCurrentAndPreviusPercentage;
      this._taskColumnChart('["--vz-primary","--vz-warning","--vz-warning","--vz-danger","--vz-dark","--vz-info"]', res.myProjectManagementTaskByStatus);
      this._subTaskColumnChart('["--vz-success","--vz-warning","--vz-warning","--vz-danger","--vz-dark","--vz-info"]', res.myProjectManagementSubTaskByStatus);
      this.bindTwoObjectOfHours(this.myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage, this.myDailyProjectWorkingHoursByCurrentAndPreviusPercentage);
      this.staffDailyAttendanceScoringList = res.myStaffDailyAttendanceScore;
      this._GaugeChart('["--vz-primary","--vz-warning"]', this.calculateScore(this.staffDailyAttendanceScoringList.myScore));
  
  
    })
  }


  bindTwoObjectOfHours(myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage, myDailyProjectWorkingHoursByCurrentAndPreviusPercentage) {
    myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage.title = 'Daily Attendance'
    myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage.icon = 'las la-hourglass-end'
    myDailyProjectWorkingHoursByCurrentAndPreviusPercentage.title = 'Task Attendance'
    myDailyProjectWorkingHoursByCurrentAndPreviusPercentage.icon = 'las la-hourglass-end'

    this.attendanceWorkingHoursByCurrentList.push(myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage, myDailyProjectWorkingHoursByCurrentAndPreviusPercentage)
    console.log("attendanceWorkingHoursByCurrentList", this.attendanceWorkingHoursByCurrentList)


  }

  assignTheValueIntoFormattedTime(myDailyAttendanceWorkingHours: Task[]) {
    myDailyAttendanceWorkingHours.forEach((element: any) => {
      if (element.taskType == 'Home') {
        this.homeFormattedTime = element.formattedTime ? element.formattedTime : '00 hours : 00 minutes'
      } else if (element.taskType == 'Office') {
        this.officeFormattedTime = element.formattedTime ? element.formattedTime : '00 hours : 00 minutes'
      } else if (element.taskType == 'On-Site') {
        this.onSiteFormattedTime = element.formattedTime ? element.formattedTime : '00 hours : 00 minutes'
      } else if (element.taskType == 'Grand Total') {
        this.grandTotalFormattedTime = element.formattedTime ? element.formattedTime : '00 hours : 00 minutes'
      } else {
      }
    })

  }
  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };


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

  staffDailyAttendanceScoringList: any;
  GaugeChart: any;

  private _GaugeChart(colors: any, myScore) {
    colors = this.getChartColorsArray(colors);
    this.GaugeChart = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      color: colors,
      textStyle: {
        fontFamily: 'Poppins, sans-serif',
      },
      series: [{
        name: 'Attending',
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: '#858d98',
        },
        axisLabel: {
          color: '#858d98',
        },
        data: [{
          title: {
            color: '#858d98',
          },
          value: myScore,
          name: 'SCORE',
        }]
      }]
    }
  }

  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace("", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace("", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }
  returnNonCount(processList: any[]) {
    return processList.filter(item => item.count !== 0).length;
  }


  calculateScore(myScore) {
    if (myScore >= 100) {
      return 100;
    } else if (myScore <= 0) {
      return myScore < 0 ? 0 : 1;
    } else {
      let calculatedScore = Math.floor(myScore * 10) / 10;
      return calculatedScore < 0.1 ? 1 : calculatedScore;
    }
  }
  taskColumnChart: any;
  subTaskColumnChart: any;
  private getTaskData(data: any) {
    return data.map((item: any) => item.totalTask);
  }

  private getTaskCategories(data: any) {
    return data.map((item: any) => item.projectTaskStatusName);
  }

  private getSubTaskData(data: any) {
    return data.map((item: any) => item.totalSubTask);
  }

  private getSubTaskCategories(data: any) {
    return data.map((item: any) => item.projectSubTaskStatusName);
  }

  private _taskColumnChart(colors: any, taskData: any) {
    colors = this.getChartColorsArray(colors);
    this.taskColumnChart = {
      series: [{
        name: 'Tasks',
        data: this.getTaskData(taskData)
      }],
      chart: {
        height: 430,
        type: 'bar',
        events: {
          click: function (chart: any, w: any, e: any) {
          }
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: this.getTaskCategories(taskData),
        labels: {
          style: {
            colors: colors,
            fontSize: '12px'
          }
        }
      }
    };
  }

  private _subTaskColumnChart(colors: any, subTaskData: any) {
    colors = this.getChartColorsArray(colors);
    this.subTaskColumnChart = {
      series: [{
        name: 'Sub-Tasks',
        data: this.getSubTaskData(subTaskData)
      }],
      chart: {
        height: 430,
        type: 'bar',
        events: {
          click: function (chart: any, w: any, e: any) {
          }
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: this.getSubTaskCategories(subTaskData),
        labels: {
          style: {
            colors: colors,
            fontSize: '12px'
          }
        }
      }
    };
  }

}
