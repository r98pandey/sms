import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DepartmentService } from "src/app/core/services/department.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-new-client",
  templateUrl: "./add-new-client.component.html",
  styleUrls: ["./add-new-client.component.scss"],
})
export class AddNewClientComponent {
  loading = {
    role: false,
    accessGroup: false,
  };

  label: any = "Add Client User";

  breadCrumbItems: any = [
    { label: "User Management" },
    { label: "Add Client User", active: true },
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
  profile_img: string;
  default_profile_img: string;
  isFirstImageVisible: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserProfileService,
    private dropDownService: DropdownService,
    private departmentService: DepartmentService,
    private router: Router,
    private modalService: NgbModal
  ) {
    if (this.userService.accessRight) {
      this.buildForm();
      this.getRoles();
      this.getCompanyDropDownList();
    } else {
      this.goBack();
    }
  }

  buildForm() {
    this.profile_img = this.default_profile_img =
      "../../../../../../assets/images/userClientPlaceholder.png";
    this.userForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
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
  get UserImageBase64string() {
    return this.userForm.get("UserImageBase64string");
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

  getRoleName(roleId) {
    return this.rolesList.find((i) => roleId == i.id);
  }
  getClientName(clientId) {
    return this.clientList.find((i) => clientId == i.clientId);
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
    let payload = {
      SearchCompanyId: this.CompanyId.value,
      SearchClientId: this.ClientId.value,
    };
    this.dropDownService.GetDepartmentListDrobDown(payload).subscribe({
      next: (res: any) => {
        this.departmentList = res.list;
      },
    });
  }

  getCompany(companyId) {
    return this.companyList.find((i) => i.companyId === companyId);
  }
  onTypeAccessGroup(event) { }

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

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.profile_img = event.target.result;
        this.isFirstImageVisible = true;
      };
      reader.onerror = () => {
        this.profile_img = this.default_profile_img;
        this.UserImageBase64string.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.profile_img = this.default_profile_img;
        this.UserImageBase64string.setValue("");
      }
    } else {
      this.profile_img = this.default_profile_img;
      this.UserImageBase64string.setValue("");
    }
  }
  crossFirstImage(url) {
    if (url) {
      this.profile_img =
        "../../../../../../assets/images/userClientPlaceholder.png";
      this.isFirstImageVisible = false;
      this.resetFileInput();
    }
  }
  resetFileInput() {
    const fileInput: any = document.getElementById("asset_id0");
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }
  submit() {
    const payload = {
      Role: this.getRoleName(this.roleId.value).name,
      AccessGroupId: this.AccessGroupId.value ? this.AccessGroupId.value : null,
      UserName: this.Email.value ? this.Email.value : null,
      Email: this.Email.value ? this.Email.value : null,
      FullName: this.FullName.value ? this.FullName.value : null,
      PhoneNumber: this.PhoneNumber.value ? this.PhoneNumber.value + "" : null,
      MobileEnable: false,
      PortalEnable: this.PortalEnable.value,
      UserImageBase64string:
        this.profile_img !==
          "../../../../../../assets/images/userClientPlaceholder.png"
          ? this.profile_img.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
      clientId: this.ClientId.value,
      clientName: this.getClientName(this.ClientId.value).clientName,
      list: [
        {
          DepartmentId: this.selectedCompanyAccessLevelArray.join(","),
          CompanyId: this.CompanyId.value,
          AccessLevel: "D",
        },
      ],
    };

    this.userService.postClientUser(payload).subscribe(
      (res) => {
        this.success(res);
        this.openModalView(res);
      },
      (err) => {
        this.openModaWaringConf(err);

      }
    );
  }

  openModalCreateClient() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Add Client ";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submit();
        } 
      }
    });
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
  openModaWaringConf(message) {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = message;
    modalRef.componentInstance.subTitle = "";
    modalRef.result.then((result) => {
      //console.log(result, "result");
      if (result) {
        if (result == "Close click") {
          this.router.navigate([
            "/application-settings/user-management/client-user/list",
          ]);
        }
      }
    });
  }

  openModalView(res: any) {
    if (res.id) {
      const modalRef = this.modalService.open(SuccessModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title =
        "Profile Create successfully and credential email to respective email.";
      modalRef.componentInstance.subTitle =
        "Do you want to setup Email Notification & Real time Push Notification & My Task";
      modalRef.componentInstance.subTitle1 =
        "If yes then navigate to View page to admin for setup.";

      modalRef.componentInstance.buttonName = "Go It";

      modalRef.result.then((result) => {
        //console.log(result);
        if (result) {
          if (result == "success") {
            this.gotoView(res.id);
          } else {
            this.router.navigate([
              "/application-settings/user-management/client-user/list",
            ]);
          }
        }
      });
    } else {
      this.router.navigate([
        "/application-settings/user-management/client-user/list",
      ]);
    }
  }
  gotoView(id: any) {
    UserProfileService.selectedUserId = id;
    this.router.navigate([
      "/application-settings/user-management/client-user/view",
    ]);
  }
}
