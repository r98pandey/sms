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
import { filter, fromEvent } from "rxjs";
import { DepartmentService } from "src/app/core/services/department.service";
import { EmployeeService } from "src/app/core/services/employee.service";
import { LocalStoreService } from "src/app/core/services/local-store.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { Lightbox } from "ngx-lightbox";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-list-new-user",
  templateUrl: "./list-new-user.component.html",
  styleUrls: ["./list-new-user.component.scss"],
})
export class ListNewUserComponent implements OnInit, AfterViewInit {
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  globalCompanyId: string;
  userList: any[] = [];
  searchName: string;
  label: any = "Staff";
  breadCrumbItems: any = [
    { label: "User Management" },
    { label: "Staff List", active: true },
  ];
  apiUrl: string;
  isProjectVisible: boolean = false;
  displayLength: number = 10;
  deleteEmpId: string;
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchFullName: null,
    SearchRoleName: null,
    SearchAccessGroupName: null,
    SearchPortalEnable: null,
    SearchMobileEnable: null,
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
    private userService: UserProfileService,
    private dropdownServices: DropdownService,
    private modalService: NgbModal,
    private router: Router,
    private modal: NgbModal,
    private commonService: CommonFunctionService,
    private menuService: MenuServiceService,
    private lightbox: Lightbox,
    private datePipe: DatePipe
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);

    this.apiUrl = environment.apiUrl;
  }

  ngOnInit(): void {

    if(this.router.url.includes('employee-profile-list')){
      console.log("employee-profile-list",)
      this.label = "Employee Profile";
      this.breadCrumbItems = [
    { label: "Human Resource" },
    { label: "Employee Profile", active: true },
  ];
    }else{
      this.label = "Staff";
      this.breadCrumbItems = [
    { label: "User Management" },
    { label: "Staff List", active: true },
  ];
    }
    this.getRoles();
    if (JSON.parse(localStorage.getItem("objectSerachForUMUserList"))) {
      this.getObjectAfterRefreshUM();
    } else {
      this.loadData();
    }
  }

  

  
  


  /**
   * End  For Dropdown Company ,client,project
   */
  loadData() {
    this.userService
      .getV2_UserList(this.commonService.clean(this.payload))
      .subscribe(
        (res: any) => {
          this.userList = res.data;
          this.setObjectBeforeRefeshUM();
          if (this.userList.length > 0) {
            this.totalRecords = res.data[0].totalCount;
            this.from = res.data.reduce(
              (min, p) => (p.rowNum < min ? p.rowNum : min),

              res.data[0].rowNum
            );

            this.to = res.data.reduce(
              (max, p) => (p.rowNum > max ? p.rowNum : max),

              res.data[0].rowNum
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
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  /**
   * for Set object to refesh
   */
  setObjectBeforeRefeshUM() {
    let objectSerachForUMUserList: any = {};
  
  
    if (this.rolesList) {
      objectSerachForUMUserList.rolesList = this.rolesList
    }
    if (this.accessGroupList) {
      objectSerachForUMUserList.accessGroupList = this.accessGroupList
    }

    if (this.selectedRoleIdValue) {
      objectSerachForUMUserList.SearchRoleName = this.selectedRoleIdValue
    }

    if (this.selectedAccessGroupValue) {
      objectSerachForUMUserList.SearchAccessGroupName = this.selectedAccessGroupValue
    }

    if (this.selectedPortalEnable) {
      objectSerachForUMUserList.SearchPortalEnable = this.selectedPortalEnable
    }

    if (this.selectedMobileEnable) {
      objectSerachForUMUserList.SearchMobileEnable = this.selectedMobileEnable
    }
    if (this.searchName) {
      objectSerachForUMUserList.SearchFullName = this.searchName
    }



    if (this.page) {
      objectSerachForUMUserList.displayStart = this.pageSize * (this.page - 1);
      objectSerachForUMUserList.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForUMUserList",
      JSON.stringify(objectSerachForUMUserList)
    );
  }

  /**
  * for get object for refesh
  */
  getObjectAfterRefreshUM() {
    let objectSerachForUMUserList: any = JSON.parse(
      localStorage.getItem("objectSerachForUMUserList")
    );



    this.rolesList =
      objectSerachForUMUserList.rolesList
        ? objectSerachForUMUserList.rolesList
        : [];
    this.accessGroupList =
      objectSerachForUMUserList.accessGroupList
        ? objectSerachForUMUserList.accessGroupList
        : [];
  

    

    this.selectedRoleIdValue =
      objectSerachForUMUserList.SearchRoleName
        ? objectSerachForUMUserList.SearchRoleName
        : null;

    this.selectedAccessGroupValue =
      objectSerachForUMUserList.SearchAccessGroupName
        ? objectSerachForUMUserList.SearchAccessGroupName
        : null;

    this.selectedPortalEnable =
      objectSerachForUMUserList.SearchPortalEnable
        ? objectSerachForUMUserList.SearchPortalEnable
        : null;

    this.selectedMobileEnable =
      objectSerachForUMUserList.SearchMobileEnable
        ? objectSerachForUMUserList.SearchMobileEnable
        : null;
    this.searchName =
      objectSerachForUMUserList.SearchFullName
        ? objectSerachForUMUserList.SearchFullName
        : null;




    this.payload.SearchRoleName = this.selectedRoleIdValue;
    this.payload.SearchAccessGroupName = this.selectedAccessGroupValue;
    this.payload.SearchPortalEnable = this.selectedPortalEnable == "Portal Enable" ? true : this.selectedPortalEnable == 'Portal Disable' ? false : null;

    this.payload.SearchMobileEnable = this.selectedMobileEnable == "Mobile Enable" ? true : this.selectedMobileEnable == 'Mobile Disable' ? false : null;

    this.payload.SearchFullName = this.searchName;

    if (objectSerachForUMUserList.displayStart) {
      this.payload.displayStart = objectSerachForUMUserList.displayStart;
      this.page = objectSerachForUMUserList.page;
    }
    this.loadData();
  }

  openModalActiveDeactive(value: any, status: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Do you want to " + status + " this  profile ";
    modalRef.componentInstance.subTitle = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = status + " It";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          this.updateUserActiveInActive(value, status);
        }
      }
    });
  }

  updateUserActiveInActive(userId: any, ProfileStatus: any) {
    let paylyoad = {
      Id: userId,
      ProfileStatus: ProfileStatus,
    };
    this.userService.updateUserActiveInActive(paylyoad).subscribe((res) => {
      this.loadData();
      this.success(res);
    });
  }

  onEmployeeNameChangeHandler(event: any) {
    this.payload.SearchFullName = this.searchName;
    this.page = 1;
    this.payload.displayStart = this.displayLength * (this.page - 1);
    this.loadData();
  }

  goToEdit(emp: any) {
    this.router.navigate([
      "/application-settings/asset-handler/asset-handler-edit",
    ]);
  }

  deleteHandler() {
    let requestData = {
      employeeId: parseInt(this.deleteEmpId),
    };
    // this.userService.dele(requestData).subscribe(
    //   (res: any) => {
    //     this.page = 1;
    //     (this.payload.displayStart = this.displayLength * (this.page - 1)),
    //       this.loadData();
    //     this.modal.dismissAll();
    //     this.success(res);
    //   },
    //   (err: any) => {
    //     //console.log("error", err);
    //   }
    // );
  }

  confirmDelete(content: any, id: any) {
    this.deleteEmpId = id;
    this.modalService.open(content, { centered: true });
  }

  resetSerachVariable() {
    this.searchName = null;
    this.selectedRoleIdValue = null;
    this.selectedAccessGroupValue = null;
    this.selectedPortalEnable = null;
    this.selectedMobileEnable = null;
    this.accessGroupList = [];
    this.page = 1;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchFullName: null,
      SearchRoleName: null,
      SearchAccessGroupName: null,
      SearchPortalEnable: null,
      SearchMobileEnable: null,
    };
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

  @ViewChild("inputer", { static: true }) input: ElementRef;
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onEmployeeNameChangeHandler(true);
        })
      )
      .subscribe();
  }

  navigateToForm() {
    this.userService.accessRight = true;
    if(this.label == "Employee Profile"){
      this.router.navigate(["/application-settings/user-management/user/employee-profile-add"]);
    }else{
      this.router.navigate(["/application-settings/user-management/user/add"]);
    }
  
  }
  navigateToView(id) {
    UserProfileService.selectedUserId = id;
    if(this.label == "Employee Profile"){
      this.router.navigate(["/application-settings/user-management/user/employee-profile-view"]);
    }else{
      this.router.navigate(["/application-settings/user-management/user/view"]);  }
  
  }
  deleteId = null;
  deleteUser(modal, id) {
    this.deleteId = id;
    this.modalService.open(modal, { centered: true });
  }

  deleteData(id: any) {
    //for deleting the company
    this.userService
      .postDeleteUser({
        Id: id,
      })
      .subscribe(
        (res) => {
          this.page = 1;
          this.payload.displayStart = this.displayLength * (this.page - 1);
          this.loadData();
        },
        (err) => {
          //console.log("error", err);
        }
      );
  }

  navigateToEdit(userId?: any) {
    UserProfileService.selectedUserId = userId;
    if(this.label == "Employee Profile"){
      this.router.navigate(["/application-settings/user-management/user/employee-profile-edit"]);
    }else{
      this.router.navigate(["/application-settings/user-management/user/edit"]);  }
  }

  openModalCreateConf(value: any, fullName: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Do you want to reset " + fullName + " password?";
    modalRef.componentInstance.subTitle = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = "Reset It";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          this.resetPassword(value);
        }
      }
    });
  }

  resetPassword(username: any) {
    this.userService.resetPassword(username).subscribe((res: any) => {
      this.success(res);
    });
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

  // Enchament new Thing

  rolesList: any = [];
  accessGroupList: any = [];

  loading = {
    role: false,
    accessGroup: false,
  };
  selectedRoleIdValue: any = null;
  selectedAccessGroupValue: any = null;
  selectedPortalEnable: any = null;
  selectedMobileEnable: any = null;
  mobileYesNoArray = [
    {
      id: true,
      name: "Mobile Enable",
    },
    {
      id: false,
      name: "Mobile Disable",
    },
  ];
  portalYesNoArray = [
    {
      id: true,
      name: "Portal Enable",
    },
    {
      id: false,
      name: "Portal Disable",
    },
  ];
  getRoles() {
    this.userService.GetRoleList().subscribe({
      next: (res: any) => {
        this.rolesList = res.data;
        this.setObjectBeforeRefeshUM()
      },
    });
  }
  getAccessGroup(id) {
    this.loading.accessGroup = true;
    this.userService.GetAccessGroupListByAccessGroupId(id).subscribe({
      next: (res: any) => {
        this.loading.accessGroup = false;
        this.accessGroupList = res.data;
        this.setObjectBeforeRefeshUM();
      },
    });
  }
  onTypeRole(event) {
    this.selectedAccessGroupValue = null;
    this.accessGroupList = [];
    this.payload.SearchRoleName = this.selectedRoleIdValue;
    this.payload.SearchAccessGroupName = this.selectedAccessGroupValue;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.loadData();
    if (event) this.getAccessGroup(event.id);
  }
  onTypeAccessGroup(event) {
    this.selectedAccessGroupValue = event ? event.name : null;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchAccessGroupName = this.selectedAccessGroupValue;
    this.loadData();
  }
  onSelectedPortalEnable(event: any) {
    // this.selectedPortalEnable = event ? event.id : null;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchPortalEnable = this.selectedPortalEnable == "Portal Enable" ? true : this.selectedPortalEnable == 'Portal Disable' ? false : null;
    this.loadData();
  }
  onSelectedMobileEnable(event: any) {
    // this.selectedMobileEnable = event ? event.id : null;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchMobileEnable = this.selectedMobileEnable == "Mobile Enable" ? true : this.selectedMobileEnable == 'Mobile Disable' ? false : null;
    this.loadData();
  }


  ccurentStatusActive(date) {
    const specificDateIST: any = new Date(date);
    const specificDateMYT: any = new Date(
      specificDateIST.toLocaleString("en-US")
    );
    const currentDateMYT: any = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kuala_Lumpur",
    });
    const currentDateMYTObject: any = new Date(currentDateMYT);
    const timeDifferenceMinutes =
      (currentDateMYTObject - specificDateMYT) / (1000 * 60);
    const isWithinLimit = Math.abs(timeDifferenceMinutes) <= 10;

    return isWithinLimit;
  }

  returnCurrentStatusClassesStatus(value: any){
    return this.commonService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any){
    return this.commonService.getStatusColorCircle(value);
  }


}
