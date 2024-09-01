import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import {
  NgbActiveModal,
  NgbModal,
  NgbOffcanvas,
} from "@ng-bootstrap/ng-bootstrap";
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

@Component({
  selector: "app-new-asset-list-common",
  templateUrl: "./new-asset-list-common.component.html",
  styleUrls: ["./new-asset-list-common.component.scss"],

})
export class NewAssetListCommonComponent
  implements OnInit, OnChanges, AfterViewInit
{
  isProject: boolean = false;
  @Input() shownCol4: boolean = true;

  @Input() selectedDropDownCompanyIdValue: any;
  @Input() selectedDropDownClientIdValue: any;
  @Input() selectedDropDownProjectOrDeparmentIdValue: any;
  @Input() SearchAssetStatusIdShown: any;
  // @Output() assetListSelected = new EventEmitter();

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
    SearchPoNumber: null,
  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  assetList = [];
  page = 1;
  collectionSize = 0;

  imageUrl: any = environment.apiUrl;
  viewImageValue: any;
  assetQrData: any;
  returnValueMenu: any;

  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownAssetStatus: any = [];
  selectedDropDownAssetStatusIdValue: any;
  selectedDropDownLocationIdValue: any;
  typeAssetNameValue: any;

  masterSelected!: boolean;
  arrayListDropDownLocationList: any = [];
  checkedAssetList: any = [];
  @Input() selectedAsset = [];

  constructor(
    private dropdownService: DropdownService,
    private router: Router,
    private modalService: NgbModal,
    private assetService: AssetService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    public modal: NgbOffcanvas,
   
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.checkedAssetList = this.selectedAsset ? this.selectedAsset : [];
    this.payload.SearchAssetStatusId = this.SearchAssetStatusIdShown
      ? this.SearchAssetStatusIdShown
      : null;

    this.loadData();
    this.getLocationListDrobDown();
    this.getDropdownCompanyList();
    this.getDropdownAssetStatusList("AssetList");
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;

    this.payload.SearchAssetStatusId = this.SearchAssetStatusIdShown
      ? this.SearchAssetStatusIdShown
      : null;
    this.checkedAssetList = this.selectedAsset ? this.selectedAsset : [];

    this.loadData();
    this.getDropdownCompanyList();
    this.getLocationListDrobDown();
    this.getDropdownAssetStatusList("AssetList");
  }
  // When the user clicks on the button, scroll to the top of the document
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
  onDropdownLocationValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchLocationId = this.selectedDropDownLocationIdValue;
    this.loadData();
  }
  navigateToAdd() {
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
    if (this.SearchAssetStatusIdShown) {
      this.assetService
        .GetV2_DeliveryAssetOnly_ByPagination(
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
    } else {
      this.assetService
        .GetV2_CommanAssetList_ByPagination(
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
    this.router.navigate(["/asset-management/asset/viewasset"]);
  }

  editHandler(assetId: any) {
    this.assetService.sendAssetId = assetId;
    this.router.navigate(["/asset-management/asset/editasset"]);
  }

  onTypeAssetNameChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);

    this.payload.SearchAssetName = this.typeAssetNameValue;
    this.loadData();
  }


  resetSerachVariable() {
    this.selectedDropDownAssetStatusIdValue = null;
    this.selectedDropDownLocationIdValue = null;
    this.typeAssetNameValue = null;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
      SearchDepartmentId: this.selectedDropDownProjectOrDeparmentIdValue,
      SearchLocationId: null,
      SearchAssetStatusId: this.SearchAssetStatusIdShown
        ? this.SearchAssetStatusIdShown
        : null,
      SearchCategoryId: null,
      SearchSubCategoryId: null,
      SearchAssetName: null,
      SearchAssetTagId: null,
    };

    this.page = 1;
    this.loadData();
  }
  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
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
    if(this.selectedDropDownClientIdValue){
    this.getDropdownClientlist();
    }
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

    this.payload.displayStart = this.pageSize * (this.page - 1);

    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.loadData();
  }
  /**
   * End  For Dropdown Company ,client,project
   */

  getDropdownAssetStatusList(pageName: any) {
    this.assetService.getAssetStatusList(pageName).subscribe((res: any) => {
      this.arrayListDropDownAssetStatus = res;
    });
  }

  onDropdownAssetStatusValueChange($event) {
    this.payload.SearchAssetStatusId = this.selectedDropDownAssetStatusIdValue;
    this.loadData();
  }

  uniqTheObject(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

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

  @ViewChild("inputer", { static: true }) input: ElementRef;

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeAssetNameChange();
        })
      )
      .subscribe();
  }

  close() {
    this.modal.dismiss(this.checkedAssetList);
  }

  submit() {
    this.modal.dismiss(this.checkedAssetList);
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
}
