import { Component, OnInit } from "@angular/core";
import { CompanyService } from "src/app/core/services/company.service";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AssetService } from "src/app/core/services/asset.service";
import { environment } from "../../../../../../environments/environment";
import { SubCategoryService } from "src/app/core/services/subcategory.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { CategoryService } from "src/app/core/services/category.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuditService } from "src/app/core/services/audit.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";

@Component({
  selector: "app-view-self-audit",
  templateUrl: "./view-self-audit.component.html",
  styleUrls: ["./view-self-audit.component.scss"],
})
export class ViewSelfAuditComponent implements OnInit {
  auditAssetList: any;
  auditAssetId: any;
  maxChars = 100;
  textvalue = "";
  chars = 0;
  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  rows = [];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  _companyId: any;
  itemsPerPage: number;
  totalItems: any;
  previousPage: any;
  loadingTableData: boolean;
  cName: any;
  page = 1;
  collectionSize = 0;
  assetData: any[];
  flag: boolean = false;
  _globalCompanyId: string;
  confirmResut: string;
  detailswFActivityList: any[] = [];
  wFActivityList: any;
  assetId: any;
  assignType: any;
  assetImagePath: any;
  assetName: any;
  assetTagId: any;
  ImageUrl: any;
  departmentListData: any;
  categoryListData: any;
  subCategoryListData: any;
  departmentName: any;
  categoryName: any;
  subCategoryName: any;
  categoryId: any;
  advanceSearchOn: boolean;
  pageNo: number;
  returnAssetForm: FormGroup;
  optionsRadios: any;
  statusType: any;
  subCategoryDisable: boolean;
  assetStatuslist: any[] = [];
  //assetStatusName:any;
  assetStatusValue: any;
  assetTagIdValue: any;
  assetNameValue: any;
  count: number;
  assetauditListData: any;
  assetAuditName: any;
  imageUrl: any;
  isTableView: boolean;
  loading: boolean;
  auditStatusId: number;
  assetAuditId: number;
  isProject: boolean = false;

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private assetService: AssetService,
    private categoryService: CategoryService,
    private departmentService: DepartmentService,
    private subCategoryService: SubCategoryService,
    private auditService: AuditService,
    private authService: AuthAssetService
  ) {
    this.assetauditListData = [];
    this.auditAssetList = { ...this.auditService.auditAsset };
    this.imageUrl = environment.apiUrl;
    this.auditAssetId = this.auditAssetList.assetAuditId;
    this.assetAuditName = this.auditAssetList.assetAuditName;

    //console.log("  this.auditAssetId", this.auditAssetList);
    this.auditStatusId = this.auditAssetList.auditStatusId;
    this.assetAuditId = this.auditAssetList.assetAuditId;

    if (
      this.auditAssetList["assetAuditId"] ||
      this.auditAssetList["assetAuditId"] == 0
    ) {
      this.getViewDetails();
    } else {
      this.router.navigate(["/audit-management/audit-self/listauditself"]);
    }

    this.loadingTableData = false;

    this.subCategoryDisable = true;
    this.advanceSearchOn = false;
    this.ImageUrl = environment.apiUrl;
    this.optionsRadios = "17";
    this.detailswFActivityList = [];
    this.wFActivityList = [];
    this.statusType = null;
    this.isTableView = false;
    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {
    this._globalCompanyId = localStorage.getItem("globalCompanyId");
    this.from = this.page;
    this.to = this.pageSize;
    this.loadData();
    this.getDepartment();
    this.getCategory();
    this.getAssetStatusList("LoanPageList");
  }
  getViewDetails() {
    this.auditService.getMasterAssetAuditDetail(this.auditAssetId).subscribe(
      (res: any) => {
        this.assetauditListData = res;
        this.loadingTableData = false;

        //console.log("assetauditListData->", this.assetauditListData);
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  goback() {
    this.router.navigate(["/audit-management/audit-self/listauditself"]);
  }

  confirmUpdate(content, asset: any) {
    //console.log("assets", asset);
    this.assetId = asset.id;
    (this.assignType = asset.workflowName),
      (this.assetImagePath = asset.assetImagePath),
      (this.assetName = asset.assetName),
      (this.assetTagId = asset.assetTagId),
      this.getWFActivityData(this.assetId, this.assignType);
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "xl",
        scrollable: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.confirmResut = `Closed with: ${result}`;
        },
        (reason) => {
          this.confirmResut = `Dismissed with: ${reason}`;
        }
      );
  }

  getWFActivityData(assetId: any, assignType: any) {
    this.detailswFActivityList = [];
    this.assetService
      .getWFActivityList(assetId, assignType)
      .subscribe((res: any) => {
        this.wFActivityList = res.data;
      });
  }

  reloadPage() {
    if ((this.advanceSearchOn = true)) {
      this.loadData(this.pageSize, 0);
      this.page = 1;
    } else {
      this.loadData(this.pageSize, this.from - 1);
    }
  }

  loadPage(pageNo: number) {
    this.pageNo = pageNo;
    this.loadData(this.pageSize, this.pageSize * (pageNo - 1));
    //console.log(pageNo);
  }

  loadPage2(pageNo: number) {
    this.pageNo = pageNo;
    this.loadData(this.pageSize, this.pageSize * (pageNo - 1));
    //console.log(pageNo);
  }
  loadData(displayLength: number = 10, startIndex: Number = 0) {
    this.loadingIndicator = true;
    this.auditService
      .getTransactionAssetSelfAudit_ByPagination(
        this.auditAssetId,
        displayLength,
        startIndex
      )
      .subscribe((res: any) => {
        //console.log(res);
        this.rows = res;
        this.isTableView = true;

        if (this.rows.length > 0) {
          this.totalRecordsFromApi = res[0].totalCount;
          this.from = res.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res[0].rowNum
          );
          this.to = res.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res[0].rowNum
          );
          this.pageSize = displayLength;
        } else {
          this.totalRecordsFromApi = 0;
          this.from = 0;
          this.to = 0;
          this.pageSize = displayLength;
        }

        this.loadingIndicator = false;
      });
  }

  confirmadvanceSearch(content) {
    this.count = 0;
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "lg",
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          if (this.departmentName) this.count++;
          if (this.categoryId) this.count++;
          if (this.subCategoryName) this.count++;
          if (this.assetStatusValue) this.count++;
          if (this.assetNameValue) this.count++;
          if (this.assetTagIdValue) this.count++;
          //console.log("this.count", this.count);
          this.categoryListData.forEach((ele) => {
            if (ele.categoryId == this.categoryId) {
              this.categoryName = ele.categoryName;
            }
          });
          //console.log("this.categoryName", this.categoryName);

          this.loadData(this.pageSize, 0);
          this.advanceSearchOn = true;
          // this.count=0;
        },
        (reason) => {
          if (
            this.departmentName == null &&
            this.categoryName == null &&
            this.categoryId == null &&
            this.subCategoryName == null &&
            this.assetStatusValue == null &&
            this.assetNameValue == null &&
            this.assetTagIdValue == null
          ) {
            this.advanceSearchOn = false;

            this.loadData(this.pageSize, 0);
          } else {
            if (this.departmentName) this.count++;
            if (this.categoryId) this.count++;
            if (this.subCategoryName) this.count++;
            if (this.assetStatusValue) this.count++;
            if (this.assetNameValue) this.count++;
            if (this.assetTagIdValue) this.count++;
            //console.log("this.count", this.count);

            this.loadData(this.pageSize, 0);
            this.advanceSearchOn = true;
          }
        }
      );
  }

  getclear() {
    this.advanceSearchOn = false;
    this.departmentName = null;
    this.categoryName = null;
    this.categoryId = null;
    this.subCategoryName = null;
    this.assetStatusValue = null;
    this.assetNameValue = null;
    this.assetTagIdValue = null;
    this.count = 0;
    this.subCategoryDisable = true;
  }

  getDepartment() {
    this.departmentService
      .getDepartmentByCompanyId(this._globalCompanyId)
      .subscribe(
        (res: any) => {
          this.departmentListData = res.data;
          //console.log("departmentListData->", this.departmentListData);
        },
        (err) => {
          //console.log(err);
        }
      );
  }
  getCategory() {
    this.subCategoryDisable = true;

    this.categoryService
      .getCategoryByCompanyId(this._globalCompanyId)
      .subscribe(
        (res: any) => {
          this.categoryListData = res.data;
          //console.log("categoryListData->", this.categoryListData);
        },
        (err) => {
          //console.log(err);
        }
      );
  }
  getSubCategory(id) {
    this.subCategoryListData = [];
    this.subCategoryName = null;
    this.subCategoryService.getSubCategoryByCompanyId(id).subscribe(
      (res: any) => {
        this.subCategoryListData = res.data;
        this.subCategoryDisable = false;

        //console.log("categoryListData->", this.subCategoryListData);
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  getAssetStatusList(id: any) {
    //console.log("id", id);
    this.assetService.getAssetStatusList(id).subscribe((res: any) => {
      this.assetStatuslist = res;
      //console.log("assetStatusList->", this.assetStatuslist);
    });
  }
  dowloadSelfReportPDf(batchstatusId, assetAuditId) {
    this.loading = true;
    this.auditService.DownloadRptAssetAuditPendingPDfSelf(
      batchstatusId,
      assetAuditId
    );
    setTimeout(() => {
      this.loading = this.auditService.loading;
    }, 600);
    setTimeout(() => {
      if (this.auditService.loading == false) {
        Swal.fire(
          "Downloading!",
          "Your file going to downloding. Please save your file.",
          "success"
        );
      }
    }, 1000);
  }
  dowloadSelfReportXl(batchstatusId, assetAuditId) {
    this.loading = true;
    this.auditService.DownloadRptAssetAuditPendingExcelSelf(
      batchstatusId,
      assetAuditId
    );
    setTimeout(() => {
      this.loading = this.auditService.loading;
    }, 600);
    setTimeout(() => {
      if (this.auditService.loading == false) {
        Swal.fire(
          "Downloading!",
          "Your file going to downloding. Please save your file.",
          "success"
        );
      }
    }, 1000);
  }

  returnClassStatus(id) {
    if (id == 2) {
      return "bg-blue-primary";
    } else if (id == 19) {
      return "bg-grey";
    } else if (id == 30) {
      return "bg-warning";
    } else if (id == 32) {
      return "bg-success";
    } else if (id == 34) {
      return "bg-danger";
    } else if (id == 31) {
      return "bg-info";
    } else if (id == 37) {
      return "bg-danger";
    } else if (id == 48) {
      return "bg-dark";
    } else if (id == 29) {
      return "bg-primary";
    }
  }

  viewImageValue: any;
  confirmForViewImage(content, value: any) {
    this.viewImageValue = this.ImageUrl + value;

    //console.log(" this.viewImageValue", this.viewImageValue);
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
}
