import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DepartmentService } from "src/app/core/services/department.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import Swal from "sweetalert2";

@Component({
  selector: 'app-create-client-member-dymi',
  templateUrl: './create-client-member-dymi.component.html',
  styleUrl: './create-client-member-dymi.component.scss'
})
export class CreateClientMemberDymiComponent implements OnInit {
  loading = {
    role: false,
    accessGroup: false,
  };
  @Input() nameTitle: any;
  @Input() projectId: any;
  @Input() clientApi: boolean

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
    private router: Router, public modal: NgbActiveModal,
    private modalService: NgbModal
  ) {



  }
  ngOnInit(): void {
    console.log("projectId", this.projectId)
    this.buildForm();
    this.getRoles();

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
      PortalEnable: [true],
      MobileEnable: [false],
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
  } get MobileEnable() {
    return this.userForm.get("MobileEnable");
  }
  get PhoneNumber() {
    return this.userForm.get("PhoneNumber");
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
    if (this.clientApi) {
      this.userService.getRoleListForClient().subscribe({
        next: (res: any) => {
          this.rolesList = res.data;
        },
      });
    } else {
      this.userService.GetRoleList().subscribe({
        next: (res: any) => {
          this.rolesList = res.data;
        },
      });
    }
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




  onTypeAccessGroup(event) { }





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
  submitForm() {
    const payload = {
      Role: this.getRoleName(this.roleId.value).name,
      AccessGroupId: this.AccessGroupId.value ? this.AccessGroupId.value : null,
      UserName: this.Email.value ? this.Email.value : null,
      Email: this.Email.value ? this.Email.value : null,
      FullName: this.FullName.value ? this.FullName.value : null,
      PhoneNumber: this.PhoneNumber.value ? this.PhoneNumber.value + "" : null,
      MobileEnable: this.MobileEnable.value,
      PortalEnable: this.PortalEnable.value,
      UserImageBase64string:
        this.profile_img !==
          "../../../../../../assets/images/userClientPlaceholder.png"
          ? this.profile_img.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
      projectUserAccess:
      {
        projectId: this.projectId
      },

    };
    this.Submit('submit', payload)

  }

  openModalCreateClient() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Add  " + this.nameTitle;
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submitForm();
        }
      }
    });
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


  gotoView(id: any) {
    UserProfileService.selectedUserId = id;
    this.router.navigate([
      "/application-settings/user-management/client-user/view",
    ]);
  }

  close(value) {
    this.modal.close({
      value: value,
    });
  }
  Submit(value, payload) {
    this.modal.close({
      value: value,
      payload: payload
    });
  }



}
