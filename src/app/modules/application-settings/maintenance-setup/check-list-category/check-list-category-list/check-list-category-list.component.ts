import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientService } from "src/app/core/services/client.services";
import { MaintenanceMasterService } from "src/app/core/services/maintenance-master.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import Swal from "sweetalert2";
import { CommonFunctionService } from '../../../../../shared/Service-common/common-function.service';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-check-list-category-list",
  templateUrl: "./check-list-category-list.component.html",
  styleUrls: ["./check-list-category-list.component.scss"],
})
export class CheckListCategoryListComponent implements OnInit {
  label: any = "Check List Category";
  breadCrumbItems: any = [
    { label: "Check List" },
    { label: "Check List Category", active: true },
  ];
  apiUrl: string;
  preventCategoryList: any=[];
  isTableView: boolean;
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  nodata: boolean;
  formGroup: FormGroup;
  editFormGroup: FormGroup;
  payload = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
  };
  isEdit: boolean = false;
  preventiveCategoryData: any;
  CompanyListV2: any[] = [];
  CompanyId: any;
  SelectedPreventCategoryName: any;
  totalRecordsFromApi: number = 0;
  pageNo = 1;
  editCheckListCategory: any = {};
 
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  constructor(
    private modalService: NgbModal,
    private maintenanceMasterService: MaintenanceMasterService,
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private menuService: MenuServiceService,
    private commonFunctionService:CommonFunctionService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.editCheckListCategory = {
      PreventiveCategoryId: "",
      PreventiveCategoryName: "",
    };
  }
 
  ngOnInit(): void {
    this.buildForm();
    this.getV2_GetCompanyListDrobDown();
    if (JSON.parse(localStorage.getItem("objectSerachForCheckListCategoryList"))) {
      this.getObjectAfterRefresh();
    } else {
      this.loadData();
    }
 
  }
 
  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      category: ["", [Validators.required]],
      companyId: [null, [Validators.required]],
      IsAsset: [false],
    });
    this.editFormGroup = this.formBuilder.group({
      category: ["", [Validators.required]],
      companyId: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      IsAsset: [false],
    });
  }
 
  get f() {
    return this.formGroup.controls;
  }
  get category() {
    return this.formGroup.get("category");
  }
  get companyId() {
    return this.formGroup.get("companyId");
  }
  get IsAssetAdd() {
    return this.formGroup.get("IsAsset");
  }
 
 
  get IsAssetEdit() {
    return this.editFormGroup.get("IsAsset");
  }
 
  get editCategory() {
    return this.editFormGroup.get("category");
  }
 
  editModalPopupHandlerModal(formModal, data: any): void {
    this.editFormGroup.patchValue({
      companyId: data?.companyId ? data?.companyId : null,
      category: data?.preventiveCategoryName
        ? data?.preventiveCategoryName
        : "",
      categoryId: data?.preventiveCategoryId ? data?.preventiveCategoryId : "",
      IsAsset: data.isAsset ? true : false,
    });
    this.isEdit = true;
    this.modalService.open(formModal, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  editModalPopupHandler(): void {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Edit Check List Category";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.onEditSubmitHandler()
        } else {
        
          //this.onBack();
        }
      }
    });
  }
 
  deleteModalPopupHandler(formModal, preventiveCategory: any): void {
    this.preventiveCategoryData = preventiveCategory;
    this.isEdit = true;
    this.modalService.open(formModal, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    if (
      this.preventiveCategoryData &&
      this.preventiveCategoryData?.preventiveCategoryId
    ) {
      this.patchForm(this.preventiveCategoryData);
    }
  }
 
  addModalPopupHandler(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.formGroup.reset();
 
        },
        (reason) => {
          this.formGroup.reset();
 
        }
      );
  }
 
  patchForm(data): void {
    this.formGroup.patchValue({
      formCompanyId: data?.companyId ? data?.companyId : null,
      preventCategoryName: data?.category ? data?.category : "",
    });
  }
 
  getV2_GetCompanyListDrobDown() {
    this.clientService.postGetV2_GetCompanyListDrobDown({}).subscribe(
      (res: any) => {
        this.CompanyListV2 = res.list;
        this.setObjectBeforeRefesh()
      },
      (err: any) => { }
    );
  }
 
  loadPage(pageNo: number) {
    this.pageNo = pageNo;
    this.payload.displayLength = this.pageSize;
    this.payload.displayStart = this.pageSize * (pageNo - 1);
    this.loadData();
 
  }
 
  loadData() {
    this.maintenanceMasterService
      .getpreventCategoryList(this.commonFunctionService.clean(this.payload))
      .subscribe(
        (response: any) => {
          this.preventCategoryList = response.list;
          if (this.preventCategoryList.length > 0) {
            this.totalRecordsFromApi = response.list[0].totalCount;
            this.from = response.list.reduce(
              (min, p) => (p.rowNum < min ? p.rowNum : min),
              response.list[0].rowNum
            );
            this.to = response.list.reduce(
              (max, p) => (p.rowNum > max ? p.rowNum : max),
              response.list[0].rowNum
            );
            this.pageSize = this.payload.displayLength;
          } else {
            this.totalRecordsFromApi = 0;
            this.from = 0;
            this.to = 0;
            this.pageSize = this.payload.displayLength;
          }
          this.setObjectBeforeRefesh()
        }
      );
  }
 
  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }

  onSubmitHandler() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to add Check List Category";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addCheckListSucessModal();
        } else {
        //  this.onBack();
        }
      }
    });
  }
  
 
  addCheckListSucessModal() {
    let companyId=this.formGroup.value.companyId
    let requestData = {
      CompanyId: this.formGroup.value.companyId,
      IsAsset: this.formGroup.value.IsAsset,
      PreventiveCategoryName: this.formGroup.value.category,
    };
 
    this.maintenanceMasterService.addPreventCategory(requestData).subscribe(
      (res: any) => {
        this.page = 1;
        this.CompanyId=companyId;
        this.payload.SearchCompanyId = companyId;
        this.payload.displayLength = this.pageSize;
        this.payload.displayStart = this.pageSize * (this.page - 1);
        this.loadData();
        this.modalService.dismissAll();
        this.formGroup.reset();
        this.formGroup.markAsUntouched();
        this.success(res);
      }
    );
  }
 
  onEditSubmitHandler() {
    let companyId=this.editFormGroup.value.companyId
    let requestData = {
      CompanyId: this.editFormGroup.value.companyId,
      IsAsset: this.editFormGroup.value.IsAsset,
      PreventiveCategoryId: this.editFormGroup.value.categoryId,
      PreventiveCategoryName: this.editFormGroup.value.category,
    };
    this.maintenanceMasterService.updatePreventCategory(requestData).subscribe(
      (res: any) => {
        this.page = 1;
        this.CompanyId=companyId;
        this.payload.SearchCompanyId = companyId;
        this.payload.displayLength = this.pageSize;
        this.payload.displayStart = this.pageSize * (this.page - 1);
        this.loadData();
        this.modalService.dismissAll();
        this.success(res);
      }
    );
  }
 
  onDeleteSubmitHandler() {
    let requestData = {
      PreventiveCategoryId: this.preventiveCategoryData.preventiveCategoryId,
    };
    this.maintenanceMasterService.deletePreventCategory(requestData).subscribe(
      (res: any) => {
        this.page = 1;
        this.payload.SearchCompanyId = this.CompanyId;
        this.payload.displayLength = this.pageSize;
        this.payload.displayStart = this.pageSize * (this.page - 1);
        this.loadData();
        this.modalService.dismissAll();
        this.success(res);
      }
    );
  }
 
  onDropdownCompanyValueChange(event: any) {
    this.page = 1;
    this.payload.displayLength = this.pageSize;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = event ? event?.companyId : null;
    this.preventCategoryList = [];
    this.loadData();
  }
 
  viewModalPopupHandler(formModal, data: any): void {
    this.preventiveCategoryData = data;
    this.modalService.open(formModal, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }
 
  clear() {
    this.CompanyId = null;
    this.page = 1;
    this.payload.SearchCompanyId = null;
    this.payload.displayLength = this.pageSize;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.loadData();
  }
  success(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  onClickHardware(event) {
    this.IsAssetAdd.setValue(event.target.checked);
  }
  onClickHardwarEdit(event) {
    this.IsAssetEdit.setValue(event.target.checked);
  }
  onClickHardwareEdit(event) {
    this.IsAssetEdit.setValue(event.target.checked);
  }
 
 
  /**
* for Set object to refesh
*/
  setObjectBeforeRefesh() {
    let objectSerachForCheckListCategoryList: any = {};
    if (this.CompanyListV2)
      objectSerachForCheckListCategoryList.CompanyListV2 = this.CompanyListV2;
 
    if (this.CompanyId)
      objectSerachForCheckListCategoryList.SearchCompanyId = this.CompanyId;
 
    if (this.page) {
      objectSerachForCheckListCategoryList.displayStart = this.pageSize * (this.page - 1);
      objectSerachForCheckListCategoryList.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForCheckListCategoryList",
      JSON.stringify(objectSerachForCheckListCategoryList)
    );
  }
 
  /**
* for get object for refesh
*/
  getObjectAfterRefresh() {
    let objectSerachForCheckListCategoryList: any = JSON.parse(
      localStorage.getItem("objectSerachForCheckListCategoryList")
    );
    this.CompanyListV2 =
      objectSerachForCheckListCategoryList.CompanyListV2
        ? objectSerachForCheckListCategoryList.CompanyListV2
        : [];
    this.CompanyId = objectSerachForCheckListCategoryList.SearchCompanyId
      ? objectSerachForCheckListCategoryList.SearchCompanyId
      : null;
 
    if (objectSerachForCheckListCategoryList.displayStart) {
      this.payload.displayStart = objectSerachForCheckListCategoryList.displayStart;
      this.page = objectSerachForCheckListCategoryList.page;
    }
    this.payload.SearchCompanyId = this.CompanyId;
    this.loadData();
 
  }
 
}