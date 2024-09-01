import { Component } from "@angular/core";
import { AssetDashboardService } from "src/app/core/services/asset-dashboard.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-asset-dashboard",
  templateUrl: "./asset-dashboard.component.html",
  styleUrls: ["./asset-dashboard.component.scss"],
})
export class AssetDashboardComponent {
  apiUrl: string = environment.apiUrl;

  label: any = "Asset Dashboard";
  breadCrumbItems: any = [
    { label: "Dashboard" },
    { label: "Asset Dashboard", active: true },
  ];

  totalAssetCounts: any[] = [];
  companyList: any[] = [];
  selectedCompanyId: any;
  expiredAssetsCounts: any;
  criticalAssetsRadialGraph: any;
  expiredCounts: any[] = [];
  totalExpiredAssetCounts: number = 0;

  assetWarranty: any[] = [];
  listAssetLoanRetun: any[] = [];

  constructor(
    private dropdownService: DropdownService,
    private assetDashboardService: AssetDashboardService,
    private commonFunctionService: CommonFunctionService,
  ) {
    // this._simplePieChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
    // this._criticalAssetsRadialGraph('["--vz-primary", "--vz-info", "--vz-danger", "--vz-success"]');
  }

  ngOnInit() {
    this.getCompanyDropdown();
    this.getAllCardsData();
  }

  getAllCardsData() {
    this.assetDashboardService
      .getAllAssetData(
        this.selectedCompanyId ? this.selectedCompanyId : undefined
      )
      .subscribe({
        next: (res: any) => {
          const assetTotalCount = res.objAssetTotalCount;
          this.totalAssetCounts = [
            {
              title: "IN SERVICE ASSETS",
              value: assetTotalCount.totalInserviceAsset,
              icon: "ri-tools-line",
            },
            {
              title: "Ready Stock Assets",
              value: assetTotalCount.totalReadyStockAsset,
              icon: "ri-shopping-cart-2-fill",
              profit: "up",
            },
            {
              title: "Loan Assets",
              value: assetTotalCount.totalLoanAsset,
              icon: "ri-money-dollar-circle-line",
              profit: "down",
            },
            {
              title: "Disposed Assets",
              value: assetTotalCount.totalDisposeAsset,
              icon: "ri-delete-bin-5-fill",
              profit: "up",
            },
            {
              title: "Transferred Asset",
              value: assetTotalCount.totalTransferedAsset,
              icon: "ri-git-pull-request-line",
              profit: "up",
            },
          ];

          const expiredCounts = res.objExpiredAssetCount;
          const expiredCountsSeries = Object.entries(expiredCounts).map(
            (i) => i[1]
          );
          const expiredCountsLabels = Object.entries(expiredCounts).map((i) =>
            i[0]
              .replace("count", "")
              .split(/(?=[A-Z])/)
              .join(" ")
          );
          this.expiredCounts = Object.entries(expiredCounts).map((i) => ({
            label: i[0]
              .replace("count", "")
              .split(/(?=[A-Z])/)
              .join(" "),
            value: i[1],
          }));

          let sum = 0;
          Object.values(expiredCounts).map((i: number) => (sum += i));
          this.totalExpiredAssetCounts = sum;
          this.generateExpiredAssetPieChart(
            '["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]',
            expiredCountsSeries.length ? expiredCountsSeries : [0, 0, 0],
            expiredCountsLabels
          );

          const criticalAssetCounts = res.objCriticalAsset;
          const criticalAssetSeries = Object.values(criticalAssetCounts).map(
            (i: number) => i
          );
          const criticalAssetLabels = Object.keys(criticalAssetCounts).map(
            (i) => i.replace("total", "")
          );

          const criticalAssetArray = Object.entries(criticalAssetCounts).map(
            (i) => ({
              name: i[0]
                .replace("total", "")
                .split(/(?=[A-Z])/)
                .join(" "),
              data: [i[1]],
            })
          );

          this.generateCriticalAssetRadialGraph(
            '["--vz-primary", "--vz-info", "--vz-danger", "--vz-success"]',
            criticalAssetArray
          );

          this.assetWarranty = res.listAssetWarrenty;
          this.listAssetLoanRetun = res.listAssetLoanRetun;
        },
      });
  }

  getCompanyDropdown() {
    this.dropdownService.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.companyList = res.list;
    });
  }

  onChangeCompanyDropdown() {
    this.getAllCardsData();
  }

  returnworkFlowAssetStatus(id: any) {
    return this.commonFunctionService.returnWorkFlowStatusBadgeClasses(id);
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  private generateExpiredAssetPieChart(colors: any, series, labels) {
    colors = this.getChartColorsArray(colors);
    this.expiredAssetsCounts = {
      series: series,
      labels: labels,
      chart: {
        type: "donut",
        height: 250,
      },
      plotOptions: {
        pie: {
          offsetX: 0,
          offsetY: 0,
          donut: {
            size: "70%",
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

  private generateCriticalAssetRadialGraph(colors: any, data: any[]) {
    colors = this.getChartColorsArray(colors);
    this.criticalAssetsRadialGraph = {
      series: data,
      chart: {
        type: "bar",
        height: 450,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "85%",
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
          text: "Critical Assets",
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
}
