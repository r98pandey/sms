import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
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
@Component({
  selector: "app-new-user-list",
  templateUrl: "./new-user-list.component.html",
  styleUrls: ["./new-user-list.component.scss"],
})
export class NewUserListComponent implements OnInit, AfterViewInit, OnChanges {
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  userList: any[] = [];
  searchName: string;
  label: any = "User";
  breadCrumbItems: any = [
    { label: "User Management" },
    { label: "User List", active: true },
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
  @Input() userType: any = "User";
  @Input() selectedDropDownProjectOrDeparmentIdValue: any;
  @Input() selectedDropDownCompanyIdValue: any;
  constructor(
    private userService: UserProfileService,
    private dropdownServices: DropdownService,
    private modalService: NgbModal,
    private router: Router,
    private modal: NgbModal,
    private commonService: CommonFunctionService,
    private menuService: MenuServiceService,
    private lightbox: Lightbox
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);

    this.apiUrl = environment.apiUrl;
  }
  checkedUserList: any = [];
  ngOnInit(): void {
    this.getRoles();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  loadData() {
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchDepartmentIdAsString =
      this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.userType === "User") {
      this.userService
        .getV2_UserListOnlyByProject(this.commonService.clean(this.payload))
        .subscribe(
          (res: any) => {
            this.userList = res.data;

            if (this.checkedUserList.length > 0) {
              this.userList = this.userList.filter((item) => {
                let foundItemArray: any[] = this.checkedUserList?.filter(
                  (el) => el.id == item.id
                );
                if (foundItemArray.length > 0) item["checked"] = true;
                return 1;
              });
            }
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
          }
          // (err) => {
          //   //console.log(err);
          // };
        );
    } else {
      this.userService
        .getV2_ClientListOnlyByProject(this.commonService.clean(this.payload))
        .subscribe(
          (res: any) => {
            this.userList = res.data;

            if (this.checkedUserList.length > 0) {
              this.userList = this.userList.filter((item) => {
                let foundItemArray: any[] = this.checkedUserList?.filter(
                  (el) => el.id == item.id
                );
                if (foundItemArray.length > 0) item["checked"] = true;
                return 1;
              });
            }
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
          }
          // (err) => {
          //   //console.log(err);
          // }
        );
    }
  }

  pageChange(pageNo): void {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  onEmployeeNameChangeHandler(event: any) {
    this.payload.SearchFullName = this.searchName;
    this.page = 1;
    this.payload.displayStart = this.displayLength * (this.page - 1);
    this.loadData();
  }

  resetSerachVariable() {
    this.searchName = null;
    this.selectedRoleIdValue = null;
    this.selectedAccessGroupValue = null;
    (this.selectedPortalEnable = null),
      (this.selectedMobileEnable = null),
      (this.page = 1);
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
      },
    });
  }
  getAccessGroup(id) {
    this.loading.accessGroup = true;
    this.userService.GetAccessGroupListByAccessGroupId(id).subscribe({
      next: (res: any) => {
        this.loading.accessGroup = false;
        this.accessGroupList = res.data;
      },
    });
  }
  onTypeRole(event) {
    this.selectedAccessGroupValue = null;
    this.accessGroupList=[];
    this.payload.SearchRoleName = this.selectedRoleIdValue;
    this.payload.SearchAccessGroupName = this.selectedAccessGroupValue;
    this.loadData();
    if (event) this.getAccessGroup(event.id);
  }
  onTypeAccessGroup(event) {
    this.selectedAccessGroupValue = event ? event.name : null;
    this.payload.SearchAccessGroupName = this.selectedAccessGroupValue;
    this.loadData();
  }
  onSelectedPortalEnable(event: any) {
    this.selectedPortalEnable = event ? event.id : null;
    this.payload.SearchPortalEnable = this.selectedPortalEnable;
    this.loadData();
  }
  onSelectedMobileEnable(event: any) {
    this.selectedMobileEnable = event ? event.id : null;
    this.payload.SearchMobileEnable = this.selectedMobileEnable;
    this.loadData();
  }

  checkUncheckAll() {
    return this.userList.length != 0
      ? this.userList.every((p) => p.checked)
      : false;
  }
  getAssetlistChecked(isSelected: any, asset: any) {
    if (isSelected == true) {
      this.checkedUserList.push(asset);
    } else {
      this.checkedUserList.forEach((value, index) => {
        if (value.id == asset.id) {
          this.checkedUserList.splice(index, 1);
        }
      });
    }
  }

  onCheckboxChange(ev) {
    if (this.userList.length) {
      this.userList.forEach((x) => (x.checked = ev.target.checked));
      if (ev.target.checked == true) {
        this.userList.forEach((ele, index) => {
          this.checkedUserList.push(ele);
        });
      } else {
        this.checkedUserList = this.checkedUserList.filter((item) => {
          let foundItemArray: any[] = this.userList.filter(
            (el) => el.id == item.id
          );
          if (foundItemArray.length > 0) return false;
          return true;
        });
      }
      this.checkedUserList = this.uniqTheObject(
        this.checkedUserList,
        (obj) => obj.id
      );
      //console.log("checkedUserList", this.checkedUserList);
    }
    return false;
  }

  uniqTheObject(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  createUserAssignByProject() {
    let payload: any = [];
    this.checkedUserList.forEach((element) => {
      payload.push({
        CompanyId: this.selectedDropDownCompanyIdValue,
        DepartmentId: this.selectedDropDownProjectOrDeparmentIdValue,
        UserId: element.id,
      });
    });
    //console.log("payload", payload);
    this.userService.userAssignByProject(payload).subscribe((res: any) => {
      this.success(res);
      this.router.navigate(["/application-settings/department/project-list"]);
    });
  }

  returnCurrentStatusClassesStatus(value: any){
    return this.commonService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any){
    return this.commonService.getStatusColorCircle(value);
  }

}
