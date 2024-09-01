import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { RegisterService } from "src/app/core/services/register.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CompanyService } from "src/app/core/services/company.service";
import { CategoryService } from "src/app/core/services/category.service";
import { SubCategoryService } from "src/app/core/services/subcategory.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { LocationService } from "src/app/core/services/location.service";
import { VendorService } from "src/app/core/services/vendor.service";
import { AssetService } from "src/app/core/services/asset.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { environment } from "src/environments/environment";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DecimalPipe, Location } from '@angular/common';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-addasset",
  templateUrl: "./addasset.component.html",
  styleUrls: ["./addasset.component.scss"],
})
export class AddassetComponent implements OnInit {
  defaultNavActiveId = 1;
  maxCharsDecision:number=100
  textvalue = "";
  text = "";
  maxChars = 250;
  maxChar = 1000;
  imageUrl: any;
  addAsset: FormGroup;
  addAssetLoading: boolean;
  categorySelectDisable: boolean;
  categoryWholeList: any[] = [];
  categoryWholeData: any[] = [];
  subCategoryList: any[] = [];
  loadingTableData: boolean;
  _globalCompanyId: string;
  _depreciationId: any;
  _categoryId: any;
  _vendorId: any;
  _subCategoryId: any;
  _assignType: any[] = [];
  _assignTypeValue: any;
  locationList: any[] = [];
  departmentSelectDisable: boolean;
  departmentWholeList: any[] = [];
  _departmentId: any;
  _locationId: any;
  asset_img0: any;
  default_asset_img0: any;
  asset_img1: any;
  default_asset_img1: any;
  asset_img2: any;
  default_asset_img2: any;
  asset_img3: any;
  default_asset_img3: any;
  vendorList: any[] = [];
  filterBy;
  EmployeeDisable: boolean;
  subcategorySelectDisable: boolean;
  locationSelectDisable: boolean;
  vendorListSelectDisable: boolean;
  depreciationListDisable: boolean;
  depreciationList: any[] = [];
  employeeList: any[] = [];
  employeeSelectDisable: boolean;
  confirmResut: string;
  page = 1;
  from = 0;
  to = 0;
  _purchasedDateValue: any;
  _purchasedPriceValue: any;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  employeeData: any;
  filteredUsers: any[];
  employeeName: any;
  _assignValue: any;
  employeeId: any;
  str: any;
  newStr: any;
  newStr2: any;
  newStr1: any;
  newStr3: any;
  _residualAmountValue: any;
  str1: any;
  str2: any;
  str3: any;
  lifeSpan: number;
  depreciationDisableFormLable: boolean;
  depreciationPercentDisable: boolean;
  depreciationAdjustValueDisable: boolean;
  netBookValueReadOnly: boolean;
  depreciationValueReadOnly: boolean;
  netBookValueDisable: boolean;
  buttonCalDisable: boolean;
  calculatorValue: boolean;
  calculatorValueList: any;
  isProject: boolean = false;
  todayDateTime = moment(new Date()).format("YYYY-MM-DD");
  assestIdStore: any;
  employeeLists: [{ image: ""; employeeName: "NA" }];
  clientList: any;
  companyList: any = [];
  _clientIdValue: any;
  public Editor = ClassicEditor;

  departmentList: any;
  clientData: any;
  companyData: any;
  isFirstImageVisible: boolean = false;
  isSecondImageVisible: boolean = false;
  isThirdImageVisible: boolean = false;
  isFourthImageVisible: boolean = false;
  label: any = "Asset Management";
  breadCrumbItems: any = [
    { label: "Asset" },
    { label: "Add Asset", active: true },
  ];

