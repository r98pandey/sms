import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";
import { CategoryService } from "src/app/core/services/category.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { SubCategoryService } from "src/app/core/services/subcategory.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import Swal from "sweetalert2";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

@Component({
  selector: "app-sub-category-list",
  templateUrl: "./sub-category-list.component.html",
  styleUrls: ["./sub-category-list.component.scss"],
})
export class SubCategoryListComponent {
  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  page = 1;
  collectionSize = 0;

  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchCategoryId: null,
    SearchSubCategoryName: null,
  };
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };

  companyListArray: any = [];
  companyListArray_add:any=[]
  label: any = "Sub Category";

  categoryList: any[] = [];
  subCategoryList: any[] = [];

  breadCrumbItems: any = [
    { label: "Asset Setup" },
    { label: "Sub Category", active: true },
  ];

  selectedCompanyId: any;
  selectedCategoryId: any;
  searchSubCategoryName: string = "";
  loadingTableData: boolean = false;
  categoryLoading: boolean = false;

  categoryForm: FormGroup;

  editMode: any = {
    isEdit: false,
    data: {},
  };

  deleteId: any;
  selectedSubCategory: any = null;

  constructor(
    private router: Router,
    private subCategoryService: SubCategoryService,
    private dropdownServices: DropdownService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
    private menuService: MenuServiceService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
  }

  ngOnInit(): void {
    this.getCompanyList();
    this.getv3_MaintenanceCompanyDropDownList_Active_AssetManagement()
    this.buildSubCategoryForm();
    if (localStorage.getItem("objectSerachForListsubCategory")) {
      this.getObjectAfterRefresh();
    } else {
      this.getCategoryList(0);
      this.getSubCategoryList();
    }
  }

  onPageChange(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.getSubCategoryList();
    }
  }

  /**
* for Set object to refesh
*/
  setObjectBeforeRefesh() {
    let objectSerachForListsubCategory: any = {};

    if (this.companyListArray)
      objectSerachForListsubCategory.companyListArray = this.companyListArray;
    if (this.categoryList)
      objectSerachForListsubCategory.categoryList = this.categoryList;

    if (this.selectedCompanyId)
      objectSerachForListsubCategory.SearchCompanyId = this.selectedCompanyId;
    if (this.selectedCategoryId)
      objectSerachForListsubCategory.SearchCategoryId = this.selectedCategoryId;

    if (this.searchSubCategoryName)
      objectSerachForListsubCategory.SearchSubCategoryName = this.searchSubCategoryName;

    if (this.page) {
      objectSerachForListsubCategory.displayStart = this.pageSize * (this.page - 1);
      objectSerachForListsubCategory.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForListsubCategory",
      JSON.stringify(objectSerachForListsubCategory)
    );
  }

  /**
* for get object for refesh
*/
  getObjectAfterRefresh() {
    let objectSerachForListsubCategory: any = JSON.parse(
      localStorage.getItem("objectSerachForListsubCategory")
    );

    this.companyListArray =
      objectSerachForListsubCategory.companyListArray
        ? objectSerachForListsubCategory.companyListArray
        : [];
    this.categoryList =
      objectSerachForListsubCategory.categoryList
        ? objectSerachForListsubCategory.categoryList
        : [];

    this.selectedCompanyId = objectSerachForListsubCategory.SearchCompanyId
      ? objectSerachForListsubCategory.SearchCompanyId
      : null;

    this.searchSubCategoryName = objectSerachForListsubCategory.SearchSubCategoryName
      ? objectSerachForListsubCategory.SearchSubCategoryName
      : null;


    this.selectedCategoryId = objectSerachForListsubCategory.SearchCategoryId
      ? objectSerachForListsubCategory.SearchCategoryId
      : null;

    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.payload.SearchCategoryId = this.selectedCategoryId;

    this.payload.SearchSubCategoryName = this.searchSubCategoryName;

    if (objectSerachForListsubCategory.displayStart) {
      this.payload.displayStart = objectSerachForListsubCategory.displayStart;
      this.page = objectSerachForListsubCategory.page;
    }

    this.getSubCategoryList();

  }

  getSubCategoryList() {
    this.loadingTableData = true;
    this.subCategoryService
      .getSubCategoryServerPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe({
        next: (res: any) => {
          this.subCategoryList = res.list;
          this.setObjectBeforeRefesh();
          if (this.subCategoryList.length > 0) {
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

  getCategoryList(SearchCompanyId) {
    this.categoryLoading = true;
    this.dropdownServices
      .GetCategoryListDrobDown({ SearchCompanyId })
      .subscribe({
        next: (res: any) => {
          this.categoryList = res.list ? res.list : [];
          this.categoryForm.controls["categoryId"].patchValue(null);
          this.categoryLoading = false;
        },
      });
    this.setObjectBeforeRefesh();

  }

  getCompanyList() {
    this.dropdownServices.Getv3_CompanyDropDownList_AssetManagement({}).subscribe((res: any) => {
      this.companyListArray = res.list ? res.list : [];

    });
  }
  getv3_MaintenanceCompanyDropDownList_Active_AssetManagement() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList_Active_AssetManagement({}).subscribe((res: any) => {
      this.companyListArray_add = res.list;

    });
  }

  onCompanyValueChange(event) { }

  goToAddPage() {
    this.router.navigate(["/application-settings/asset-setup/category/add"]);
  }

  openSubCategoryFormModal(modal, editMode?: boolean, data?: any) {
    this.editMode.isEdit = editMode;
    this.editMode.data = data;

    if (this.editMode.isEdit) {
      this.categoryForm.patchValue({
        ...data,
        code: data.subCategoryCode,
        name: data.subCategoryName,
        lifetime: data.lifeTime,
      });

      this.categoryForm.controls["companyId"].disable();
      this.categoryForm.controls["categoryId"].disable();
      this.categoryForm.controls["code"].disable();
    } else {
      this.categoryForm.reset();
      this.categoryForm.markAsUntouched();
      this.categoryForm.controls["companyId"].enable();
      this.categoryForm.controls["categoryId"].enable();
      this.categoryForm.controls["code"].enable();
    }

    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.save();
          // this.submitAddCategoryFormDetails(event);
        },
        (reason) => {
          // this.addCategoryForm.reset();
          // this.goback();
        }
      );
  }

  buildSubCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      code: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(6)],
      ],
      name: ["", Validators.required],
      lifetime: [0, Validators.required],
      companyId: [null, Validators.required],
      categoryId: [null, Validators.required],
    });
  }

  onCodeChange() {
    const value = this.categoryForm.value;
    this.categoryForm.setValue({ ...value, code: value?.code?.toUpperCase() });
  }

  get code() {
    return this.categoryForm.get("code");
  }
  get name() {
    return this.categoryForm.get("name");
  }
  get companyId() {
    return this.categoryForm.get("companyId");
  }
  get categoryId() {
    return this.categoryForm.get("categoryId");
  }
  get lifetime() {
    return this.categoryForm.get("lifetime");
  }

  getCompanyName(companyId) {
    return this.companyListArray.find((i) => i.companyId === companyId)
      .companyName;
  }

  getCategoryName(categoryId) {
    return this.categoryList.find((i) => i.categoryId === categoryId)
      .categoryId;
  }

  onChangeCompany(event) {
    this.getCategoryList(event.companyId);
  }

  
  save() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to add Sub Category";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addSaveSubCategorySucessModal();
          this.modalService.dismissAll()
        } else {
         // this.onBack();
        }
      }
    });
  }

  addSaveSubCategorySucessModal() {
    const formValues = this.categoryForm.value;

    let payload: any = {
      companyId: formValues.companyId,
      subCategoryCode: formValues.code,
      subCategoryName: formValues.name,
      categoryId: formValues.categoryId,
      lifetime: formValues.lifetime,
      //categoryName: this.getCategoryName(formValues.categoryId),
      //companyName: this.getCompanyName(formValues.companyId),
    };
    //console.log("payload", payload);
    if (this.editMode.isEdit) {
      payload.subCategoryId = this.editMode.data.subCategoryId;
      this.subCategoryService.postUpdateSubCategory(payload).subscribe(
        (res: any) => {
          this.getSubCategoryList();
          this.success(res);
        },
        (err) => { }
      );
    } else {
      this.subCategoryService.postSubCategory(payload).subscribe(
        (res: any) => {
          this.getSubCategoryList();
        },
        (err) => { }
      );
    }
  }

  showDeleteConfirmation(id: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#FF3366",
      confirmButtonText: "<span class='swal2-confirm '> Yes, delete it!</span>",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSubCategory(id);
      }
    });
  }

  deleteSubCategory(id: any) {
    this.subCategoryService
      .postDeleteSubCategory({
        subCategoryId: id,
      })
      .subscribe({
        next: (res: any) => {
          this.deleteCategoryResponse(res.message, false);
          this.getSubCategoryList();
        },
        error: (err) => {
          //console.log("error", err);
          this.deleteCategoryResponse(err.error.message || err.message, true);
        },
      });
  }

  deleteCategoryResponse(res, error) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: error ? "warning" : "success",
      title: res,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  onTypeCompanyNameChange(event: any) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.selectedCategoryId = null;
    this.payload.SearchCategoryId = this.selectedCategoryId;
    this.payload.SearchSubCategoryName = this.searchSubCategoryName;
    this.getSubCategoryList();
    this.getCategoryList(this.selectedCompanyId);
  }

  resetSearchVariable() {
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchCategoryId: null,
      SearchSubCategoryName: null,
    };
    localStorage.removeItem('objectSerachForListsubCategory');
    this.page = 1;
    this.getSubCategoryList();
    this.selectedCompanyId = null;
    this.selectedCategoryId = null;
    this.searchSubCategoryName = null;

  }

  onTypeCategory(event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCategoryId = this.selectedCategoryId;
    this.searchSubCategoryName = null;

    this.getSubCategoryList();
  }

  onTypeSubCategory() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    if (this.searchSubCategoryName) {
      this.payload.SearchSubCategoryName = this.searchSubCategoryName;
    } else {
      delete this.payload.SearchSubCategoryName;
    }
    this.getSubCategoryList();
  }

  confirmDelete(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  success(res) {
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

  viewModal(modal, category) {
    this.selectedSubCategory = category;

    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.save();
        },
        (reason) => { }
      );
  }

  @ViewChild("inputer", { static: true }) input: ElementRef;
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(300),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeSubCategory();
        })
      )
      .subscribe();
  }
}
