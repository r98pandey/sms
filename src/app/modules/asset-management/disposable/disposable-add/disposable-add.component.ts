import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { AuditService } from "src/app/core/services/audit.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbModal, NgbNav, NgbOffcanvas, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { DisposableAssetListComponent } from "src/app/shared/components/disposable-asset-list/disposable-asset-list.component";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import Swal from "sweetalert2";
import { NavigationExtras, Router } from "@angular/router";
import { DisposableService } from "src/app/core/services/disposable.service";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { AssetService } from "src/app/core/services/asset.service";

@Component({
  selector: 'app-disposable-add',
  templateUrl: './disposable-add.component.html',
  styleUrl: './disposable-add.component.scss'
})
export class DisposableAddComponent implements OnInit {
  isProject: boolean = false;
  label: any = "Disposable Management";
  defaultNavActiveId = 1;
  breadCrumbItems: any = [
    { label: "Disposable" },
    { label: "Disposable List", active: true },
  ];
  addDisposableFrom: FormGroup;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownAssetStatusIdValue: any;

  selectedAssetList: any = [];

  public Editor = ClassicEditor;
  assetStatusListDisposeType: any;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private dropdownServices: DropdownService,
    private auditService: AuditService,
    private authService: AuthAssetService,
    private offcanvasService: NgbOffcanvas,
    private commonFunctionService: CommonFunctionService,
    private disposableService: DisposableService,
    private modalService: NgbModal,
    private assetService: AssetService

  ) {
    if (this.auditService.accessRight == true) {
      let url = this.router.url;
      this.isProject = this.authService.getisProject();
      this.getDropdownCompanyList();
    } else {
      //this.goback();
    }
  }

  ngOnInit(): void {
    this.getFromBinding();
    this.getDropdownCompanyList();
    this.getAssetStatusDisposeType('DisposeType');;
  }
  getAssetStatusDisposeType(id: any) {
    console.log("id", id)
    this.assetService.getAssetStatusList(id).subscribe(
      (res: any) => {
        this.assetStatusListDisposeType = res;
        console.log("assetStatusListDisposeType->", this.assetStatusListDisposeType);
      },
      (err) => {
        console.log(err)
      }
    );
  }

  getFromBinding() {
    this.addDisposableFrom = this.formBuilder.group({
      company: [null, [Validators.required]],
      client: [null, [Validators.required]],
      project: [null, [Validators.required]],
      disposableName: ["", [Validators.required]],
      disposableDescription: [""],
    });
    this.disposeTypeArray = [];
    this.salesValue = [];
    this.remarkValue = [];
  }

  get project() {
    return this.addDisposableFrom.get("project");
  }

  get client() {
    return this.addDisposableFrom.get("client");
  }
  get company() {
    return this.addDisposableFrom.get("company");
  }
  get disposableName() {
    return this.addDisposableFrom.get("disposableName");
  }
  get disposableDescription() {
    return this.addDisposableFrom.get("disposableDescription");
  }

  disposeTypeArray: any;
  salesValue: any;
  remarkValue: any;
  setDisposeTypeName(event, index) {
    this.disposeTypeArray[index] = event.assetStatusId
    console.log(this.disposeTypeArray)
  }
  onSubmit(): void {
    console.log("")
    let payload = {
      "BatchName": this.disposableName.value,
      "Remark": this.disposableDescription.value,
      CompanyId: this.company.value,
      ClientId: this.client.value,
      ClientName: this.findNameById(
        this.client.value,
        this.arrayListDropDownClientList,
        "clientName",
        "clientId"
      ),
      CompanyName: this.findNameById(
        this.company.value,
        this.arrayListDropDownCompany,
        "companyName",
        "companyId"
      ),
      ProjectId: this.project.value,
      ProjectName: this.findNameById(
        this.project.value,
        this.arrayListDropDownProjectOrDeparmentList,
        "departmentName",
        "departmentId"
      ),

      "detail": this.selectedAssetList.map((asset, index) => ({
        "AssetId": asset.id,
        "DepartmentId": asset.departmentId,
        "DisposeTypeId": this.disposeTypeArray[index],
        "SellingPrice": this.salesValue[index] || 0,
        "Remark": this.remarkValue[index]
      }))
    };
    this.saveDisposableDelivery(this.commonFunctionService.clean(payload));
  }


  findNameById(
    idToFind: number,
    items,
    objectname,
    objectId
  ): string | undefined {
    const foundItem = items.find((item) => item[objectId] === idToFind);
    return foundItem ? foundItem[objectname] : undefined;
  }


  saveDisposableDelivery(payload): void {
    this.disposableService.CreateAssetDispose(payload).subscribe(
      (response: any) => {
        if (response) {
          this.success(response);
          this.router.navigate([
            "asset-management/disposable/list-disposable",
          ]);
        }
      },
      (err) => {
        this.refreshRouter();
      }
    );
  }

  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  goback() {
    this.router.navigate(["asset-management/disposable/list-disposable"]);
  }

  refreshRouter() {
    const currentUrl = this.router.url;

    const navigationExtras: NavigationExtras = {
      queryParamsHandling: "preserve",
      preserveFragment: true,
    };

    this.router.navigate([currentUrl], navigationExtras);
  }


  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList_Active_AssetManagement({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (res.list.length != 0) {
        let data: any = JSON.parse(localStorage.getItem("currentUser"));
        if (data?.role === "Client User") {
          // if (data?.accessGroupName === "Application User") {
          this.selectedDropDownCompanyIdValue =
            this.arrayListDropDownCompany[0].companyId;
          this.getDropdownClientlist();
          // }
        }
      }
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceClientDropDownList_Active_AssetManagement(payload)
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
      .Getv3_MaintenanceDepartmentDropDownList_Active_AssetManagement(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownProjectOrDeparmentList = res.list;
      });
  }
  onDropdownCompanyValueChange(event) {
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedAssetList = [];
    this.arrayListDropDownClientList = []
    if (this.selectedDropDownCompanyIdValue) {
      this.getDropdownClientlist();
    }
  }
  onDropdownClientValueChange(event) {
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.getDropdownDepartmentList();
    this.selectedAssetList = [];
  }
  onDropdownDepartmentValueChange(event) {
    this.selectedAssetList = [];
  }
  /**
   * End  For Dropdown Company ,client,project
   */

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  getDisposableAssetList() {
    const modalRef = this.offcanvasService.open(DisposableAssetListComponent, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas ",
    });
    modalRef.componentInstance.selectedDropDownCompanyIdValue =
      this.company.value;
    modalRef.componentInstance.selectedDropDownClientIdValue =
      this.client.value;
    modalRef.componentInstance.selectedDropDownProjectOrDeparmentIdValue =
      this.project.value;

    modalRef.componentInstance.selectedAsset =
      this.selectedAssetList.length != 0 ? this.selectedAssetList : [];

    modalRef.result
      .then((result) => {
        this.selectedAssetList = result;
        this.selectedAssetList.forEach((value, index) => {
          this.disposeTypeArray[index] = null;
          this.salesValue[index] = null;
          this.remarkValue[index] = null;

        });

      })
      .catch((result) => {
        this.selectedAssetList = result;
        this.selectedAssetList.forEach((value, index) => {
          this.disposeTypeArray[index] = null;
          this.salesValue[index] = null;
          this.remarkValue[index] = null;

        });
      });
  }
  deleteId: any;

  confirmDelete(index: any) {

    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You are about to delete a Asset Disposable?";
    modalRef.componentInstance.subTitle =
      "Deleting your Asset Disposable will remove all of your information from our database.";
    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteHandler(index);
        }
      }
    });
  }

  deleteHandler(index) {
    this.selectedAssetList.splice(index, 1)
  }

}
