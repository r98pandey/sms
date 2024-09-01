import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
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
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";
import { AdvanceFilterComponent } from "src/app/shared/components/advance-filter/advance-filter.component";
import Swal from "sweetalert2";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { SuccessModalWithRemarkComponent } from "src/app/shared/components/success-modal-with-remark/success-modal-with-remark.component";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";

@Component({
  selector: "app-asset-list-dashboard",
  templateUrl: "./asset-list-dashboard.component.html",
  styleUrls: ["./asset-list-dashboard.component.scss"],
})
export class AssetListDashboardComponent implements OnInit, AfterViewInit {
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
    approverType: null,
    masterWorkflowId: null,
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
  storeWorkflowObject: any;
  storeMasterWorkflowId: any;
  storeApproverType: any;

  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
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
    private menuService: MenuServiceService,
    private helpDeskService: HelpDeskService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);

    this.isProject = this.authService.getisProject();

    this.storeWorkflowObject = { ...this.helpDeskService.workflowObject };
    this.storeMasterWorkflowId = this.storeWorkflowObject.masterWorkflowId
      ? this.storeWorkflowObject.masterWorkflowId
      : 0;
    this.storeApproverType = this.storeWorkflowObject.approverType;
    if (this.storeMasterWorkflowId == 0 || this.storeMasterWorkflowId == null) {
      this.router.navigate([
        "/maintenance-management/dashboard/asset-dashboard",
      ]);
    } else {
    }
  }
  onBack() {
    this.router.navigate(["/maintenance-management/dashboard/asset-dashboard"]);
  }
  ngOnInit(): void {
    this.getV2_AssetStatusCount();
    this.getDropdownCompanyList();
    this.getDropdownAssetStatusList("AssetList");
    this.getDropdownClientlist();
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
    (this.payload.approverType = this.storeWorkflowObject.approverType),
      (this.payload.masterWorkflowId =
        this.storeWorkflowObject.masterWorkflowId),
      this.assetService
        .GetV2_DashboardTodoListDetails_Paging(
          this.commonFunctionService.clean(this.payload)
        )
        .subscribe((res: any) => {
          this.assetList = res.list;
          if (this.checkedAssetList.length > 0) {
            this.assetList = this.assetList.filter((item) => {
              let foundItemArray: any[] = this.checkedAssetList?.filter(
                (el) => el.id == item.id
              );
              if (foundItemArray.length > 0) item["checked"] = true;
              return 1;
            });
          }

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

  viewHandler(assetId: any, objectAsset: any) {
    this.assetService.sendAssetId = assetId;
    this.assetService.storeAssetObject = { ...objectAsset };
    this.router.navigate([
      "/maintenance-management/dashboard/asset-view-dashboard",
    ]);
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
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownAssetStatusIdValue = null;
    this.selectedDropDownLocationIdValue = null;
    this.typeAssetNameValue = null;
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
    };
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
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (this.currentUserRole === "Client User") {
        this.selectedDropDownCompanyIdValue =
          this.arrayListDropDownCompany[0].companyId;
        this.onDropdownCompanyValueChange("");
      }
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .GetClientListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;

        console.log("get client::",this.arrayListDropDownClientList);
        if (this.currentUserRole === "Client User") {
          this.selectedDropDownClientIdValue =
            this.arrayListDropDownClientList[0].clientId;
          this.onDropdownClientValueChange("");
        }
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
    this.getDropdownCategoryList();}
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

  onTypeAssetTagId() {}

  clearAdvanceSearch(offcanvas) {
    offcanvas.dismiss("Cross click");
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.selectedDropDownCategoryIdValue = null;
    this.selectedDropDownSubCategoryIdValue = null;

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

  uniqTheObject(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  checkedAssetList: any = [];
  onCheckboxChange(ev) {
    if (this.assetList.length) {
      this.assetList.forEach((x) => (x.checked = ev.target.checked));
      if (ev.target.checked == true) {
        this.assetList.forEach((ele, index) => {
          this.checkedAssetList.push(ele);
        });
      } else {
        this.checkedAssetList = this.checkedAssetList.filter((item) => {
          let foundItemArray: any[] = this.assetList.filter(
            (el) => el.id == item.id
          );
          if (foundItemArray.length > 0) return false;
          return true;
        });
      }
      this.checkedAssetList = this.uniqTheObject(
        this.checkedAssetList,
        (obj) => obj.id
      );
    }
    return false;
  }

  checkUncheckAll() {
    return this.assetList.length != 0
      ? this.assetList.every((p) => p.checked)
      : false;
  }
  getAssetlistChecked(isSelected: any, asset: any) {
    if (isSelected == true) {
      this.checkedAssetList.push(asset);
    } else {
      this.checkedAssetList.forEach((value, index) => {
        if (value.id == asset.id) {
          this.checkedAssetList.splice(index, 1);
        }
      });
    }
  }

  removeCheckedAssetList(asset: any) {
    this.assetList.forEach((ele, i) => {
      if (ele.id == asset.id) {
        this.assetList[i].checked = false;
      }
    });
    this.checkedAssetList.forEach((value, index) => {
      if (value.id == asset.id) {
        this.checkedAssetList.splice(index, 1);
      }
    });
  }

  requestHandler(asset, remark, actionStatus: any) {
    //New Asset Confirmation

    let actionStatusdata: any;
    if (actionStatus == "Approver") {
      actionStatusdata = "Approved";
    } else if (actionStatus == "Reviewer") {
      actionStatusdata = "Reviewed";
    } else if (actionStatus == "Reject") {
      actionStatusdata = "Rejected";
    }
    if (this.storeMasterWorkflowId == 1) {
      let requestData = {
        WfAssetCreationId: asset.wfAssetCreationId,
        WfAssetCreationDetailId: asset.wfAssetCreationDetailId,
        ApproverType: this.storeWorkflowObject.approverType,
        ActionStatus: actionStatusdata,
        AssetId: asset.id,
        Remark: remark,
      };
      //console.log("requestData", requestData);
      this.assetService
        .postUpdateReviewerApproverProcess(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkedAssetList = [];
            this.loadData();
          },
          (err: any) => {
            //console.log(err);
            this.openModaWaringConf(err);
          }
        );
    }
  }
  openModaWaringConf(message) {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = message;
    modalRef.componentInstance.subTitle = "";
    modalRef.result.then((result) => {
      //console.log(result, "result");
      if (result) {
        if (result == "Close click") {
          this.loadData();
        }
      }
    });
  }

  requestHandlerMulti(remark, actionStatus: any) {
    //New Asset Confirmation

    let actionStatusdata: any;
    if (actionStatus == "Approver") {
      actionStatusdata = "Approved";
    } else if (actionStatus == "Reviewer") {
      actionStatusdata = "Reviewed";
    } else if (actionStatus == "Reject") {
      actionStatusdata = "Rejected";
    }
    let pushedPayload: any = [];
    if (this.storeMasterWorkflowId == 1) {
      this.checkedAssetList.forEach((asset) => {
        pushedPayload.push({
          WfAssetCreationId: asset.wfAssetCreationId,
          WfAssetCreationDetailId: asset.wfAssetCreationDetailId,
          ApproverType: this.storeWorkflowObject.approverType,
          ActionStatus: actionStatusdata,
          AssetId: asset.id,
          Remark: remark,
        });
      });
      let requestData = pushedPayload;
      //console.log("requestData", requestData);
      this.assetService
        .postUpdateReviewerMultiApproverProcess(requestData)
        .subscribe((res: any) => {
          this.success(res);
          this.checkedAssetList = [];
          this.loadData();
        });
    }
  }

  openModalSucccessWithRemark(asset: any, type: any,print:any) {
    const modalRef = this.modalService.open(SuccessModalWithRemarkComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      " Do you want to " + print + " this asset";
    modalRef.componentInstance.subTitle = "( " + asset.assetName + " ) ";
    modalRef.componentInstance.subTitle1 = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = print + " It";
    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result.value == "success") {
          this.requestHandler(asset, result.remark, type);
        }
      }
    });
  }
  openModalSucccessWithRemarkMulti(type: any,buttonName:any) {
    const modalRef = this.modalService.open(SuccessModalWithRemarkComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Would you like to proceed with this action?";
    modalRef.componentInstance.subTitle = " You won't be able to revert this!";
    modalRef.componentInstance.subTitle1 = "";
    modalRef.componentInstance.buttonName = buttonName + " It";
    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result.value == "success") {
          this.requestHandlerMulti(result.remark, type);
        }
      }
    });
  }

  success(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.action,
      text: res.message,
      showConfirmButton: false,
      timer: 1000,
      showCloseButton: true, // Add this line
    });
  }
}