  activePassiveList = [
    {
      id: 1,
      value: "Active",
    },
    {
      id: 0,
      value: "Passive",
    },
  ];
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private dropdownService: DropdownService,
    private registerService: RegisterService,
    private companyService: CompanyService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private departmentService: DepartmentService,
    private locationService: LocationService,
    private vendorService: VendorService,
    private assetService: AssetService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private authService: AuthAssetService,
    private maintenanceService: MaintenanceService,
    private commonFunctionService: CommonFunctionService,
    private locationBack:Location
  ) {
    if (this.assetService.accessRight == true) {
      this.isProject = this.authService.getisProject();
      this.netBookValueDisable = true;
      this.addAssetLoading = false;
      this.categorySelectDisable = true;
      this.employeeSelectDisable = true;
      this.subcategorySelectDisable = true;
      this.locationSelectDisable = true;
      this.departmentSelectDisable = true;
      this.vendorListSelectDisable = true;
      this.EmployeeDisable = true;
      this.depreciationListDisable = true;
      this.imageUrl = environment.apiUrl;
      this.depreciationDisableFormLable = true;
      this.depreciationPercentDisable = false;
      this.depreciationAdjustValueDisable = false;
      this.buttonCalDisable = true;

      this.lifeSpan = 0;
      this._assignType = [
        "Individual",
        this.isProject ? "Project" : "Department",
      ];
      this.getDepreciationData();
      this.getCompany();
    } else {
      this.goback();
    }
  }

  ngOnInit(): void {
    this.from = this.page;
    this.to = this.pageSize;
    this.getfromBinding();
  }
  getCompany(): void {
    this.dropdownService.Getv3_MaintenanceCompanyDropDownList_Active_AssetManagement({}).subscribe(
      (res: any) => {
        this.companyList = res.list;
      },
      (err) => {
        //console.log("errr", err);
      }
    );
  }

  getClientOrBranch(): void {
    this.dropdownService
      .Getv3_MaintenanceClientDropDownList_Active_AssetManagement({
        SearchCompanyId: this._globalCompanyId,
      })
      .subscribe(
        (res: any) => {
          this.clientList = res.list;
        },
        (err) => {
          //console.log("errr", err);
        }
      );
  }

  loadDepartmentOrProject(clientId): void {
    this.dropdownService
      .Getv3_MaintenanceDepartmentDropDownList_Active_AssetManagement({
        SearchCompanyId: this._globalCompanyId,

        SearchClientId: clientId,
      })
      .subscribe(
        (response: any) => {
          if (response) {
            this.departmentList = response?.list;
          }
        },
        (error) => {
          //console.log("error", error);
        }
      );
  }

  clientHandler(event): void {
    this.clientData = event;
    this._departmentId = null;
    this.department.reset();
    this.locationList = [];
    this._locationId = null;

    // this.projectValue = {}
    if (this.clientData.clientId) {
      this.loadDepartmentOrProject(this.clientData.clientId);
    }
  }

  /**
   *
   * @param id
   * @description  for getting  Depreciation list
   */
  getDepreciationData() {
    this.assetService.getDepreciationList().subscribe(
      (res: any) => {
        // this.depreciationListDisable = false
        this.depreciationList = res.data;
        this.depreciationList.forEach((ele) => {
          if (ele.depreciationId == 0) {
            this._depreciationId = ele.depreciationId;
          }
        });
        this.getDepreciationChange(this._depreciationId);
        this.depreciationDisableFormLable = true;
      },
      (err) => {
        //console.log(err);
      }
    );
  }
  getDepreciationChange(id) {
    let valuedecimal = "0.00";
    this.addAsset.controls["purchasedDate"].setValue(null);
    this.addAsset.controls["purchasedPrice"].setValue(valuedecimal);
    this.addAsset.controls["depreciationValue"].setValue(valuedecimal);
    this.addAsset.controls["residualAmount"].setValue(valuedecimal);
    this.addAsset.controls["netBookValue"].setValue(valuedecimal);
    this.addAsset.controls["depreciationPercent"].setValue(valuedecimal);
    this.addAsset.controls["depreciationAdjustValue"].setValue(valuedecimal);

    if (id == 0) {
      this.depreciationDisableFormLable = true;
      this.depreciationPercentDisable = true;
      this.depreciationAdjustValueDisable = true;
      this.depreciationValueReadOnly = false;
      this.netBookValueReadOnly = false;
      this.netBookValueDisable = true;
      this.buttonCalDisable = true;
    }
    if (id == 1) {
      this.depreciationDisableFormLable = false;
      this.depreciationPercentDisable = true;
      this.depreciationAdjustValueDisable = true;
      this.depreciationValueReadOnly = false;
      this.netBookValueReadOnly = false;
      this.netBookValueDisable = true;
      this.buttonCalDisable = true;
    }
    if (id == 2) {
      this.depreciationDisableFormLable = false;
      this.depreciationPercentDisable = false;
      this.depreciationValueReadOnly = true;
      this.netBookValueReadOnly = true;
      this.netBookValueDisable = false;
      this.buttonCalDisable = false;
      this.depreciationAdjustValueDisable = false;
    } else {
    }
  }
  /**
   *
   * @param id
   * @description  for getting  category list
   */
  getCategoryList(id: any) {
    this.lifeSpan = 0;
    this.depreciationDisableFormLable = true;
    this.depreciationValueReadOnly = false;
    this.netBookValueReadOnly = false;
    //this.netBookValueDisable=true;
    this.buttonCalDisable = true;

    this.depreciationPercentDisable = true;
    this.depreciationAdjustValueDisable = true;
    this.categoryService.getCategoryByCompanyId(id).subscribe(
      (res: any) => {
        this.categorySelectDisable = false;
        this.categoryWholeList = res.data;
        this.categoryWholeData = this.categoryWholeList;
      },
      (err) => {
        //console.log(err);
      }
    );
  }
  /**
   *
   * @param id
   * @description  for getting  sub category list by company
   */
  getSubCategorydetails(id: any) {
    this.depreciationDisableFormLable = true;
    this.depreciationValueReadOnly = false;
    this.netBookValueReadOnly = false;
    this.depreciationPercentDisable = true;
    this.depreciationAdjustValueDisable = true;
    // this.netBookValueDisable=true;
    this.buttonCalDisable = true;

    this.lifeSpan = 0;
    this._depreciationId = null;
    this.depreciationList.forEach((ele) => {
      if (ele.depreciationId == 0) {
        this._depreciationId = ele.depreciationId;
      }
    });

    let valuedecimal = "0.00";

    this.addAsset.controls["purchasedDate"].setValue(null);
    this.addAsset.controls["purchasedPrice"].setValue(valuedecimal);
    this.addAsset.controls["depreciationValue"].setValue(valuedecimal);
    this.addAsset.controls["residualAmount"].setValue(valuedecimal);
    this.addAsset.controls["netBookValue"].setValue(valuedecimal);
    this.addAsset.controls["depreciationPercent"].setValue(valuedecimal);
    this.addAsset.controls["depreciationAdjustValue"].setValue(valuedecimal);

    this._subCategoryId = null;
    this.addAsset.controls["assetLifeSpan"].setValue(null);
    this.depreciationListDisable = true;
    this.subCategoryService.getSubCategoryByCompanyId(id).subscribe(
      (res: any) => {
        this.subCategoryList = res.data;
        this.loadingTableData = false;
        this.subcategorySelectDisable = false;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  getLifeSpan(id) {
    this.buttonCalDisable = true;
    this._depreciationId = null;
    this.depreciationList.forEach((ele) => {
      if (ele.depreciationId == 0) {
        this._depreciationId = ele.depreciationId;
      }
    });
    let valuedecimal = "0.00";
    this.depreciationDisableFormLable = true;
    this.depreciationValueReadOnly = false;
    this.netBookValueReadOnly = false;
    this.depreciationPercentDisable = true;
    this.depreciationAdjustValueDisable = true;
    // this.netBookValueDisable=true;

    // this.netBookValueDisable=true;
    this.addAsset.controls["purchasedDate"].setValue(null);
    this.addAsset.controls["purchasedPrice"].setValue(valuedecimal);
    this.addAsset.controls["depreciationValue"].setValue(valuedecimal);
    this.addAsset.controls["residualAmount"].setValue(valuedecimal);
    this.addAsset.controls["netBookValue"].setValue(valuedecimal);
    this.addAsset.controls["depreciationPercent"].setValue(valuedecimal);
    this.addAsset.controls["depreciationAdjustValue"].setValue(valuedecimal);

    this.subCategoryList.forEach((ele) => {
      if (ele.subCategoryId == id) {
        this.lifeSpan = ele.lifeTime;
        this.addAsset.controls["assetLifeSpan"].setValue(ele.lifeTime);
        this.depreciationListDisable = false;
      }
    });
  }
  /**
   *
   * @param id
   * @description  for getting  department list
   */
  getDepartmentList(id: any) {
    this.employeeName = null;
    this.employeeId = null;
    this.departmentService.getDepartmentByCompanyId(id).subscribe(
      (res: any) => {
        this.departmentWholeList = res.data;
      },
      (err) => {
        //console.log(err);
      }
    );
  }
  /**
   *
   * @param id
   * @description  for getting  location list by department and companyId
   */
  getLocation(id: any) {
    this.loadingTableData = true;
    this.locationService
      .getLocationByCompanyIdDepartmentId(this._globalCompanyId, id)
      .subscribe((res: any) => {
        this.locationList = res.data;
        this.locationList.forEach((ele) => {
          if (ele.locationName == "Not Applicable") {
            this._locationId = ele.locationId;
          }
        });
        this.locationSelectDisable = false;
        this.loadingTableData = false;
        (err) => {
          //console.log(err);
        };
      });
  }

  getEmployeeDisable(_assignValue: any) {
    this._assignValue = _assignValue;
    this.EmployeeDisable = false;
    this.employeeName = null;
    this.employeeId = null;
    this.employee.reset();
  }

  getEmployeeList(departmentId: any) {
    this.employeeList = [];
    this.employeeData = [];
    this.filteredUsers = [];
    this._locationId = null;
    this.loadingTableData = true;
    this.EmployeeDisable = false;
    this.employeeName = null;
    this.employeeId = null;
    this.assetService.getEmployeeListDD(departmentId).subscribe((res: any) => {
      this.employeeList = res.data;
      this.employeeData = res.data;
      this.totalRecords = res.data.length;

      this.filteredUsers = [...this.employeeList];
      this.employeeList.forEach((ele) => {
        ele.isSelected = false;
      });
      this.collectionSize = this.employeeList.length;
      this.getemployeeData();
      this.employeeSelectDisable = false;
      this.loadingTableData = false;
      (err) => {
        //console.log(err);
      };
    });
  }

  /**
   * @description to assign user function
   * */
  toAssignUser(userdata: any, modal?: any) {
    modal.dismiss("Cross click");

    this.employeeList.forEach((user) => {
      if (user.employeeId == userdata.employeeId) {
        this.employeeName = user.employeeName;
        this.employeeId = user.employeeId;

        user.isSelected = true;
      } else {
        user.isSelected = false;
      }
    });
    this.addAsset.controls["employee"].setValue(this.employeeName);
  }
  clearTeach(){
    this.filterBy=null;
    this.getEmployeeList(this._departmentId)
  }
  getemployeeData() {
    this.employeeList = this.employeeData.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.to =
      this.page * this.pageSize > this.employeeData.length
        ? this.employeeData.length
        : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.employeeData.length == 0 ? 0 : this.from;
  }
  filter() {
    this.filteredUsers = [
      ...this.employeeList.filter((user) =>
        user.employeeName.includes(this.filterBy)
      ),
    ];
  }
  getVendordetails(id: any) {
    // for getting  vendor list
    this.loadingTableData = true;
    this.vendorService.getVendorListByCompanyId(id).subscribe(
      (res: any) => {
        this.vendorList = res.data;
        this.vendorListSelectDisable = false;
        this.vendorList.forEach((ele) => {
          if (ele.vendorName == "NA") {
            this._vendorId = ele.vendorId;
          }
        });
      },
      (err) => {
        //console.log(err);
      }
    );
  }
  getfromBinding() {
    let valuedecimal = "0.00";
    this.asset_img0 = this.default_asset_img0 =
      "../../../../../assets/images/placeholderimage.png";
    this.asset_img1 = this.default_asset_img1 =
      "../../../../../assets/images/placeholderimage.png";
    this.asset_img2 = this.default_asset_img2 =
      "../../../../../assets/images/placeholderimage.png";
    this.asset_img3 = this.default_asset_img3 =
      "../../../../../assets/images/placeholderimage.png";

    this.addAsset = this.formBuilder.group({
      assetName: ["", Validators.required],
      subCategory: ["", Validators.required],
      category: ["", Validators.required],
      department: [null, Validators.required],
      location: ["", Validators.required],
      vendor: ["", Validators.required],
      assignType: ["", Validators.required],
      assetImageURL: [],
      employee: ["", [Validators.required]],
      assetImageURL1: [],
      assetImageURL2: [],
      assetImageURL3: [],
      textvaluebox: [],
      depreciation: [],
      assetLifeSpan: [0],
      serialNo: [],
      oldAssetId: [],
      model: [],
      warrantyStart: [],
      warrantyEnd: [],
      installationDate: [],
      deliveryDate: [],
      pONumber: [],
      invoiceNo: [],
      invoiceDate: [],
      purchasedDate: [],
      purchasedPrice: [valuedecimal],
      depreciationValue: [valuedecimal],
      residualAmount: [valuedecimal],
      salesProceed: [valuedecimal],
      netBookValue: [valuedecimal],
      depreciationPercent: [valuedecimal],
      depreciationAdjustValue: [valuedecimal],
      assetSpec: [""],
      client: [null],
      company: [null, Validators.required],
      RMAEndWarrenty: [],
      RMAStartWarrenty: [],
      ExtendedEndWarrenty: [],
      ExtendedStartWarrenty: [],
      purchasePrice: [0],
      V017: [1],
      V018: [],
    });

    if (this.isProject) {
      this.addAsset.get("client").setValidators([Validators.required]);
    }
  }
  get employee() {
    return this.addAsset.get("employee");
  }
  get assetName() {
    return this.addAsset.get("assetName");
  }
  get subCategory() {
    return this.addAsset.get("subCategory");
  }
  get category() {
    return this.addAsset.get("category");
  }
  get department() {
    return this.addAsset.get("department");
  }
  get location() {
    return this.addAsset.get("location");
  }
  get vendor() {
    return this.addAsset.get("vendor");
  }
  get textvaluebox() {
    return this.addAsset.get("textvaluebox");
  }
  get depreciation() {
    return this.addAsset.get("depreciation");
  }
  get serialNo() {
    return this.addAsset.get("serialNo");
  }
  get oldAssetId() {
    return this.addAsset.get("oldAssetId");
  }
  get warrantyStart() {
    return this.addAsset.get("warrantyStart");
  }
  get warrantyEnd() {
    return this.addAsset.get("warrantyEnd");
  }
  get pONumber() {
    return this.addAsset.get("pONumber");
  }
  get invoiceNo() {
    return this.addAsset.get("invoiceNo");
  }
  get invoiceDate() {
    return this.addAsset.get("invoiceDate");
  }
  get purchasedDate() {
    return this.addAsset.get("purchasedDate");
  }
  get purchasedPrice() {
    return this.addAsset.get("purchasedPrice");
  }
  get depreciationValue() {
    return this.addAsset.get("depreciationValue");
  }
  get residualAmount() {
    return this.addAsset.get("residualAmount");
  }
  get salesProceed() {
    return this.addAsset.get("salesProceed");
  }
  get netBookValue() {
    return this.addAsset.get("netBookValue");
  }
  get depreciationPercent() {
    return this.addAsset.get("depreciationPercent");
  }
  get depreciationAdjustValue() {
    return this.addAsset.get("depreciationAdjustValue");
  }
  get assignType() {
    return this.addAsset.get("assignType");
  }
  get assetLifeSpan() {
    return this.addAsset.get("assetLifeSpan");
  }
  get assetImageURL() {
    return this.addAsset.get("assetImageURL");
  }
  get assetImageURL1() {
    return this.addAsset.get("assetImageURL1");
  }
  get assetImageURL2() {
    return this.addAsset.get("assetImageURL2");
  }
  get assetImageURL3() {
    return this.addAsset.get("assetImageURL3");
  }
  get model() {
    return this.addAsset.get("model");
  }
  get assetSpec() {
    return this.addAsset.get("assetSpec");
  }
  get client() {
    return this.addAsset.get("client");
  }
  get company() {
    return this.addAsset.get("company");
  }

  get RMAEndWarrenty() {
    return this.addAsset.get("RMAEndWarrenty");
  }
  get RMAStartWarrenty() {
    return this.addAsset.get("RMAStartWarrenty");
  }
  get ExtendedEndWarrenty() {
    return this.addAsset.get("ExtendedEndWarrenty");
  }
  get ExtendedStartWarrenty() {
    return this.addAsset.get("ExtendedStartWarrenty");
  }
  get installationDate() {
    return this.addAsset.get("installationDate");
  }
  get deliveryDate() {
    return this.addAsset.get("deliveryDate");
  }
  get purchasePrice() {
    return this.addAsset.get("purchasePrice");
  }
  get V017() {
    return this.addAsset.get("V017");
  }
  get V018() {
    return this.addAsset.get("V018");
  }

  goback() {
    this.locationBack.back();
    // this.router.navigate(["/asset-management/asset/listasset"]);
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.asset_img0 = event.target.result;
        this.isFirstImageVisible = true;
      };
      reader.onerror = () => {
        this.asset_img0 = this.default_asset_img0;
        this.assetImageURL.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.asset_img0 = this.default_asset_img0;
        this.assetImageURL.setValue("");
      }
    } else {
      this.asset_img0 = this.default_asset_img0;
      this.assetImageURL.setValue("");
    }
  }
  onSelectFile2(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.asset_img2 = event.target.result;
        this.isThirdImageVisible = true;
      };

      reader.onerror = () => {
        this.asset_img2 = this.default_asset_img2;
        this.assetImageURL2.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.asset_img2 = this.default_asset_img2;
        this.assetImageURL2.setValue("");
      }
    } else {
      this.asset_img2 = this.default_asset_img2;
      this.assetImageURL2.setValue("");
    }
  }
  onSelectFile1(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.asset_img1 = event.target.result;
        this.isSecondImageVisible = true;
      };

      reader.onerror = () => {
        this.asset_img1 = this.default_asset_img1;
        this.assetImageURL1.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.asset_img1 = this.default_asset_img1;
        this.assetImageURL1.setValue("");
      }
    } else {
      this.asset_img1 = this.default_asset_img1;
      this.assetImageURL1.setValue("");
    }
  }
  onSelectFile3(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.asset_img3 = event.target.result;
        this.isFourthImageVisible = true;
      };

      reader.onerror = () => {
        this.asset_img3 = this.default_asset_img3;
        this.assetImageURL3.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.asset_img3 = this.default_asset_img3;
        this.assetImageURL3.setValue("");
      }
    } else {
      this.asset_img3 = this.default_asset_img3;
      this.assetImageURL3.setValue("");
    }
  }

  confirmUpdate(content) {
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
          this.confirmResut = `Dismissed with: ${reason}`;
        }
      );
  }

  dateFormatter(date) {
    const newDate = moment(date).format("YYYY-MM-DD");
    if (newDate === "1970-01-01") return null;
    else return newDate;
  }

  submitAssetvalue() {
    if (!this.addAsset.valid) {
      this.error("Fill the mandatory fields");
      return;
    } else {
      this.str = this.asset_img0;
      if (this.str == "../../../../../assets/images/placeholderimage.png") {
        this.newStr = null;
      } else {
        this.newStr = this.str.replace(/^data:image\/[a-z]+;base64,/, "");
        //    this.newStr =this.str.replace('data:image/png;base64,','');
      }
      this.str1 = this.asset_img1;
      if (this.str1 == "../../../../../assets/images/placeholderimage.png") {
        this.newStr1 = null;
      } else {
        this.newStr1 = this.str1.replace(/^data:image\/[a-z]+;base64,/, "");
      }
      this.str2 = this.asset_img2;
      if (this.str2 == "../../../../../assets/images/placeholderimage.png") {
        this.newStr2 = null;
      } else {
        this.newStr2 = this.str2.replace(/^data:image\/[a-z]+;base64,/, "");
      }
      this.str3 = this.asset_img3;
      if (this.str3 == "../../../../../assets/images/placeholderimage.png") {
        this.newStr3 = null;
      } else {
        this.newStr3 = this.str3.replace(/^data:image\/[a-z]+;base64,/, "");
      }

      this.addAssetLoading = true;

      let requestData: any = {
        CompanyId: this._globalCompanyId.toString(),
        AssetName: this.assetName.value,
        SubCategoryID: this.subCategory.value,
        CategoryID: this.category.value,
        DepartmentID: this.department.value,
        LocationID: this.location.value,
        VendorID: this.vendor.value,
        AssignType: this.assignType.value,
        AssetImageBase64String: this.newStr,
        AssetImageBase64String1: this.newStr1,
        AssetImageBase64String2: this.newStr2,
        AssetImageBase64String3: this.newStr3,
        DepreciationID: this._depreciationId,
        AssetLifeSpan: this.assetLifeSpan.value,
        Model: this.model.value,
        SerialNo: this.serialNo.value,
        V017:this.V017.value,
        V018:this.V018.value,
        ThirdPartySystemAssetId: this.oldAssetId.value,
        WarrantyStart: this.warrantyStart.value
          ? this.dateFormatter(this.warrantyStart.value)
          : null,
        WarrantyEnd: this.warrantyEnd.value
          ? this.dateFormatter(this.warrantyEnd.value)
          : null,
        rmaEndWarrenty: this.RMAEndWarrenty.value
          ? this.dateFormatter(this.RMAEndWarrenty.value)
          : null,
        rmaStartWarrenty: this.RMAStartWarrenty.value
          ? this.dateFormatter(this.RMAStartWarrenty.value)
          : null,
        extendedEndWarrenty: this.ExtendedEndWarrenty.value
          ? this.dateFormatter(this.ExtendedEndWarrenty.value)
          : null,
        extendedStartWarrenty: this.ExtendedStartWarrenty.value
          ? this.dateFormatter(this.ExtendedStartWarrenty.value)
          : null,
        PoNumber: this.pONumber.value,
        InvoiceNo: this.invoiceNo.value,
        InvoiceDate: this.invoiceDate.value
          ? this.dateFormatter(this.invoiceDate.value)
          : null,
        PurchasePrice: this.purchasedPrice.value,
        DepreValue: this.depreciationValue.value,
        ResidualAmount: this.residualAmount.value,
        SalesProceed: this.salesProceed.value,
        //NetBookValue:this.netBookValue.value,
        DeprePercent: this.depreciationPercent.value,
        DepreAdjustValue: this.depreciationAdjustValue.value,
        Remarks: this.textvaluebox.value,
        EmployeeID: this.employeeId,
        installationDate: this.installationDate.value
          ? this.dateFormatter(this.installationDate.value)
          : null,
        deliveryDate: this.deliveryDate.value
          ? this.dateFormatter(this.deliveryDate.value)
          : null,
        purchasePrice: this.purchasePrice.value,
      };
      if (this.purchasedDate.value) {
        requestData.PurchaseDate = this.dateFormatter(this.purchasedDate.value);
      }
      if (this.assetSpec.value) {
        requestData.V001 = this.assetSpec.value;
      }
      this.assetService
        .postInsertAsset(this.commonFunctionService.clean(requestData))
        .subscribe(
          (res: any) => {
            this.addAssetLoading = false;
            this.assestIdStore = res.assetId;
            this.success(res);
            this.addSparePart(res.message, this.assestIdStore);
          },
          (err) => {
            this.addAssetLoading = false;
            this.error(err);
          }
        );
    }
  }

  addAssetAddSucessModal() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Add Assets";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submitAssetvalue();
        } 
      }
    });
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

  getcalculatorValue(
    purchasedDateValue: any = null,
    purchasedPriceValue: any = null,
    residualAmountValue: any = null,
    lifeSpan: number = null,
    disposeDate: any = null
  ) {
    this.assetService
      .getDepriciationValue(
        purchasedDateValue,
        purchasedPriceValue,
        residualAmountValue,
        lifeSpan,
        disposeDate
      )
      .subscribe(
        (res: any) => {
          this.calculatorValueList = res.data;

          let totalDepreciation =
            Math.round(
              (this.calculatorValueList.totalDepreciation + Number.EPSILON) *
                100
            ) / 100;
          this.addAsset.controls["depreciationValue"].setValue(
            totalDepreciation
          );
          let monthlyNetBookValueValue =
            Math.round(
              (this.calculatorValueList.monthlyNetBookValueValue +
                Number.EPSILON) *
                100
            ) / 100;
          this.addAsset.controls["netBookValue"].setValue(
            monthlyNetBookValueValue
          );
        },
        (err) => {
          //console.log(err);
        }
      );
  }
  error1: any = { isError: false, errorMessage: "" };

  compareTwoDates() {
    if (
      new Date(this.addAsset.controls["warrantyEnd"].value) <
      new Date(this.addAsset.controls["warrantyStart"].value)
    ) {
      this.error1 = {
        isError: true,
        errorMessage: "Warranty End Date Can Not Before Warranty Start Date",
      };
    } else {
      this.error1 = { isError: false, errorMessage: null };
    }
  }

  addSparePart(message: string, assetId: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Do you want to Add Spare part for the asset created?";
    modalRef.componentInstance.buttonName = "Done It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addAsset.disable();
        this.gotoSparePart(assetId);
        }else{
          this.goback();
        }
      }
    });
  }

  gotoSparePart(assetId: any) {
    this.assetService.sendAssetId = assetId;
    this.router.navigate(["/asset-management/asset/addSpareList"]);
  }
  crossFirstImage(url) {
    if (url) {
      this.asset_img0 = "../../../../../assets/images/placeholderimage.png";
      this.isFirstImageVisible = false;
      this.resetFileInput("asset_id0");
    }
  }

  crossSecondImage(url) {
    if (url) {
      this.asset_img1 = "../../../../../assets/images/placeholderimage.png";
      this.isSecondImageVisible = false;
      this.resetFileInput("asset_id1");
    }
  }

  crossThirdImage(url) {
    if (url) {
      this.asset_img2 = "../../../../../assets/images/placeholderimage.png";
      this.isThirdImageVisible = false;
      this.resetFileInput("asset_id2");
    }
  }

  crossFourthImage(url) {
    if (url) {
      this.asset_img3 = "../../../../../assets/images/placeholderimage.png";
      this.isFourthImageVisible = false;
      this.resetFileInput("asset_id3");
    }
  }

  resetFileInput(id) {
    const fileInput: any = document.getElementById(id);
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }

  getCurrencyCode(departmentId: number) {
    return this.departmentList.find((i) => i.departmentId === departmentId)
      ?.currencyCode;
  }
  companyHandler(event: any) {
    this._globalCompanyId = event.companyId;
    this.getClientOrBranch();
    this.getCategoryList(this._globalCompanyId);
    this._vendorId = null;
    this._subCategoryId = null;
    this._categoryId = null;
    this.subCategoryList = [];
    this.clientList = [];
    this.getVendordetails(this._globalCompanyId);
    this._clientIdValue = null;
    this._departmentId = null;
    this.departmentList = [];
    this.locationList = [];
    this._locationId = null;
  }
  onBack() {
    this.router.navigate(["/asset-management/asset/listasset"]);
  }

  clearChangDeliveryDate() {
    this.deliveryDate.reset();
  }
  clearChangInstallationDate() {
    this.installationDate.reset();
  }
}
