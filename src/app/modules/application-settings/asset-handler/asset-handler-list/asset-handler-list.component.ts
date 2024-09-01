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
import { Lightbox } from "ngx-lightbox";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { EmployeeService } from "src/app/core/services/employee.service";
import { LocalStoreService } from "src/app/core/services/local-store.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-asset-handler-list",
  templateUrl: "./asset-handler-list.component.html",
  styleUrls: ["./asset-handler-list.component.scss"],
})
export class AssetHandlerListComponent implements OnInit {
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;

  empList: any[] = [];
  companyList: any[] = [];
  clientList: any[] = [];
  departmentList: any[] = [];
  searchName: string;
  label: any = "Asset Handlers";
  breadCrumbItems: any = [
    { label: "Asset Setup" },
    { label: "Asset Handlers", active: true },
  ];
  apiUrl: string;
  isProjectVisible: boolean = false;
  displayLength: number = 10;
  selectedEmail: string;
  selectedEmpName: string;
  selectedEmpId: string;
  selectedCompanyId: string;
  selectedClientId: string;
  selectedDepartmentId: string;
  selectedDepartmentName: string;
  image: any;
  defaultImage: any;
  isDefaultImage: boolean = true;
  base64Image: any;
  isDisabled: boolean = true;
  employee: any = {};
  editEmployee: any = {};
  employeeDefaultImage: string = "EmpImage/employee.png";

