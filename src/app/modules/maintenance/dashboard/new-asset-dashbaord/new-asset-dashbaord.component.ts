import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AssetDashboardService } from "src/app/core/services/asset-dashboard.service";
import { AssetService } from "src/app/core/services/asset.service";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import { event } from 'jquery';

@Component({
  selector: "app-new-asset-dashbaord",
  templateUrl: "./new-asset-dashbaord.component.html",
  styleUrls: ["./new-asset-dashbaord.component.scss"],
})
export class NewAssetDashbaordComponent {
  breadCrumbItems!: Array<{}>;
  companyList: any = [];
  selectedCompanyId: any;
  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
  };
  totalAssetCounts: any[] = [];
  expiredCounts: any[] = [];
  totalExpiredAssetCounts: number = 0;
  criticalAssetsRadialGraph: any;
  expiredAssetsCounts: any;
  assetWarranty: any[] = [];
  listAssetLoanRetun: any[] = [];
  apiUrl: string = environment.apiUrl;
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
    quotationRejected: true,
    ticketAcknowledgmentRequest: true,
    pmScheduleCompletionAcknowlegementAdmin: true,
    pmScheduleCompletionAcknowlegementClient: true,
    auditCompletionAcknowlegementAdmin: true,
    auditCompletionAcknowlegementClient: true,
  };
  issueAssetsActive: number = 1;
  maintabsActive: number = 1;
  totalCountTicketServiceOrderIncident: any = {};
  constructor(
    private dropdownService: DropdownService,
    private assetDashboardService: AssetDashboardService,
    private commonFunctionService: CommonFunctionService,
    private helpDeskService: HelpDeskService,
    private router: Router,
    private assetService: AssetService,
    private dropdownServices: DropdownService
  ) { }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "Asset Dashboard", active: true },
    ];
    this.getCompanyDropdown();
    this.getV2_TotalCountTicketServiceOrderIncident();
    this.getProjectList();
    this.getV2_DashboardTodoList();
    if (localStorage.getItem('onTabChangeMaintabsActive')) {
      this.maintabsActive = Number(localStorage.getItem('onTabChangeMaintabsActive'))
    }
    if (this.assetService.backTabs) {
      this.maintabsActive = 3;
      if (this.assetService.backTabs == "Not Delivered") {
        this.issueAssetsActive = 1;
      } else if (this.assetService.backTabs == "Not Installed") {
        this.issueAssetsActive = 2;
      } else if (this.assetService.backTabs === "Warranty Asset") {
        this.issueAssetsActive = 4;
      } else if (this.assetService.backTabs === "Extended Asset") {
        this.issueAssetsActive = 5;
      } else if (this.assetService.backTabs == "RMA Asset") {
        this.issueAssetsActive = 6;
      } else {
        this.issueAssetsActive = 1;
      }
    }

    if (localStorage.getItem('onTabChangeIssueAssetsActive')) {
      this.issueAssetsActive = Number(localStorage.getItem('onTabChangeIssueAssetsActive'))
    }
  }

  getCompanyDropdown() {
    this.dropdownService.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.companyList = res.list;
      if (this.companyList.length != 0) {
        if (localStorage.getItem('storeCompanyId')) {
          this.selectedCompanyId = Number(localStorage.getItem('storeCompanyId'));
        } else {
          this.selectedCompanyId = this.companyList[0].companyId;
        }
        localStorage.setItem('storeCompanyId', this.selectedCompanyId)
        this.getAllCardsData();
      }
    });
  }
  onChangeCompanyDropdown() {
    if(this.selectedCompanyId){
      localStorage.setItem('storeCompanyId', this.selectedCompanyId);
    }else{
      localStorage.removeItem('storeCompanyId');
    }
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
              title: "READY STOCK ",
              value: assetTotalCount.totalReadyStockAsset,
              icon: "ri-shopping-cart-2-fill",
              statuId: 11
            },
            {
              title: "IN-SERVICE",
              value: assetTotalCount.totalInserviceAsset,
              icon: "ri-tools-line",
              statuId: 3
            },
            {
              title: "Disposed ",
              value: assetTotalCount.totalDisposeAsset,
              icon: "ri-delete-bin-5-fill",
              statuId: null
            },

            {
              title: "Delivered",
              value: assetTotalCount.totalDeliveredAsset,
              icon: "ri-money-dollar-circle-line",
              statuId: 64
            },

            {
              title: "Installed/Assigned",
              value: assetTotalCount.totalInstalledAsset,
              icon: "ri-git-pull-request-line",
              statuId: null
            },
          ];

          console.log(res.objExpiredAssetCount);

          const expiredCounts = res.objExpiredAssetCount;
          const expiredCountsSeries = Object.entries(expiredCounts).map(
            (i) => i[1]
          );
          const expiredCountsLabels = Object.entries(expiredCounts).map((i) =>
            i[0]
              .replace("count", "")
              .replace("Warrenty","Warranty")
              .split(/(?=[A-Z])/)
              .join(" ")
          );
          this.expiredCounts = Object.entries(expiredCounts).map((i) => ({
            label: i[0]
              .replace("count", "")
              .replace("Warrenty","Warranty")
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

  getV2_TotalCountTicketServiceOrderIncident() {
    this.helpDeskService
      .getV2_TotalCountTicketServiceOrderIncident()
      .subscribe((res: any) => {
        this.totalCountTicketServiceOrderIncident = res.data;
      });
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

  totalCountWorkflowTodoList: any[] = [];
  getV2_DashboardTodoList() {
    this.helpDeskService.getV2_DashboardTodoList().subscribe((res: any) => {
      this.totalCountWorkflowTodoList = res.data;
    });
  }

  navigateMyWorkflowPageList(workflowObject: any) {
    if (workflowObject) {
      this.helpDeskService.pageAction = "Workflow Page";
      this.helpDeskService.workflowObject = { ...workflowObject };

      // for  Approival asset
      if (workflowObject.masterWorkflowId == 1) {
        this.router.navigate([
          "/maintenance-management/dashboard/asset-list-dashboard",
        ]);
      }

      // for the Quotation list
      // else if (workflowObject.masterWorkflowId == 10) {
      //   this.router.navigate([
      //     "/maintenance-management/dashboard/quotation-ticket-list",
      //   ]);
      // } else if (workflowObject.masterWorkflowId == 11) {
      //   this.router.navigate([
      //     "/maintenance-management/dashboard/quotation-ticket-list",
      //   ]);
      // }
    }
  }

  projectList: any[] = [];

  getProjectList() {
    this.helpDeskService.getProjectList().subscribe({
      next: (res: any) => {
        this.projectList = res.list;
      },
    });
  }

  onTabChangeIssueAssetsActive(event) {
    localStorage.setItem('onTabChangeIssueAssetsActive', String(event))
  }

  onTabChangeMaintabsActive(event) {
    localStorage.setItem('onTabChangeMaintabsActive', String(event))
  }


  onClickTopCard(statusId) {
    localStorage.removeItem("objectSerachForAsset");
    if (localStorage.getItem('storeCompanyId')) {
      localStorage.getItem('storeCompanyId')
      this.getDropdownClientlist(statusId);

    }
    else {
      let objectSerachForAsset: any = {};
      if (statusId)
       objectSerachForAsset.SearchAssetStatusId =
          statusId;
      localStorage.setItem(
        "objectSerachForAsset",
        JSON.stringify(objectSerachForAsset)
      );
      this.router.navigate(['/asset-management/asset/listasset'])
    }
  }

  arrayListDropDownClientList: any = [];
  arrayListDropDownCategoryList:any=[];
  getDropdownClientlist(statusId: any) {
    let payload: any = {
      SearchCompanyId: Number(localStorage.getItem('storeCompanyId'))
    };
    this.dropdownServices
      .GetClientListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        this.getDropdownCategoryList(statusId)
      });
  }



  getDropdownCategoryList(statusId) {
    let payload: any = {
      SearchCompanyId: Number(localStorage.getItem('storeCompanyId'))
    };
    this.dropdownServices
      .GetCategoryListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownCategoryList = res.list;
        let objectSerachForAsset: any = {};
        if (localStorage.getItem('storeCompanyId')) {
          objectSerachForAsset.SearchCompanyId =
            Number(localStorage.getItem('storeCompanyId'))
        }

        if (this.arrayListDropDownClientList) {
          objectSerachForAsset.arrayListDropDownClientList =
            this.arrayListDropDownClientList;
        }
          if (this.arrayListDropDownCategoryList) {
          objectSerachForAsset.arrayListDropDownCategoryList =
            this.arrayListDropDownCategoryList;
        }
        if (statusId)
          objectSerachForAsset.SearchAssetStatusId =
            statusId;
        localStorage.setItem(
          "objectSerachForAsset",
          JSON.stringify(objectSerachForAsset)
        );
        this.router.navigate(['/asset-management/asset/listasset'])
     
      });
  }
}
