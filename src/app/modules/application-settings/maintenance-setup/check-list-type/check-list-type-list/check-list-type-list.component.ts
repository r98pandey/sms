import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { preventiveType } from "src/app/core/models/ticket.interface";
import { ClientService } from "src/app/core/services/client.services";
import { MaintenanceMasterService } from "src/app/core/services/maintenance-master.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import Swal from "sweetalert2";
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { Router } from "@angular/router";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-check-list-type-list",
  templateUrl: "./check-list-type-list.component.html",
  styleUrls: ["./check-list-type-list.component.scss"],
})
export class CheckListTypeListComponent implements OnInit {
  label: any = "Check List Types";
  breadCrumbItems: any = [
    { label: "Check List" },
    { label: "Check List Types", active: true },
  ];
  apiUrl: string;
  list: any;
  companyList: any;
  companyId: string | number;
  preventTypeName: string;
  preventCategoryId: string;
  totalRecords: number;
  pageSize: number = 10;
  pageNo: number;
  formGroup: FormGroup;
  editFormGroup: FormGroup;
  formPayload: any = {};
  preventiveTypeData: any;
  isEdit: boolean = false;
  preventCategoryList: any;
  preventCategoryList2: any;
  preventiveCategoryId: string | number;
  from = 0;
  to = 0;
  page = 1;
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchPreventCategoryId: null,
  };

  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  constructor(
    private dropDownService: DropdownService,
    private modalService: NgbModal,
    private maintenanceMasterService: MaintenanceMasterService,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private router: Router,
    private menuService: MenuServiceService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
  }

  ngOnInit(): void {
    this.buildForm();
    this.getV2_GetCompanyListDrobDown();
    //this.getPreventiveType();
    if (localStorage.getItem("objectSerachForCheckList")) {
      this.getObjectAfterRefresh();
    } else {
      this.getPreventiveType();
    }
  }

  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForCheckList: any = {};
    if (this.companyId)
      objectSerachForCheckList.SearchCompanyId =
        this.companyId;

    if (this.preventCategoryList)
      objectSerachForCheckList.preventCategoryList =
        this.preventCategoryList;

    if (this.preventCategoryId)
      objectSerachForCheckList.SearchPreventCategoryId =
        this.preventCategoryId;

    if (this.page) {
      objectSerachForCheckList.displayStart = this.pageSize * (this.page - 1);
      objectSerachForCheckList.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForCheckList",
      JSON.stringify(objectSerachForCheckList)
    );
  }

  /**
* for get object for refesh
*/
  getObjectAfterRefresh() {
    let objectSerachForCheckList: any = JSON.parse(
      localStorage.getItem("objectSerachForCheckList")
    );
    this.companyId =
      objectSerachForCheckList.SearchCompanyId
        ? objectSerachForCheckList.SearchCompanyId
        : [];



    this.preventCategoryList
      = objectSerachForCheckList.preventCategoryList ? objectSerachForCheckList.preventCategoryList : [];

    this.companyId = objectSerachForCheckList.SearchCompanyId
      ? objectSerachForCheckList.SearchCompanyId
      : null;

    this.preventCategoryId = objectSerachForCheckList.SearchPreventCategoryId
      ? objectSerachForCheckList.SearchPreventCategoryId
      : null;

    this.payload.SearchCompanyId = this.companyId;
    this.payload.SearchPreventCategoryId = this.preventCategoryId;

    if (objectSerachForCheckList.displayStart) {
      this.payload.displayStart = objectSerachForCheckList.displayStart;
      this.page = objectSerachForCheckList.page;
    }
    this.getPreventiveType();
  }



  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      companyId: [null, [Validators.required]],
      preventiveCategoryId: [null, [Validators.required]],
      preventiveTypeName: [null, [Validators.required]],
    });
    this.editFormGroup = this.formBuilder.group({
      companyId: [null, [Validators.required]],
      preventiveCategoryId: [null, [Validators.required]],
      preventiveTypeName: [null, [Validators.required]],
    });
  }

  get f() {
    return this.formGroup.controls;
  }
  get fEdit() {
    return this.editFormGroup.controls;
  }

  get preventiveTypeName() {
    return this.formGroup.get("preventiveTypeName");
  }

  get editPreventiveTypeName() {
    return this.editFormGroup.get("preventiveTypeName");
  }

  getV2_GetCompanyListDrobDown() {
    this.dropDownService.GetCompanyListDrobDown({}).subscribe(
      (res: any) => {
        this.companyList = res.list;
        this.setObjectBeforeRefesh();
      },
      (err: any) => {
        //console.log("err", err);
      }
    );
  }

  changeCompanyHandler(event) {
    this.preventCategoryId = null;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = null;
    (this.payload.SearchPreventCategoryId = this.preventCategoryId),
      (this.preventCategoryList = []);
    if (event?.companyId) {
      (this.payload.SearchCompanyId = event?.companyId),
        (this.payload.SearchPreventCategoryId = this.preventCategoryId),
        this.getPreventiveCategory(event?.companyId);
    }
    this.getPreventiveType();
  }

  changeCompanyHandlerForm(event) {
    this.preventCategoryList2 = [];
    if (event.companyId) {
      this.formGroup.controls["preventiveCategoryId"].patchValue(null);
      this.getPreventiveCategory2(event.companyId);
    }
  }

  categoryHandler(event): void {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);

    this.preventiveCategoryId = event ? event.preventiveCategoryId : null;
    (this.payload.SearchPreventCategoryId = this.preventCategoryId),
      this.getPreventiveType();
  }

  companyHandler(event): void {
    this.getPreventiveCategory(event.companyId);
  }

  getPreventiveCategory(companyId): void {
    let payload = {
      SearchCompanyId: companyId,
    };
    this.maintenanceMasterService.getPreventiveCategory(payload).subscribe(
      (res: any) => {
        this.preventCategoryList = res.list;
        this.setObjectBeforeRefesh();
      },
      (err) => {
        //console.log("err", err);
      }
    );
  }

  getPreventiveCategory2(companyId): void {
    let payload = {
      SearchCompanyId: companyId,
    };
    this.maintenanceMasterService
      .getPreventiveCategory(payload)
      .subscribe((res: any) => {
        this.preventCategoryList2 = res.list;
        this.setObjectBeforeRefesh();
        // if (this.preventiveTypeData) {
        //   this.editFormGroup.get('preventiveCategoryId').setValue(this.preventiveTypeData?.preventiveCategoryId)
        //   //console.log(this.editFormGroup.getRawValue())

        //}
      });
  }

  getPreventiveType(): void {
    this.list = [];
    this.maintenanceMasterService
      .getPreventiveTypeList(this.commonFunctionService.clean(this.payload))
      .subscribe(
        (res: any) => {
          this.list = res?.list;
          this.setObjectBeforeRefesh();
          if (this.list.length > 0) {
            this.totalRecords = res.list[0].totalCount;
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
            this.totalRecords = 0;
            this.from = 0;
            this.to = 0;
            this.pageSize = this.payload.displayLength;
          }
        },
        (err) => {
          //console.log("err", err);
        }
      );
  }

  openPopup(formModal): void {
    this.modalService.open(formModal, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  // patchForm(data): void {
  //   this.formGroup.patchValue({
  //     formCompanyId: data?.companyId ? data?.companyId : null,
  //     preventiveCategory: data?.preventCategoryId ? data?.preventCategoryId : null,
  //     preventType: data?.preventiveTypeName ? data?.preventiveTypeName : '',
  //   })
  // }

  loadPage(pageNo: number) {
    this.pageNo = pageNo;
    this.payload.displayLength = this.pageSize;
    this.payload.displayStart = this.pageSize * (pageNo - 1);
    this.payload.SearchCompanyId = this.companyId;
    this.payload.SearchPreventCategoryId = this.preventiveCategoryId;
    this.getPreventiveType();

    this.pageNo = 1;
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
          this.preventCategoryList2 = [];
        },
        (reason) => {
          this.formGroup.reset();
          this.preventCategoryList2 = [];
        }
      );
  }

  onSubmitHandler() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to add Check List Item";
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
    let requestData = {
      CompanyId: this.formGroup.value.companyId,
      PreventCategoryId: this.formGroup.value.preventiveCategoryId,
      PreventiveTypeName: this.formGroup.value.preventiveTypeName,
    };
    this.maintenanceMasterService.addPreventiveType(requestData).subscribe(
      (res: any) => {
        this.modalService.dismissAll();
        this.page = 1;
        this.payload.displayStart = this.pageSize * (this.page - 1);
        this.formGroup.reset();
        this.preventCategoryList2 = [];
        this.success(res);
        this.getPreventiveType();
      },
      (err: any) => {
        //console.log("error", err);
      }
    );
  }

  editModalPopupHandler(): void {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Edit Check List Item";
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
  



  editModalPopupHandlerModal(formModal, preventiveType: any): void {
    this.preventiveTypeData = preventiveType;
    this.getPreventiveCategory2(preventiveType?.companyId);
    this.editFormGroup.patchValue({
      companyId: preventiveType?.companyId ? preventiveType?.companyId : null,
      preventiveCategoryId: preventiveType?.preventiveCategoryId
        ? preventiveType?.preventiveCategoryId
        : "",
      preventiveTypeName: preventiveType?.preventiveTypeName
        ? preventiveType?.preventiveTypeName
        : "",
    });

    //console.log("this.editFormGroup", this.editFormGroup.value);
    this.isEdit = true;
    this.modalService
      .open(formModal, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.editFormGroup.reset();
          this.preventCategoryList2 = [];
        },
        (reason) => {
          this.editFormGroup.reset();
          this.preventCategoryList2 = [];
        }
      );
  }

  onEditSubmitHandler() {
    let requestData = {
      CompanyId: this.editFormGroup.value.companyId,
      PreventiveTypeId: this.preventiveTypeData.preventiveTypeId,
      PreventCategoryId: this.editFormGroup.value.preventiveCategoryId,
      PreventiveTypeName: this.editFormGroup.value.preventiveTypeName,
    };
    this.maintenanceMasterService.updatePreventiveType(requestData).subscribe(
      (res: any) => {
        this.modalService.dismissAll();
        this.page = 1;
        this.payload.displayStart = this.pageSize * (this.page - 1);
        this.success(res);
        this.preventCategoryList2 = [];
        this.editFormGroup.reset();
        this.getPreventiveType();
        this.preventiveTypeData = null;
      },
      (err: any) => {
        //console.log("error", err);
      }
    );
  }

  deleteModalPopupHandler(formModal, preventiveType: any) {
    this.preventiveTypeData = preventiveType;
    //console.log("this.preventiveTypeData", this.preventiveTypeData);
    this.modalService.open(formModal, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  onDeleteSubmitHandler(): void {
    let payload = {
      PreventiveTypeId: this.preventiveTypeData.preventiveTypeId,
    };
    if (this.preventiveTypeData.preventiveCategoryId) {
      this.maintenanceMasterService.deletePreventiveType(payload).subscribe(
        (res) => {
          this.modalService.dismissAll();
          this.page = 1;
          this.payload.displayStart = this.pageSize * (this.page - 1);

          this.success(res);
          this.getPreventiveType();
        },
        (err) => {
          this.modalService.dismissAll();
        }
      );
    }
  }
  clear() {
    this.companyId = null;
    this.preventCategoryId = null;
    this.preventCategoryList = [];
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchPreventCategoryId: null,
    };
    this.getPreventiveType();
  }
  viewModalPopupHandler(formModal, data: any): void {
    this.preventiveTypeData = data;
    //console.log("preventiveCategoryData", this.preventiveTypeData);

    this.modalService.open(formModal, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
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
}
