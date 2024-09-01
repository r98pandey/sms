import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { AssetService } from "src/app/core/services/asset.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { LocationService } from "src/app/core/services/location.service";
import { VendorService } from "src/app/core/services/vendor.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


// function getMonthName(monthIndex) {
//   var months =
//   return months[monthIndex];
// }

function getMonthIndex(month) {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].indexOf(month);
}

@Component({
  selector: "app-asset-edit",
  templateUrl: "./asset-edit.component.html",
  styleUrls: ["./asset-edit.component.scss"],
})
export class AssetEditComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  public Editor = ClassicEditor;
  storeAssetID: any;
  assetDetailsObj: any = {};
  apiUrl: any = environment.apiUrl;
  addSpartListShown: boolean = false;
  activeId: number = 1;
  shownButtonSpareList: boolean = false;
  isProject: any;
  asset_img0: any;
  default_asset_img0: any;
  asset_img1: any;
  default_asset_img1: any;
  asset_img2: any;
  default_asset_img2: any;
  asset_img3: any;
  default_asset_img3: any;
  editAsset: FormGroup;
  imageUrl: any = environment.apiUrl;
  editAssetLoading: boolean;
  isFirstImageVisible: boolean = false;
  isSecondImageVisible: boolean = false;
  isThirdImageVisible: boolean = false;
  isFourthImageVisible: boolean = false;
  locationList: any = [];
  updateAsset: any = [];
  arrayListDropDownAssetStatus: any = [];
  selectedDropDownAssetStatusIdValue: any;
  AssetId: any;
  _locationId: any;
  _companyId: any;
  _departmentId: any;
  _vendorId: any;
  lifeSpan: any;
  employeeId: any;
  vendorList: any = [];
  employeeName: any;
  filterBy: any;
  remark: any;
  maxCharsDecision = 300;
  addAccessGroupForm: FormGroup;
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

  editStatusButton: boolean = false;
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchAssetStatusId: null,

  };
  constructor(
    public formBuilder: FormBuilder,
    private assetService: AssetService,
    private router: Router,
    private authService: AuthAssetService,
    private locationService: LocationService,
    private datePipe: DatePipe,
    private vendorService: VendorService,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService
  ) {
    this.isProject = this.authService.getisProject();
    this.breadCrumbItems = [
      { label: "Asset Management" },
      { label: "Asset Detail", active: true },
    ];
    this.storeAssetID = this.assetService.sendAssetId;
    if (this.storeAssetID == 0 || this.storeAssetID == null) {
      this.router.navigate([this.assetService.assetBackRoute]);
    } else {
      this.getAssetDetailsByAssetId(this.storeAssetID);

    }
  }

  ngOnInit(): void {
    this.editStatusButton = this.assetService.editStatus;
    this.getfromBinding();

    this.getAddFromBinding();
  }


  getAddFromBinding() {

    this.addAccessGroupForm = this.formBuilder.group({
      AssetStatusId: [null, Validators.required],
      StatusRemark: ["", Validators.required],
    });
  }

  get AssetStatusId() {
    return this.addAccessGroupForm.get("AssetStatusId");
  }
  get StatusRemark() {
    return this.addAccessGroupForm.get("StatusRemark");
  }
  openModalUpdateStatus() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you Sure to Update Asset Status?";
      modalRef.componentInstance.subTitle    ="You won't be able to revert this!."
    modalRef.componentInstance.buttonName = "Update It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.getUpdateAsset(result);
          this.getAssetDetailsByAssetId(this.storeAssetID);
        }
      }
    });
  }



  getUpdateAsset(modal: any) {
    let requestData = {
      AssetId: this.storeAssetID,
      AssetStatusId: this.AssetStatusId.value,
      StatusRemark: this.StatusRemark.value
    };
    this.assetService.V2_UpdateAssetStatus(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.modalService.dismissAll(modal);
        this.getAssetDetailsByAssetId(this.storeAssetID);

      },
      (error) => {
        this.error(error);
        this.addAccessGroupForm.reset();
      }
    );
  }


  getDropdownAssetStatusList(pageName: any) {
    this.assetService.getAssetStatusList(pageName).subscribe((res: any) => {
      res.forEach((element, index) => {
        if (element.assetStatusId == this.assetDetailsObj.assetStatusId) {
          res.splice(index, 1)
        }
      });
    
      this.arrayListDropDownAssetStatus = res

    });
  }
  getDropdownAssetStatusList_new(pageName: any,content,event) {
    this.assetService.getAssetStatusList(pageName).subscribe((res: any) => {
      res.forEach((element, index) => {
        if (element.assetStatusId == this.assetDetailsObj.assetStatusId) {
          res.splice(index, 1)
        }
      });
    
      this.arrayListDropDownAssetStatus = res
      this.modalService
      .open(content, {

        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.addAccessGroupForm.reset();
        },
        (reason) => {
          this.addAccessGroupForm.reset();
          // this.addspareForm.reset();
        }
      );

    });
  }

  onDropdownAssetStatusValueChange($event) {
    this.payload.SearchAssetStatusId = this.selectedDropDownAssetStatusIdValue;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
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

    this.editAsset = this.formBuilder.group({
      assetName: ["", Validators.required],
      location: ["", Validators.required],
      vendor: ["", Validators.required],
      assetImageURL: [],
      employee: ["", [Validators.required]],
      assetImageURL1: [],
      assetImageURL2: [],
      assetImageURL3: [],
      textvaluebox: [],
      depreciation: [],
      assetLifeSpan: [0],
      serialNo: [],
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
      company: [null],
      RMAEndWarrenty: [],
      RMAStartWarrenty: [],
      ExtendedEndWarrenty: [],
      ExtendedStartWarrenty: [],
      purchasePrice: [0],
      V017: [1],
      V018: [],
    });

    // if (this.isProject) {
    //   this.editAsset?.get("client").setValidators([Validators.required]);
    // }
  }
  get employee() {
    return this.editAsset?.get("employee");
  }
  get assetName() {
    return this.editAsset?.get("assetName");
  }
  get subCategory() {
    return this.editAsset?.get("subCategory");
  }
  get category() {
    return this.editAsset?.get("category");
  }
  get department() {
    return this.editAsset?.get("department");
  }
  get location() {
    return this.editAsset?.get("location");
  }
  get vendor() {
    return this.editAsset?.get("vendor");
  }
  get textvaluebox() {
    return this.editAsset?.get("textvaluebox");
  }
  get depreciation() {
    return this.editAsset?.get("depreciation");
  }
  get serialNo() {
    return this.editAsset?.get("serialNo");
  }
  // get oldAssetId() {
  //   return this.editAsset?.get("oldAssetId");
  // }
  get warrantyStart() {
    return this.editAsset?.get("warrantyStart");
  }
  get warrantyEnd() {
    return this.editAsset?.get("warrantyEnd");
  }
  get pONumber() {
    return this.editAsset?.get("pONumber");
  }
  get invoiceNo() {
    return this.editAsset?.get("invoiceNo");
  }
  get invoiceDate() {
    return this.editAsset?.get("invoiceDate");
  }
  get purchasedDate() {
    return this.editAsset?.get("purchasedDate");
  }
  get purchasedPrice() {
    return this.editAsset?.get("purchasedPrice");
  }
  get depreciationValue() {
    return this.editAsset?.get("depreciationValue");
  }
  get residualAmount() {
    return this.editAsset?.get("residualAmount");
  }
  get salesProceed() {
    return this.editAsset?.get("salesProceed");
  }
  get netBookValue() {
    return this.editAsset?.get("netBookValue");
  }
  get depreciationPercent() {
    return this.editAsset?.get("depreciationPercent");
  }
  get depreciationAdjustValue() {
    return this.editAsset?.get("depreciationAdjustValue");
  }
  get assignType() {
    return this.editAsset?.get("assignType");
  }
  get assetLifeSpan() {
    return this.editAsset?.get("assetLifeSpan");
  }
  get assetImageURL() {
    return this.editAsset?.get("assetImageURL");
  }
  get assetImageURL1() {
    return this.editAsset?.get("assetImageURL1");
  }
  get assetImageURL2() {
    return this.editAsset?.get("assetImageURL2");
  }
  get assetImageURL3() {
    return this.editAsset?.get("assetImageURL3");
  }
  get model() {
    return this.editAsset?.get("model");
  }
  get assetSpec() {
    return this.editAsset?.get("assetSpec");
  }
  get client() {
    return this.editAsset?.get("client");
  }
  get company() {
    return this.editAsset?.get("company");
  }

  get RMAEndWarrenty() {
    return this.editAsset?.get("RMAEndWarrenty");
  }
  get RMAStartWarrenty() {
    return this.editAsset?.get("RMAStartWarrenty");
  }
  get ExtendedEndWarrenty() {
    return this.editAsset?.get("ExtendedEndWarrenty");
  }
  get ExtendedStartWarrenty() {
    return this.editAsset?.get("ExtendedStartWarrenty");
  }
  get installationDate() {
    return this.editAsset?.get("installationDate");
  }
  get deliveryDate() {
    return this.editAsset?.get("deliveryDate");
  }
  get purchasePrice() {
    return this.editAsset?.get("purchasePrice");
  }

  get V017() {
    return this.editAsset.get("V017");
  }
  get V018() {
    return this.editAsset.get("V018");
  }

  getAssetDetailsByAssetId(assetId: Number) {
    this.assetService.getAssetProfileDetails(assetId).subscribe((res: any) => {
      if (res) {
        this.assetDetailsObj = res.data;
        this._companyId = this.assetDetailsObj.companyId;
        this._departmentId = this.assetDetailsObj.departmentID;
        this._locationId = this.assetDetailsObj.locationID;
        this.getLocation(this._departmentId);
        this.getVendordetails(this._companyId);
        this.patchTheObjectOfAsset();
        this.shownButtonSpareList = this.assetDetailsObj.assetStatusId == 16 ? false : true;
      }
    });
  }

  // File Upload

  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];
    document.getElementById("");

    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      (document.getElementById("product-img") as HTMLImageElement).src =
        this.imageURL;
    };
    reader.readAsDataURL(file);
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.asset_img0 = event.target.result;
        this.uploadImage({
          id: this.assetDetailsObj.id,
          AssetImageBase64String:
            this.asset_img0 !=
              "../../../../../assets/images/placeholderimage.png"
              ? this.asset_img0.replace(/^data:image\/[a-z]+;base64,/, "")
              : null,
        });
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

  uploadImage(payload: any, type = "update") {
    this.assetService.updateAssetImage(payload).subscribe(
      (res) => {
        this.success(res);
        if (type == "update") {
          this.isFirstImageVisible = true;
        } else {
          this.isFirstImageVisible = false;
        }
      },
      (err) => {
        //console.log("err", err);
      }
    );
  }

  onSelectFile2(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.asset_img2 = event.target.result;
        this.uploadImage2({
          id: this.assetDetailsObj.id,
          AssetImageBase64String2:
            this.asset_img2 !=
              "../../../../../assets/images/placeholderimage.png"
              ? this.asset_img2.replace(/^data:image\/[a-z]+;base64,/, "")
              : null,
        });
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

  uploadImage2(payload, type = "update") {
    this.assetService.updateAssetImage2(payload).subscribe(
      (res) => {
        if (type == "update") {
          this.isThirdImageVisible = true;
        } else {
          this.isThirdImageVisible = false;
        }
        this.success(res);
      },
      (err) => {
        //console.log("err", err);
      }
    );
  }

  onSelectFile1(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.asset_img1 = event.target.result;
        this.uploadImage1({
          id: this.assetDetailsObj.id,
          AssetImageBase64String1:
            this.asset_img1 !=
              "../../../../../assets/images/placeholderimage.png"
              ? this.asset_img1.replace(/^data:image\/[a-z]+;base64,/, "")
              : null,
        });
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

  uploadImage1(payload: any, type = "update") {
    this.assetService.updateAssetImage1(payload).subscribe(
      (res) => {
        if (type == "update") {
          this.isSecondImageVisible = true;
        } else {
          this.isSecondImageVisible = false;
        }
        this.success(res);
      },
      (err) => {
        //console.log("err", err);
      }
    );
  }

  onSelectFile3(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.asset_img3 = event.target.result;
        this.uploadImage3({
          id: this.assetDetailsObj.id,
          AssetImageBase64String3:
            this.asset_img3 !=
              "../../../../../assets/images/placeholderimage.png"
              ? this.asset_img3.replace(/^data:image\/[a-z]+;base64,/, "")
              : null,
        });
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

  uploadImage3(payload, type = "update") {
    this.assetService.updateAssetImage3(payload).subscribe(
      (res) => {
        if (type == "update") {
          this.isFourthImageVisible = true;
        } else {
          this.isFourthImageVisible = false;
        }
        this.success(res);
      },
      (err) => {
        //console.log("err", err);
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

  getLocation(id: any) {
    this.locationService
      .getLocationByCompanyIdDepartmentId(this._companyId, this._departmentId)
      .subscribe((res: any) => {
        this.locationList = res.data;
        this._locationId = this.assetDetailsObj.locationID;
      });
  }

  //->>confirm for Add spare




  getJsDate(inputDate) {
    if (!inputDate) return "";
    const inputDateStr = inputDate.split("-");

    const date = new Date(inputDate);

    // Get day, month, and year components
    const day = date.getDate();
    const month = getMonthIndex(inputDateStr[1]) + 1;
    const year = date.getFullYear();

    // Format the date as "DD-MM-YYYY"
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }

  patchTheObjectOfAsset() {
    //console.log("this.assetDetailsObj.invoiceNo", this.assetDetailsObj);

    const obj = {
      assetName: this.assetDetailsObj.assetName,
      assetTagId: this.assetDetailsObj.assetTagId,
      assignType: this.assetDetailsObj.assignType,
      employee: this.assetDetailsObj.employeeName,
      textvaluebox: this.assetDetailsObj.remarks,
      depreciation: this.assetDetailsObj.depreciationID,
      assetLifeSpan: this.assetDetailsObj.assetLifeSpan,
      serialNo: this.assetDetailsObj.serialNo,
      model: this.assetDetailsObj.model,
      purchasePrice: this.assetDetailsObj.purchasePrice,
      warrantyStart: this.getJsDate(this.assetDetailsObj.warrantyStart),
      installationDate: this.getJsDate(this.assetDetailsObj.installationDate),
      deliveryDate: this.getJsDate(this.assetDetailsObj.deliveryDate),
      warrantyEnd: this.getJsDate(this.assetDetailsObj.warrantyEnd),
      pONumber: this.assetDetailsObj.poNumber,
      invoiceNo: this.assetDetailsObj.invoiceNo,
      invoiceDate: this.getJsDate(this.assetDetailsObj.invoiceDate),
      purchasedDate: this.getJsDate(this.assetDetailsObj.purchaseDate),
      purchasedPrice: this.assetDetailsObj.purchasePrice,
      depreciationValue:
        Math.round((this.assetDetailsObj.depreValue + Number.EPSILON) * 100) /
        100,
      residualAmount: this.assetDetailsObj.residualAmount,
      salesProceed: this.assetDetailsObj.salesProceed,
      netBookValue:
        Math.round(
          (this.assetDetailsObj.monthlyNetBookValueValue + Number.EPSILON) * 100
        ) / 100,
      depreciationPercent: this.assetDetailsObj.deprePercent,
      depreciationAdjustValue: this.assetDetailsObj.depreAdjustValue,
      assetSpec: this.assetDetailsObj.v001,
      ExtendedStartWarrenty: this.getJsDate(
        this.assetDetailsObj.extendedStartWarrenty
      ),
      ExtendedEndWarrenty: this.getJsDate(
        this.assetDetailsObj.extendedEndWarrenty
      ),
      RMAStartWarrenty: this.getJsDate(this.assetDetailsObj.rmaStartWarrenty),
      RMAEndWarrenty: this.getJsDate(this.assetDetailsObj.rmaEndWarrenty),
      V017: this.assetDetailsObj.v017,
      V018: this.assetDetailsObj.v018,
    };
    this.editAsset?.patchValue(obj);
    (this.lifeSpan = this.assetDetailsObj.assetLifeSpan),
      this.getLocation(this._departmentId);
    this.getEmployeeList(this._departmentId);
    this.editAsset?.controls["employee"].setValue(
      this.assetDetailsObj.employeeName
    );
    this._vendorId = this.assetDetailsObj.vendorID;
    this.employeeId = this.assetDetailsObj.employeeID;
    if (this.assetDetailsObj.assetImagePath) {
      this.asset_img0 = this.apiUrl + this.assetDetailsObj.assetImagePath;
      this.isFirstImageVisible = true;
    } else {
      this.isFirstImageVisible = false;
      this.asset_img0 = "../../../../../assets/images/placeholderimage.png";
    }
    if (this.assetDetailsObj.assetImagePath1) {
      this.asset_img1 = this.apiUrl + this.assetDetailsObj.assetImagePath1;
      this.isSecondImageVisible = true;
    } else {
      this.isSecondImageVisible = false;
      this.asset_img1 = "../../../../../assets/images/placeholderimage.png";
    }
    if (this.assetDetailsObj.assetImagePath2) {
      this.isThirdImageVisible = true;
      this.asset_img2 = this.apiUrl + this.assetDetailsObj.assetImagePath2;
    } else {
      this.isThirdImageVisible = false;
      this.asset_img2 = "../../../../../assets/images/placeholderimage.png";
    }
    if (this.assetDetailsObj.assetImagePath3) {
      this.isFourthImageVisible = true;
      this.asset_img3 = this.apiUrl + this.assetDetailsObj.assetImagePath3;
    } else {
      this.isFourthImageVisible = false;
      this.asset_img3 = "../../../../../assets/images/placeholderimage.png";
    }


    // if (this.assetDetailsObj.isLock) {
    //   this.location?.disable();
    //   this.vendor?.disable();
    //   this.purchasePrice?.disable();

    //   this.purchasedDate?.disable();
    //   this.invoiceDate?.disable();
    //   this.deliveryDate?.disable();
    //   this.installationDate?.disable();
    //   this.invoiceNo?.disable();
    // }
  }
  employeeList: any = [];
  employeeData: any = [];
  filteredUsers: any = [];
  page = 1;
  from = 0;
  to = 0;
  _purchasedDateValue: any;
  _purchasedPriceValue: any;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  getEmployeeList(departmentId: any) {
    this.employeeList = [];
    this.employeeData = [];
    this.filteredUsers = [];
    this._locationId = null;
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
    });
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

  getVendordetails(id: any) {
    // for getting  vendor list
    this.vendorService.getVendorListByCompanyId(id).subscribe((res: any) => {
      this.vendorList = res.data;
    });
  }

  confirmUpdate(content) {
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }
  employeeLists: [{ image: ""; employeeName: "NA" }];

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

    this.editAsset?.controls["employee"].setValue(this.employeeName);
    //console.log(" this.employeeList", this.employeeList);
  }

  filter() {
    this.filteredUsers = [
      ...this.employeeList.filter((user) =>
        user.employeeName.includes(this.filterBy)
      ),
    ];
  }

  crossFirstImage(url) {
    if (url) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        //confirmButtonColor: '#727CF5',
        cancelButtonColor: "#FF3366",
        confirmButtonText:
          "<span class='swal2-confirm '> Yes, remove it!</span>",
      }).then((result) => {
        if (result.isConfirmed) {
          this.uploadImage(
            {
              id: this.assetDetailsObj.id,
              AssetImageBase64String: null,
            },
            "delete"
          );
          this.asset_img0 = "../../../../../assets/images/placeholderimage.png";
          this.isFirstImageVisible = false;
          this.resetFileInput("asset_id0");
        }
      });
    }
  }

  crossSecondImage(url) {
    if (url) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        //confirmButtonColor: '#727CF5',
        cancelButtonColor: "#FF3366",
        confirmButtonText:
          "<span class='swal2-confirm '> Yes, remove it!</span>",
      }).then((result) => {
        if (result.isConfirmed) {
          this.uploadImage1(
            {
              id: this.assetDetailsObj.id,
              AssetImageBase64String: null,
            },
            "delete"
          );
          this.asset_img1 = "../../../../../assets/images/placeholderimage.png";
          this.isSecondImageVisible = false;
          this.resetFileInput("asset_id1");
        }
      });
    }
  }

  crossThirdImage(url) {
    if (url) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        //confirmButtonColor: '#727CF5',
        cancelButtonColor: "#FF3366",
        confirmButtonText:
          "<span class='swal2-confirm '> Yes, remove it!</span>",
      }).then((result) => {
        if (result.isConfirmed) {
          this.uploadImage2(
            {
              id: this.assetDetailsObj.id,
              AssetImageBase64String: null,
            },
            "delete"
          );
          this.asset_img2 = "../../../../../assets/images/placeholderimage.png";
          this.isThirdImageVisible = false;
          this.resetFileInput("asset_id2");
        }
      });
    }
  }

  crossFourthImage(url) {
    if (url) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        //confirmButtonColor: '#727CF5',
        cancelButtonColor: "#FF3366",
        confirmButtonText:
          "<span class='swal2-confirm '> Yes, remove it!</span>",
      }).then((result) => {
        if (result.isConfirmed) {
          this.uploadImage3(
            {
              id: this.assetDetailsObj.id,
              AssetImageBase64String: null,
            },
            "delete"
          );
          this.asset_img3 = "../../../../../assets/images/placeholderimage.png";
          this.isFourthImageVisible = false;
          this.resetFileInput("asset_id3");
        }
      });
    }
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

  dateFormatter(date) {
    if (typeof date === 'object') {
      const originalDate = new Date(date);
      const day = originalDate.getDate().toString().padStart(2, "0");
      const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
      const year = originalDate.getFullYear();
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    } else {
      let current: any = date.split("-");
      if (!date) {
        return null;
      } else {
        let newDate = current[2] + "-" + current[1] + "-" + current[0];
        return newDate;
      }
    }
  }

  submitAssetvalueModal() {
    if (!this.editAsset.valid) {
      this.error("Please fill the all mandatory fields");
      return;
    }

    let requestData: any = {
      id: this.assetDetailsObj.id,
      depreciationName: this.assetDetailsObj.depreciationName,
      CompanyId: this.assetDetailsObj.companyId.toString(),
      AssetName: this.assetName.value,
      SubCategoryID: this.assetDetailsObj.subCategoryID,
      CategoryID: this.assetDetailsObj.categoryID,
      DepartmentID: this.assetDetailsObj.departmentID,
      LocationID: this.location.value,
      VendorID: this.vendor.value,
      AssignType: this.assetDetailsObj.assignType,
      DepreciationID: this.assetDetailsObj.depreciationId,
      AssetLifeSpan: this.assetLifeSpan.value,
      Model: this.model.value,
      SerialNo: this.serialNo.value,
      WarrantyStart: this.warrantyStart.value
        ? this.dateFormatter(this.warrantyStart.value)
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
      PurchasePrice: this.purchasePrice.value ? this.purchasePrice.value : null,
      DepreValue: this.depreciationValue.value,
      ResidualAmount: this.residualAmount.value,
      SalesProceed: this.salesProceed.value,
      DeprePercent: this.depreciationPercent.value,
      DepreAdjustValue: this.depreciationAdjustValue.value,
      Remarks: this.textvaluebox.value,
      EmployeeID: this.employeeId,
      V017: this.V017.value,
      V018: this.V018.value,

      installationDate: this.installationDate.value
        ? this.dateFormatter(this.installationDate.value)
        : null,
      deliveryDate: this.deliveryDate.value
        ? this.dateFormatter(this.deliveryDate.value)
        : null,
      // purchasePrice: this.purchasePrice.value,
    };
    if (this.purchasedDate.value) {
      requestData.PurchaseDate = this.dateFormatter(this.purchasedDate.value);
    }
    if (this.assetSpec.value) {
      requestData.V001 = this.assetSpec.value;
    }
    if (this.warrantyEnd.value) {
      requestData.WarrantyEnd = this.dateFormatter(this.warrantyEnd.value);
    }

    this.assetService
      .postUpdateAsset(this.commonFunctionService.clean(requestData))
      .subscribe((res: any) => {
        this.editAssetLoading = false;

        this.success(res);
        this.onBack();
      });
  }

  submitAssetvalue() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Edit Assets";
    modalRef.componentInstance.subTitle ="You won't be able to revert this!."
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submitAssetvalueModal();
        } 
      }
    });
  }

  onBack() {
    this.router.navigate([this.assetService.assetBackRoute]);
  }

  resetFileInput(id) {
    const fileInput: any = document.getElementById(id);
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  clearChangDeliveryDate() {
    this.deliveryDate.reset();
  }
  clearChangInstallationDate() {
    this.installationDate.reset();
  }
}
