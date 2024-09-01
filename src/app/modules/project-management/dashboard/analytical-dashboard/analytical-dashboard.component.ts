
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-analytical-dashboard',
  templateUrl: './analytical-dashboard.component.html',
  styleUrl: './analytical-dashboard.component.scss'
})
export class AnalyticalDashboardComponent implements OnInit {
  chartValueActive:any=1
  statData = [{
    title: 'Total Project ',
    value: 9,
    icon: ' ri-book-line',
    profit: 'down',
  
  },{
    title: 'Total Task',
    value: 17,
    icon: 'ri-space-ship-line',
  
  
  }, {
    title: 'Total SubTask',
    value: 14,
    icon: ' ri-shopping-basket-line',
  
  
  }, {
    title: 'Total FollowUp',
    value: 32,
    icon: ' ri-chat-follow-up-line',
  
    }, {
    title: 'Upload Document ',
    value: 15,
    icon: ' ri-file-line',
    
  }, 
  ];
  TeamMembers = [
    {
      name: "Create new Admin Template",
      dedline: '03 Nov 2021',
      status: 'Completed',
      assignee: 
      {
        name: 'Mary Stoner',
        profile: 'assets/images/users/avatar-2.jpg'
      }
    },
    {
      name: "Marketing Coordinator",
      dedline: '17 Nov 2021',
      status: 'Progress',
      assignee: 
      {
        name: 'Den Davis',
        profile: 'assets/images/users/avatar-7.jpg'
      }
    },
    {
      name: "Administrative Analyst",
      dedline: '26 Nov 2021',
      status: 'Completed',
      assignee: 
      {
        name: 'Alex Brown',
        profile: 'assets/images/users/avatar-6.jpg'
      }
    },
    {
      name: "E-commerce Landing Page",
      dedline: '10 Dec 2021',
      status: 'Pending',
      assignee: 
      {
        name: 'Prezy Morin',
        profile: 'assets/images/users/avatar-5.jpg'
      }
    },
    {
      name: "UI/UX Design",
      dedline: '22 Dec 2021',
      status: 'Progress',
      assignee: 
      {
        name: 'Stine Nielsen',
        profile: 'assets/images/users/avatar-1.jpg'
      }
    },
    {
      name: "Projects Design",
      dedline: '31 Dec 2021',
      status: 'Pending',
      assignee: 
      {
        name: 'Jansh William',
        profile: 'assets/images/users/avatar-4.jpg'
      }
    }
  ];
  breadCrumbItems!: Array<{}>;

  ScheduleOverviewChart: any;
  DealTypeChart: any;
  splineAreaChart: any;
  basicPolarChart: any;
  MyTask = [
    {
      name: "Create new Admin Template",
      dedline: '03 Nov 2021',
      status: 'Completed',
      assignee: 
      {
        name: 'Mary Stoner',
        profile: 'assets/images/users/avatar-2.jpg'
      }
    },
    {
      name: "Marketing Coordinator",
      dedline: '17 Nov 2021',
      status: 'Progress',
      assignee: 
      {
        name: 'Den Davis',
        profile: 'assets/images/users/avatar-7.jpg'
      }
    },
    {
      name: "Administrative Analyst",
      dedline: '26 Nov 2021',
      status: 'Completed',
      assignee: 
      {
        name: 'Alex Brown',
        profile: 'assets/images/users/avatar-6.jpg'
      }
    },
    {
      name: "E-commerce Landing Page",
      dedline: '10 Dec 2021',
      status: 'Pending',
      assignee: 
      {
        name: 'Prezy Morin',
        profile: 'assets/images/users/avatar-5.jpg'
      }
    },
    {
      name: "UI/UX Design",
      dedline: '22 Dec 2021',
      status: 'Progress',
      assignee: 
      {
        name: 'Stine Nielsen',
        profile: 'assets/images/users/avatar-1.jpg'
      }
    },
    {
      name: "Projects Design",
      dedline: '31 Dec 2021',
      status: 'Pending',
      assignee: 
      {
        name: 'Jansh William',
        profile: 'assets/images/users/avatar-4.jpg'
      }
    }
    
  ];
  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Dashboards' },
      { label: 'Analytical Dashboard', active: true }
    ];

     this._ScheduleOverviewChart('["--vz-primary", "--vz-secondary", "--vz-info","--vz-success"]');

     this._basicPolarChart('["--vz-primary", "--vz-success",  "--vz-info"]');
    }

   // Chart Colors Set
   private getChartColorsArray(colors:any) {
    colors = JSON.parse(colors);
    return colors.map(function (value:any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
            if (color) {
            color = color.replace(" ", "");
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



  private _ScheduleOverviewChart(colors:any) {
    colors = this.getChartColorsArray(colors);
    this.ScheduleOverviewChart = {
      series: [
        {
        name: 'Pending',
        data: [7]
      }, {
          name: 'Daft',
          data: [12]
      }, {
        name: 'In-Progress',
        data: [18]
    },{
      name: 'Completed',
      data: [10]
  }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
            show: false,
        },
      },
      plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '65%',
          },
      },
      stroke: {
          show: true,
          width: 5,
          colors: ['transparent']
      },
      xaxis: {
        categories: [''],
        axisTicks: {
            show: false,
            borderType: 'solid',
            color: '#78909C',
            height: 6,
            offsetX: 0,
            offsetY: 0
        },
        title: {
            text: 'Total Forecasted Value',
            offsetX: 0,
            offsetY: -45,
            style: {
                color: '#78909C',
                fontSize: '12px',
                fontWeight: 400,
            },
        },
      },
      
      fill: {
          opacity: 1
      },
      legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'center',
          fontWeight: 500,
          offsetX: 0,
          offsetY: -14,
          itemMargin: {
              horizontal: 8,
              vertical: 0
          },
          markers: {
              width: 10,
              height: 10,
          }
      },
      colors: colors
    };
  }


  private _basicPolarChart(colors:any) {
    colors = this.getChartColorsArray(colors);
    this.basicPolarChart = {
      series: [14, 23, 21,],
      chart: {
        type: "polarArea",
        width: 400,
      },
      labels: [
      
        "Pending",
        "Completed",
        "In-progress",
      ],
      stroke: {
        colors: ["#fff"],
      },
      fill: {
        opacity: 0.8,
      },
      legend: {
        position: "bottom",
      },
      colors: colors,
    };
  }

  
}
