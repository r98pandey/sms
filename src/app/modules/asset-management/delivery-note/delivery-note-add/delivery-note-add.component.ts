import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { DeliveryService } from "../../../../core/services/delivery.service";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { NewAssetListCommonComponent } from "src/app/shared/components/new-asset-list-common/new-asset-list-common.component";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import { DeliveryAssetListCommonComponent } from "src/app/shared/components/delivery-asset-list-common/delivery-asset-list-common.component";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-delivery-note-add",
  templateUrl: "./delivery-note-add.component.html",
  styleUrls: ["./delivery-note-add.component.scss"],
})
export class DeliveryNoteAddComponent {
  isProject: boolean = false;
  label: any = "Delivery Note";
  breadCrumbItems: any = [
    { label: "Delivery" },
    { label: "Delivery Add", active: true },
  ];
  maxCharsDecision = 300;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownAssetStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  projectDepartmentFieldDisiabled: boolean = false;
  selectedAssetList: any[] = [];
  addDeliveryNoteFrom: FormGroup;
  disabledWithAceessGroup: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthAssetService,
    public formBuilder: FormBuilder,
    private dropdownServices: DropdownService,
    private deliveryService: DeliveryService,
    private offcanvasService: NgbOffcanvas,
    private commonFunctionService: CommonFunctionService,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) {
    if (this.deliveryService.accessRight == true) {
      let url = this.router.url;
      this.isProject = this.authService.getisProject();
      this.getDropdownCompanyList();
    } else {
      this.goback();
    }
  }

  ngOnInit(): void {
    let data: any = JSON.parse(localStorage.getItem("currentUser"));
    if (data?.role === "Client User") {
      if (data?.accessGroupName === "Application User") {
        this.disabledWithAceessGroup = true;
      }
    }
    this.getFromBinding();
  }

  getFromBinding() {
    this.addDeliveryNoteFrom = this.formBuilder.group({
      company: [null, [Validators.required]],
      client: [null, [Validators.required]],
      project: [null, [Validators.required]],
      title: ["", [Validators.required]],
      expectedDeliveryTime: ["", [Validators.required]],
      expectedDeliveryDate: ["", [Validators.required]],
      deliveryNoteRemark: ["", [Validators.required]],
    });
  }

  get client() {
    return this.addDeliveryNoteFrom.get("client");
  }
  get company() {
    return this.addDeliveryNoteFrom.get("company");
  }
  get project() {
    return this.addDeliveryNoteFrom.get("project");
  }
  get title() {
    return this.addDeliveryNoteFrom.get("title");
  }
  get expectedDeliveryTime() {
    return this.addDeliveryNoteFrom.get("expectedDeliveryTime");
  }
  get expectedDeliveryDate() {
    return this.addDeliveryNoteFrom.get("expectedDeliveryDate");
  }
  get deliveryNoteRemark() {
    return this.addDeliveryNoteFrom.get("deliveryNoteRemark");
  }

  goback() {
    this.router.navigate(["/asset-management/delivery-note/list-delivery"]);
  }
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList_Active_AssetManagement({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (res.list.length != 0) {
        let data: any = JSON.parse(localStorage.getItem("currentUser"));
        if (data?.role === "Client User") {
          if (data?.accessGroupName === "Application User") {
            this.selectedDropDownCompanyIdValue =
              this.arrayListDropDownCompany[0].companyId;
            this.getDropdownClientlist();
          }
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

        if (res.list.length != 0) {
          let data: any = JSON.parse(localStorage.getItem("currentUser"));
          if (data?.role === "Client User") {
            if (data?.accessGroupName === "Application User") {
              this.selectedDropDownClientIdValue =
                this.arrayListDropDownClientList[0].clientId;
              this.getDropdownDepartmentList();
            }
          }
        }
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
        if (res.list.length != 0) {
          let data: any = JSON.parse(localStorage.getItem("currentUser"));
          if (data?.role === "Client User") {
            if (data?.accessGroupName === "Application User") {
              this.selectedDropDownProjectOrDeparmentIdValue =
                this.arrayListDropDownProjectOrDeparmentList[0].departmentId;
              if (res.list.length >= 2) {
                this.projectDepartmentFieldDisiabled = false;
              } else {
                this.projectDepartmentFieldDisiabled = true;
              }
            }
          }
        }
      });
  }
  onDropdownCompanyValueChange(event) {
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.arrayListDropDownClientList = []
    if (this.selectedDropDownCompanyIdValue) {
      this.getDropdownClientlist();
    }
    this.selectedAssetList = [];
  }
  onDropdownClientValueChange(event) {
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.getDropdownDepartmentList();
    this.selectedAssetList = [];
  }
  onDropdownDepartmentValueChange(event) {
    this.selectedAssetList = [];
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  getAssetList() {
    const modalRef = this.offcanvasService.open(
      DeliveryAssetListCommonComponent,
      {
        scroll: true,
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvas ",
      }
    );
    modalRef.componentInstance.selectedDropDownCompanyIdValue =
      this.company.value;
    modalRef.componentInstance.selectedDropDownClientIdValue =
      this.client.value;
    modalRef.componentInstance.selectedDropDownProjectOrDeparmentIdValue =
      this.project.value;
    modalRef.componentInstance.SearchAssetStatusIdShown = 11;

    modalRef.componentInstance.selectedAsset =
      this.selectedAssetList.length != 0 ? this.selectedAssetList : [];

    modalRef.result
      .then((result) => {
        this.selectedAssetList = result;
      })
      .catch((result) => {
        this.selectedAssetList = result;
      });
  }

  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }

    return `${hour}:${minutes} ${ampm}`;
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

  onSubmit() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Delivery Note";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addDeliveryNoteSucessModal();
        } else {
          //this.onBack();
        }
      }
    });
  }

  addDeliveryNoteSucessModal(): void {
    let payload: any = {
      header: {
        DeliveryNoteTitle: this.title.value,
        DeliveryNoteRemark: this.deliveryNoteRemark?.value,
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

        ExpectedDeliveryDateTime:
          this.datePipe.transform(
            this.expectedDeliveryDate.value,
            "yyyy-MM-dd "
          ) +
          " " +
          this.expectedDeliveryTime.value,
      },
      assetList: this.selectedAssetList
        ? this.selectedAssetList.map((i) => ({ assetId: i.id }))
        : [],
    };

    this.saveDelivery(this.commonFunctionService.clean(payload));
  }

  saveDelivery(payload): void {
    this.deliveryService.createDeliveryNote(payload).subscribe(
      (response: any) => {
        if (response) {
          this.success(response);
          this.router.navigate([
            "asset-management/delivery-note/list-delivery",
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

  refreshRouter() {
    const currentUrl = this.router.url;

    const navigationExtras: NavigationExtras = {
      queryParamsHandling: "preserve",
      preserveFragment: true,
    };

    this.router.navigate([currentUrl], navigationExtras);
  }

  clearChangDate() {
    this.expectedDeliveryDate.reset();
    this.expectedDeliveryTime.reset();
  }

  openModalDeleteAssetObject(asset: any) {
    console.log(asset, "hh")
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to delete a Asset ?";
    modalRef.componentInstance.subTitle =
      "Deleting your Asset will remove for this Asset List  ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.unCheckItemAssetList(asset);
        }
      }
    });
  }


  unCheckItemAssetList(asset) {
    const index = this.getAssetIndex(asset.id);
    this.selectedAssetList.splice(index, 1);
  }
  getAssetIndex(assetId) {
    return this.selectedAssetList.findIndex((i) => i.id === assetId);
  }

}
