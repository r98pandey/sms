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
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { LocationService } from "src/app/core/services/location.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import Swal from "sweetalert2";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-location-list",
  templateUrl: "./location-list.component.html",
  styleUrls: ["./location-list.component.scss"],
})
export class LocationListComponent {
  locationList: any[] = [];
  maxCharsDecision = 300;
  label: any = "Location";
  breadCrumbItems: any = [
    { label: "Location" },
    { label: "Location List", active: true },
  ];

  locationForm: FormGroup;

  editMode: any = {
    isEdit: false,
    data: {},
  };

  companyList: any[] = [];
  clientList: any[] = [];
  departmentList: any[] = [];
  deleteId: any;

  selectedCompanyId: null | number = null;
  selectedClientId: null | number = null;
  selectedDepartmentId: null | number = null;
  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  assetList = [];
  page = 1;
  collectionSize = 0;

  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchDepartmentId: null,
    SearchLocationName: null,
  };

  locationDetail: any = {};
  isProject: any;
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };

  constructor(
    private locationService: LocationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private authService: AuthAssetService,
    private commonServiceFunction: CommonFunctionService,
    private menuService: MenuServiceService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.buildForm();
  }

  ngOnInit() {
    this.isProject = this.authService.getisProject();
    this.getLocationList();
     this.getCompanyList();
    if (localStorage.getItem("objectSerachForLocationList")) {
      this.getObjectAfterRefresh();
     } //else {
    //   this.getCompanyList();
    //   this.getLocationList();

    // }
  }

  /**
 * for Set object to refesh
 */
  setObjectBeforeRefesh() {
    let objectSerachForLocationList: any = {};


    if (this.selectedCompanyId)
      objectSerachForLocationList.SearchCompanyId =
        this.selectedCompanyId;

    if (this.companyList) {
      objectSerachForLocationList.companyList =
        this.companyList;
    }

    if (this.clientList) {
      objectSerachForLocationList.clientList =
        this.clientList;
    }
    if (this.departmentList) {
      objectSerachForLocationList.departmentList =
        this.departmentList;
    }

    if (this.selectedClientId)
      objectSerachForLocationList.SearchClientId =
        this.selectedClientId;

    if (this.selectedDepartmentId)
      objectSerachForLocationList.SearchDepartmentId =
        this.selectedDepartmentId;

    if (this.searchLocation)
      objectSerachForLocationList.SearchLocationName =
        this.searchLocation;

    if (this.page) {
      objectSerachForLocationList.displayStart = this.pageSize * (this.page - 1);
      objectSerachForLocationList.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForLocationList",
      JSON.stringify(objectSerachForLocationList)
    );
  }

  /**
* for get object for refesh
*/
  getObjectAfterRefresh() {
    let objectSerachForLocationList: any = JSON.parse(
      localStorage.getItem("objectSerachForLocationList")
    );
    this.companyList =
      objectSerachForLocationList.companyList
        ? objectSerachForLocationList.companyList
        : [];
    this.clientList =
      objectSerachForLocationList.clientList
        ? objectSerachForLocationList.clientList
        : [];
    this.departmentList =
      objectSerachForLocationList.departmentList
        ? objectSerachForLocationList.departmentList
        : [];

    //Company Value
    this.selectedCompanyId = objectSerachForLocationList.SearchCompanyId
      ? objectSerachForLocationList.SearchCompanyId
      : null;

    this.selectedClientId = objectSerachForLocationList.SearchClientId
      ? objectSerachForLocationList.SearchClientId
      : null;

    this.selectedDepartmentId = objectSerachForLocationList.SearchDepartmentId
      ? objectSerachForLocationList.SearchDepartmentId
      : null;

    this.searchLocation = objectSerachForLocationList.SearchLocationName
      ? objectSerachForLocationList.SearchLocationName
      : null;


    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.payload.SearchClientId = this.selectedClientId;
    this.payload.SearchDepartmentId = this.selectedDepartmentId;
    this.payload.SearchLocationName = this.searchLocation;

    if (objectSerachForLocationList.displayStart) {
      this.payload.displayStart = objectSerachForLocationList.displayStart;
      this.page = objectSerachForLocationList.page;
    }

    this.getCompanyList();
    this.getLocationList();
  }

  getCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.companyList = res.list;
      this.setObjectBeforeRefesh();
    });
  }

  getClientList(id) {
    this.dropdownServices
      .getClientForApplicationSettingDrobDown({ SearchCompanyId: id })
      .subscribe((res: any) => {
        this.clientList = res.list;
        this.setObjectBeforeRefesh();
      });
  }

  getDepartmentList(cid, id) {
    this.dropdownServices
      .GetDepartmentListDrobDown({ SearchCompanyId: cid, SearchClientId: id })
      .subscribe((res: any) => {
        this.departmentList = res.list;
        this.setObjectBeforeRefesh();
      });
  }

  getLocationList() {
    this.locationService
      .GetLocationTableList_ServerPagination(
        this.commonServiceFunction.clean(this.payload)
      )
      .subscribe({
        next: (res: any) => {
          this.locationList = res.list;
          this.setObjectBeforeRefesh();
          if (this.locationList.length > 0) {
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
      this.getLocationList();
    }
  }
  searchLocation: string = "";
  onTypeLocationNameChange() {
    if (this.searchLocation) {
      this.payload.SearchLocationName = this.searchLocation;
    } else {
      delete this.payload.SearchLocationName;
    }

    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchClientId = this.selectedClientId;
    this.payload.SearchCompanyId = this.selectedCompanyId;

    this.payload.SearchDepartmentId = this.selectedDepartmentId;
    this.getLocationList();
  }
  openLocationFormModal(modal, editMode?: boolean, data?: any) {
    this.editMode.isEdit = editMode;
    this.editMode.data = data;

    if (this.editMode.isEdit) {
      this.locationForm.patchValue({
        ...data,
      });

      this.getClientList(data.companyId);
      this.getDepartmentList(data.companyId, data.clientId);

      this.locationForm.controls["companyId"].disable();
      this.locationForm.controls["departmentId"].disable();
      this.locationForm.controls["clientId"].disable();
      this.locationForm.controls["locationCode"].disable();
    } else {
      this.locationForm.reset();
      this.locationForm.markAsUntouched();

      this.locationForm.controls["companyId"].enable();
      this.locationForm.controls["departmentId"].enable();
      this.locationForm.controls["clientId"].enable();
      this.locationForm.controls["locationCode"].enable();
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
          // this.save();
        },
        (reason) => { }
      );
  }

  getLocationDetail(locationId) {
    this.locationService.getLocationDetail(locationId).subscribe({
      next: (res: any) => {
        this.locationDetail = res.data;
        this.setObjectBeforeRefesh();
      },
    });
  }

  openLocationViewModal(modal, data?: any) {
    this.getLocationDetail(data.locationId);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  onTypeCompany(event) {
    this.clientId.reset();
    this.departmentId.reset();
    this.getClientList(event.companyId);
  }

  onTypeClient(event) {
    this.departmentId.reset();
    this.getDepartmentList(this.companyId.value, event.clientId);
  }

  buildForm() {
    this.locationForm = this.formBuilder.group({
      departmentId: [null, Validators.required],
      clientId: [null, Validators.required],
      companyId: [null, Validators.required],
      locationName: ["", Validators.required],
      locationCode: ["", Validators.required],
      remark: ["", Validators.required],
    });
  }

  get locationCode() {
    return this.locationForm.get("locationCode");
  }

  get locationName() {
    return this.locationForm.get("locationName");
  }

  get companyId() {
    return this.locationForm.get("companyId");
  }

  get clientId() {
    return this.locationForm.get("clientId");
  }

  get departmentId() {
    return this.locationForm.get("departmentId");
  }

  get remark() {
    return this.locationForm.get("remark");
  }

  findCompanyName(companyId) {
    return this.companyList.find((i) => i.companyId === companyId);
  }

  findClientName(clientId) {
    return this.clientList.find((i) => i.clientId === clientId);
  }

  findDepartmentName(departmentId) {
    return this.departmentList.find((i) => i.departmentId === departmentId);
  }

  openModalCreateLocation(modal, event) {
    modal.close(
      "Ok",
      event,
      " this.locationForm.getRawValue()",
      this.locationForm.getRawValue()
    );
    const formValue = this.locationForm.getRawValue();
    const payload: any = {
      CompanyId: formValue.companyId,
      CompanyName: this.findCompanyName(formValue.companyId).companyName,
      DepartmentId: formValue.departmentId,
      DepartmentName: this.findDepartmentName(formValue.departmentId)
        .departmentName,
      ClientId: formValue.clientId,
      ClientName: this.findClientName(formValue.clientId).clientName,

      LocationCode: formValue.locationCode,
      LocationName: formValue.locationName,
      Remark: formValue.remark,
    };

    if (this.editMode.isEdit) {
      payload.LocationId = this.editMode.data.locationId;
      this.locationService.postUpdateLocation(payload).subscribe({
        next: (res) => {
          this.success(res);
          this.getLocationList();
        },
      });
    } else {
      this.locationService.postLocation(payload).subscribe({
        next: (res) => {
          this.success(res);
          this.getLocationList();
        },
      });
    }
    modal.close("Ok", event);
  }

  save(modal, event){ console.log("event::",this.editMode.isEdit);
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    if (this.editMode.isEdit == true) {
      modalRef.componentInstance.title = "Are you Sure you want to Edit Location";
      modalRef.componentInstance.subTitle = "";
  } else {
      modalRef.componentInstance.title = "Are you Sure you want to Add Location";
      modalRef.componentInstance.subTitle = "";
  }
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.openModalCreateLocation(modal, event);
        } else {
          //this.goBack();
        }
      }
    });
  }

  addConfirmDeleteSucessModal(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  confirmDelete(content: any, id: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Delete Location";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addConfirmDeleteSucessModal(content,id);
        } else {
          //this.onBack();
        }
      }
    });
  }

  deleteLocation(id) {
    this.locationService.postDeleteLocation({ locationId: id }).subscribe({
      next: (res) => {
        this.success(res);
        this.getLocationList();
      },
    });
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

  onCompanyValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.selectedClientId = null;
    this.payload.SearchClientId = this.selectedClientId;
    this.selectedDepartmentId = null;
    this.payload.SearchDepartmentId = this.selectedDepartmentId;
    if (this.selectedCompanyId) {
      this.getClientList(this.selectedCompanyId);
    } else {
      this.clientList = [];
      this.departmentList = [];
    }
    this.getLocationList();
  }
  onClientValueChange(event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchClientId = this.selectedClientId;
    this.selectedDepartmentId = null;
    this.payload.SearchDepartmentId = this.selectedDepartmentId;
    if (this.selectedCompanyId && this.selectedCompanyId) {
      this.getDepartmentList(this.selectedCompanyId, this.selectedClientId);
    } else {
      this.departmentList = [];
    }

    this.getLocationList();
  }

  onChangeDepartment(event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchDepartmentId = this.selectedDepartmentId;
    this.getLocationList();
  }

  clearAllPayload() {
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchDepartmentId: null,
    };
    this.searchLocation = null;
    this.selectedDepartmentId = null;
    this.selectedClientId = null;
    this.selectedCompanyId = null;
    this.getLocationList();
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
          this.onTypeLocationNameChange();
        })
      )
      .subscribe();
  }
}
