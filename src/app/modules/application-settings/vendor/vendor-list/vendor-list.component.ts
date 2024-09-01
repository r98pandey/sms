import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VendorService } from 'src/app/core/services/vendor.service';
import Swal from 'sweetalert2';
import { CommonFunctionService } from '../../../../shared/Service-common/common-function.service';
import { DropdownService } from 'src/app/shared/Service-common/dropdown.service';
import { fromEvent, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

@Component({
  selector: "app-vendor-list",
  templateUrl: "./vendor-list.component.html",
  styleUrls: ["./vendor-list.component.scss"],
})
export class VendorListComponent implements OnInit, AfterViewInit {
  label: any = "Vendor List";
  breadCrumbItems: any = [
    { label: "Vendor" },
    { label: "Vendor List", active: true },
  ];

  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchVendorName: null,
  };
  arrayListDropDownCompany: any = [];
  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  assetList = [];
  page = 1;
  collectionSize = 0;
  deleteId: any = null;

  vendorList: any[] = [];
  selectedDropDownCompanyIdValue: any = null;
  typeVendorNameValue: any;
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  constructor(
    private vendorService: VendorService,
    private router: Router,
    private modalService: NgbModal,
    private dropdownServices: DropdownService,
    private commonFunctionService: CommonFunctionService,
    private menuService: MenuServiceService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
  }
  ngOnInit(): void {
    this.getDropdownCompanyList();

    if (localStorage.getItem("objectSerachForVendorList")) {
      this.getObjectAfterRefreshVendor();
    } else {
      this.getVendors();
    }
  }

  getVendors() {
    this.vendorService
      .GetVendorTableList_ServerPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe({
        next: (res: any) => {
          this.vendorList = res.list;
          this.setObjectAfterRefreshVendor();
          if (this.vendorList.length > 0) {
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
        },
      });
  }
  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.getVendors();
    }
  }

  /**
  * for Set object to refesh
  */
  setObjectAfterRefreshVendor() {
    let objectSerachForVendorList: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForVendorList.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;

    if (this.typeVendorNameValue)
      objectSerachForVendorList.SearchVendorName =
        this.typeVendorNameValue;


    if (this.page) {
      objectSerachForVendorList.displayStart = this.pageSize * (this.page - 1);
      objectSerachForVendorList.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForVendorList",
      JSON.stringify(objectSerachForVendorList)
    );
  }

  /**
  * for get object for refesh
  */
  getObjectAfterRefreshVendor() {
    let objectSerachForVendorList: any = JSON.parse(
      localStorage.getItem("objectSerachForVendorList")
    );

    this.selectedDropDownCompanyIdValue = objectSerachForVendorList.SearchCompanyId
      ? objectSerachForVendorList.SearchCompanyId
      : null;
    this.typeVendorNameValue = objectSerachForVendorList.SearchVendorName
      ? objectSerachForVendorList.SearchVendorName
      : null;
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchVendorName = this.typeVendorNameValue;

    if (objectSerachForVendorList.displayStart) {
      this.payload.displayStart = objectSerachForVendorList.displayStart;
      this.page = objectSerachForVendorList.page;
    }
    this.getVendors();
  }


  navigateToForm(isAdd?: boolean, id?) {
    this.vendorService.accessRight = true;
    if (isAdd) {
      this.router.navigate(["/application-settings/vendor/vendor-add"]);
    } else {
      VendorService.selectedVendorId = id;
      this.router.navigate(["/application-settings/vendor/vendor-edit"]);
    }
  }

  addConfirmDeleteSucessModal(content: any, id: any) {
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
    modalRef.componentInstance.title = "Are you Sure you want to Delete Vendor";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addConfirmDeleteSucessModal(content, id);
        } else {
         // this.onBack();
        }
      }
    });
  }
  

  deleteData(deleteId) {
    this.vendorService.postDeleteVendor({ VendorId: deleteId }).subscribe({
      next: (res) => {
        this.successForDeletespareData(res);
        this.page = 1;
        this.payload.displayStart = this.pageSize * (this.page - 1);
        this.getVendors();
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

  navigateToView(vendor) {
    VendorService.selectedVendorId = vendor.vendorId;
    this.router.navigate(["/application-settings/vendor/vendor-view"]);
  }

  getDropdownCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
    });
  }

  onDropdownCompanyValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    
      this.getVendors();
    
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
          this.onTypeAssetNameChange(true);
        })
      )
      .subscribe();
  }
  onTypeAssetNameChange(isDebounce) {
    if (this.typeVendorNameValue.length === 0 || isDebounce) {
      this.page = 1;
      this.payload.displayStart = this.pageSize * (this.page - 1);
      this.payload.SearchVendorName = this.typeVendorNameValue;
      this.getVendors();
    }
  }
  resetSerachVariable() {
    this.selectedDropDownCompanyIdValue = null;
    this.typeVendorNameValue = null;

    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchVendorName: null,
    };
    this.page = 1;
    this.getVendors();
  }
}
