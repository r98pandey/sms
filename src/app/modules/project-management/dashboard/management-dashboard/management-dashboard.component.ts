
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { DataModel } from './countProjectDashboard.interface';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { ClosingDeals, crmstatData, DealsStatus, UpcomingActivities } from './dashboardCrm';
import { hide } from '@popperjs/core';
import { circle, latLng, tileLayer } from 'leaflet';

@Component({
  selector: 'app-management-dashboard',
  templateUrl: './management-dashboard.component.html',
  styleUrl: './management-dashboard.component.scss'
})
export class ManagementDashboardComponent implements OnInit {

  activeIdTop: any = 1
  breadCrumbItems!: Array<{}>;
  statData!: any;
  salesForecastChart: any;
  DealTypeChart: any;
  sunburstChart: any;
  PieChart:any;
  patternedDonutChart: any;
  lineAreaChart!: any;
  constructor(private commonHttpServiceCallerService: CommonHttpServiceCallerService, private commonFunctionService: CommonFunctionService,) {
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboards' },
      { label: 'Management Dashboard', active: true }
    ];

    this.fetchData();
    this._salesForecastChart('["--vz-primary", "--vz-success", "--vz-danger"]');
    this._DealTypeChart('["--vz-warning", "--vz-secondary", "--vz-success"]');
    this._PieChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
  
