
 
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { DataModel } from '../management-dashboard/countProjectDashboard.interface';


@Component({
  selector: 'app-progress-dashboard',
  templateUrl: './progress-dashboard.component.html',
  styleUrl: './progress-dashboard.component.scss'
})
export class ProgressDashboardComponent  implements OnInit {

  activeIdTop: any = 1
  breadCrumbItems!: Array<{}>;
  statData!: any;
  OverviewChart: any;
  ActiveProjects: any;

  simpleDonutChart: any;
  activityStatusList: { name: any; count: any; type: string; textColor: any; }[];
  projectStatusData: { title: string; value: number; icon: string; }[];
  gradientChart: any
  projectManagementTaskAttendanceList: any;
  constructor(private commonHttpServiceCallerService: CommonHttpServiceCallerService,private commonFunctionService: CommonFunctionService,) {
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboards' },
      { label: 'Progress Dashboard', active: true }
    ];
    this.fetchData();

    
  }
  

  
  /**
* Simple Donut Chart
*/

  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
  };




  /**
 * Projects Overview
 */



  private _OverviewChart(colors: any) {
    colors = this.getChartColorsArray(colors);

    const statusMapping = {
      'TotalProjectPending': 'Pending',
      'TotalProjectInactive': 'Inactive',
      'TotalProjectActive': 'Active',
      'TotalProjectClosedFail': 'Closed-Fail',
      'TotalProjectDeleted': 'Deleted',
    };

    const chartData = this.totalCountProjectAdHockANdMaintenanceProject.dataProjectProfileStatusList.map(status => ({
      x: statusMapping[status.projectStatus],
      y: status.count,
      fillColor: colors[Object.keys(statusMapping).indexOf(status.projectStatus)]
    }));


    this.OverviewChart = {
      series: [{
        name: 'Count',
        data: chartData
      }],
      chart: {
        height: 374,
        type: 'bar',
        toolbar: {
          show: false,
        }
      },
      xaxis: {
        categories: Object.values(statusMapping),
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: true,
          }
        },
        yaxis: {
          lines: {
            show: true,
          }
        },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        }
      }
    };
  }
  // getChartColorsArray(colors: string[]): string[] {
  //   // Implement the logic to convert CSS variables to color codes
  //   return colors.map(color => getComputedStyle(document.documentElement).getPropertyValue(color).trim());
  // }

  getProjectCount(projectStatus) {
    const status = this.totalCountProjectAdHockANdMaintenanceProject.dataProjectProfileStatusList.find(item => item.projectStatus === projectStatus);
    return status ? status.count : null; // return null if the status is not found
  }

  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;
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




  /**
   * Fetches the data
   */
  private fetchData() {
    this.getV3_TotalCountProjectAdHockANdMaintenanceProject();
    this.getV3_ProjectManagementTaskAttendance()
  }


  totalCountProjectAdHockANdMaintenanceProject: DataModel
  getV3_TotalCountProjectAdHockANdMaintenanceProject() {
    let paylod = {};
    let url = 'api/ProjectManagementDash/GetV3_TotalCountProjectAdHockANdMaintenanceProject'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.totalCountProjectAdHockANdMaintenanceProject = res;

      this.projectStatusData = [{
        title: 'Verification Required',
        value: this.totalCountProjectAdHockANdMaintenanceProject.dataProjectManagementActivityStatusList.totalProjectVerificationRequired,
        icon: 'briefcase',


      }, {
        title: 'Acknowledgement Required',
        value: this.totalCountProjectAdHockANdMaintenanceProject.dataProjectManagementActivityStatusList.totalProjectAcknowledgementRequired,
        icon: 'award',


      }, {
        title: 'Pending Approval',
        value: this.totalCountProjectAdHockANdMaintenanceProject.dataProjectManagementActivityStatusList.totalProjectPendingApproval,
        icon: 'clock',


      }
      ];
      this.activityStatusList = this.transformActivityStatusList(this.totalCountProjectAdHockANdMaintenanceProject.dataProjectManagementActivityStatusList)
      this._OverviewChart('["--vz-primary", "--vz-warning", "--vz-success","--vz-danger","--vz-info" ]');

    })
  }

  getV3_ProjectManagementTaskAttendance() {
    let payload = {};
    let url = 'api/ProjectManagementDash/GetV3_ProjectManagementTaskAttendance';
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe((res: any) => {
      this.projectManagementTaskAttendanceList = res.projectTaskAttendance;
    
      this.projectManagementTaskAttendanceList.sort((a, b) => {
        let [aMonth, aYear] = a.monthYear.split('-');
        let [bMonth, bYear] = b.monthYear.split('-');
        return (aYear < bYear || (aYear === bYear && new Date(`01-${aMonth}-2000`) < new Date(`01-${bMonth}-2000`))) ? -1 : 1;
    });
    
    const categories = this.projectManagementTaskAttendanceList.map(item => item.monthYear);
    const data = this.projectManagementTaskAttendanceList.map(item => item.totalHours);
 
      this._gradientChart('["--vz-success"]', categories, data);
    });
  }

  private _gradientChart(colors: any, categories: any, data: any) {
    colors = this.getChartColorsArray_gradient(colors);
    this.gradientChart = {
      series: [{
        name: 'Total Hours',
        data: data
      }],
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: 7,
        curve: 'smooth'
      },
      xaxis: {
        type: 'category',
        categories: categories,
        tickAmount: 10,
      },
      title: {
        text: 'Project Task Attendance',
        align: 'left',
        style: {
          fontWeight: 500,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#09b29e'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        },
      },
      markers: {
        size: 4,
        colors: colors,
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      yaxis: {
        min: -10,
        max: 80,
        title: {
          text: 'Total Hours',
        },
      }
    };
  }

  private getChartColorsArray_gradient(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        } else return newValue;
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


  transformActivityStatusList(statusList: any) {
    const statusMapping = {
      totalProject: 'Total',
      totalProjectInitiated: 'Initiated',
      totalProjectInProgress: 'In Progress',
      totalProjectCompleted: 'Completed',
      totalProjectVerificationRequired: 'Verification ',
      totalProjectAcknowledgementRequired: 'Acknowledgement ',
      totalProjectPendingApproval: 'Pending Approval'
    }; const statusMappingColor = {
      totalProject: 'text-black',
      totalProjectInitiated: 'text-info',
      totalProjectInProgress: 'text-primary',
      totalProjectCompleted: 'text-success',
      totalProjectVerificationRequired: 'text-danger',
      totalProjectAcknowledgementRequired: 'text-danger',
      totalProjectPendingApproval: 'text-warning'
    };

    const unwantedKeys = ['totalAdHocProject', 'totalMaintenanceProject'];

    return Object.keys(statusList)
      .filter(key => !unwantedKeys.includes(key))
      .map(key => ({
        name: statusMapping[key],
        count: statusList[key],
        type: key,
        textColor: statusMappingColor[key],
      }));
  }
}