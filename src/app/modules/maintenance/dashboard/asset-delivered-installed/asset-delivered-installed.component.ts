import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { AssetService } from "src/app/core/services/asset.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";
import { AdvanceFilterComponent } from "src/app/shared/components/advance-filter/advance-filter.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-asset-delivered-installed",
  templateUrl: "./asset-delivered-installed.component.html",
  styleUrls: ["./asset-delivered-installed.component.scss"],
})
export class AssetDeliveredInstalledComponent
  implements OnInit, AfterViewInit, OnChanges {
  @Input() SearchIsDeliveredAndInstalled: any;
  @Input() selectedCompanyId: any = 0;
  isProject: boolean = false;
  label: any = "Asset Management";
  breadCrumbItems: any = [
    { label: "Asset" },
    { label: "Asset List", active: true },
  ];
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: this.selectedCompanyId ? this.selectedCompanyId : null,
    SearchClientId: null,
    SearchDepartmentId: null,
    SearchLocationId: null,
    SearchAssetStatusId: null,
    SearchCategoryId: null,
    SearchSubCategoryId: null,
    SearchAssetName: null,
    SearchAssetTagId: null,
  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  assetList = [];
  page = 1;
  collectionSize = 0;
  deleteId: any = null;

  imageUrl: any = environment.apiUrl;
  viewImageValue: any;
  assetQrData: any;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownLocationList: any = [];
  arrayListDropDownAssetStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownLocationIdValue: any;
  selectedDropDownAssetStatusIdValue: any;
  arrayListDropDownCategoryList: any = [];
  arrayListDropDownSubCategoryList: any = [];
  selectedDropDownCategoryIdValue: any;
  selectedDropDownSubCategoryIdValue: any;

  typeAssetNameValue: any;
  typeAssetTagIdValue: any;

  assetStatusCountObject: any = {
    totalInserviceAsset: 0,
    totalReadyStockAsset: 0,
    totalLoanAsset: 0,
    totalDisposeAsset: 0,
  };
  operationList = [
    { name: "Service", operationTypeId: 1 },
    { name: "Incident Report", operationTypeId: 2 },
  ];

  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  currentUserRole: any;

  constructor(
    private dropdownService: DropdownService,
    private router: Router,
    private modalService: NgbModal,
    private assetService: AssetService,
    private authService: AuthAssetService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private offcanvasService: NgbOffcanvas,
    private menuService: MenuServiceService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);

    this.isProject = this.authService.getisProject();

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.selectedDropDownCompanyIdValue = this.selectedCompanyId ? this.selectedCompanyId : null;
    console.log(" this.selectedDropDownCompanyIdValue", this.selectedDropDownCompanyIdValue)
    if (this.selectedCompanyId) {
      this.onDropdownCompanyValueChange("");
    } else {
      this.resetSerachVariable();
    } 
  }

  ngOnInit(): void {
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    this.getV2_AssetStatusCount();
    this.getDropdownAssetStatusList("AssetList");
    if (this.SearchIsDeliveredAndInstalled === 'Not Delivered') {
      if (localStorage.getItem("objectSerachNotDeliveredForAsset")) {
        this.getObjectAfterRefreshNotDelivered();
      } else {
        this.loadData();
      }

    } else if (this.SearchIsDeliveredAndInstalled === 'Not Installed') {
      if (localStorage.getItem("objectSerachNotInstalledForAsset")) {
        this.getObjectAfterRefreshNotInstalled();
      } else {
        this.loadData();
      }
    }

  }


  /**
   * for Set object to refesh
   */
  setObjectBeforeRefeshNotInstalled() {
    let objectSerachNotInstalledForAsset: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachNotInstalledForAsset.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachNotInstalledForAsset.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachNotInstalledForAsset.SearchDepartmentId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.typeAssetNameValue)
      objectSerachNotInstalledForAsset.SearchAssetName = this.typeAssetNameValue;
    if (this.typeAssetTagIdValue)
      objectSerachNotInstalledForAsset.SearchAssetTagId = this.typeAssetTagIdValue;

    if (this.selectedDropDownLocationIdValue)
      objectSerachNotInstalledForAsset.SearchLocationId =
        this.selectedDropDownLocationIdValue;

    if (this.selectedDropDownAssetStatusIdValue)
      objectSerachNotInstalledForAsset.SearchAssetStatusId =
        this.selectedDropDownAssetStatusIdValue;
    if (this.arrayListDropDownClientList) {
      objectSerachNotInstalledForAsset.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachNotInstalledForAsset.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }
    if (this.arrayListDropDownLocationList) {
      objectSerachNotInstalledForAsset.arrayListDropDownLocationList =
        this.arrayListDropDownLocationList;
    }

    if (this.selectedDropDownCategoryIdValue)
      objectSerachNotInstalledForAsset.SearchCatergoryId =
        this.selectedDropDownCategoryIdValue;
    if (this.selectedDropDownSubCategoryIdValue)
      objectSerachNotInstalledForAsset.SearchSubCategoryId =
        this.selectedDropDownSubCategoryIdValue;
    if (this.arrayListDropDownCategoryList) {
      objectSerachNotInstalledForAsset.arrayListDropDownCategoryList =
        this.arrayListDropDownCategoryList;
    }
    if (this.arrayListDropDownSubCategoryList) {
      objectSerachNotInstalledForAsset.arrayListDropDownSubCategoryList =
        this.arrayListDropDownSubCategoryList;
    }

    if (this.page) {
      objectSerachNotInstalledForAsset.displayStart = this.pageSize * (this.page - 1);
      objectSerachNotInstalledForAsset.page = this.page;
    }
    localStorage.setItem(
      "objectSerachNotInstalledForAsset",
      JSON.stringify(objectSerachNotInstalledForAsset)
    );
  }
  /**
   * for get object for refesh
   */
  getObjectAfterRefreshNotInstalled() {
    let objectSerachNotInstalledForAsset: any = JSON.parse(
      localStorage.getItem("objectSerachNotInstalledForAsset")
    );
    this.arrayListDropDownClientList =
      objectSerachNotInstalledForAsset.arrayListDropDownClientList
        ? objectSerachNotInstalledForAsset.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachNotInstalledForAsset.arrayListDropDownProjectOrDeparmentList
        ? objectSerachNotInstalledForAsset.arrayListDropDownProjectOrDeparmentList
        : [];
    this.arrayListDropDownLocationList =
      objectSerachNotInstalledForAsset.arrayListDropDownLocationList
        ? objectSerachNotInstalledForAsset.arrayListDropDownLocationList
        : [];
    this.selectedDropDownCompanyIdValue = objectSerachNotInstalledForAsset.SearchCompanyId
      ? objectSerachNotInstalledForAsset.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachNotInstalledForAsset.SearchClientId
      ? objectSerachNotInstalledForAsset.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachNotInstalledForAsset.SearchDepartmentId
        ? objectSerachNotInstalledForAsset.SearchDepartmentId
        : null;
    this.typeAssetNameValue = objectSerachNotInstalledForAsset.SearchAssetName
      ? objectSerachNotInstalledForAsset.SearchAssetName
      : null;
    this.typeAssetTagIdValue = objectSerachNotInstalledForAsset.SearchAssetTagId
      ? objectSerachNotInstalledForAsset.SearchAssetTagId
      : null;
    this.selectedDropDownAssetStatusIdValue =
      objectSerachNotInstalledForAsset.SearchAssetStatusId
        ? objectSerachNotInstalledForAsset.SearchAssetStatusId
        : null;
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchAssetName = this.typeAssetNameValue;
    this.payload.SearchAssetTagId = this.typeAssetTagIdValue;

    this.payload.SearchAssetStatusId = this.selectedDropDownAssetStatusIdValue;
    this.arrayListDropDownCategoryList =
      objectSerachNotInstalledForAsset.arrayListDropDownCategoryList
        ? objectSerachNotInstalledForAsset.arrayListDropDownCategoryList
        : [];
    this.arrayListDropDownSubCategoryList =
      objectSerachNotInstalledForAsset.arrayListDropDownSubCategoryList
        ? objectSerachNotInstalledForAsset.arrayListDropDownSubCategoryList
        : [];
    this.selectedDropDownCategoryIdValue =
      objectSerachNotInstalledForAsset.SearchCatergoryId
        ? objectSerachNotInstalledForAsset.SearchCatergoryId
        : null;
    this.selectedDropDownSubCategoryIdValue =
      objectSerachNotInstalledForAsset.SearchSubCategoryId
        ? objectSerachNotInstalledForAsset.SearchSubCategoryId
        : null;
    this.selectedDropDownLocationIdValue = objectSerachNotInstalledForAsset.SearchLocationId
      ? objectSerachNotInstalledForAsset.SearchLocationId
      : null;
    this.payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.payload.SearchLocationId = this.selectedDropDownLocationIdValue;

    if (objectSerachNotInstalledForAsset.displayStart) {
      this.payload.displayStart = objectSerachNotInstalledForAsset.displayStart;
      this.page = objectSerachNotInstalledForAsset.page;
    }
    this.loadData();
  }


  /**
 * for Set object to refesh
 */
  setObjectBeforeRefeshNotDelivered() {
    let objectSerachNotDeliveredForAsset: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachNotDeliveredForAsset.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachNotDeliveredForAsset.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachNotDeliveredForAsset.SearchDepartmentId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.typeAssetNameValue)
      objectSerachNotDeliveredForAsset.SearchAssetName = this.typeAssetNameValue;
    if (this.typeAssetTagIdValue)
      objectSerachNotDeliveredForAsset.SearchAssetTagId = this.typeAssetTagIdValue;

    if (this.selectedDropDownLocationIdValue)
      objectSerachNotDeliveredForAsset.SearchLocationId =
        this.selectedDropDownLocationIdValue;

    if (this.selectedDropDownAssetStatusIdValue)
      objectSerachNotDeliveredForAsset.SearchAssetStatusId =
        this.selectedDropDownAssetStatusIdValue;
    if (this.arrayListDropDownClientList) {
      objectSerachNotDeliveredForAsset.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachNotDeliveredForAsset.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }
    if (this.arrayListDropDownLocationList) {
      objectSerachNotDeliveredForAsset.arrayListDropDownLocationList =
        this.arrayListDropDownLocationList;
    }

    if (this.selectedDropDownCategoryIdValue)
      objectSerachNotDeliveredForAsset.SearchCatergoryId =
        this.selectedDropDownCategoryIdValue;
    if (this.selectedDropDownSubCategoryIdValue)
      objectSerachNotDeliveredForAsset.SearchSubCategoryId =
        this.selectedDropDownSubCategoryIdValue;
    if (this.arrayListDropDownCategoryList) {
      objectSerachNotDeliveredForAsset.arrayListDropDownCategoryList =
        this.arrayListDropDownCategoryList;
    }
    if (this.arrayListDropDownSubCategoryList) {
      objectSerachNotDeliveredForAsset.arrayListDropDownSubCategoryList =
        this.arrayListDropDownSubCategoryList;
    }

    if (this.page) {
      objectSerachNotDeliveredForAsset.displayStart = this.pageSize * (this.page - 1);
      objectSerachNotDeliveredForAsset.page = this.page;
    }
    localStorage.setItem(
      "objectSerachNotDeliveredForAsset",
      JSON.stringify(objectSerachNotDeliveredForAsset)
    );
  }
  /**
   * for get object for refesh
   */
  getObjectAfterRefreshNotDelivered() {
    let objectSerachNotDeliveredForAsset: any = JSON.parse(
      localStorage.getItem("objectSerachNotDeliveredForAsset")
    );
    this.arrayListDropDownClientList =
      objectSerachNotDeliveredForAsset.arrayListDropDownClientList
        ? objectSerachNotDeliveredForAsset.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachNotDeliveredForAsset.arrayListDropDownProjectOrDeparmentList
        ? objectSerachNotDeliveredForAsset.arrayListDropDownProjectOrDeparmentList
        : [];
    this.arrayListDropDownLocationList =
      objectSerachNotDeliveredForAsset.arrayListDropDownLocationList
        ? objectSerachNotDeliveredForAsset.arrayListDropDownLocationList
        : [];
    this.selectedDropDownCompanyIdValue = objectSerachNotDeliveredForAsset.SearchCompanyId
      ? objectSerachNotDeliveredForAsset.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachNotDeliveredForAsset.SearchClientId
      ? objectSerachNotDeliveredForAsset.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachNotDeliveredForAsset.SearchDepartmentId
        ? objectSerachNotDeliveredForAsset.SearchDepartmentId
        : null;
    this.typeAssetNameValue = objectSerachNotDeliveredForAsset.SearchAssetName
      ? objectSerachNotDeliveredForAsset.SearchAssetName
      : null;
    this.typeAssetTagIdValue = objectSerachNotDeliveredForAsset.SearchAssetTagId
      ? objectSerachNotDeliveredForAsset.SearchAssetTagId
      : null;
    this.selectedDropDownAssetStatusIdValue =
      objectSerachNotDeliveredForAsset.SearchAssetStatusId
        ? objectSerachNotDeliveredForAsset.SearchAssetStatusId
        : null;
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchAssetName = this.typeAssetNameValue;
    this.payload.SearchAssetTagId = this.typeAssetTagIdValue;

    this.payload.SearchAssetStatusId = this.selectedDropDownAssetStatusIdValue;
    this.arrayListDropDownCategoryList =
      objectSerachNotDeliveredForAsset.arrayListDropDownCategoryList
        ? objectSerachNotDeliveredForAsset.arrayListDropDownCategoryList
        : [];
    this.arrayListDropDownSubCategoryList =
      objectSerachNotDeliveredForAsset.arrayListDropDownSubCategoryList
        ? objectSerachNotDeliveredForAsset.arrayListDropDownSubCategoryList
        : [];
    this.selectedDropDownCategoryIdValue =
      objectSerachNotDeliveredForAsset.SearchCatergoryId
        ? objectSerachNotDeliveredForAsset.SearchCatergoryId
        : null;
    this.selectedDropDownSubCategoryIdValue =
      objectSerachNotDeliveredForAsset.SearchSubCategoryId
        ? objectSerachNotDeliveredForAsset.SearchSubCategoryId
        : null;
    this.selectedDropDownLocationIdValue = objectSerachNotDeliveredForAsset.SearchLocationId
      ? objectSerachNotDeliveredForAsset.SearchLocationId
      : null;
    this.payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.payload.SearchLocationId = this.selectedDropDownLocationIdValue;

    if (objectSerachNotDeliveredForAsset.displayStart) {
      this.payload.displayStart = objectSerachNotDeliveredForAsset.displayStart;
      this.page = objectSerachNotDeliveredForAsset.page;
    }
    this.loadData();
  }

  navigateToAdd() {
    this.assetService.accessRight = true;
    this.router.navigate(["/asset-management/asset/createasset"]);
  }
  navigateToSpareList() {
    this.router.navigate(["/asset-management/spare/list-spare"]);
  }
  navigateToQrList() {
    this.router.navigate(["/asset-management/asset/qr-detail"]);
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    if (this.SearchIsDeliveredAndInstalled == "Not Delivered") {
      this.payload.SearchIsDelivered = false;
    } else if (this.SearchIsDeliveredAndInstalled == "Not Installed") {
      this.payload.SearchIsInstalled = false;
    }
    this.assetService
      .GetV2_CommanAssetList_ByPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.assetList = res.list;

        if (this.assetList.length > 0) {
          this.totalRecordsFromApi = res.list[0].totalCount;
          this.from = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.to = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.pageSize = this.payload.displayLength;
        } else {
          this.totalRecordsFromApi = 0;
          this.from = 0;
          this.to = 0;
          this.pageSize = this.payload.displayLength;
        }

        if (this.SearchIsDeliveredAndInstalled === 'Not Delivered') {
          this.setObjectBeforeRefeshNotDelivered();

        } else if (this.SearchIsDeliveredAndInstalled === 'Not Installed') {
          this.setObjectBeforeRefeshNotInstalled();

        }
      });
  }

  viewQrCodeImage(content, asset): void {
    this.assetQrData = asset;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  viewHandler(assetId: any) {
    this.assetService.assetBackRoute =
      "maintenance-management/dashboard/asset-dashboard";
    if (this.SearchIsDeliveredAndInstalled == "Not Delivered") {
      this.assetService.backTabs = "Not Delivered";
    } else if (this.SearchIsDeliveredAndInstalled == "Not Installed") {
      this.assetService.backTabs = "Not Installed";
    }
    this.assetService.sendAssetId = assetId;
    this.router.navigate(["/asset-management/asset/editasset"]);
  }

  editHandler(assetId: any) {
    if (this.currentUserRole == "Client") {
      return;
    } else {
      this.assetService.assetBackRoute =
        "maintenance-management/dashboard/asset-dashboard";
      if (this.SearchIsDeliveredAndInstalled == "Not Delivered") {
        this.assetService.backTabs = "Not Delivered";
      } else if (this.SearchIsDeliveredAndInstalled == "Not Installed") {
        this.assetService.backTabs = "Not Installed";
      }
      this.assetService.sendAssetId = assetId;
      this.router.navigate(["/asset-management/asset/editasset"]);
    }
  }

  onTypeAssetNameChange(isDebounce) {
    if (this.typeAssetNameValue.length === 0 || isDebounce) {
      this.page = 1;
      this.payload.displayStart = this.pageSize * (this.page - 1);
      this.payload.SearchAssetName = this.typeAssetNameValue;
      this.loadData();
    }
  }

  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.arrayListDropDownLocationList = [];
    this.selectedDropDownCompanyIdValue = this.selectedCompanyId?this.selectedCompanyId:null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownAssetStatusIdValue = null;
    this.selectedDropDownLocationIdValue = null;
    this.typeAssetNameValue = null;
    this.typeAssetTagIdValue = null;
    this.arrayListDropDownCategoryList = [];
    this.arrayListDropDownSubCategoryList = [];
    this.selectedDropDownCategoryIdValue = null;
    this.selectedDropDownSubCategoryIdValue = null;

    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: this.selectedCompanyId ? this.selectedCompanyId : null,

      SearchClientId: null,
      SearchDepartmentId: null,
      SearchLocationId: null,
      SearchAssetStatusId: null,
      SearchCategoryId: null,
      SearchSubCategoryId: null,
      SearchAssetName: null,
      SearchAssetTagId: null,
    };

    this.page = 1;
    if (this.SearchIsDeliveredAndInstalled === 'Not Delivered') {
      localStorage.removeItem("objectSerachNotDeliveredForAsset")
    } else if (this.SearchIsDeliveredAndInstalled === 'Not Installed') {
      localStorage.removeItem("objectSerachNotInstalledForAsset")
    }
    if (this.selectedCompanyId) {
      this.onDropdownCompanyValueChange("");
    } else {
      this.loadData();
    }
  }
  /**
   * Start  For Dropdown Company ,client,project
   */

  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .GetClientListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .GetDepartmentListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownProjectOrDeparmentList = res.list;
      });
  }

  getLocationListDrobDown() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
      SearchDepartmentId: this.selectedDropDownProjectOrDeparmentIdValue,
    };
    this.dropdownServices
      .GetLocationListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownLocationList = res.list;
      });
  }
  onDropdownCompanyValueChange($event) {

    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchDepartmentId = this.selectedDropDownProjectOrDeparmentIdValue;
    this.arrayListDropDownProjectOrDeparmentList = [];

    this.selectedDropDownCategoryIdValue = null;
    this.selectedDropDownSubCategoryIdValue = null;
    this.selectedDropDownLocationIdValue = null;
    this.payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.payload.SearchLocationId = this.selectedDropDownLocationIdValue;
    this.arrayListDropDownCategoryList = [];
    this.arrayListDropDownSubCategoryList = [];
    this.arrayListDropDownLocationList = [];
    this.typeAssetTagIdValue=null;
    this.payload.SearchAssetTagId = this.typeAssetTagIdValue;
    if(this.selectedDropDownCompanyIdValue){
      this.getDropdownClientlist();
    this.getDropdownCategoryList();}

    this.loadData();
    // if (this.SearchIsDeliveredAndInstalled === 'Not Delivered') {
    //   if (localStorage.getItem("objectSerachNotDeliveredForAsset")) {
    //     this.getObjectAfterRefreshNotDelivered();
    //   } else {
    //     this.loadData();
    //   }

    // } else if (this.SearchIsDeliveredAndInstalled === 'Not Installed') {
    //   if (localStorage.getItem("objectSerachNotInstalledForAsset")) {
    //     this.getObjectAfterRefreshNotInstalled();
    //   } else {
    //     this.loadData();
    //   }
    // }
  }
  onDropdownClientValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
      if(this.selectedDropDownClientIdValue){
  
    this.getDropdownDepartmentList();}
    this.loadData();
  }
  onDropdownDepartmentValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.page - 1;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.selectedDropDownLocationIdValue = null;
    this.payload.SearchLocationId = this.selectedDropDownLocationIdValue;
    this.arrayListDropDownLocationList = [];
    this.loadData();
    this.getLocationListDrobDown();
  }
  /**
   * End  For Dropdown Company ,client,project
   */

  getDropdownAssetStatusList(pageName: any) {
    this.assetService.getAssetStatusList(pageName).subscribe((res: any) => {
      this.arrayListDropDownAssetStatus = res;
    });
  }

  getV2_AssetStatusCount() {
    this.assetService.getV2_AssetStatusCount().subscribe((res: any) => {
      this.assetStatusCountObject = res.data;
    });
  }

  onDropdownAssetStatusValueChange($event) {
    this.payload.SearchAssetStatusId = this.selectedDropDownAssetStatusIdValue;
    this.loadData();
  }

  @ViewChild("inputer", { static: true }) input: ElementRef;
  @ViewChild("assetTagId", { static: true }) assetTagId: ElementRef;
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeAssetNameChange(true);
        })
      )
      .subscribe();
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  returnworkFlowAssetStatus(id: any) {
    return this.commonFunctionService.returnWorkFlowStatusBadgeClasses(id);
  }

  openFilter(modal: TemplateRef<any>) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          // this.submitAddCategoryFormDetails(event);
        },
        (reason) => {
          // this.addCategoryForm.reset();
          // this.goback();
        }
      );
  }

  searchFilter() {
    this.offcanvasService.dismiss();
  }

  getDropdownCategoryList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .GetCategoryListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownCategoryList = res.list;
      });
  }
  getDropdownSubCategoryList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchCategoryId: this.selectedDropDownCategoryIdValue,
    };
    this.dropdownServices
      .GetSubCategoryListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownSubCategoryList = res.list;
      });
  }

  onDropdownCategoryValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    this.selectedDropDownSubCategoryIdValue = null;
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.loadData();
    this.getDropdownSubCategoryList();
  }
  onDropdownSubCategoryValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.loadData();
  }

  onDropdownLocationValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchLocationId = this.selectedDropDownLocationIdValue;
    this.loadData();
  }

  onTypeAssetTagId() { }

  clearAdvanceSearch(offcanvas) {
    offcanvas.dismiss("Cross click");
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.selectedDropDownCategoryIdValue = null;
    this.selectedDropDownSubCategoryIdValue = null;
    this.typeAssetTagIdValue = null;
    this.selectedDropDownLocationIdValue = null;
    this.payload.SearchCatergoryId = null;
    this.payload.SearchSubCategoryId = null;
    this.payload.SearchAssetTagId = null;
    this.payload.SearchLocationId = null;
    this.loadData();
  }

  submitAdvanceSearch(offcanvas) {
    offcanvas.dismiss("Cross click");
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.payload.SearchAssetTagId = this.typeAssetTagIdValue;
    this.payload.SearchLocationId = this.selectedDropDownLocationIdValue;
    this.loadData();
  }

  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  deleteData(deleteId) {
    this.assetService.deleteAsset({ AssetId: deleteId }).subscribe({
      next: (res) => {
        this.successForDeletespareData(res);
        this.page = 1;
        this.payload.displayStart = this.pageSize * (this.page - 1);
        this.loadData();
      },
    });
  }

  successForDeletespareData(res) {
    //for  Delete spare successfully message
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }
}
