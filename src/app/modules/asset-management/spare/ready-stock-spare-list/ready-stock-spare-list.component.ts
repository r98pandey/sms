import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { SpareService } from "src/app/core/services/spare.service";
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
import Swal from "sweetalert2";

@Component({
  selector: "app-ready-stock-spare-list",
  templateUrl: "./ready-stock-spare-list.component.html",
  styleUrls: ["./ready-stock-spare-list.component.scss"],
})
export class ReadyStockSpareListComponent implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Spare Management";
  breadCrumbItems: any = [
    { label: "Spare" },
    { label: "Spare List", active: true },
  ];
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    companyId: null,
    SearchCatergoryId: null,
    SearchSparePartName: null,
    SearchSpareStatusId: null,
    SearchSubCategoryId: null,
    SearchSparePartStatusId: null,
  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  spareList = [];
  page = 1;
  collectionSize = 0;

  imageUrl: any = environment.apiUrl;
  viewImageValue: any;
  spareQrData: any;
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };

  arrayListDropDownCompany: any = [];
  arrayListDropDownCategoryList: any = [];
  arrayListDropDownSubCategoryList: any = [];
  arrayListDropDownSpareStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownCategoryIdValue: any;
  selectedDropDownSubCategoryIdValue: any;
  selectedDropDownSpareStatusIdValue: any;

  typeSpareNameValue: any;
  submitted: boolean;
  assetQrData: any;
  editSparepartObject: any;
  viewSparepartObject: any;

  spareStatusCountObject: any = {
    totalInserviceAssetSparePart: 0,
    totalReadyStockAssetAssetSparePart: 0,
    totalEndOffLifeAsset: 0,
  };

  deleteId: any;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private spareService: SpareService,
    private authService: AuthAssetService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private menuService: MenuServiceService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);

    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {
    this.getV2_AssetStatusCount();
    this.getDropdownCompanyList();
    this.getDropdownSpareStatusList();
    if (localStorage.getItem("objectSerachForRaedySpare")) {
      this.getObjectAfterRefresh();
    } else {
      this.loadData();
    }
  }

  getV2_AssetStatusCount() {
    this.spareService
      .getV2_SparePartAssetStatusCount()
      .subscribe((res: any) => {
        this.spareStatusCountObject = res.data;
      });
  }

  openModalAddSpare(addSpare: any) {
    this.modalService.open(addSpare, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,

      scrollable: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    this.spareService
      .getSpartPartList_ReadyStock_ByPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.spareList = res.obj;
        this.setObjectBeforeRefesh();
        if (this.spareList.length > 0) {
          this.totalRecordsFromApi = res.obj[0].totalCount;
          this.from = res.obj.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.obj[0].rowNum
          );
          this.to = res.obj.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.obj[0].rowNum
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

  viewHandler(spare: any, content) {
    this.viewSparepartObject = spare;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,

      scrollable: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  editHandler(spare: any, content) {
    this.editSparepartObject = spare;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,

      scrollable: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  onTypeSpareNameChange(isDebounce) {
    if (this.typeSpareNameValue.length === 0 || isDebounce) {
      this.page = 1;
      this.payload.displayStart = this.pageSize * (this.page - 1);
      this.payload.SearchSparePartName = this.typeSpareNameValue;
      this.loadData();
    }
  }
  resetSerachVariable() {
    this.arrayListDropDownCategoryList = [];
    this.arrayListDropDownSubCategoryList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownCategoryIdValue = null;
    this.selectedDropDownSubCategoryIdValue = null;
    this.selectedDropDownSpareStatusIdValue = null;
    this.typeSpareNameValue = null;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      companyId: null,
      SearchCatergoryId: null,
      SearchSparePartName: null,
      SearchSpareStatusId: null,
      SearchSubCategoryId: null,
      SearchSparePartStatusId: null,
    };
    this.page = 1;
    localStorage.removeItem("objectSerachForRaedySpare");
    this.loadData();
  }
  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_CompanyDropDownList_AssetManagement({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
    });
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
  onDropdownCompanyValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.companyId = this.selectedDropDownCompanyIdValue;
    this.selectedDropDownCategoryIdValue = null;
    this.selectedDropDownSubCategoryIdValue = null;

    this.payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.arrayListDropDownCategoryList = [];
    this.arrayListDropDownSubCategoryList = [];
    this.getDropdownCategoryList();

    this.loadData();
  }
  onDropdownCategoryValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    this.selectedDropDownSubCategoryIdValue = null;
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.getDropdownSubCategoryList();
    this.loadData();
  }
  onDropdownSubCategoryValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);

    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.loadData();
  }
  /**
   * End  For Dropdown Company ,client,project
   */

  getDropdownSpareStatusList() {
    this.spareService.getSparePartStatusList().subscribe((res: any) => {
      this.arrayListDropDownSpareStatus = res;
    });
  }

  onDropdownSpareStatusValueChange($event) {
    this.payload.SearchSparePartStatusId =
      this.selectedDropDownSpareStatusIdValue;
    this.loadData();
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: "md", centered: true });
  }
  afterSubmitSpareData(event) {
    // this.payload = {
    //   displayLength: 10,
    //   displayStart: this.pageSize * (this.page - 1),
    //   companyId: this.selectedDropDownCompanyIdValue,
    //   SearchCatergoryId: this.selectedDropDownCategoryIdValue ? this.selectedDropDownCategoryIdValue : null,
    //   SearchSparePartName: this.typeSpareNameValue ? this.typeSpareNameValue : null,
    //   SearchSubCategoryId: this.selectedDropDownSubCategoryIdValue ? this.selectedDropDownSubCategoryIdValue : null,
    //   SearchSparePartStatusId: this.selectedDropDownSpareStatusIdValue ? this.selectedDropDownSpareStatusIdValue : null
    // }
    this.editSparepartObject = null;
    this.getObjectAfterRefresh();
  }

  viewQrCodeImage(content, asset): void {
    this.spareQrData = asset;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  @ViewChild("inputer", { static: true }) input: ElementRef;
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeSpareNameChange(true);
        })
      )
      .subscribe();
  }

  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForRaedySpare: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForRaedySpare.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownCategoryIdValue)
      objectSerachForRaedySpare.SearchCatergoryId =
        this.selectedDropDownCategoryIdValue;
    if (this.selectedDropDownSubCategoryIdValue)
      objectSerachForRaedySpare.SearchSubCategoryId =
        this.selectedDropDownSubCategoryIdValue;
    if (this.typeSpareNameValue)
      objectSerachForRaedySpare.SearchSparePartName = this.typeSpareNameValue;
    if (this.selectedDropDownSpareStatusIdValue)
      objectSerachForRaedySpare.SearchSparePartStatusId =
        this.selectedDropDownSpareStatusIdValue;
    if (this.arrayListDropDownCategoryList) {
      objectSerachForRaedySpare.arrayListDropDownCategoryList =
        this.arrayListDropDownCategoryList;
    }
    if (this.arrayListDropDownSubCategoryList) {
      objectSerachForRaedySpare.arrayListDropDownSubCategoryList =
        this.arrayListDropDownSubCategoryList;
    }
    if (this.page) {
      objectSerachForRaedySpare.displayStart = this.pageSize * (this.page - 1);
      objectSerachForRaedySpare.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForRaedySpare",
      JSON.stringify(objectSerachForRaedySpare)
    );
  }
  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForRaedySpare: any = JSON.parse(
      localStorage.getItem("objectSerachForRaedySpare")
    );
    this.arrayListDropDownCategoryList =
      objectSerachForRaedySpare.arrayListDropDownCategoryList
        ? objectSerachForRaedySpare.arrayListDropDownCategoryList
        : [];
    this.arrayListDropDownSubCategoryList =
      objectSerachForRaedySpare.arrayListDropDownSubCategoryList
        ? objectSerachForRaedySpare.arrayListDropDownSubCategoryList
        : [];
    this.selectedDropDownCompanyIdValue =
      objectSerachForRaedySpare.SearchCompanyId
        ? objectSerachForRaedySpare.SearchCompanyId
        : null;
    this.selectedDropDownCategoryIdValue =
      objectSerachForRaedySpare.SearchCatergoryId
        ? objectSerachForRaedySpare.SearchCatergoryId
        : null;
    this.selectedDropDownSubCategoryIdValue =
      objectSerachForRaedySpare.SearchSubCategoryId
        ? objectSerachForRaedySpare.SearchSubCategoryId
        : null;
    this.typeSpareNameValue = objectSerachForRaedySpare.SearchSparePartName
      ? objectSerachForRaedySpare.SearchSparePartName
      : null;
    this.selectedDropDownSpareStatusIdValue =
      objectSerachForRaedySpare.SearchSparePartStatusId
        ? objectSerachForRaedySpare.SearchSparePartStatusId
        : null;
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.payload.SearchSparePartName = this.typeSpareNameValue;
    this.payload.SearchSparePartStatusId =
      this.selectedDropDownSpareStatusIdValue;
    if (objectSerachForRaedySpare.displayStart) {
      this.payload.displayStart = objectSerachForRaedySpare.displayStart;
      this.page = objectSerachForRaedySpare.page;
    }
    this.loadData();
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  openDeleteModal(modal, id) {
    this.deleteId = id;
    this.modalService.open(modal, { centered: true });
  }

  deleteData(deleteId?) {
    this.spareService
      .postDeletespare({ AssetSparePartId: this.deleteId })
      .subscribe({
        next: (res) => {
          this.page = 1;
          this.payload.displayStart = this.pageSize * (this.page - 1);
          this.loadData();
          this.successForDeletespareData(res);
        },
      });
  }

  successForDeletespareData(res) {
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
