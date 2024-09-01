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
  selector: "app-create-self-audit",
  templateUrl: "./create-self-audit.component.html",
  styleUrls: ["./create-self-audit.component.scss"],
})
export class CreateSelfAuditComponent implements OnInit {
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
  wFActivityList: any[] = [];
  assetId: any;
  assignType: any;
  assetImagePath: any;
  assetName: any;
  assetTagId: any;
  ImageUrl: any;
  filterBy;
  addLoanloding: boolean;
  totalRecords: number = 0;
  departmentListData: any;
  categoryListData: any;
  subCategoryListData: any;
  departmentName: any;
  categoryName: any;
  subCategoryName: any;
  categoryId: any;
  advanceSearchOn: boolean;
  pageNo: number;
  addAuditForm: FormGroup;
  employeeData: any;
  filteredUsers: any[];
  employeeName: any;
  _assignValue: any;
  employeeId: any;
  employeeList: any[] = [];
  employeeSelectDisable: boolean;
  assetStatusList: any;
  assetStatusValue: any;
  assetTagIdValue: any;
  assetNameValue: any;
  _departmentId_byemployee: any;
  allSeletectedAsset: any;
  subCategoryDisable: boolean;
  count: number;
  viewEmployelist: boolean;
  to1: any;
  from1: any;
  departmentList: any;
  departmentFromValue: any;
  submitButtonDisabled: boolean;
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
    private authService: AuthAssetService,
    private utilService: UtilService
  ) {
    this.allSeletectedAsset = [];
    this.employeeSelectDisable = true;
    this.loadingTableData = false;
    this.addLoanloding = false;
    this.advanceSearchOn = false;
    this.ImageUrl = environment.apiUrl;
    this.subCategoryDisable = true;
    this.viewEmployelist = false;
    this.employeeList = [];
    this.submitButtonDisabled = false;
    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {
    this._globalCompanyId = localStorage.getItem("globalCompanyId");
    this.from = this.page;
    this.to = this.pageSize;
    this.from1 = this.page;
    this.to1 = this.pageSize;

    this.loadData();
    this.checkAssetsvalue();
    this.getDepartment();
    this.getCategory();
    this.auditFormBinding();
    this.getAssetStatusList("CreateLoanPage");

    //this.addAuditForm.get('employee').disable();
  }
  navigateToAdd() {
    //console.log("navigate to add");
    this.router.navigate(["/asset-management/asset/createasset"]);
  }
  editHandler(event, row: any) {
    event.target.parentElement.parentElement.blur();
    // this.companyService.cItem = { ...row };
    this.router.navigate(["/mastersetup/company/editcompany"]);
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

  getList(assetList) {
    this.modalService.open(assetList, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      size: "lg",
      scrollable: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  getWFActivityData(assetId: any, assignType: any) {
    this.assetService
      .getWFActivityList(assetId, assignType)
      .subscribe((res: any) => {
        this.wFActivityList = res.data;
        //  this.loadingTableData = false;

        //console.log(" wFActivityList->", this.wFActivityList);
      });
  }

  reloadPage() {
    //this.loadData();
    if ((this.advanceSearchOn = true)) {
      this.loadData(
        this.pageSize,
        0,
        this.departmentName,
        this.categoryName,
        this.subCategoryName,
        this.assetStatusValue,
        this.assetNameValue,
        this.assetTagIdValue
      );
      // this.advanceSearchOn=false
      this.page = 1;
    } else {
      this.loadData(this.pageSize, this.from - 1);
    }
  }

  loadPage(pageNo: number) {
    this.pageNo = pageNo;
    this.loadData(
      this.pageSize,
      this.pageSize * (pageNo - 1),
      null,
      null,
      null
    );
    //console.log(pageNo);
  }

  loadPage2(pageNo: number) {
    this.pageNo = pageNo;
    this.loadData(
      this.pageSize,
      this.pageSize * (pageNo - 1),
      this.departmentName,
      this.categoryName,
      this.subCategoryName,
      this.assetStatusValue,
      this.assetNameValue,
      this.assetTagIdValue
    );
    //console.log(pageNo);
  }

  loadData(
    displayLength: number = 10,
    startIndex: Number = 0,
    departmentName: any = null,
    CatName: any = null,
    SubCatName: any = null,
    AssetStatus: any = null,
    AssetName: any = null,
    AssetTagId: any = null
  ) {
    this.loadingIndicator = true;
    this.assetService
      .getAssetListForAuditRequestSelfAudit_ByPagination(
        this._globalCompanyId,
        displayLength,
        startIndex,
        departmentName,
        CatName,
        SubCatName,
        AssetStatus,
        AssetName,
        AssetTagId
      )
      .subscribe(
        (res: any) => {
          this.rows = res;
          this.rows = this.rows.filter((item) => {
            let foundItemArray: any[] = this.allSeletectedAsset.filter(
              (el) => el.id == item.id
            );
            if (foundItemArray.length > 0) item["checked"] = true;

            return 1;
          });

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
        },
        (err) => {
          //console.log(err);
        }
      );
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

          this.loadData(
            this.pageSize,
            0,
            this.departmentName,
            this.categoryName,
            this.subCategoryName,
            this.assetStatusValue,
            this.assetNameValue,
            this.assetTagIdValue
          );
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

            this.loadData(
              this.pageSize,
              0,
              this.departmentName,
              this.categoryName,
              this.subCategoryName,
              this.assetStatusValue,
              this.assetNameValue,
              this.assetTagIdValue
            );
          } else {
            if (this.departmentName) this.count++;
            if (this.categoryId) this.count++;
            if (this.subCategoryName) this.count++;
            if (this.assetStatusValue) this.count++;
            if (this.assetNameValue) this.count++;
            if (this.assetTagIdValue) this.count++;

            this.loadData(
              this.pageSize,
              0,
              this.departmentName,
              this.categoryName,
              this.subCategoryName,
              this.assetStatusValue,
              this.assetNameValue,
              this.assetTagIdValue
            );
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
      .subscribe((res: any) => {
        this.departmentListData = res.data;
        //console.log("departmentListData->", this.departmentListData);
      });
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

  uniqByKeepZLast(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  checkAllCheckBox(ev, rows: any) {
    this.rows.forEach((x) => (x.checked = ev.target.checked));
    if (ev.target.checked == true) {
      this.rows.forEach((ele, index) => {
        this.allSeletectedAsset.push(ele);
      });
    } else {
      this.allSeletectedAsset = this.allSeletectedAsset.filter((item) => {
        let foundItemArray: any[] = this.rows.filter((el) => el.id == item.id);
        if (foundItemArray.length > 0) return false;
        return true;
      });
    }
    this.allSeletectedAsset = this.uniqByKeepZLast(
      this.allSeletectedAsset,
      (obj) => obj.id
    );

    //console.log("'this.allSeletectedAsset", this.allSeletectedAsset);
  }

  isAllCheckBoxChecked() {
    return this.rows.every((p) => p.checked);
  }

  checkAssetsvalue() {
    if (this.allSeletectedAsset.length > 1) {
      this.rows.forEach((ele) => {
        if (ele.id == this.allSeletectedAsset.AssetId) {
          ele.isSelect = true;
        }
      });
    }
  }

  getTodolistChecked(isSelected: any, asset: any) {
    if (isSelected == true) {
      this.allSeletectedAsset.push(asset);
    } else {
      this.allSeletectedAsset.forEach((value, index) => {
        if (value.id == asset.id) {
          this.allSeletectedAsset.splice(index, 1);
        }
      });
    }
    //console.log("'this.allSeletectedAsset", this.allSeletectedAsset);
  }

  getLoanListChecked(asset: any) {
    //console.log("asset11", asset);
    this.rows.forEach((ele, i) => {
      if (ele.id == asset.id) {
        this.rows[i].checked = false;
      }
    });
    this.allSeletectedAsset.forEach((value, index) => {
      if (value.id == asset.id) {
        this.allSeletectedAsset.splice(index, 1);
      }
    });
    //console.log("'this.allSeletectedAsset", this.allSeletectedAsset);
  }

  auditFormBinding() {
    this.addAuditForm = this.fb.group({
      department: ["", Validators.required],
      auditName: ["", Validators.required],
    });
  }
  get department() {
    return this.addAuditForm.get("department");
  }
  get auditName() {
    return this.addAuditForm.get("auditName");
  }

  confirmUpdate2(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.confirmResut = `Closed with: ${result}`;
          // this.submitaddBuilding();
        },
        (reason) => {
          this.viewEmployelist = false;
          this._departmentId_byemployee = null;
          this.employeeList = [];
          this.totalRecords = 0;
          this.from1 = 0;
          this.to1 = 0;
        }
      );
  }

  subBmitCreateLoanForm() {
    this.submitButtonDisabled = true;
    let finalSeletectedAsset = [];
    this.addLoanloding = true;

    if (this.allSeletectedAsset.length != 0) {
      this.allSeletectedAsset.forEach((ele) => {
        finalSeletectedAsset.push({
          AssetId: ele.id,
          Email: ele.email,
          EmployeeId: ele.employeeId,
          EmployeeName: ele.employeeName,
          AssetTagId: ele.assetTagId,
        });
      });
    }

    let requestData = {
      AssetAuditName: this.auditName.value,
      CompanyId: this._globalCompanyId,
      DepartmentId: this.department.value,
      transactionAssetAudits: finalSeletectedAsset,
    };

    //console.log("requestData", requestData);
    this.auditService.postInsertAuditSelfAudit(requestData).subscribe(
      (res: any) => {
        this.addLoanloding = false;
        this.success(res);
        this.submitButtonDisabled = false;
        this.goback();
      },
      (err) => {
        //console.log("error", err);
        this.error(err);
        this.submitButtonDisabled = true;
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
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  goback() {
    this.router.navigate(["/audit-management/audit-self/listauditself"]);
  }
  getAssetStatusList(id: any) {
    //console.log("id", id);
    this.assetService.getAssetStatusList(id).subscribe(
      (res: any) => {
        this.assetStatusList = res;
        //console.log("assetStatusList->", this.assetStatusList);
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  returnClassStatus(id) {
    return this.utilService.returnStatusClasses(id);
  }
}