  deleteEmpId: string;
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchDepartmentId: null,
    SearchEmpName: null,
  };
  selectedEmpData: any = null;
  isProject: any;
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  companyList_add: any=[];

  constructor(
    private employeeService: EmployeeService,
    private dropDownService: DropdownService,
    private modalService: NgbModal,
    private router: Router,
    private localStorage: LocalStoreService,
    private departmentService: DepartmentService,
    private modal: NgbModal,
    private fromBuilder: FormBuilder,
    private commonService: CommonFunctionService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    private lightbox: Lightbox
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.apiUrl = environment.apiUrl;
    this.defaultImage =
      "../../../../../../assets/images/userClientPlaceholder.png";
    this.employee = {
      email: "",
      empName: "",
      empId: "",
      companyId: "",
      clientId: "",
      departmentId: "",
      image: "",
    };
    this.editEmployee = {
      email: "",
      empName: "",
      empId: "",
      companyId: "",
      clientId: "",
      departmentId: "",
      image: "",
    };
  }

  ngOnInit(): void {
    this.isProject = this.authService.getisProject();
    //this.loadData();
    this.getCompany();
    this.getCompany_Add();
    if (localStorage.getItem("objectSerachForAssetHandler")) {
      this.getObjectAfterRefresh();
    } else {

      this.loadData();
    }
  }

  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForAssetHandler: any = {};
    if (this.selectedCompanyId)
      objectSerachForAssetHandler.SearchCompanyId =
        this.selectedCompanyId;
    if (this.selectedClientId)
      objectSerachForAssetHandler.SearchClientId = this.selectedClientId;
    if (this.selectedDepartmentId)
      objectSerachForAssetHandler.SearchDepartmentId =
        this.selectedDepartmentId;
    if (this.searchName)
      objectSerachForAssetHandler.SearchEmpName =
        this.searchName;

    if (this.clientList) {
      objectSerachForAssetHandler.clientList =
        this.clientList;
    }
    if (this.departmentList) {
      objectSerachForAssetHandler.departmentList =
        this.departmentList;
    }
    if (this.page) {
      objectSerachForAssetHandler.displayStart = this.pageSize * (this.page - 1);
      objectSerachForAssetHandler.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForAssetHandler",
      JSON.stringify(objectSerachForAssetHandler)
    );
  }

  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForAssetHandler: any = JSON.parse(
      localStorage.getItem("objectSerachForAssetHandler")
    );
    this.clientList =
      objectSerachForAssetHandler.clientList
        ? objectSerachForAssetHandler.clientList
        : [];
    this.departmentList =
      objectSerachForAssetHandler.departmentList
        ? objectSerachForAssetHandler.departmentList
        : [];
    this.selectedCompanyId =
      objectSerachForAssetHandler.selectedCompanyId
        ? objectSerachForAssetHandler.selectedCompanyId
        : [];
    this.selectedClientId =
      objectSerachForAssetHandler.selectedClientId
        ? objectSerachForAssetHandler.selectedClientId
        : [];
    this.selectedDepartmentId =
      objectSerachForAssetHandler.selectedDepartmentId
        ? objectSerachForAssetHandler.selectedDepartmentId
        : [];
    this.selectedCompanyId = objectSerachForAssetHandler.SearchCompanyId
      ? objectSerachForAssetHandler.SearchCompanyId
      : null;
    this.selectedClientId = objectSerachForAssetHandler.SearchClientId
      ? objectSerachForAssetHandler.SearchClientId
      : null;
    this.selectedDepartmentId =
      objectSerachForAssetHandler.SearchDepartmentId
        ? objectSerachForAssetHandler.SearchDepartmentId
        : null;
    this.searchName = objectSerachForAssetHandler.SearchEmpName
      ? objectSerachForAssetHandler.SearchEmpName
      : null;

    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.payload.SearchClientId = this.selectedClientId;
    this.payload.SearchDepartmentId = this.selectedDepartmentId;
    this.payload.SearchEmpName = this.searchName;

    if (objectSerachForAssetHandler.displayStart) {
      this.payload.displayStart = objectSerachForAssetHandler.displayStart;
      this.page = objectSerachForAssetHandler.page;
    }
    this.loadData();
  }


  onDropdownCompanyValueChange(changeEvent: any) {
    const event = {
      companyId: changeEvent ? changeEvent.companyId : null,
    };
    this.selectedClientId = null;
    this.selectedDepartmentId = null;

    if (event.companyId) {
      this.getClient(event.companyId);
    } else {
      this.clientList = [];
    }
    this.payload = {
      SearchCompanyId: event.companyId,
      displayLength: 10,
      displayStart: this.displayLength * (this.page - 1),
    };
    if (this.searchName) {
      this.payload.SearchEmpName = this.searchName;
    }
    this.page = 1;
    this.loadData();
  }
  onDropdownCompanyValueChange2(changeEvent: any) {
    const event = {
      companyId: changeEvent ? changeEvent.companyId : null,
    };
    this.employee.clientId = null;
    this.employee.departmentId = null;

    if (event.companyId) {
      this.getClient_Add(event.companyId);
    } else {
      this.clientList_Array = [];
    }
  }

  onDropdownClientValueChange(changeEvent: any) {
    this.selectedDepartmentId = null;

    const event = {
      clientId: changeEvent ? changeEvent.clientId : null,
    };
    this.getDepartment(this.selectedCompanyId, event.clientId);
    this.payload = {
      SearchCompanyId: this.selectedCompanyId,
      SearchClientId: event.clientId,
      displayLength: 10,
      displayStart: this.displayLength * (this.page - 1),
    };
    if (this.searchName) {
      this.payload.SearchEmpName = this.searchName;
    }
    this.page = 1;
    this.loadData();
  }
  onDropdownClientValueChange2(changeEvent: any) {
    //console.log("changeEvent", changeEvent);
    this.employee.departmentId = null;
    this.getDepartment_Add(this.employee.comanyId, this.employee.clientId);
  }

  onDropdownDepartmentValueChange(changeEvent: any) {
    const event = {
      departmentId: changeEvent ? changeEvent.departmentId : null,
    };
    this.payload = {
      SearchCompanyId: this.selectedCompanyId,
      SearchClientId: this.selectedClientId,
      SearchDepartmentId: event.departmentId,
      displayLength: 10,
      displayStart: this.displayLength * (this.page - 1),
    };
    if (this.searchName) {
      this.payload.SearchEmpName = this.searchName;
    }
    this.page = 1;
    this.loadData();
  }

  getCompany() {
    let data = {};
    this.dropDownService.Getv3_CompanyDropDownList_AssetManagement(data).subscribe((res: any) => {
      this.companyList = res.list;
      this.setObjectBeforeRefesh();
    });
  }
  getCompany_Add() {
    let data = {};
    this.dropDownService.Getv3_MaintenanceCompanyDropDownList_Active_AssetManagement(data).subscribe((res: any) => {
      this.companyList_add = res.list;

    });
  }

  getClient(companyId: string) {
    this.clientList = [];
    this.employee.clientId = null;
    let data = {
      SearchCompanyId: companyId,
    };
    this.dropDownService
      .Getv3_ClientDropDownList_AssetManagement(this.commonService.clean(data))
      .subscribe((res: any) => {
        this.clientList = res.list;
        this.setObjectBeforeRefesh();
      });
  }
  clientList_Array: any = [];
  getClient_Add(companyId: string) {
    this.clientList_Array = [];
    this.employee.clientId = null;
    let data = {
      SearchCompanyId: companyId,
    };
    this.dropDownService
      .Getv3_MaintenanceClientDropDownList_Active_AssetManagement(data)
      .subscribe((res: any) => {
        this.clientList_Array = res.list;

      });
  }

  getDepartment(companyId: string, clientId: string) {
    this.departmentList = [];
    this.employee.departmentId = null;
    let data = {
      SearchCompanyId: companyId,
      SearchClientId: clientId,
    };
    this.dropDownService
      .Getv3_DepartmentDropDownList_AssetManagement(this.commonService.clean(data))
      .subscribe((res: any) => {
        this.departmentList = res.list;
        this.setObjectBeforeRefesh();
      });
  }
  departmentList_add: any = [];
  getDepartment_Add(companyId: string, clientId: string) {
    //console.log("ompanyId: string, clientId", companyId, clientId);
    this.departmentList_add = [];
    this.employee.departmentId = null;
    let data = {
      SearchCompanyId: this.employee.companyId,
      SearchClientId: this.employee.clientId,
    };
    this.dropDownService
      .Getv3_MaintenanceDepartmentDropDownList_Active_AssetManagement(this.commonService.clean(data))
      .subscribe((res: any) => {
        this.departmentList_add = res.list;

      });
  }

  loadData() {
    this.employeeService
      .getEmployeeTableListServerPagination(
        this.commonService.clean(this.payload)
      )
      .subscribe(
        (res: any) => {
          this.empList = res.list;
          this.setObjectBeforeRefesh();
          if (this.empList.length > 0) {
            this.totalRecords = res.list[0].totalCount;
            this.from = res.list.reduce(
              (min, p) => (p.rowNum < min ? p.rowNum : min),

              res.list[0].rowNum
            );

            this.to = res.list.reduce(
              (max, p) => (p.rowNum > max ? p.rowNum : max),

              res.list[0].rowNum
            );
            this.pageSize = this.displayLength;
          } else {
            this.totalRecords = 0;
            this.from = 0;
            this.to = 0;
            this.pageSize = this.displayLength;
          }
        },
        (err) => {
          //console.log(err);
        }
      );
  }

  pageChange(pageNo): void {
    this.payload = {
      displayLength: this.displayLength,
      displayStart: this.displayLength * (pageNo - 1),
      SearchCompanyId: this.selectedCompanyId,
      SearchClientId: this.selectedClientId,
      SearchDepartmentId: this.selectedDepartmentId,
      SearchEmpName: this.selectedEmpName,
    };
    this.loadData();
  }

  goToNavigation(access: any) {
    this.localStorage.setItem("asset-handler-data", JSON.stringify(access));
    this.router.navigate([
      "/application-settings/asset-handler/asset-handler-edit",
    ]);
  }

  goToAdd() {
    this.router.navigate([
      "/application-settings/asset-handler/asset-handler-add",
    ]);
  }

  addModalPopup(content) {
    this.employee = {};
    this.isDefaultImage = true;

    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  selectedAssetHandler = null;
  editModalPopup(content, emp) {
    this.selectedAssetHandler = emp;
    this.editEmployee = {};
    this.image = "";
    this.base64Image = "";
    this.editEmployee = {
      email: emp.email,
      empName: emp.employeeName,
      empId: emp.employeeId,
      empTagId: emp.employeeTagId,
      companyId: emp.companyId,
      companyName: emp.companyName,
      clientId: emp.clientId,
      clientName: emp.clientName,
      departmentId: emp.departmentId,
      departmentName: emp.departmentName,
    };

    //console.log("content", this.editEmployee);
    if (emp.empImgUrl != null && emp.empImgUrl && emp.empImgUrl.length > 0) {
      this.isDefaultImage = false;
      this.image = this.apiUrl + emp.empImgUrl;
    } else {
      this.image = "../../../../../../assets/images/userClientPlaceholder.png";
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          //console.log("content", emp);
        },
        (reason) => { }
      );
  }

  deleteModalPopup(content, emp) {
    this.deleteEmpId = emp.employeeId;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  onEmployeeNameChangeHandler(event: any) {
    this.payload.SearchEmpName = this.searchName;
    this.page = 1;
    this.payload.displayStart = this.displayLength * (this.page - 1);
    this.loadData();
  }

  goToEdit(emp: any) {
    this.localStorage.setItem("employeeId", JSON.stringify(emp.employeeId));
    this.router.navigate([
      "/application-settings/asset-handler/asset-handler-edit",
    ]);
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;
      this.base64Image = this.image.replace(/^data:image\/[a-z]+;base64,/, "");
      this.isDefaultImage = false;
      //console.log(this.image);
    };
    myReader.readAsDataURL(file);
  }

  onSubmitHandler(f: NgForm) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Add Asset Handlers";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addAssetSucessModal(f);
        } else {
          //this.onBack();
        }
      }
    });
  }

  addAssetSucessModal(f: NgForm) {
    let requestData = {
      EmployeeTagId: this.employee.empId,
      EmployeeName: this.employee.empName,
      CompanyId: this.employee.companyId,
      DepartmentId: this.employee.departmentId,
      Email: this.employee.email,
      Base64EmpImg: this.base64Image,
    };
    this.employeeService
      .createEmployee(this.commonService.clean(requestData))
      .subscribe(
        (res: any) => {
          this.employee = {};
          this.image = "";
          this.base64Image = "";
          this.page = 1;
          (this.payload.displayStart = this.displayLength * (this.page - 1)),
            this.loadData();
          this.departmentList_add = [];
          this.clientList_Array = [];
          this.modal.dismissAll();
          this.success(res);
        },
        (err: any) => {
          //console.log("error", err);
        }
      );
  }

  onEditSubmitHandlerModal() {
    let requestData = {
      employeeId: parseInt(this.editEmployee.empId),
      employeeTagId: this.editEmployee.empTagId,
      employeeName: this.editEmployee.empName,
      departmentId: parseInt(this.editEmployee.departmentId),
      companyId: this.editEmployee.companyId,
      email: this.editEmployee.email,
      Base64ToImage: this.base64Image,
    };
    this.employeeService
      .updateEmployee(this.commonService.clean(requestData))
      .subscribe((res: any) => {
        this.editEmployee = {};
        this.image = "";
        this.base64Image = "";
        this.page = 1;
        (this.payload.displayStart = this.displayLength * (this.page - 1)),
          this.loadData();
        this.modal.dismissAll();
        this.success(res);
      });
  }

  onEditSubmitHandler() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Edit Asset Handler";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.onEditSubmitHandlerModal();
        } else {
          //this.onBack();
        }
      }
    });
  }


  deleteHandler() {
    let requestData = {
      employeeId: parseInt(this.deleteEmpId),
    };
    this.employeeService.deleteEmployee(requestData).subscribe(
      (res: any) => {
        this.editEmployee = {};
        this.image = "";
        this.base64Image = "";
        this.page = 1;
        (this.payload.displayStart = this.displayLength * (this.page - 1)),
          this.loadData();
        this.modal.dismissAll();
        this.success(res);
      },
      (err: any) => {
        //console.log("error", err);
      }
    );
  }



  confirmDelete(id: any) {
    this.deleteEmpId = id;
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You are about to delete a Asset Handler ?";
    modalRef.componentInstance.subTitle =
      "Deleting your asset handler will remove all of your information from our database.";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteHandler();
        }
      }
    });
  }

  clear() {
    this.searchName = "";
    this.selectedDepartmentId = null;
    this.selectedCompanyId = null;
    this.selectedClientId = null;
    this.page = 1;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchDepartmentId: null,
      SearchEmpName: null,
    };
    this.loadData();
  }

  view(modal, emp) {
    this.selectedEmpData = emp;
    //console.log("this.selectedEmpData", this.selectedEmpData);
    this.modalService.open(modal, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
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

  onClearImage(event: any) {
    this.base64Image = "";
    this.isDefaultImage = true;
    this.resetFileInput();
  }

  openModalDeleteConf(urk) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You are about to delete a Profile Image?";
    modalRef.componentInstance.subTitle =
      "Deleting your Profile Image will remove for the database";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.base64Image = "";
          this.isDefaultImage = true;
          this.resetFileInput();
          if (this.selectedAssetHandler) {
            this.saveImage();
          }
        }
      }
    });
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data imageUrl
      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.base64Image = event.target.result;
        if (this.base64Image) {
          this.isDefaultImage = true;
        }
        this.saveImage();
      };
    }
  }

  saveImage() {
    let payload = {
      EmployeeId: this.editEmployee.empId,
      Base64EmpImg:
        this.base64Image !==
          "../../../../../../assets/images/userClientPlaceholder.png"
          ? this.base64Image.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
    };
    this.employeeService
      .updateEmployeeProfileImage(this.commonService.clean(payload))
      .subscribe((res) => {
        this.editEmployee = {};
        this.image = "";
        this.base64Image = "";
        this.page = 1;
        this.payload.displayStart = this.displayLength * (this.page - 1);
        this.loadData();
        this.modal.dismissAll();
        this.success(res);
      });
  }

  resetFileInput() {
    const fileInput: any = document.getElementById("profile-img-file-input");
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }

  open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }
}
