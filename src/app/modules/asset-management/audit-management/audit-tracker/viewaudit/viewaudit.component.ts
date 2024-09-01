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
import { UtilService } from "src/app/core/services/util.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";

@Component({
  selector: "app-viewaudit",
  templateUrl: "./viewaudit.component.html",
  styleUrls: ["./viewaudit.component.scss"],
})
export class ViewauditComponent implements OnInit {
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
  page1 = 1;
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
  notMatchData: any;
  totalRecords: any;
  rows1: any;
  collectionSize1: any;
  pageSize1: number = 10;
  from1: number = 0;
  to1: any = 0;
  isTableView: boolean;
  assetAuditId: number;
  auditStatusId: number;
  loading: boolean;
  auditTypeValue: string;
  isProject: boolean = false;
  defaultNavActiveId: number;

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
    private authService: AuthAssetService,
    private utilService: UtilService
  ) {
    this.assetauditListData = [];
    this.auditAssetList = { ...this.auditService.auditAsset };
    this.auditTypeValue = this.auditService.auditType;
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
      this.router.navigate([
        "/audit-management/audit-tracker/listaudittracker",
      ]);
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
    this.from1 = this.page1;
    this.to1 = this.pageSize1;

    this.loadData();
    this.getDepartment();
    this.getCategory();
    this.getAssetStatusList("LoanPageList");
    this.getNotMatchdetails();
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
    this.router.navigate(["/audit-management/audit-tracker/listaudittracker"]);
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

        //  this.loadingTableData = false;

        //console.log(" wFActivityList->", this.wFActivityList);
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
    if (this.auditTypeValue == "Normal Audit") {
      this.auditService
        .getTransactionAssetAudit_ByPagination(this.auditAssetId)
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
    } else {
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
      .subscribe((res: any) => {
        this.categoryListData = res.data;
        //console.log("categoryListData->", this.categoryListData);
      });
  }
  getSubCategory(id) {
    this.subCategoryListData = [];
    this.subCategoryName = null;
    this.subCategoryService
      .getSubCategoryByCompanyId(id)
      .subscribe((res: any) => {
        this.subCategoryListData = res.data;
        this.subCategoryDisable = false;

        //console.log("categoryListData->", this.subCategoryListData);
      });
  }

  getAssetStatusList(id: any) {
    //console.log("id", id);
    this.assetService.getAssetStatusList(id).subscribe((res: any) => {
      this.assetStatuslist = res;
      //console.log("assetStatusList->", this.assetStatuslist);
    });
  }

  sweetAlertAssetAuditVerification(audit: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      input: "textarea",
      inputAttributes: {
        maxlength: "100",
      },
      inputPlaceholder: "Remark",
      inputValidator: (result) => !result && "You need to write something!",
      cancelButtonColor: "#FF3366",
      confirmButtonText: "<span class='swal2-confirm '> Yes, Verify it!</span>",
    }).then((result) => {
      if (result.value) {
        if (result.isConfirmed) {
          this.requestHandler(audit, result.value);
        }
      }
    });
  }
  sweetAlertAssetSelfAuditCompleted(audit: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      input: "textarea",
      inputAttributes: {
        maxlength: "100",
      },
      inputPlaceholder: "Remark",
      inputValidator: (result) => !result && "You need to write something!",
      cancelButtonColor: "#FF3366",
      confirmButtonText:
        "<span class='swal2-confirm '> Yes, Completed it!</span>",
    }).then((result) => {
      if (result.value) {
        if (result.isConfirmed) {
          this.requestHandlerSelf(audit, result.value);
        }
      }
    });
  }
  requestHandler(audit, remark) {
    let requestData = {
      AssetAuditId: audit.assetAuditId,
      VerifiedRemark: remark,
    };
    //console.log("requestData", requestData);
    this.auditService
      .postUpdateMasterAssetAuditVerification(requestData)
      .subscribe(
        (res: any) => {
          this.success(res);
          this.goback();
        },
        (err) => {
          this.error(err);
          //console.log("error", err);
        }
      );
  }

  requestHandlerSelf(audit, remark) {
    let requestData = {
      AssetAuditId: audit.assetAuditId,
      // VerifiedRemark: remark,
    };
    //console.log("requestData", requestData);
    this.auditService
      .postUpdateMasterAssetAuditAsCompleted(requestData)
      .subscribe(
        (res: any) => {
          this.success(res);
          this.goback();
        },
        (err) => {
          this.error(err);
          //console.log("error", err);
        }
      );
  }
  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  error(err) {
    // this.addCompanyDisable = false;
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 2000,
    });
  }
  getNotMatchdetails() {
    this.isTableView = false;

    this.rows1 = [];
    this.loadingTableData = true;
    this.totalRecords = 0;
    this.auditService.getAssetAuditNotMatch(this.auditAssetId).subscribe(
      (res: any) => {
        this.notMatchData = res;
        this.rows1 = res;
        this.isTableView = true;
        this.totalRecords = this.rows1.length;
        this.loadingTableData = false;
        if (this.totalRecords == 0) {
          this.from1 = 0;
          this.to1 = 0;
        }
        this.collectionSize1 = this.rows1.length;
        this.getnotMatchData();
        //console.log("notMatchData->", this.notMatchData);

        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1500);
      },
      (err) => {
        this.loadingTableData = false;
      }
    );
  }
  getnotMatchData() {
    //console.log("this.pageSize", this.pageSize);

    this.rows1 = this.notMatchData.slice(
      (this.page1 - 1) * this.pageSize1,
      (this.page1 - 1) * this.pageSize1 + this.pageSize1
    );
    this.to1 =
      this.page1 * this.pageSize1 > this.notMatchData.length
        ? this.notMatchData.length
        : this.page1 * this.pageSize1;
    let fromvalue1 = this.page * this.pageSize1 - (this.pageSize1 - 1); // (this.page * this.pageSize) > this.companyData.length ? this.to - ((this.page * this.pageSize) - this.companyData.length) : this.to - (this.pageSize - 1);
    this.from1 = fromvalue1 < 1 ? 1 : fromvalue1;
    this.from1 = this.notMatchData.length == 0 ? 0 : this.from;
  }

  dowloadNormalReportPDf(batchstatusId, assetAuditId) {
    this.loading = true;
    this.auditService.DownloadRptAssetAuditPendingPDf(
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

  dowloadNormalReportXl(batchstatusId, assetAuditId) {
    this.loading = true;
    this.auditService.DownloadRptAssetAuditPendingExcel(
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
    return this.utilService.returnStatusClasses(id);
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