    this._sunburstChart('["--vz-warning", "--vz-success"]');
    this._patternedDonutChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
    this._lineAreaChart('["--vz-primary-rgb, 0.2", "--vz-primary", "--vz-success-rgb, 0.2", "--vz-success"]');
  
  }


  // Chart Colors Set
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

  /**
 * Sales Forecast Charts
 */
  setforecastvalue(value: any) {
    if (value == 'oct') {
      this.salesForecastChart.series = [{
        name: 'Goal',
        data: [17]
      }, {
        name: 'Pending Forcast',
        data: [6]
      }, {
        name: 'Revenue',
        data: [37]
      }]
    }
    if (value == 'nov') {
      this.salesForecastChart.series = [{
        name: 'Goal',
        data: [37]
      }, {
        name: 'Pending Forcast',
        data: [12]
      }, {
        name: 'Revenue',
        data: [18]
      }]
    }
    if (value == 'dec') {
      this.salesForecastChart.series = [{
        name: 'Goal',
        data: [25]
      }, {
        name: 'Pending Forcast',
        data: [20]
      }, {
        name: 'Revenue',
        data: [27]
      }]
    }
    if (value == 'jan') {
      this.salesForecastChart.series = [{
        name: 'Goal',
        data: [7]
      }, {
        name: 'Pending Forcast',
        data: [5]
      }, {
        name: 'Revenue',
        data: [32]
      }]
    }
  }

  private _salesForecastChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.salesForecastChart = {
      series: [{
        name: 'Goal',
        data: [37]
      }, {
        name: 'Pending Forcast',
        data: [12]
      }, {
        name: 'Revenue',
        data: [18]
      }],
      chart: {
        type: 'bar',
        height: 430,
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
      yaxis: {
        labels: {
          formatter: function (value: any) {
            return "$" + value + "k";
          }
        },
        tickAmount: 4,
        min: 0
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

  /**
 * Deal Type Chart
 */
  setdealvalue(value: any) {
    if (value == 'today') {
      this.DealTypeChart.series = [{
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      },
      {
        name: 'Series 2',
        data: [20, 30, 40, 80, 20, 80],
      },
      {
        name: 'Series 3',
        data: [44, 76, 78, 13, 43, 10],
      }]
    }
    if (value == 'weekly') {
      this.DealTypeChart.series = [{
        name: 'Series 1',
        data: [90, 40, 40, 20, 80, 50],
      },
      {
        name: 'Series 2',
        data: [50, 20, 30, 70, 30, 80],
      },
      {
        name: 'Series 3',
        data: [54, 76, 78, 23, 43, 50],
      }]
    }
    if (value == 'monthly') {
      this.DealTypeChart.series = [{
        name: 'Series 1',
        data: [20, 50, 30, 50, 100, 80],
      },
      {
        name: 'Series 2',
        data: [80, 30, 70, 50, 30, 50],
      },
      {
        name: 'Series 3',
        data: [44, 56, 78, 53, 43, 10],
      }]
    }
    if (value == 'yearly') {
      this.DealTypeChart.series = [{
        name: 'Series 1',
        data: [20, 50, 90, 40, 100, 20],
      },
      {
        name: 'Series 2',
        data: [50, 80, 40, 40, 10, 60],
      },
      {
        name: 'Series 3',
        data: [34, 96, 58, 23, 33, 40],
      }]
    }
  }

  private _DealTypeChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.DealTypeChart = {
      series: [{
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      },
      {
        name: 'Series 2',
        data: [20, 30, 40, 80, 20, 80],
      },
      {
        name: 'Series 3',
        data: [44, 76, 78, 13, 43, 10],
      }
      ],
      chart: {
        height: 350,
        type: 'radar',
        dropShadow: {
          enabled: true, blur: 1, left: 1, top: 1
        },
        toolbar: {
          show: false
        },
      },
      stroke: {
        width: 2
      },
      fill: {
        opacity: 0.2
      },
      markers: {
        size: 0
      },
      colors: colors,
      xaxis: {
        categories: ['2014', '2015', '2016', '2017', '2018', '2019']
      }
    };
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




  private fetchData() {
    this.statData = crmstatData;
    // this.DealsStatus = DealsStatus;
    // this.UpcomingActivities = UpcomingActivities;
    // this.ClosingDeals = ClosingDeals;
  }

  private _sunburstChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.sunburstChart = {
      color: colors,
      height: 350,
      series: {
        type: 'sunburst',
        data: [{
          name: 'Grandpa',
          children: [{
            name: 'Uncle Leo',
            value: 15,
            children: [{
              name: 'Cousin Jack',
              value: 2
            },
            {
              name: 'Cousin Mary',
              value: 5,
              children: [{
                name: 'Jackson',
                value: 2
              }]
            },
            {
              name: 'Cousin Ben',
              value: 4
            }
            ]
          },
          {
            name: 'Father',
            value: 10,
            children: [{
              name: 'Me',
              value: 5
            },
            {
              name: 'Brother Peter',
              value: 1
            }
            ]
          }
          ]
        },
        {
          name: 'Nancy',
          children: [{
            name: 'Uncle Nike',
            children: [{
              name: 'Cousin Betty',
              value: 1
            },
            {
              name: 'Cousin Jenny',
              value: 2
            }
            ]
          }]
        }
        ],
        radius: [0, '90%'],
        label: {
          rotate: 'radial'
        }
      },
      textStyle: {
        fontFamily: 'Poppins, sans-serif'
      },
    }
  }
  
     // PieChart
     private _PieChart(colors:any) {
      colors = this.getChartColorsArray(colors);
      this.PieChart = {
          tooltip: {
          trigger: 'item'
          },
          
          color: colors,
          series: [{
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: [{
                      value: 1048,
                      name: 'Search Engine'
                  },
                  {
                      value: 735,
                      name: 'Direct'
                  },
                  {
                      value: 580,
                      name: 'Email'
                  },
                  {
                      value: 484,
                      name: 'Union Ads'
                  },
                  {
                      value: 300,
                      name: 'Video Ads'
                  }
              ],
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }],
          textStyle: {
              fontFamily: 'Poppins, sans-serif'
          },
      };
  }


  /**
 * Patterned Donut Chart
 */
  private _patternedDonutChart(colors:any) {
    colors = this.getChartColorsArray(colors);
    this.patternedDonutChart = {
    series: [44, 55, 41, 17, 15],
    chart: {
      height: 550,
      type: "donut",
      dropShadow: {
        enabled: true,
        color: "#111",
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.2,
      },
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
            },
          },
        },
      },
    },
    labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
    dataLabels: {
      dropShadow: {
        blur: 3,
        opacity: 0.8,
      },
    },
    fill: {
      type: "pattern",
      opacity: 1,
      pattern: {
        style: [
          "verticalLines",
          "squares",
          "horizontalLines",
          "circles",
          "slantedLines",
        ],
      },
    },
    states: {
      hover: {
      },
    },
    theme: {
      palette: "palette2",
    },
    
    legend: {
      position: "bottom",
    },
    colors: colors,
    };
  }

    /**
 * Line Area Chart
 */
    private _lineAreaChart(colors:any) {
      colors = this.getChartColorsArray(colors);
      this.lineAreaChart = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
        datasets: [
          {
              label: "Sales Analytics",
              fill: true,
              lineTension: 0.5,
              backgroundColor: colors[0],
              borderColor: colors[1],
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: colors[1],
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: colors[1],
              pointHoverBorderColor: "#fff",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [65, 59, 80, 81, 56, 55, 40, 55, 30, 80]
          },
          {
              label: "Monthly Earnings",
              fill: true,
              lineTension: 0.5,
              backgroundColor: colors[2],
              borderColor: colors[3],
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: colors[3],
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: colors[3],
              pointHoverBorderColor: "#eef0f2",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [80, 23, 56, 65, 23, 35, 85, 25, 92, 36]
          }
        ],
        options: {
            defaultFontColor: '#8791af',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        gridLines: {
                            color: 'rgba(166, 176, 207, 0.1)',
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            max: 100,
                            min: 20,
                            stepSize: 10,
                        },
                        gridLines: {
                            color: 'rgba(166, 176, 207, 0.1)',
                        },
                    },
                ],
            },
      
        }
      }
    }


    options = {
      layers: [
        tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbWVzYnJhbmQiLCJhIjoiY2xmbmc3bTV4MGw1ejNzbnJqOWpubzhnciJ9.DNkdZVKLnQ6I9NOz7EED-w", {
          id: "mapbox/light-v9",
          tileSize: 512,
          zoomOffset: 0,
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        })
      ],
      zoom: 1.1,
      center: latLng(28, 1.5)
    };
    layers = [
      circle([41.9, 12.45], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
      circle([12.05, -61.75], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
      circle([1.3, 103.8], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    ];
  
}