import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DepartmentService } from "src/app/core/services/department.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { CommonFunctionService } from '../../../../../shared/Service-common/common-function.service';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

@Component({
  selector: "app-edit-new-client",
  templateUrl: "./edit-new-client.component.html",
  styleUrls: ["./edit-new-client.component.scss"],
})
export class EditNewClientComponent implements OnInit {
  loading = {
    role: false,
    accessGroup: false,
  };

  label: any = "Edit Client User";

  breadCrumbItems: any = [
    { label: "User Management" },
    { label: "Edit Client User", active: true },
  ];

  userForm: FormGroup;
  rolesList: any[] = [];
  accessGroupList: any[] = [];
  companyList: any[] = [];
  profileStatus: any[] = [];

  selectedProfileStatus: string = "";
  clientList: any[] = [];

  selectedCompanies: any[] = [];
  companyModel: any;

  dataAccessLevelByCompany: any = {};
  departmentList: any = [];
  selectedCompanyAccessLevelArray: any = [];
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
      this.router.navigate([
        "/application-settings/user-management/client-user/list",
      ]);
    } else {
      this.buildForm();
      this.getRoles();
      this.getCompanyDropDownList();
    }
  }
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.formBuilder.group({
      Email: ["", Validators.required],
      FullName: ["", Validators.required],
      PhoneNumber: ["", Validators.required],
      roleId: [null, Validators.required],
      AccessGroupId: [null, Validators.required],

      PortalEnable: [false],
      CompanyId: [null, Validators.required],
      ClientId: [null, Validators.required],
      UserImageBase64string: [""],
    });
  }

  get form() {
    return this.userForm.controls;
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
  get PortalEnable() {
    return this.userForm.get("PortalEnable");
  }
  get PhoneNumber() {
    return this.userForm.get("PhoneNumber");
  }
  get CompanyId() {
    return this.userForm.get("CompanyId");
  }
  get ClientId() {
    return this.userForm.get("ClientId");
  }
  get UserImageBase64string() {
    return this.userForm.get("UserImageBase64string");
  }

  getRoleName(roleId) {
    return this.rolesList.find((i) => roleId == i.id);
  }

  onTypeRole(event) {
    this.AccessGroupId.reset();
    this.getAccessGroup(event.id);
  }

  getRoles() {
    this.userService.getRoleListForClient().subscribe({
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
    this.dropDownService.GetCompanyListDrobDown({}).subscribe({
      next: (res: any) => {
        this.companyList = res.list;
        this.getUserDetail(UserProfileService.selectedUserId);
      },
    });
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
          PortalEnable: this.userData.portalEnable,
        });

        // this.profile_img = this.imagEUrl + this.userData.profileImageUrl;
        this.profile_img = this.userData.profileImageUrl
          ? this.imagEUrl + this.userData.profileImageUrl
          : "../../../../../../assets/images/userClientPlaceholder.png";
        this.isFirstImageVisible = this.userData.profileImageUrl ? true : false;

        //console.log(this.profile_img, "    this.profile_img =");

        this.userData.list.forEach((element) => {
          this.companyList.forEach((el: any) => {
            if (element.companyId == el.companyId) {
              this.CompanyId.setValue(element.companyId);
              this.getClientListDrobDown();
              this.getDepartmentListDrobDown();
              this.selectedCompanyAccessLevelArray = element.departmentId
                .split(",")
                .map(Number);
            }
          });
        });
        // this.getProjectByCompany(this.selectedCompanies, this.userData.list);
      },
    });
  }
  getClientListDrobDown() {
    let payload = {
      SearchCompanyId: this.CompanyId.value,
    };
    this.dropDownService
      .getClientForApplicationSettingDrobDown(payload)
      .subscribe({
        next: (res: any) => {
          this.clientList = res.list;
        },
      });
  }

  getDepartmentListDrobDown() {
    let dep = [];
    this.userData.list.forEach((element) => {
      dep = element.departmentId.split(",").map(Number);
    });
    let payload = {
      SearchCompanyId: this.CompanyId.value,
      SearchClientId: this.ClientId?.value,
    };
    this.dropDownService.GetDepartmentListDrobDown(payload).subscribe({
      next: (res: any) => {
        if (res.list.length != 0) {
          res.list.forEach((element) => {
            if (element.departmentId == dep[0]) {
              this.ClientId.setValue(element.clientId);
              this.getDepartmentListDrobDown2();
            }
          });
        }
      },
    });
  }

  getDepartmentListDrobDown2() {
    let payload = {
      SearchCompanyId: this.CompanyId.value,
      SearchClientId: this.ClientId?.value,
    };
    this.dropDownService.GetDepartmentListDrobDown(payload).subscribe({
      next: (res: any) => {
        if (res.list.length != 0) {
          this.departmentList = res.list;
          //console.log(this.departmentList);
        }
      },
    });
  }

  getCompany(companyId) {
    return this.companyList.find((i) => i.companyId === companyId);
  }
  onTypeAccessGroup(event) {}

  checkDeparmentAccess(event, value, index) {
    if (event.target.checked) {
      this.selectedCompanyAccessLevelArray.push(value);
    } else {
      this.selectedCompanyAccessLevelArray.splice(
        this.selectedCompanyAccessLevelArray.indexOf(value),
        1
      );
    }
  }
  returnValue(value) {
    return this.selectedCompanyAccessLevelArray.includes(value);
  }
  returnaSelectAll() {
    return (
      this.selectedCompanyAccessLevelArray.length === this.departmentList.length
    );
  }

  checkSelectedAll(event, index = 0) {
    this.selectedCompanyAccessLevelArray = [];
    if (event.target.checked) {
      this.departmentList.map((project) => {
        this.selectedCompanyAccessLevelArray.push(project.departmentId);
      });
    } else {
      this.selectedCompanyAccessLevelArray = [];
    }
  }

  onChangeCompany(event) {
    this.ClientId.reset();
    this.departmentList = [];
    this.selectedCompanyAccessLevelArray = [];
    this.getClientListDrobDown();
  }
  onTypeClient(event) {
    this.departmentList = [];
    this.selectedCompanyAccessLevelArray = [];
    this.getDepartmentListDrobDown();
  }

  goBack() {
    this.router.navigate([
      "/application-settings/user-management/client-user/list",
    ]);
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

  updatePerspon() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you sure you want to update the client user data?";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addupdatePersponSucessModal();
        } else {
          //this.onBack();
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
      MobileEnable: false,
      PortalEnable: this.PortalEnable.value,
      RoleId: this.roleId.value,
    };

    //console.log("paayload", payload);
    this.userService.postUpdateUserBasicDetail(payload).subscribe({
      next: (res) => {
        this.success(res);
        this.router.navigate([
          "/application-settings/user-management/client-user/list",
        ]);
      },
    });
  }

  updateUserDataAccessLevelModal() {
    const payload = {
      Id: this.userData.id,
      list: [
        {
          DepartmentId: this.selectedCompanyAccessLevelArray.join(","),
          CompanyId: this.CompanyId.value,
          AccessLevel: "D",
        },
      ],
    };

    this.userService.postUpdateCompanyDepartmentAccessLevel(payload).subscribe({
      next: (res) => {
        this.success(res);
        this.router.navigate([
          "/application-settings/user-management/client-user/list",
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
    modalRef.componentInstance.title = "Are you sure you want to update the client data? ";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.updateUserDataAccessLevelModal();
        } else {
          //this.onBack();
        }
      }
    });
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
}
