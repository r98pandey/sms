import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import { HelpDeskService } from "src/app/core/services/help-desk.service";


import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { Validators } from "@angular/forms";
import { TicketService } from "src/app/core/services/ticket.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { ClientDashbaordService } from "src/app/core/services/client-dashbaord.service";
import { DatePipe } from "@angular/common";
import { CommonFunctionService } from "../../../../shared/Service-common/common-function.service";
import { environment } from "src/environments/environment";
import { MapsAPILoader } from "@agm/core";
import { isPlatformBrowser } from "@angular/common";
import { map } from "rxjs";
import { HubConnection } from "@microsoft/signalr";
import { SignalRService } from "src/app/core/services/signal-r.service";
import { MapInfoWindow, MapMarker } from "@angular/google-maps";
import { PreventiveService } from "src/app/core/services/preventive.service";
import { AuditService } from "src/app/core/services/audit.service";

interface Size {
  width: number;
  height: number;
  equals(other: Size): boolean;
}
@Component({
  selector: "app-help-desk-dashboard",
  templateUrl: "./help-desk-dashboard.component.html",
  styleUrls: ["./help-desk-dashboard.component.scss"],
})
export class HelpDeskDashboardComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  OverviewChart: any;
  ActiveProjects: any;
  MyTask: any;
  TeamMembers: any;
  status7: any;
  todoList: any = {};
  dashboadStatusCount: any = {
    myRequest: 0,
    myRequestPending: 0,
    myRequestApprove: 0,
    myRequestReject: 0,
    myRequestOtherStatus: 0,
  };
  sendDataInProjectStat!: any;
  // @ViewChild('scrollRef') scrollRef:any;
  scheduleList_ByDateList: any = [];
  currentDate: any;
  checktheRuleOfClientDashbard = {
    userId: null,
    newTicket: true,
    awaitQuotation: true,
    generateNewSO: true,
    expectedStartTaskDateTime: true,
    techSignatureRequired: true,
    clientSignatureRequired: true,
    statusDescription: true,
    quotationToProceedFinance: true,
    pendingForCloseTicketProcess: true,
    pendingForCloseTicketProcessInternal: true,
    quotationRejected: true,
    ticketAcknowledgmentRequest: true,
    pmScheduleCompletionAcknowlegementAdmin: true,
    pmScheduleCompletionAcknowlegementClient: true,
    auditCompletionAcknowlegementAdmin: true,
    auditCompletionAcknowlegementClient: true,
    ticketVerificationForAcknowledgeProcess: true
  };
  technitionsAttendanceTransactionList: any = [];
  technitionsAttendanceTransactionListDaily: any = [];
  imgUrl = environment.apiUrl;
  longitude = 101.693207;
  latitude = 3.140853;
  markers: any = [];

  mapOptions: google.maps.MapOptions = {
    center: { lat: 3.140853, lng: 101.693207 },
    zoom: 5,
  };
  zoom: number = 8;
  @ViewChild("streetviewMap", { static: true }) streetviewMap: any;
  @ViewChild("streetviewPano", { static: true }) streetviewPano: any;
  checktheRuleOfTrueValue: boolean = true;
  currentUserRole: any;
  listOverDueNewTicket: any[] = [];
  listOverDueBillingEligible: any[] = [];
  listOverDueInternalQuotation: any[] = [];
  listOverDueClientQuotApproval: any[] = [];
  listOverDueServiceOrder: any[] = [];
  listOverDueTicketQuotRequired: any[] = [];
  listOverDueTicketExternalAcknowledge: any[] = [];
  listOverDueTicketInternalAcknowledge: any[] = [];

  infoWindowOpen: any = 'checkIn';
  chartValueActive: any = 1
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  activeIdTop: number = 1;
  onDutyActiveId: number = 1;
  onBillingActiveId: number = 1;
  onTicketAgingId: number = 1;
  constructor(
    private helpDeskService: HelpDeskService,
    private router: Router,
    public authAssetService: AuthAssetService,
    private clientDashbaordService: ClientDashbaordService,
    private datepipe: DatePipe,
    public commonFunctionService: CommonFunctionService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any,
    private mapsAPILoader: MapsAPILoader,
    private signalRService: SignalRService,
    private zone: NgZone,
    private preventiveService: PreventiveService,
    private auditService: AuditService,
    private ticketService: TicketService,
  ) {
    let accgroup = JSON.parse(localStorage.getItem("currentUser")).accessGroupName;
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    console.log("this.currentUserRole",this.currentUserRole)

    if (this.currentUserRole === "Client User") {
      if (accgroup === "Application User") {

        this.router.navigate([
          "maintenance-management/corrective/ticket/list-ticket",
        ]);
      } else {

        this.router.navigate([
          "/maintenance-management/dashboard/client-dashboard",
        ]);
      }
    } else if (this.currentUserRole === "Help Desk") {

      this.router.navigate([
        "/maintenance-management/dashboard/help-desk-dashboard",
      ]);
    }
    else if (this.currentUserRole === "Human Resource") {

      this.router.navigate([
        "/maintenance-management/attendance/daily-attendance",
      ]);
    }
    else if (this.currentUserRole === "Asset Administrator") {

      this.router.navigate([
        "/maintenance-management/dashboard/asset-dashboard",
      ]);
    } else if (this.currentUserRole === "Software Support") {
      if (accgroup === "Software Engineer") {

        this.router.navigate([
          "/software-support/software-dashboard",
        ]);
      } else if (
        accgroup === "Head Of Department"
      ) {

        this.router.navigate([
          "/software-support/software-dashboard",
        ]);
      } else {

        this.router.navigate([
          "/maintenance-management/dashboard/help-desk-dashboard",
        ]);
      }
    } else {
  
    }

    if (this.currentUserRole != "Super Admin") {
      if (this.currentUserRole === "Client User") {
        if (accgroup == "Application User") {
          this.router.navigate([
            "/maintenance-management/corrective/ticket/list-ticket",
          ]);
        } else {
          this.router.navigate([
            "/maintenance-management/dashboard/client-dashboard",
          ]);
        }
      }
      else if (this.currentUserRole === "Software Support") {
        if (accgroup == "Software Engineer") {
          this.router.navigate([
            "/software-support/software-dashboard",
          ]);
        }
      } else if (this.currentUserRole === "Human Resource") {
        if (accgroup == "HR Admin") {
          this.router.navigate([
            "/maintenance-management/attendance/daily-attendance",
          ]);
        }
      }

    }

    if (localStorage.getItem('setChartMesseageHelpDesk')) {
      this.chartValueActive = Number(localStorage.getItem('setChartMesseageHelpDesk'))
    }
    this.initialTabOpenBackFromThePage();
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Dashboards" },
      { label: this.authAssetService.getRole() + " Dashboard", active: true },
    ];

    this.initialiseSignalRFunction();

    this._OverviewChart(
      '["--vz-primary", "--vz-warning","--vz-danger","--vz-success"]'
    );
    this._status7(
      '["--vz-success", "--vz-primary", "--vz-warning", "--vz-danger"]'
    );
    this.getV2_TotalCountTicketServiceOrderIncident();
    this.getV2_MaintenanceWorkflowTodoList();
    this.getV2_TechnitionsAttendanceTransaction();
    this.getV2_TechnitionsAttendanceTransactionDaily();
    this.getBillableNonBillable();
    this.getV2_TotalTicket7DayGraph();
    this.getV2_TotalTicketMonthlyGraph();
    this.getSupportType();
    this.getProjectList();
    if (this.authAssetService.getRole() !== "Super Admin") {
      this.getV2_MyTaskRulesActiveCount();
    }
    this.currentDate = new Date();
    this.getV2_MX_PM_ScheduleList_ByDate(new Date());
    this.getV2_OverDue();
  }
  initialTabOpenBackFromThePage() {


    this.activeIdTop = sessionStorage.getItem("initalToTabs") ? Number(sessionStorage.getItem("initalToTabs")) : 1;
    this.onDutyActiveId = sessionStorage.getItem("innerTaskTab") ? Number(sessionStorage.getItem("innerTaskTab")) : 1;
    this.onTicketAgingId = sessionStorage.getItem("ticketAgingTab") ? Number(sessionStorage.getItem("ticketAgingTab")) : 1;
    this.onBillingActiveId = sessionStorage.getItem("billingTab") ? Number(sessionStorage.getItem("billingTab")) : 1;


  }
  ngAfterViewInit() {
    // this.scrollRef.SimpleBar.getScrollElement().scrollTop = 600;
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  getV2_MX_PM_ScheduleList_ByDate(date) {
    //console.log(date);
    let payload = {
      SearchDate: this.datepipe.transform(date, "dd-MM-yyyy"),
    };
    this.helpDeskService
      .getV2_MX_PM_ScheduleList_ByDate(payload)
      .subscribe((res: any) => {
        this.scheduleList_ByDateList = res.list;
      });
  }
  getV2_MyTaskRulesActiveCount() {
    this.clientDashbaordService
      .getV2_MyTaskRulesActiveCount()
      .subscribe((res: any) => {
        this.checktheRuleOfClientDashbard = res.data;
        this.checktheRuleOfTrueValue = Object.values(
          this.checktheRuleOfClientDashbard
        ).some((value) => value === true);
      });
  }
  getV2_OverDue() {
    this.helpDeskService.getV2_OverDue().subscribe((res: any) => {
      this.listOverDueNewTicket = res.listOverDueNewTicket
        ? res.listOverDueNewTicket
        : [];
      this.listOverDueBillingEligible = res.listOverDueBillingEligible
        ? res.listOverDueBillingEligible
        : [];
      this.listOverDueInternalQuotation = res.listOverDueInternalQuotation
        ? res.listOverDueInternalQuotation
        : [];
      this.listOverDueClientQuotApproval = res.listOverDueClientQuotApproval
        ? res.listOverDueClientQuotApproval
        : [];
      this.listOverDueServiceOrder = res.listOverDueServiceOrder
        ? res.listOverDueServiceOrder
        : [];

      this.listOverDueTicketQuotRequired = res.listOverDueTicketQuotRequired
        ? res.listOverDueTicketQuotRequired
        : [];

      this.listOverDueTicketInternalAcknowledge =
        res.listOverDueTicketInternalAcknowledge
          ? res.listOverDueTicketInternalAcknowledge
          : [];
      this.listOverDueTicketExternalAcknowledge =
        res.listOverDueTicketExternalAcknowledge
          ? res.listOverDueTicketExternalAcknowledge
          : [];
    });
  }
  // Chart Colors Set
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(
          newValue
        );
        if (color) {
          color = color.replace(" ", "");
          return color;
        } else return newValue;
      } else {
        var val = value.split(",");
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  /**
   * Projects Overview
   */
  setprojectvalue(value: any) {
    if (value == "all") {
      this.OverviewChart.series = [
        {
          name: "Respond SLA violations",
          type: "bar",
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
        },
        {
          name: "On-Site SLA violations",
          type: "area",
          data: [
            89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57,
            42.36, 88.51, 36.57,
          ],
        },
        {
          name: "Active Projects",
          type: "bar",
          data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
        },
        ,
        {
          name: "Zero SLA Violations",
          type: "bar",
          data: [88, 2, 7, 67, 21, 11, 88, 9, 9, 81, 12, 35],
        },
      ];
    }
    if (value == "1M") {
      this.OverviewChart.series = [
        {
          name: "Respond SLA violations",
          type: "bar",
          data: [24, 75, 16, 98, 19, 41, 52, 34, 28, 52, 63, 67],
        },
        {
          name: "On-Site SLA violations",
          type: "area",
          data: [
            99.25, 28.58, 98.74, 12.87, 107.54, 94.03, 11.24, 48.57, 22.57,
            42.36, 88.51, 36.57,
          ],
        },
        {
          name: "Complition SLA violations",
          type: "bar",
          data: [28, 22, 17, 27, 21, 11, 5, 9, 17, 29, 12, 15],
        },
        {
          name: "Zero SLA Violations",
          type: "bar",
          data: [18, 12, 47, 7, 41, 11, 8, 9, 37, 29, 12, 65],
        },
      ];
    }
    if (value == "6M") {
      this.OverviewChart.series = [
        {
          name: "Respond SLA violations",
          type: "bar",
          data: [34, 75, 66, 78, 29, 41, 32, 44, 58, 52, 43, 77],
        },
        {
          name: "On-Site SLA violations",
          type: "area",
          data: [
            109.25, 48.58, 38.74, 57.87, 77.54, 84.03, 31.24, 18.57, 92.57,
            42.36, 48.51, 56.57,
          ],
        },
        {
          name: "Complition SLA violations",
          type: "bar",
          data: [12, 22, 17, 27, 1, 51, 5, 9, 7, 29, 12, 35],
        },
        {
          name: "Zero SLA Violations",
          type: "bar",
          data: [18, 82, 5, 7, 2, 11, 78, 9, 77, 79, 12, 35],
        },
      ];
    }
    if (value == "1Y") {
      this.OverviewChart.series = [
        {
          name: "Respond SLA violations",
          type: "bar",
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
        },
        {
          name: "On-Site SLA violations",
          type: "area",
          data: [
            89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57,
            42.36, 88.51, 36.57,
          ],
        },
        {
          name: "Complition SLA violations",
          type: "bar",
          data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
        },
        {
          name: "Zero SLA Violations",
          type: "bar",
          data: [18, 15, 7, 70, 21, 31, 81, 9, 8, 29, 12, 75],
        },
      ];
    }
  }

  private _OverviewChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.OverviewChart = {
      series: [
        {
          name: "Respond SLA violations",
          type: "bar",
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
        },
        {
          name: "On-Site SLA violations",
          type: "area",
          data: [
            89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57,
            42.36, 88.51, 36.57,
          ],
        },
        {
          name: "Complition SLA violations",
          type: "bar",
          data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
        },
        {
          name: "Zero SLA Violations",
          type: "bar",
          data: [18, 12, 57, 7, 21, 11, 8, 9, 17, 29, 82, 55],
        },
      ],

      chart: {
        height: 374,
        width: "99%",
        type: "line",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "smooth",
        dashArray: [0, 3, 0],
        width: [0, 1, 0],
      },
      fill: {
        opacity: [1, 0.1, 1],
      },
      markers: {
        size: [0, 4, 0],
        strokeWidth: 2,
        hover: {
          size: 4,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10,
        },
      },
      legend: {
        show: true,
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: -5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          barHeight: "70%",
        },
      },
      colors: colors,
      tooltip: {
        shared: true,
        y: [
          {
            formatter: function (y: any) {
              if (typeof y !== "undefined") {
                return y.toFixed(0);
              }
              return y;
            },
          },
          {
            formatter: function (y: any) {
              if (typeof y !== "undefined") {
                return "$" + y.toFixed(2) + "k";
              }
              return y;
            },
          },
          {
            formatter: function (y: any) {
              if (typeof y !== "undefined") {
                return y.toFixed(0);
              }
              return y;
            },
          },
        ],
      },
    };
  }

  /**
   *  Status7
   */
  setstatusvalue(value: any) {
    if (value == "all") {
      this.status7.series = [125, 42, 58, 89];
    }
    if (value == "7") {
      this.status7.series = [25, 52, 158, 99];
    }
    if (value == "30") {
      this.status7.series = [35, 22, 98, 99];
    }
    if (value == "90") {
      this.status7.series = [105, 32, 68, 79];
    }
  }

  private _status7(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.status7 = {
      series: [125, 42, 58, 89],
      labels: ["Completed", "In Progress", "Yet to Start", "Cancelled"],
      chart: {
        type: "donut",
        height: 230,
      },
      plotOptions: {
        pie: {
          offsetX: 0,
          offsetY: 0,
          donut: {
            size: "90%",
            labels: {
              show: false,
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      stroke: {
        lineCap: "round",
        width: 0,
      },
      colors: colors,
    };
  }

  totalCountTicketServiceOrderIncident: any = {
    countTotalTicket: 0,
    countTotalSO: 0,
    countTotalIncident: 0,
    countNewTicketCard: 0,
    countPendingTicket: 0,
    countInProgressTicket: 0,
    countResolvedTicket: 0,
    countClosedTicket: 0,
    countOnHoldTicket: 0,
    countPendingSO: 0,
    countInProgressSO: 0,
    countCompletedSO: 0,
    countOnHoldSO: 0,
    countNewIncident: 0,
    countPendingIncident: 0,
    countInProgressIncident: 0,
    countCompletedIncident: 0,
    countOnHoldIncident: 0,
    countResolvedIncident: 0,

    countTotalServiceOrderPending: 0,
    countTotalServiceOrderWithoutExpectedDateTime: 0,
    countTotalServiceOrderWithoutAssignTechnition: 0,
  };
  getV2_TotalCountTicketServiceOrderIncident() {
    this.helpDeskService
      .getV2_TotalCountTicketServiceOrderIncident()
      .subscribe((res: any) => {
        this.totalCountTicketServiceOrderIncident = res.data;

        this.sendDataInProjectStat = [
          {
            title: "TICKETS",
            value: this.totalCountTicketServiceOrderIncident.countTotalTicket,
            icon: "briefcase",
            month: "Tickets this month",
            progressBar: [
              {
                id: 1,
                bgColor: "bg-warning",
                width: this.returnProgressBarValue(
                  this.returnTotalCountValueOfTicket(),
                  this.totalCountTicketServiceOrderIncident.countNewTicketCard
                ),
                data: "New",
              },
              {
                id: 2,
                bgColor: "bg-info",
                width: this.returnProgressBarValue(
                  this.returnTotalCountValueOfTicket(),
                  this.totalCountTicketServiceOrderIncident.countResolvedTicket
                ),
                data: "Resolved",
              },
              // {
              //   id: 3,
              //   bgColor: "bg-primary",
              //   width: this.returnProgressBarValue(
              //     this.returnTotalCountValueOfTicket(),
              //     this.totalCountTicketServiceOrderIncident.countPendingTicket
              //   ),
              //   data: "WorkFlow",
              // },

              {
                id: 4,
                bgColor: "bg-success",
                width: this.returnProgressBarValue(
                  this.returnTotalCountValueOfTicket(),
                  this.totalCountTicketServiceOrderIncident.countClosedTicket
                ),
                data: "Closed",
              },
            ],
            subItem: [
              {
                id: 1,
                icon: "mdi mdi-numeric-3-circle",
                bgColor: "bg-warning",
                iconClass: "warning",
                label: "New",
                statusId: 48,
                Value: this.totalCountTicketServiceOrderIncident.countNewTicketCard,
              },

              {
                id: 2,
                icon: "mdi mdi-numeric-3-circle",
                bgColor: "bg-info",
                iconClass: "info",
                label: "Resolved",
                statusId: 31,
                Value:
                  this.totalCountTicketServiceOrderIncident.countResolvedTicket,
              },
              // {
              //   id: 3,
              //   icon: "mdi mdi-numeric-1-circle",
              //   bgColor: "bg-primary",
              //   iconClass: "primary",
              //   label: "Workflow",
              //   Value:
              //     this.totalCountTicketServiceOrderIncident.countPendingTicket,
              // },
              {
                id: 4,
                icon: "mdi mdi-numeric-1-circle",
                bgColor: "bg-success",
                iconClass: "success",
                label: "Closed",
                statusId: 32,
                Value:
                  this.totalCountTicketServiceOrderIncident.countClosedTicket,
              },
            ],
          },
          {
            title: "SERVICE ORDERS",
            value: this.totalCountTicketServiceOrderIncident.countTotalSO,
            icon: "award",
            month: "Service Orders this month",
            progressBar: [
              {
                id: 1,
                bgColor: "bg-warning",
                width: this.returnProgressBarValue(
                  this.returnTotalCountValueOfSO(),
                  this.totalCountTicketServiceOrderIncident.countPendingSO
                ),
                data: "Pending",
              },
              {
                id: 2,
                bgColor: "bg-info",
                width: this.returnProgressBarValue(
                  this.returnTotalCountValueOfSO(),
                  this.totalCountTicketServiceOrderIncident.countInProgressSO
                ),
                data: "In-Progress",
              },
              {
                id: 3,
                bgColor: "bg-success",
                width: this.returnProgressBarValue(
                  this.returnTotalCountValueOfSO(),
                  this.totalCountTicketServiceOrderIncident.countCompletedSO
                ),
                data: "Completed",
              },
            ],
            subItem: [
              {
                id: 2,
                icon: "mdi mdi-numeric-3-circle",
                bgColor: "bg-warning",
                iconClass: "warning",
                label: "Pending",
                statusId: 2,
                Value: this.totalCountTicketServiceOrderIncident.countPendingSO,
              },
              {
                id: 3,
                icon: "mdi mdi-numeric-3-circle",
                bgColor: "bg-info",
                iconClass: "info",
                label: "In-Progress",
                statusId: 30,
                Value:
                  this.totalCountTicketServiceOrderIncident.countInProgressSO,
              },

              {
                id: 4,
                icon: "mdi mdi-numeric-3-circle",
                bgColor: "bg-success",
                iconClass: "success",
                label: "Completed",
                statusId: 25,
                Value:
                  this.totalCountTicketServiceOrderIncident.countCompletedSO,
              },
            ],
          },

          {
            title: "INCIDENTS",
            value: this.totalCountTicketServiceOrderIncident.countTotalIncident,
            icon: "alert-circle",
            month: "Incidents this month",
            progressBar: [
              {
                id: 1,
                bgColor: "bg-warning",
                width: this.returnProgressBarValue(
                  this.returnTotalCountValueOfIncident(),
                  this.totalCountTicketServiceOrderIncident.countInProgressIncident
                ),
                data: "In-Progress",
              },
              {
                id: 3,
                bgColor: "bg-info",
                width: this.returnProgressBarValue(
                  this.returnTotalCountValueOfIncident(),
                  this.totalCountTicketServiceOrderIncident
                    .countResolvedIncident
                ),
                data: "Resolved",
              },
              {
                id: 4,
                bgColor: "bg-success",
                width: this.returnProgressBarValue(
                  this.returnTotalCountValueOfIncident(),
                  this.totalCountTicketServiceOrderIncident
                    .countClosedIncident
                ),
                data: "Closed",
              },
            ],
            subItem: [
              {
                id: 1,
                icon: "mdi mdi-numeric-3-circle",
                bgColor: "bg-warning",
                iconClass: "warning",
                label: "In-progress",
                statusId: 30,
                Value:
                  this.totalCountTicketServiceOrderIncident
                    .countInProgressIncident,
              },

              {
                id: 2,
                icon: "mdi mdi-numeric-3-circle",
                bgColor: "bg-info",
                iconClass: "info",
                label: "Resolved",
                statusId: 31,
                Value:
                  this.totalCountTicketServiceOrderIncident
                    .countResolvedIncident,
              },
              {
                id: 3,
                icon: "mdi mdi-numeric-1-circle",
                bgColor: "bg-success",
                iconClass: "success",
                label: "Closed",
                statusId: 32,
                Value:
                  this.totalCountTicketServiceOrderIncident
                    .countClosedIncident,
              },
            ],
          },

          // {
          //   title: "Quotation",
          //   value: this.totalCountTicketServiceOrderIncident.countTotalQuote,
          //   icon: "dollar-sign",
          //   month: "Quotation this month",
          //   progressBar: [
          //     {
          //       id: 1,
          //       bgColor: "bg-warning",
          //       width: this.returnProgressBarValue(
          //         this.returnTotalCountValueOfQuotation(),
          //         this.totalCountTicketServiceOrderIncident.countQuotePending
          //       ),
          //       data: "Pending",
          //     },
          //     {
          //       id: 3,
          //       bgColor: "bg-info",
          //       width: this.returnProgressBarValue(
          //         this.returnTotalCountValueOfQuotation(),
          //         this.totalCountTicketServiceOrderIncident.countQuoteInReview
          //       ),
          //       data: "Review",
          //     },
          //     {
          //       id: 4,
          //       bgColor: "bg-success",
          //       width: this.returnProgressBarValue(
          //         this.returnTotalCountValueOfQuotation(),
          //         this.totalCountTicketServiceOrderIncident.countQuoteApproved
          //       ),
          //       data: "Approved",
          //     },
          //   ],
          //   subItem: [
          //     {
          //       id: 1,
          //       icon: "mdi mdi-numeric-3-circle",
          //       bgColor: "bg-warning",
          //       iconClass: "warning",
          //       label: "Pending",
          //       Value:
          //         this.totalCountTicketServiceOrderIncident.countQuotePending,
          //     },

          //     {
          //       id: 2,
          //       icon: "mdi mdi-numeric-3-circle",
          //       bgColor: "bg-info",
          //       iconClass: "info",
          //       label: "Review",
          //       Value:
          //         this.totalCountTicketServiceOrderIncident.countQuoteInReview,
          //     },
          //     {
          //       id: 3,
          //       icon: "mdi mdi-numeric-1-circle",
          //       bgColor: "bg-success",
          //       iconClass: "success",
          //       label: "Approved",
          //       Value:
          //         this.totalCountTicketServiceOrderIncident.countQuoteApproved,
          //     },
          //   ],
          // },
        ];
      });
  }
  returnTotalCountValueOfTicket() {
    return (
      this.totalCountTicketServiceOrderIncident.countNewTicketCard +
      // this.totalCountTicketServiceOrderIncident.countPendingTicket +
      this.totalCountTicketServiceOrderIncident.countClosedTicket +
      this.totalCountTicketServiceOrderIncident.countResolvedTicket
    );
  }
  returnTotalCountValueOfQuotation() {
    return (
      this.totalCountTicketServiceOrderIncident.countQuoteInReview +
      this.totalCountTicketServiceOrderIncident.countQuotePending +
      this.totalCountTicketServiceOrderIncident.countQuoteApproved
    );
  }

  returnTotalCountValueOfSO() {
    return (
      this.totalCountTicketServiceOrderIncident.countPendingSO +
      this.totalCountTicketServiceOrderIncident.countInProgressSO +
      this.totalCountTicketServiceOrderIncident.countCompletedSO
    );
  }
  returnTotalCountValueOfIncident() {
    return (
      this.totalCountTicketServiceOrderIncident.countInProgressIncident +
      this.totalCountTicketServiceOrderIncident.countClosedIncident +
      this.totalCountTicketServiceOrderIncident.countResolvedIncident
    );
  }
  returnProgressBarValue(totalValue: any, objectStatusValue: any) {
    const value = (objectStatusValue / totalValue) * 100;
    const fixedValue = value.toFixed(0);
    return fixedValue + "%";
  }

  myTaskTicketList(value: any, ticketStatusId: any, pageAction: any) {
    if (value != 0) {
      this.helpDeskService.ticketStatusId = ticketStatusId;
      this.helpDeskService.pageAction = pageAction;
      this.router.navigate([
        "/maintenance-management/dashboard/new-ticket-list",
      ]);
    }
  }
  myTaskServiceOrderList(value: any, serviceStatusId: any, pageAction: any) {
    if (value != 0) {
      this.helpDeskService.serviceStatusId = serviceStatusId;
      this.helpDeskService.pageAction = pageAction;
      this.router.navigate([
        "/maintenance-management/dashboard/dashboard-servicet-order-list",
      ]);
    }
  }
  myTaskAuditListForClient(value: any, count: any, type: any) {
    if (count != 0) {
      this.helpDeskService.auditStatusId = value;
      this.helpDeskService.pageAction = type;
      this.helpDeskService.auditTypeAdminAndClient = "Client";
      this.router.navigate([
        "/maintenance-management/dashboard/audit-list-dashboard",
      ]);
    }
  }
  myTaskAuditListForAdmin(value: any, count: any, type: any) {
    if (count != 0) {
      this.helpDeskService.auditStatusId = value;
      this.helpDeskService.pageAction = type;
      this.helpDeskService.auditTypeAdminAndClient = "Admin";
      this.router.navigate([
        "/maintenance-management/dashboard/audit-list-dashboard",
      ]);
    }
  }
  totalCountMaintenanceWorkflowTodoList: any[] = [];
  getV2_MaintenanceWorkflowTodoList() {
    this.helpDeskService
      .getV2_MaintenanceWorkflowTodoList()
      .subscribe((res: any) => {
        this.totalCountMaintenanceWorkflowTodoList = res.list;
      });
  }
  navigateMyWorkflowPageList(workflowObject: any) {
    if (workflowObject) {
      this.helpDeskService.pageAction = "Workflow Page";
      this.helpDeskService.workflowObject = { ...workflowObject };
      // for thew workglow
      if (workflowObject.masterWorkflowId == 9) {
        this.router.navigate([
          "/maintenance-management/dashboard/workflow-ticket-list",
        ]);
      }
      // for the Quotation list
      else if (workflowObject.masterWorkflowId == 10) {
        this.router.navigate([
          "/maintenance-management/dashboard/quotation-ticket-list",
        ]);
      } else if (workflowObject.masterWorkflowId == 11) {
        this.router.navigate([
          "/maintenance-management/dashboard/quotation-ticket-list",
        ]);
      } else {
        this.warning("No Workflow Id");
      }
    }
  }
  myTaskQuestionList(value: any, type: any) {
    if (value != 0) {
      this.helpDeskService.pageAction = type;
      this.router.navigate([
        "/maintenance-management/dashboard/quotation-ticket-list",
      ]);
    }
  }
  myTaskWaitingForInvoice(value: any, type: any) {
    if (value != 0) {
      this.helpDeskService.pageAction = type;
      this.router.navigate([
        "/maintenance-management/dashboard/waiting-for-generate-invoice-list",
      ]);
    }
  }
  myTaskSignatureList(value: any, count: any, type: any) {
    if (count != 0) {
      this.helpDeskService.ticketStatusId = value;
      this.helpDeskService.pageAction = type;
      this.router.navigate([
        "/maintenance-management/dashboard/tech-sigature-ticket-list",
      ]);
    }
  }
  myTaskScheduleListForAdmin(value: any, count: any, type: any) {
    if (count != 0) {
      this.helpDeskService.scheduleStatusId = value;
      this.helpDeskService.pageAction = type;
      this.helpDeskService.scheduleTypeAdminAndClient = "Admin";
      this.router.navigate([
        "/maintenance-management/dashboard/schedule-list-adminandclient",
      ]);
    }
  }
  myTaskScheduleListForClient(value: any, count: any, type: any) {
    if (count != 0) {
      this.helpDeskService.scheduleStatusId = value;
      this.helpDeskService.pageAction = type;
      this.helpDeskService.scheduleTypeAdminAndClient = "Client";
      this.router.navigate([
        "/maintenance-management/dashboard/schedule-list-adminandclient",
      ]);
    }
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

  billablePieChart: any;
  supportTypeBarGraph: any;
  supportTypeData: any = {
    countTotalIsBillingRequired_1: 1,
    countTotalIsBillingRequired_0: 1,
  };
  billable: any = {
    countTotalSupportTypeOnSite: 1,
    countTotalSupportTypeRemote: 1,
  };
  projectList: any[] = [];

  getBillableNonBillable() {
    this.helpDeskService.getBillableNonBillableCounts().subscribe({
      next: (res: any) => {
        this.billable = res.data;
        this.generateBillablePieChart(
          '["--vz-warning", "--vz-info"]',
          [
            this.billable.countTotalIsBillingRequired_1,
            this.billable.countTotalIsBillingRequired_0,
          ],
          ["Billable", "Non-Billable"]
        );
      },
    });
  }

  getSupportType() {
    this.helpDeskService.getSupportTypeCounts().subscribe({
      next: (res: any) => {
        this.supportTypeData = res.data;
        this.generateSupportTypeGraph(
          '["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]',
          [
            {
              name: "Remote",
              data: [this.supportTypeData.countTotalSupportTypeRemote],
            },
            {
              name: "On-Site",
              data: [this.supportTypeData.countTotalSupportTypeOnSite],
            },
          ]
        );
      },
    });
  }

  getProjectList() {
    this.helpDeskService.getProjectList().subscribe({
      next: (res: any) => {
        this.projectList = res.list;
      },
    });
  }

  getV2_TechnitionsAttendanceTransaction() {
    this.helpDeskService.getV2_TechnitionsAttendanceTransaction().subscribe({
      next: (res: any) => {
        this.technitionsAttendanceTransactionList = res.obj;


      },
    });
  }
  getV2_TechnitionsAttendanceTransactionDaily() {
    this.helpDeskService
      .getV2_TechnitionsAttendanceTransactionDaily()
      .subscribe({
        next: (res: any) => {
          this.technitionsAttendanceTransactionListDaily = res.obj;


        },
      });
  }

  private generateBillablePieChart(colors: any, series, labels) {
    //console.log("generateBillablePieChart", series);
    colors = this.getChartColorsArray(colors);
    this.billablePieChart = {
      series: series,
      labels: labels,
      chart: {
        type: "donut",
        height: 350,
      },
      plotOptions: {
        pie: {
          offsetX: 0,
          offsetY: 0,
          donut: {
            size: "70%",
            labels: {
              show: true,
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
      },
      stroke: {
        lineCap: "round",
        width: 0,
      },
      colors: colors,
    };
  }

  //Support Type

  private generateSupportTypeGraph(colors: any, data: any[]) {
    colors = this.getChartColorsArray(colors);
    this.supportTypeBarGraph = {
      series: data,
      chart: {
        type: "bar",
        height: 500,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          offsetX: 0,
        },
      },
      stroke: {
        show: true,
        width: 5,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [""],
        axisTicks: {
          show: true,
          borderType: "solid",
          color: "#78909C",
          height: 16,
          offsetX: 0,
          offsetY: 0,
        },
        title: {
          text: "Support Type",
          offsetX: 0,
          offsetY: -20,
          style: {
            color: "#78909C",
            fontSize: "12px",
            fontWeight: 400,
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (value: any) {
            return value;
          },
        },
        tickAmount: 4,
        min: 0,
      },
      fill: {
        opacity: 1,
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        fontWeight: 500,
        offsetX: 0,
        // offsetY: -14,
        itemMargin: {
          horizontal: 8,
          vertical: 0,
        },
        markers: {
          width: 10,
          height: 10,
        },
      },
      colors: colors,
    };
  }

  @ViewChild("myMap", { static: false }) myMap: any;
  checkActive = 1;
  checkdection(value: any) {
    this.changeDetectorRef.detectChanges();
    this.storeMapData = {};
    this.longitude = 101.693207;
    this.latitude = 3.140853;
    this.zoom = 7;
    this.infoWindowOpen = null;
    this.checkActive = value;
    if (value == 4 || value == 5) {
      this.getV2_OverDue();
    }
    sessionStorage.setItem("initalToTabs", "" + this.activeIdTop);
    sessionStorage.setItem("ticketAgingTab", "" + this.onTicketAgingId);
    sessionStorage.setItem("billingTab", "" + this.onBillingActiveId);
    console.log("   this.onTicketAgingId", this.onTicketAgingId)

    if (value == 2) {

      this.calllingTask()

    }
    if (value == 3) {
      this.callinginOnDuty(3)
    }
    // this.helpDeskService.initalToTabs = this.activeIdTop;
    // this.helpDeskService.innerTaskTab = this.onDutyActiveId;
    // this.helpDeskService.ticketAgingTab = this.onTicketAgingId;
    // this.helpDeskService.billingTab = this.onBillingActiveId;


  }
  calllingTask() {
    this.getV2_MyTaskRulesActiveCount();
    this.getV2_TotalCountTicketServiceOrderIncident()
  }
  calllingWorkFlow() {
    this.getV2_MaintenanceWorkflowTodoList();
  }
  callinginOnDuty(type) {
    if (type == 1) {
      this.getV2_TechnitionsAttendanceTransaction();
    }
    else if (type == 2) {
      this.getV2_TechnitionsAttendanceTransactionDaily();
    } else {
      this.getV2_TechnitionsAttendanceTransaction();
      this.getV2_TechnitionsAttendanceTransactionDaily();

    }
    sessionStorage.setItem("innerTaskTab", "" + this.onDutyActiveId);

  }
  storeMapData: any;
  lineCoordinates: any = [];

  viewMaps(data) {
    this.markers = [];
    this.infoWindowOpen = 'checkIn'
    this.storeMapData = data;
    this.changeDetectorRef.detectChanges();
    this.latitude = this.storeMapData?.startLatitude ? Number(this.storeMapData?.startLatitude) : this.latitude;
    this.longitude = this.storeMapData?.startLongitude ? Number(this.storeMapData?.startLongitude) : this.longitude;
    this.zoom = 12;
    this.mapOptions = {
      center: {
        lat: this.storeMapData?.startLatitude ? Number(this.storeMapData?.startLatitude) : this.latitude,
        lng: this.storeMapData?.startLongitude ? Number(this.storeMapData?.startLongitude) : this.longitude
      },
      zoom: 17,
    };
    this.markers.push(
      {
        lat: Number(this.storeMapData?.startLatitude),
        lng: Number(this.storeMapData?.startLongitude),

      },
    );
    if (this.storeMapData?.endLatitude) {
      this.markers.push(
        {
          lat: Number(this.storeMapData?.endLatitude),
          lng: Number(this.storeMapData?.endLongitude),
        }
      )
    }
  }
  getMarkerIcon(type: number = 0): google.maps.Icon {
    const iconUrl = type == 0 ? 'assets/images/green-dot.png' : 'assets/images/yellow-dot.png';
    const size: Size = {
      width: 50,
      height: 50,
      equals: (other: Size) => other.width === size.width && other.height === size.height,
    };

    return {
      url: iconUrl,
      scaledSize: size,
    };
  }
  infoWindowOptions: google.maps.InfoWindowOptions = {
    pixelOffset: { width: 0, height: -30 } as Size
  };
  openInfoWindow(windowType: string) {
    console.log(windowType, "gg")


  }

  closeInfoWindow() {
    this.infoWindowOpen = null;

  }

  /**
   * Multiple Y-Axis Charts
   */

  multipleYAxisChart: any;
  private _multipleYAxisChart(colors: any, array: any) {
    colors = this.getChartColorsArray(colors);
    this.multipleYAxisChart = {
      series: [
        {
          name: "Not Confirm",
          type: "column",
          data: array.map((res) => {
            return res.countNotConfirm;
          }),
        },
        {
          name: "Billable",
          type: "column",
          data: array.map((res) => {
            return res.countBillable;
          }),
        },
        {
          name: "Non Billable",
          type: "line",
          data: array.map((res) => {
            return res.countNonBillable;
          }),
        },
      ],
      chart: {
        height: 500,
        type: "line",
        stacked: false,
        toolbar: {
          show: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 1, 4],
      },

      xaxis: {
        categories: array.map((res) => {
          return res.createdTicketDate;
        }),
        labels: {
          style: {
            fontSize: 10, // Set the desired font size for the x-axis
            colors: "#405189",
          },
        },
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#405189",
          },
          labels: {
            style: {
              colors: "#405189",
            },
          },
          title: {
            text: "Not Confirm",
            style: {
              color: "#405189",
              fontWeight: 600,
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: "Billable",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#405189",
          },
          labels: {
            style: {
              colors: "#405189",
            },
          },
          title: {
            text: "Billable",
            style: {
              color: "#405189",
              fontWeight: 600,
            },
          },
        },
        {
          seriesName: "Non Billable",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#63ad6f",
          },
          labels: {
            style: {
              colors: "#63ad6f",
            },
          },
          title: {
            text: "Non Billable",
            style: {
              color: "#63ad6f",
              fontWeight: 600,
            },
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
      legend: {
        horizontalAlign: "center",
        offsetX: 40,
      },
      colors: colors,
    };
  }
  lineColumnAreaChart: any;

  /**
   * Line, Column & Area Charts
   */
  private _lineColumnAreaChart(colors: any, array: any) {
    colors = this.getChartColorsArray(colors);
    this.lineColumnAreaChart = {
      series: [
        {
          name: "Not Confirm",
          type: "column",
          data: array.map((res) => {
            return res.countNotConfirm;
          }),
        },
        {
          name: "Billable",
          type: "area",
          data: array.map((res) => {
            return res.countBillable;
          }),
        },
        {
          name: "Non Billable",
          type: "line",
          data: array.map((res) => {
            return res.countNonBillable;
          }),
        },
      ],
      chart: {
        height: 500,
        type: "line",
        stacked: false,
        toolbar: {
          show: true,
        },
      },
      stroke: {
        width: [0, 2, 5],
        curve: "smooth",
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: array.map((res) => {
        return res.createdTicketMonth;
      }),
      markers: {
        size: 0,
      },
      xaxis: {
        type: "date",
      },
      yaxis: {
        title: {
          text: "Points",
        },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      colors: colors,
    };
  }
  totalTicket7DayGraphList: any = [];
  totalTicketMonthlyGraph: any = [];
  getV2_TotalTicket7DayGraph() {
    this.helpDeskService.getV2_TotalTicket7DayGraph().subscribe({
      next: (res: any) => {
        this.totalTicket7DayGraphList = res.list;
        this._multipleYAxisChart(
          '["--vz-primary", "--vz-info", "--vz-success"]',
          this.totalTicket7DayGraphList
        );
      },
    });
  }
  getV2_TotalTicketMonthlyGraph() {
    this.helpDeskService.getV2_TotalTicketMonthlyGraph().subscribe({
      next: (res: any) => {
        this.totalTicketMonthlyGraph = res.list;
        this._lineColumnAreaChart(
          '["--vz-primary", "--vz-success", "--vz-danger"]',
          this.totalTicketMonthlyGraph
        );
      },
    });
  }
  hubConnection: HubConnection;
  internalPostMessageValueStore: any = "0";
  globalPostMessageValueStore: any = "0";
  //For SignalR
  initialiseSignalRFunction() {
    // conection start
    sessionStorage.setItem("InternalPostMessageValue", "0");
    sessionStorage.setItem("GlobalPostMessageValue", "0");

    if (sessionStorage.getItem("InternalPostMessageValue")) {
      this.internalPostMessageValueStore = sessionStorage.getItem(
        "InternalPostMessageValue"
      );
    }

    if (sessionStorage.getItem("GlobalPostMessageValue")) {
      this.globalPostMessageValueStore = sessionStorage.getItem(
        "GlobalPostMessageValue"
      );
    }
    this.hubConnection = this.signalRService.getSignLrConnection();
    this.hubConnection.on("V2_TicketingProcess", (data) => {
      console.log("dd", data)
      this.playBoop();
      if (data.action === "Internal Post Message") {
        this.zone.run(() => {
          sessionStorage.setItem(
            "InternalPostMessageValue",
            String(
              Number(sessionStorage.getItem("InternalPostMessageValue")) + 1
            )
          );
          this.internalPostMessageValueStore = sessionStorage.getItem(
            "InternalPostMessageValue"
          );
        });
      }
      if (data.action === "Global Post Message") {
        this.zone.run(() => {
          sessionStorage.setItem(
            "GlobalPostMessageValue",
            String(Number(sessionStorage.getItem("GlobalPostMessageValue")) + 1)
          );
          this.globalPostMessageValueStore = sessionStorage.getItem(
            "GlobalPostMessageValue"
          );
        });
      }
    });
  }

  private async playSoundWav(url: string, vol: number, duration: number): Promise<void> {
    try {
      const audioContext = new AudioContext();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = audioContext.createGain();
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = vol * 0.01;

      source.start(audioContext.currentTime);
      source.stop(audioContext.currentTime + duration * 0.001);
    } catch (error) {
      console.error('Error loading or playing sound:', error);
    }
  }


  playSong() {
    navigator.vibrate([300, 300, 300]);
  }
  playBoop() {
    console.log("ggs")
    this.playSoundWav('../../../../../assets/mixkit-long-pop-2358.wav', 50, 100);
  }

  openInfoWindow_newInfo(marker: MapMarker, windowType: any) {
    this.infoWindowOpen = windowType;
    this.infoWindow?.open(marker);
  }


  // viewHandleMap(storeMapData) {
  //   sessionStorage.setItem("initalToTabs", "" +this.activeIdTop);
  //   sessionStorage.setItem("innerTaskTab", ""+this.onDutyActiveId);
  //   this.helpDeskService.initalToTabs = this.activeIdTop;
  //   this.helpDeskService.innerTaskTab = this.onDutyActiveId;

  //   if (storeMapData.taskType == 'Corrective') {
  //     this.ticketService.sendTicketId = storeMapData.woId;
  //     this.helpDeskService.pageAction = "";

  //     this.ticketService.ticketPageAction = "Basic Service Page";
  //     this.ticketService.lastStoreTicketRouterName =
  //       "maintenance-management/dashboard/help-desk-dashboard";
  //     localStorage.setItem(
  //       "lastStoreTicketRouterName",
  //       this.ticketService.lastStoreTicketRouterName
  //     );
  //     this.router.navigate([
  //       "/maintenance-management/corrective/ticket/ticket-view",
  //     ]);
  //   } else if (storeMapData.taskType == 'Preventive') {
  //     this.preventiveService.scheduleId = storeMapData.woId;;
  //     this.preventiveService.lastStorePreventiveRouterName = "maintenance-management/dashboard/help-desk-dashboard"

  //     this.router.navigate([
  //       "maintenance-management/preventive/schedule/current-schedule",
  //     ]);
  //   } else if (storeMapData.taskType == 'Audit') {
  //     this.auditService.auditId = storeMapData.woId;;
  //     this.router.navigate(["asset-management/audit-management/audit/viewaudit"]);
  //   } else {

  //   }
  // }


  viewHandleMap(storeMapData) {
    sessionStorage.setItem("initalToTabs", "" + this.activeIdTop);
    sessionStorage.setItem("innerTaskTab", "" + this.onDutyActiveId);
    this.helpDeskService.initalToTabs = this.activeIdTop;
    this.helpDeskService.innerTaskTab = this.onDutyActiveId;

    if (storeMapData.taskType == 'Corrective') {
      this.ticketService.sendTicketId = storeMapData.uniquedId;
      this.helpDeskService.pageAction = "";

      this.ticketService.ticketPageAction = "Basic Service Page";
      this.ticketService.lastStoreTicketRouterName =
        "maintenance-management/dashboard/help-desk-dashboard";
      localStorage.setItem(
        "lastStoreTicketRouterName",
        this.ticketService.lastStoreTicketRouterName
      );
      this.router.navigate([
        "/maintenance-management/corrective/ticket/ticket-view",
      ]);
    } else if (storeMapData.taskType == 'Preventive') {
      this.preventiveService.scheduleId = storeMapData.uniquedId;;
      this.preventiveService.lastStorePreventiveRouterName = "maintenance-management/dashboard/help-desk-dashboard"

      this.router.navigate([
        "maintenance-management/preventive/schedule/current-schedule",
      ]);
    } else if (storeMapData.taskType == 'Audit') {
      this.auditService.auditId = storeMapData.uniquedId;;
      this.router.navigate(["asset-management/audit-management/audit/viewaudit"]);
    } else {

    }
  }


  returnCurrentStatusClassesStatus(value: any) {
    return this.commonFunctionService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any) {
    return this.commonFunctionService.getStatusColorCircle(value);
  }


  removeToHtml(str) {
    let st = str.replace(/<[^>]+>/g, '');
    return st.replace('<a href="', '')


  }
  getCChatActive(value: any) {
    localStorage.setItem('setChartMesseageHelpDesk', value)
  }


}


