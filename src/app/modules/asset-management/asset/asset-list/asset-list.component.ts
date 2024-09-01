import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
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
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

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
  selector: "app-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrls: ["./asset-list.component.scss"],
})
export class AssetListComponent implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Asset Management";
  breadCrumbItems: any = [
    { label: "Asset" },
    { label: "Asset List", active: true },
  ];
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchDepartmentId: null,
    SearchLocationId: null,
    SearchAssetStatusId: null,
    SearchCategoryId: null,
    SearchSubCategoryId: null,
    SearchAssetName: null,
    SearchAssetTagId: null,
  };
  num: number = 0;
  option = {
  startVal: this.num,
  useEasing: true,
  duration: 2,
  decimalPlaces: 0,
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
  jsonSearchArrayObject: {
    type: string;
    label: string;
    sendobject: string;
    options: any[];
    value: any;
    input_type: string;
  }[];
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
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
  currentUserAccessGroup: any;

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
    this.jsonSearchArrayObject = [
      {
        type: "input",
        label: "Asset Tag Id ",
        sendobject: "SearchAssetTagId",
        options: [],
        value: null,
        input_type: "",
      },
    ];
  }

  ngOnInit(): void {
    this.getV2_AssetStatusCount();
    this.getDropdownCompanyList();
    this.getDropdownAssetStatusList("AssetList");
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    this.currentUserAccessGroup = JSON.parse(
      localStorage.getItem("currentUser")
    ).accessGroupName;
    console.log("this.currentUserAccessGroup =", this.currentUserAccessGroup);
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    } else {
      if (localStorage.getItem("objectSerachForAsset")) {
        this.getObjectAfterRefresh();
      } else {
        this.loadData();
      }
    }
  }
  navigateToAdd() {
    this.assetService.accessRight = true;
    this.assetService.assetBackRoute = "asset-management/asset/listasset";
    this.router.navigate(["/asset-management/asset/createasset"]);
  }
  navigateToSpareList() {
    this.assetService.assetBackRoute = "asset-management/asset/listasset";
    
    this.router.navigate(["/asset-management/spare/list-spare"]);
  }
  navigateToQrList() {
    this.assetService.assetBackRoute = "asset-management/asset/listasset";
    
    this.router.navigate(["/asset-management/asset/qr-detail"]);
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    this.assetService
      .GetV2_CommanAssetList_ByPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.assetList = res.list;
        this.setObjectBeforeRefesh();
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
    this.assetService.sendAssetId = assetId;
    this.assetService.assetBackRoute = "asset-management/asset/listasset";
  
    this.router.navigate(["/asset-management/asset/viewasset"]);
  }

  editHandler(assetId: any) {
    this.assetService.sendAssetId = assetId.id;
    this.assetService.editStatus=(assetId.assetStatusId==2 ||assetId.assetStatusId==16)?false:true ;
    this.assetService.assetBackRoute = "asset-management/asset/listasset";
    this.router.navigate(["/asset-management/asset/editasset"]);
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
    this.activeCard='';
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.arrayListDropDownLocationList = [];
    this.selectedDropDownCompanyIdValue = null;
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
      SearchCompanyId: null,
      SearchClientId: null,
      SearchDepartmentId: null,
      SearchLocationId: null,
      SearchAssetStatusId: null,
      SearchCategoryId: null,
      SearchSubCategoryId: null,
      SearchAssetName: null,
      SearchAssetTagId: null,
    };
    localStorage.removeItem("objectSerachForAsset");
    if (this.currentUserRole === "Client User") {
      this.resetAfterClientUser();
    } else {
      this.page = 1;
      this.loadData();
    }
  }
  resetAfterClientUser() {
    this.selectedDropDownCompanyIdValue =
      this.arrayListDropDownCompany[0].companyId;
    this.onDropdownCompanyValueChange("");
    if (this.arrayListDropDownClientList.length != 0) {
      this.selectedDropDownClientIdValue =
        this.arrayListDropDownClientList[0].clientId;
      this.onDropdownClientValueChange("");
    }
    if (this.arrayListDropDownProjectOrDeparmentList.length != 0) {
      if (this.currentUserRole === "Client User") {
        if (this.arrayListDropDownProjectOrDeparmentList.list.length >= 2) {
          this.projectDepartmentFieldDisiabled = false;
        } else {
          this.projectDepartmentFieldDisiabled = true;
          this.selectedDropDownProjectOrDeparmentIdValue =
            this.arrayListDropDownProjectOrDeparmentList[0].departmentId;
          this.onDropdownDepartmentValueChange("");
        }
      }
    }
  }
  /**
   * Start  For Dropdown Company ,client,project
   */

  getDropdownCompanyList() {
    this.dropdownServices.Getv3_CompanyDropDownList_AssetManagement({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (this.currentUserRole === "Client User") {
        this.selectedDropDownCompanyIdValue =
          this.arrayListDropDownCompany[0].companyId;
        this.onDropdownCompanyValueChange("");
      }
      this.setObjectBeforeRefesh();
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .Getv3_ClientDropDownList_AssetManagement(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        if (this.currentUserRole === "Client User") {
          this.selectedDropDownClientIdValue =
            this.arrayListDropDownClientList[0].clientId;
          this.onDropdownClientValueChange("");
        }
        this.setObjectBeforeRefesh();
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
      SearchDepartmentId: this.selectedDropDownProjectOrDeparmentIdValue,
    };
    this.dropdownServices
      .Getv3_DepartmentDropDownList_AssetManagement(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownProjectOrDeparmentList = res.list;

        if (res.list.length != 0) {
          if (this.currentUserRole === "Client User") {
            if (res.list.length >= 2) {
              this.projectDepartmentFieldDisiabled = false;
            } else {
              this.projectDepartmentFieldDisiabled = true;
              this.selectedDropDownProjectOrDeparmentIdValue =
                this.arrayListDropDownProjectOrDeparmentList[0].departmentId;
              this.onDropdownDepartmentValueChange("");
            }
          }
        }
        this.setObjectBeforeRefesh();
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
        this.setObjectBeforeRefesh();
      });
  }
  onDropdownCompanyValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;

    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
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

    
      if(this.selectedDropDownCompanyIdValue){
      this.getDropdownClientlist();
      this.getDropdownCategoryList();
    }
    this.getDropdownClientlist();
    this.loadData();
  }
  onDropdownClientValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
      if(this.selectedDropDownClientIdValue){
    this.getDropdownDepartmentList();
  }
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
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.activeCard='';
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
  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForAsset: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForAsset.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachForAsset.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForAsset.SearchDepartmentId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.typeAssetNameValue)
      objectSerachForAsset.SearchAssetName = this.typeAssetNameValue;
    if (this.typeAssetTagIdValue)
      objectSerachForAsset.SearchAssetTagId = this.typeAssetTagIdValue;

    if (this.selectedDropDownLocationIdValue)
      objectSerachForAsset.SearchLocationId =
        this.selectedDropDownLocationIdValue;

    if (this.selectedDropDownAssetStatusIdValue)
      objectSerachForAsset.SearchAssetStatusId =
        this.selectedDropDownAssetStatusIdValue;
    if (this.arrayListDropDownClientList) {
      objectSerachForAsset.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForAsset.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }
    if (this.arrayListDropDownLocationList) {
      objectSerachForAsset.arrayListDropDownLocationList =
        this.arrayListDropDownLocationList;
    }

    if (this.selectedDropDownCategoryIdValue)
      objectSerachForAsset.SearchCatergoryId =
        this.selectedDropDownCategoryIdValue;
    if (this.selectedDropDownSubCategoryIdValue)
      objectSerachForAsset.SearchSubCategoryId =
        this.selectedDropDownSubCategoryIdValue;
    if (this.arrayListDropDownCategoryList) {
      objectSerachForAsset.arrayListDropDownCategoryList =
        this.arrayListDropDownCategoryList;
    }
    if (this.arrayListDropDownSubCategoryList) {
      objectSerachForAsset.arrayListDropDownSubCategoryList =
        this.arrayListDropDownSubCategoryList;
    }
