import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
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
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import Swal from "sweetalert2";

import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
})
export class CategoryListComponent implements OnInit, AfterViewInit {
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
    SearchCategoryName: null,
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
  label: any = "Categories";

  categoryList: any[] = [];

  breadCrumbItems: any = [
    { label: "Asset Setup" },
    { label: "Categories", active: true },
  ];

  selectedCompanyId: any;
  loadingTableData: boolean = false;

  categoryForm: FormGroup;

  editMode: any = {
    isEdit: false,
    data: {},
  };

  deleteId: any;
  selectedCategory: any | null = null;
  companyListArray_add: any = [];
  constructor(
    private router: Router,
    private categoryService: CategoryService,
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
    this.getv3_MaintenanceCompanyDropDownList_Active_AssetManagement();

    this.buildCategoryForm();

    if (localStorage.getItem("objectSerachForAssetCategory")) {
      this.getObjectAfterRefresh();
    } else {
      this.getCategoryList();
    }
  }

  onPageChange(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.getCategoryList();
    }
  }

  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForAssetCategory: any = {};
    if (this.selectedCompanyId)
      objectSerachForAssetCategory.SearchCompanyId =
        this.selectedCompanyId;

    if (this.companyListArray) {
      objectSerachForAssetCategory.companyListArray =
        this.companyListArray;
    }
    if (this.searchCategory) {
      objectSerachForAssetCategory.SearchCategoryName =
        this.searchCategory;
    }

    if (this.page) {
      objectSerachForAssetCategory.displayStart = this.pageSize * (this.page - 1);
      objectSerachForAssetCategory.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForAssetCategory",
      JSON.stringify(objectSerachForAssetCategory)
    );
  }

  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForAssetCategory: any = JSON.parse(
      localStorage.getItem("objectSerachForAssetCategory")
    );
    this.companyListArray =
      objectSerachForAssetCategory.companyListArray
        ? objectSerachForAssetCategory.companyListArray
        : [];




    this.selectedCompanyId = objectSerachForAssetCategory.SearchCompanyId
      ? objectSerachForAssetCategory.SearchCompanyId
      : null;


    this.searchCategory = objectSerachForAssetCategory.SearchCategoryName
      ? objectSerachForAssetCategory.SearchCategoryName
      : null;

    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.payload.SearchCategoryName = this.searchCategory;

    if (objectSerachForAssetCategory.displayStart) {
      this.payload.displayStart = objectSerachForAssetCategory.displayStart;
      this.page = objectSerachForAssetCategory.page;
    }
    this.getCategoryList();

  }



  getCategoryList() {
    this.loadingTableData = true;
    this.categoryService
      .getCategoryServerPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe({
        next: (res: any) => {
          this.categoryList = res.list;
          this.setObjectBeforeRefesh();
          if (this.categoryList.length > 0) {
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

  getCompanyList() {
    this.dropdownServices.Getv3_CompanyDropDownList_AssetManagement({}).subscribe((res: any) => {
      this.companyListArray = res.list;
      this.setObjectBeforeRefesh();
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

  openCategoryFormModal(modal, editMode?: boolean, data?: any) {
    this.editMode.isEdit = editMode;
    this.editMode.data = data;

    if (this.editMode.isEdit) {
      this.categoryForm.patchValue({
        ...data,
        code: data.categoryCode,
        name: data.categoryName,
      });
      this.categoryForm.controls["code"].disable();
      this.categoryForm.controls["companyId"].disable();
    } else {
      this.categoryForm.reset();
      this.categoryForm.markAsUntouched();
      this.categoryForm.controls["code"].enable();
      this.categoryForm.controls["companyId"].enable();
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
          if (result){

          }

        },
        (reason) => {
          // this.addCategoryForm.reset();
          // this.goback();
        }
      );
  }

  buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      code: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(6)],
      ],
      name: ["", Validators.required],
      companyId: [null, Validators.required],
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

  getCompanyName(companyId) {
    return this.companyListArray.find((i) => i.companyId === companyId)
      .companyName;
  }

  save() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = this.editMode.isEdit ? "Are you Sure to update category" : "Are you Sure to add category";

    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addSaveCategorySucessModal();
          this.modalService.dismissAll()
        }
      }
    });
  }


  addSaveCategorySucessModal() {
    const formValues = this.categoryForm.value;
    let payload: any = {
      companyId: formValues.companyId,
      categoryCode: formValues.code,
      categoryName: formValues.name,
      // companyName: this.getCompanyName(formValues.companyId),
    };

    if (this.editMode.isEdit) {
      payload.categoryId = this.editMode.data.categoryId;
      this.categoryService.postUpdateCategory(payload).subscribe(
        (res: any) => {
          this.getCategoryList();

          this.deleteCategoryResponse(res.message, false);
        },
        (err) => { }
      );
    } else {
      this.categoryService.postCategory(payload).subscribe(
        (res: any) => {
          this.getCategoryList();
          this.deleteCategoryResponse(res.message, false);
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
        this.deleteCategory(id);
      }
    });
  }

  confirmDelete(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  deleteCategory(id: any) {
    this.categoryService
      .postDeleteCategory({
        categoryId: id,
      })
      .subscribe({
        next: (res: any) => {
          this.deleteCategoryResponse(res, false);
          this.getCategoryList();
        },
        error: (err) => {
          //console.log("error", err);
          this.deleteCategoryResponse(err.error || err.message, true);
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
    this.getCategoryList();
  }

  searchCategory: string = "";
  onTypeCategoryNameChange(isDebounce?) {
    if (this.searchCategory.length == 0 || isDebounce) {
      this.page = 1;
      this.payload.displayStart = this.pageSize * (this.page - 1);
      if (this.searchCategory.length === 0) {
        delete this.payload.SearchCategoryName;
      } else {
        this.payload.SearchCategoryName = this.searchCategory;
      }
      this.getCategoryList();
    }
  }

  resetSearchVariable() {
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
    };
    this.searchCategory = null;
    this.page = 1;
    this.selectedCompanyId = null;
    localStorage.removeItem('objectSerachForAssetCategory');
    this.getCategoryList();
  }

  viewModal(modal, category) {
    this.selectedCategory = category;

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
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeCategoryNameChange(true);
        })
      )
      .subscribe();
  }
}
