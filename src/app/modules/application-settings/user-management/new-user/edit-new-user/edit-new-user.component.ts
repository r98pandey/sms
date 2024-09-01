import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DepartmentService } from "src/app/core/services/department.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import Swal from "sweetalert2";
import { CommonFunctionService } from "../../../../../shared/Service-common/common-function.service";
import { environment } from "src/environments/environment";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { el } from "@fullcalendar/core/internal-common";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

@Component({
  selector: "app-edit-new-user",
  templateUrl: "./edit-new-user.component.html",
  styleUrls: ["./edit-new-user.component.scss"],
})
export class EditNewUserComponent implements OnInit {
  selectedCompanyAccessLevelArray: any = [];

  loading = {
    role: false,
    accessGroup: false,
  };

  label: any = "Edit User";

  breadCrumbItems: any = [
    { label: "User Management" },
    { label: "Edit User", active: true },
  ];

  userForm: FormGroup;
  rolesList: any[] = [];
  accessGroupList: any[] = [];
  companyList: any[] = [];
  profileStatus: any[] = [];
  user_Lago_Img: string | null = null;
  selectedProfileStatus: string = "";

  selectedCompanies: any[] = [];
  companyModel: any;
  userData: any;

  profile_img: any;
  default_profile_img: string;
  isFirstImageVisible: boolean;
  imagEUrl: any = environment.apiUrl;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserProfileService,
    private dropDownService: DropdownService,
    private departmentService: DepartmentService,
    private router: Router,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService
  ) {
    if (
      UserProfileService.selectedUserId == 0 ||
      UserProfileService.selectedUserId == null ||
      !UserProfileService.selectedUserId == undefined
    ) {
      this.goBack();
    } else {
      this.buildForm();
      this.getRoles();
      this.getCompanyDropDownList();
    }
  }
  ngOnInit(): void {
    if (this.router.url.includes('employee-profile-edit')) {
      this.label = "Employee Profile Edit";
      this.breadCrumbItems = [
        { label: "Human Resource" },
        { label: "Employee Profile Edit", active: true },
      ];
    } else {
      this.label = "Staff";
      this.breadCrumbItems = [
        { label: "User Management" },
        { label: "Staff Edit", active: true },
      ];
    }
    this.buildForm();
  }

  buildForm() {
    this.companyModel = [];
    this.userForm = this.formBuilder.group({
      Email: ["", Validators.required],
      FullName: ["", Validators.required],
      PhoneNumber: ["", Validators.required],
      roleId: [null, Validators.required],
      AccessGroupId: [null, Validators.required],
      MobileEnable: [false],
      PortalEnable: [false],
      UserImageBase64string: [""],
    });
  }
  get AccessGroupId() {
    return this.userForm.get("AccessGroupId");
  }
  get roleId() {
    return this.userForm.get("roleId");
  }
  get FullName() {
    return this.userForm.get("FullName");
  }
  get Email() {
    return this.userForm.get("Email");
  }
  get MobileEnable() {
    return this.userForm.get("MobileEnable");
  }
  get PortalEnable() {
    return this.userForm.get("PortalEnable");
  }
  get PhoneNumber() {
    return this.userForm.get("PhoneNumber");
  }
  get UserImageBase64string() {
    return this.userForm.get("UserImageBase64string");
  }

  getUserDetail(id) {
    this.userService.getUserListByUserId(id).subscribe({
      next: (res: any) => {
        this.userData = res.data;
        this.getAccessGroup(this.userData.roleId);
        this.userForm.patchValue({
          FullName: this.userData.fullName,
          Email: this.userData.email,
          roleId: this.userData.roleId,
          PhoneNumber: this.userData.phoneNumber,
          AccessGroupId: this.userData.accessGroupId,
          MobileEnable: this.userData.mobileEnable,
          PortalEnable: this.userData.portalEnable,
        });
        this.profile_img = this.userData.profileImageUrl
          ? this.imagEUrl + this.userData.profileImageUrl
          : "../../../../../../assets/images/userClientPlaceholder.png";
        this.isFirstImageVisible = this.userData.profileImageUrl ? true : false;
        this.userData.list.forEach((element) => {
          this.companyList.forEach((el: any) => {
            if (element.companyId == el.companyId) {
              this.companyModel.push(Number(element.companyId));
              this.companyModel = [...this.companyModel];
              this.selectedCompanies.push(el);
            }
          });
        });
        //console.log(this.companyModel, this.selectedCompanies);
        this.getProjectByCompany2(this.selectedCompanies, this.userData.list);
      },
    });
  }

  getRoleName(roleId) {
    return this.rolesList.find((i) => roleId == i.id);
  }

  onTypeRole(event) {
    this.AccessGroupId.reset();
    this.getAccessGroup(event.id);
  }

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

  getCompanyDropDownList() {
    this.userService.getCompanyExistWithDepartmentList({}).subscribe({
      next: (res: any) => {
        this.companyList = res.list;
        this.getUserDetail(UserProfileService.selectedUserId);
      },
    });
  }
  localStoreDepartmentId: any = [];
  getProjectByCompany2(company, dataSelected: any = []) {
    this.selectedCompanyAccessLevelArray = [];
    company.forEach((element, index1) => {
      this.departmentService
        .getDepartmentTableList_LocalPagination({
          SearchCompanyId: element.companyId,
        })
        .subscribe({
          next: (res: any) => {
            if (res.list.length == 0) {
              this.selectedCompanies.forEach((ele, index) => {
                if (ele.companyId == element.companyId) {
                  this.companyModel.splice(index, 1);
                  this.companyModel = [...this.companyModel];
                  this.selectedCompanies.splice(index, 1);
                }
              });
              this.noDepartmentModalPopUpOpen();
            } else {
              this.selectedCompanyAccessLevelArray.push({
                company: element,
                projectList: res.list,
                selectedList: dataSelected[index1]
                  ? dataSelected[index1]?.departmentId.split(",").map(Number)
                  : [],
              });
            }

            if (this.userData.list.length != 0) {
              this.userData.list.forEach((element) => {
                this.selectedCompanyAccessLevelArray.forEach((el1, index) => {
                  if (el1.company.companyId === element.companyId) {
                    el1.selectedList = element.departmentId
                      ? element.departmentId.split(",").map(Number)
                      : [];
                  }
                });
              });
              this.localStoreDepartmentId =
                this.selectedCompanyAccessLevelArray.slice();
            }
          },
        });
    });
  }
  getProjectByCompany(company, dataSelected: any = []) {
    this.selectedCompanyAccessLevelArray = [];
    company.forEach((element, index1) => {
      this.departmentService
        .getDepartmentTableList_LocalPagination({
          SearchCompanyId: element.companyId,
        })
        .subscribe({
          next: (res: any) => {
            if (res.list.length == 0) {
              this.selectedCompanies.forEach((ele, index) => {
                if (ele.companyId == element.companyId) {
                  this.companyModel.splice(index, 1);
                  this.companyModel = [...this.companyModel];
                  this.selectedCompanies.splice(index, 1);
                }
              });
              this.noDepartmentModalPopUpOpen();
            } else {
              this.selectedCompanyAccessLevelArray.push({
                company: element,
                projectList: res.list,
                selectedList: dataSelected[index1]
                  ? dataSelected[index1]?.departmentId.split(",").map(Number)
                  : [],
              });

              if (this.localStoreDepartmentId.length) {
                this.localStoreDepartmentId.forEach((element) => {
                  this.selectedCompanyAccessLevelArray.forEach((el1, index) => {
                    if (el1.company.companyId === element.company.companyId) {
                      el1.selectedList = element.selectedList;
                    }
                  });
                });
              }
            }
          },
        });
    });
  }
  get form() {
    return this.userForm.controls;
  }

  checkDeparmentAccess(event, value, index) {
    if (event.target.checked) {
      this.selectedCompanyAccessLevelArray[index].selectedList.push(value);
    } else {
      this.selectedCompanyAccessLevelArray[index].selectedList.splice(
        this.selectedCompanyAccessLevelArray[index].selectedList.indexOf(value),
        1
      );
    }
    this.localStoreDepartmentId = this.selectedCompanyAccessLevelArray.slice();
  }
  returnValue(value, index) {
    return this.selectedCompanyAccessLevelArray[index].selectedList.includes(
      value
    );
  }
  returnaSelectAll(index) {
    return (
      this.selectedCompanyAccessLevelArray[index].selectedList.length ===
      this.selectedCompanyAccessLevelArray[index].projectList.length
    );
  }

  checkSelectedAll(event, index) {
    this.selectedCompanyAccessLevelArray[index].selectedList = [];
    if (event.target.checked) {
      this.selectedCompanyAccessLevelArray[index].projectList.map((project) => {
        this.selectedCompanyAccessLevelArray[index].selectedList.push(
          project.departmentId
        );
      });
    } else {
      this.selectedCompanyAccessLevelArray[index].selectedList = [];
    }
    this.localStoreDepartmentId = this.selectedCompanyAccessLevelArray.slice();
  }

  onTypeAccessGroup(event) {}

  onTypeCompany(event) {
    this.selectedCompanies = event;
    this.companyModel = [...this.companyModel];
    this.getProjectByCompany(event);
  }

  updatePerspon() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you sure you want to update the user data?";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addupdatePersponSucessModal();
        } else {
         // this.onBack();
        }
      }
    });
  }

  addupdatePersponSucessModal() {
    const payload = {
      Id: this.userData.id,
      Role: this.getRoleName(this.roleId.value).name,
      AccessGroupId: this.AccessGroupId.value ? this.AccessGroupId.value : null,
      UserName: this.Email.value ? this.Email.value : null,
      Email: this.Email.value ? this.Email.value : null,
      FullName: this.FullName.value ? this.FullName.value : null,
      PhoneNumber: this.PhoneNumber.value ? this.PhoneNumber.value + "" : null,
      MobileEnable: this.MobileEnable.value,
      PortalEnable: this.PortalEnable.value,
      RoleId: this.roleId.value,
    };

    //console.log("paayload", payload);
    this.userService.postUpdateUserBasicDetail(payload).subscribe({
      next: (res) => {
        this.success(res);
        this.router.navigate([
          "/application-settings/user-management/user/list",
        ]);
      },
    });
  }

  updateUserDataAccessLevel() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you sure you want to update the user data?";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addUserDataSucessModal();
        } else {
         // this.onBack();
        }
      }
    });
  }

  addUserDataSucessModal() {
    const payload = {
      Id: this.userData.id,
      list: [],
    };
    this.selectedCompanyAccessLevelArray.forEach((elment: any) => {
      const obj = {
        DepartmentId: elment.selectedList.join(","),
        CompanyId: elment.company.companyId,
        AccessLevel: "D",
      };
      payload.list.push(obj);
    });

    this.userService.postUpdateCompanyDepartmentAccessLevel(payload).subscribe({
      next: (res) => {
        this.success(res);
        this.router.navigate([
          "/application-settings/user-management/user/list",
        ]);
      },
    });
  }

  goBack() {
    if (this.router.url.includes('employee-profile-edit')) {
      this.router.navigate(["/application-settings/user-management/user/employee-profile-list"]);
    } else {
      this.router.navigate(["/application-settings/user-management/user/list"]);
    }
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

  @ViewChild("noDepartmentModalPopUp", { static: true })
  noDepartmentModalPopUp: ElementRef;

  noDepartmentModalPopUpOpen() {
    this.modalService
      .open(this.noDepartmentModalPopUp, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
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
          this.crossFirstImage(urk);
        }
      }
    });
  }

  crossFirstImage(url) {
    if (url) {
      this.profile_img =
        "../../../../../../assets/images/userClientPlaceholder.png";
      this.isFirstImageVisible = false;
      this.resetFileInput();
      this.saveImage();
    }
  }

  resetFileInput() {
    const fileInput: any = document.getElementById("asset_id0");
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }
  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data imageUrl
      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.profile_img = event.target.result;

        this.UserImageBase64string.setValue("");
        if (this.profile_img) {
          this.isFirstImageVisible = true;
        }
        this.saveImage();
      };
    }
  }

  saveImage() {
    let pay = {
      Id: this.userData.id,
      UserLogoBase64string:
        this.profile_img !==
        "../../../../../../assets/images/userClientPlaceholder.png"
          ? this.profile_img.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
    };

    this.userService
      .postUpdateProfileLogo(this.commonFunctionService.clean(pay))
      .subscribe((res) => {
        this.successForImageInsert(res);
      });
  }
  successForImageInsert(res) {
    //for  insert  logo image successfully message
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  checkThatObjectSelectedAccess() {
    if (this.selectedCompanyAccessLevelArray.length) {
      const hasEmptySelectedList = this.selectedCompanyAccessLevelArray.some(
        (element) => element.selectedList.length === 0
      );
      return hasEmptySelectedList;
    } else {
      return true;
    }
  }
}