if(this.activeCard){
  objectSerachForAsset.activeCard =
  this.activeCard;
}
    if (this.page) {
      objectSerachForAsset.displayStart = this.pageSize * (this.page - 1);
      objectSerachForAsset.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForAsset",
      JSON.stringify(objectSerachForAsset)
    );
  }
  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForAsset: any = JSON.parse(
      localStorage.getItem("objectSerachForAsset")
    );
    this.activeCard=
      objectSerachForAsset.activeCard ?  objectSerachForAsset.activeCard:''
     
    this.arrayListDropDownClientList =
      objectSerachForAsset.arrayListDropDownClientList
        ? objectSerachForAsset.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForAsset.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForAsset.arrayListDropDownProjectOrDeparmentList
        : [];
    this.arrayListDropDownLocationList =
      objectSerachForAsset.arrayListDropDownLocationList
        ? objectSerachForAsset.arrayListDropDownLocationList
        : [];
    this.selectedDropDownCompanyIdValue = objectSerachForAsset.SearchCompanyId
      ? objectSerachForAsset.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForAsset.SearchClientId
      ? objectSerachForAsset.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForAsset.SearchDepartmentId
        ? objectSerachForAsset.SearchDepartmentId
        : null;
    this.typeAssetNameValue = objectSerachForAsset.SearchAssetName
      ? objectSerachForAsset.SearchAssetName
      : null;
    this.typeAssetTagIdValue = objectSerachForAsset.SearchAssetTagId
      ? objectSerachForAsset.SearchAssetTagId
      : null;
    this.selectedDropDownAssetStatusIdValue =
      objectSerachForAsset.SearchAssetStatusId
        ? objectSerachForAsset.SearchAssetStatusId
        : null;
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchAssetName = this.typeAssetNameValue;
    this.payload.SearchAssetTagId = this.typeAssetTagIdValue;

    this.payload.SearchAssetStatusId = this.selectedDropDownAssetStatusIdValue;
    this.arrayListDropDownCategoryList =
      objectSerachForAsset.arrayListDropDownCategoryList
        ? objectSerachForAsset.arrayListDropDownCategoryList
        : [];
    this.arrayListDropDownSubCategoryList =
      objectSerachForAsset.arrayListDropDownSubCategoryList
        ? objectSerachForAsset.arrayListDropDownSubCategoryList
        : [];
    this.selectedDropDownCategoryIdValue =
      objectSerachForAsset.SearchCatergoryId
        ? objectSerachForAsset.SearchCatergoryId
        : null;
    this.selectedDropDownSubCategoryIdValue =
      objectSerachForAsset.SearchSubCategoryId
        ? objectSerachForAsset.SearchSubCategoryId
        : null;
    this.selectedDropDownLocationIdValue = objectSerachForAsset.SearchLocationId
      ? objectSerachForAsset.SearchLocationId
      : null;
    this.payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.payload.SearchLocationId = this.selectedDropDownLocationIdValue;

    if (objectSerachForAsset.displayStart) {
      this.payload.displayStart = objectSerachForAsset.displayStart;
      this.page = objectSerachForAsset.page;
    }
    this.loadData();
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
    this.setObjectBeforeRefesh();
    this.getObjectAfterRefresh();
  }

  getDropdownCategoryList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .GetCategoryListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownCategoryList = res.list;
        this.setObjectBeforeRefesh();
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
        this.setObjectBeforeRefesh();
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

  onTypeAssetTagId() {}

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

  confirmDelete(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  confirm(content: any, id: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Delete Asset List";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.confirmDelete(content, id);
        } else {
          //this.onBack();
        }
      }
    });
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
  maintenanceWorkflowAuditList: any = [];
  getV2_MaintenanceWorkflowAudit(asset: any, content: any) {
    //  assetId: number, masterWorkflowId: number, assetWorkflowStatusId: number
    this.assetService
      .getV2_MaintenanceWorkflowAudit(
        asset.id,
        asset.masterWorkflowId,
        asset.assetWorkflowStatusId
      )
      .subscribe((res: any) => {
        //console.log(res);
        this.maintenanceWorkflowAuditList = res.data.fullName ? [res.data] : [];
        if (this.maintenanceWorkflowAuditList.length != 0) {
          this.openAduit(content);
        } else {
          this.warning("No Workflow Audit Transaction ");
        }
      });
  }

  warning(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: res,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  openAduit(content: any) {
    this.offcanvasService.open(content, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas2",
    });
  }

  downloadReport(value) {
    let payload: any = {};
    let newDate = new Date();
    let projectName='AssetReport ';
    if(this.selectedDropDownProjectOrDeparmentIdValue){
       this.arrayListDropDownProjectOrDeparmentList.forEach(element => {
         if(element.departmentId==this.selectedDropDownProjectOrDeparmentIdValue){
          projectName=element.departmentName+' ';
         }
       });
    }
    payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    payload.SearchAssetTagId = this.typeAssetTagIdValue;
    payload.SearchLocationId = this.selectedDropDownLocationIdValue;
    payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    payload.SearchClientId = this.selectedDropDownClientIdValue;
    payload.SearchDepartmentId = this.selectedDropDownProjectOrDeparmentIdValue;
    payload.SearchAssetName = this.typeAssetNameValue;
    payload.SearchAssetTagId = this.typeAssetTagIdValue;
    payload.SearchAssetStatusId = this.selectedDropDownAssetStatusIdValue;
    payload.RenderFormat = value;
    console.log(payload);
    this.assetService
      .downloadGetAssetReport(this.commonFunctionService.clean(payload))
      .subscribe((data: Blob) => {
        const filename =
          value === "PDF"
            ? projectName + newDate + ".pdf"
            : projectName + newDate + ".xls";
        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }


  activeCard:any='';

  onCardClickActive(type:any, statusId:any){
    this.activeCard=type;
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.arrayListDropDownLocationList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownAssetStatusIdValue = statusId;
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
      SearchCompanyId: null,
      SearchClientId: null,
      SearchDepartmentId: null,
      SearchLocationId: null,
      SearchAssetStatusId: statusId,
      SearchCategoryId: null,
      SearchSubCategoryId: null,
      SearchAssetName: null,
      SearchAssetTagId: null,
    };
    localStorage.removeItem("objectSerachForAsset");
    if (this.currentUserRole === "Client User") {
      this.resetAfterClientUser();
    } else {
      this.page = 1;
      this.loadData();
    }
  }
}
