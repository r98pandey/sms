import { AuditService } from "src/app/core/services/audit.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { RegisterService } from "src/app/core/services/register.service";
import { environment } from "../../../../../../environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { CompanyService } from "src/app/core/services/company.service";
import { CategoryService } from "src/app/core/services/category.service";
import { SubCategoryService } from "src/app/core/services/subcategory.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { LocationService } from "src/app/core/services/location.service";
import { VendorService } from "src/app/core/services/vendor.service";
import { AssetService } from "src/app/core/services/asset.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-listaudittracker",
  templateUrl: "./listaudittracker.component.html",
  styleUrls: ["./listaudittracker.component.scss"],
})
export class ListaudittrackerComponent implements OnInit {
  private _globalCompanyId: string;
  auditListData: any;
  loadingTableData: boolean;
  auditDataPresent: boolean;
  assetauditListData: any;
  noDataPresent: boolean;
  assetStatusValue: any;
  assetStatusList: any;
  year: number;
  yearList: any[] = [];
  currentYear: number;
  auditTypeArray: { id: number; type: string }[];
  auditTypeValue: any;
  constructor(
    private auditService: AuditService,
    public formBuilder: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private departmentService: DepartmentService,
    private locationService: LocationService,
    private vendorService: VendorService,
    private assetService: AssetService,
    private modalService: NgbModal
  ) {
    this.loadingTableData = true;
    this.auditDataPresent = false;
    this.noDataPresent = true;
    this.yearList = [
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026",
      "2027",
      "2028",
      "2029",
      "2030",
      "2031",
    ];
    this.auditTypeArray = [
      {
        id: 0,
        type: "Normal Audit",
      },
      {
        id: 1,
        type: "Self Audit",
      },
    ];
  }

  ngOnInit(): void {
    this.year = 2021;
    this._globalCompanyId = localStorage.getItem("globalCompanyId");
    this.auditTypeValue = 0;
    this.getAssetStatusList("AssetAuditList");
    this.getAuditType(this.auditTypeValue);
  }

  getAuditType(auditTypeValue) {
    this.auditTypeValue = auditTypeValue;
    this.getassetStatus(this.assetStatusValue);
    this.year = this.currentYear;
    this.getYearSelection(this.currentYear);
    //console.log("auditTypeValue", this.auditTypeValue);
  }
  getAudit(id: any, year = 2021, statusid, auditType: number) {
    this.auditService.getAudit(id, year, statusid, auditType).subscribe(
      (res: any) => {
        this.auditListData = res;
        this.loadingTableData = false;
        this.auditDataPresent = true;

        if (this.auditListData.length == 0) {
          this.noDataPresent = true;
        } else {
          this.noDataPresent = false;
        }
        //console.log("auditListData->", this.auditListData);
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  navigateToViewDetails(event, audit) {
    let typevalue: string;
    event.target.parentElement.parentElement.blur();
    this.auditService.auditAsset = { ...audit };
    this.auditTypeArray.forEach((ele) => {
      if (ele.id == this.auditTypeValue) {
        typevalue = ele.type;
      }
    });
    this.auditService.auditType = typevalue;
    this.router.navigate(["/audit-management/audit-tracker/viewaudittracker"]);
  }
  getassetStatus(id) {
    if (id) {
      this.assetStatusValue = id;
      this.getAudit(
        this._globalCompanyId,
        this.year,
        this.assetStatusValue,
        this.auditTypeValue
      );
    } else {
      this.assetStatusValue = null;
      this.getAudit(
        this._globalCompanyId,
        this.year,
        this.assetStatusValue,
        this.auditTypeValue
      );
    }
  }
  getYearSelection(yearValue) {
    if (yearValue) {
      this.year = yearValue;
      this.getAudit(
        this._globalCompanyId,
        this.year,
        this.assetStatusValue,
        this.auditTypeValue
      );
    } else {
      this.year = null;
      this.getAudit(
        this._globalCompanyId,
        this.year,
        this.assetStatusValue,
        this.auditTypeValue
      );
    }
  }
  getAssetStatusList(id: any) {
    this.currentYear = new Date().getFullYear();
    //console.log("id", id);
    this.assetService.getAssetStatusList(id).subscribe((res: any) => {
      this.assetStatusList = res;
      this.assetStatusList.forEach((element) => {
        if (element.assetStatusId == 24) {
          this.assetStatusValue = element.assetStatusId;
          this.getassetStatus(this.assetStatusValue);
          this.year = this.currentYear;
          this.getYearSelection(this.currentYear);
        }
      });
      //console.log("assetStatusList->", this.assetStatusList);
    });
  }
}
