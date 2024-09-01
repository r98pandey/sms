import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DepartmentService } from "src/app/core/services/department.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import Swal from "sweetalert2";
import { map } from "rxjs";
import { CommonFilterComponent } from "../../../../../shared/components/common-filter/common-filter.component";
import { CommonFunctionService } from "../../../../../shared/Service-common/common-function.service";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { AuthAssetService } from '../../../../../core/services/auth-asset.service';

@Component({
  selector: "app-add-new-user",
  templateUrl: "./add-new-user.component.html",
  styleUrls: ["./add-new-user.component.scss"],
})
export class AddNewUserComponent  implements OnInit{
  selectedCompanyAccessLevelArray: any = [];

  loading = {
    role: false,
    accessGroup: false,
  };

  label: any = "Add User";

  breadCrumbItems: any = [
    { label: "User Management" },
    { label: "Add User", active: true },
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
  profile_img: string;
  default_profile_img: string;
  isFirstImageVisible: boolean;
  localStoreDepartmentId: any = [];
  isMaintenanceModule: any;
  isProjectManagementModule: any;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserProfileService,
    private dropDownService: DropdownService,
    private departmentService: DepartmentService,
    private router: Router,
    private modalService: NgbModal,  private authAssetService: AuthAssetService,
    private CommonFunctionService: CommonFunctionService
  ) {
    if (this.userService.accessRight) {
      this.buildForm();
      this.getRoles();
      this.getCompanyDropDownList();
    } else {
      this.goBack();
    }
  }
  ngOnInit(): void {
    console.log("this.router.url.includes('employee-profile-add')",this.router.url.includes('employee-profile-add'))
    if(this.router.url.includes('employee-profile-add'))
      {
      
      this.label = "Add Employee Profile ";
      this.breadCrumbItems = [
    { label: "Human Resource" },
    { label: "Add Employee Profile", active: true },
  ];
    }else{
      this.label = "Add Staff";
      this.breadCrumbItems = [
    { label: "User Management" },
    { label: "Add Staff", active: true },
  ]
  }
}

  
  buildForm() {

    this.isMaintenanceModule =this.authAssetService.getIsMaintenanceModule()
    this.isProjectManagementModule=this.authAssetService.getIsProjectManagementModule()


    this.profile_img = this.default_profile_img =
      "../../../../../../assets/images/userClientPlaceholder.png";
    this.userForm = this.formBuilder.group({
      Email:  ['', [Validators.required, Validators.email]],
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

  get form() {
    return this.userForm.controls;
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
      },
    });
  }

  getProjectByCompany(company) {
    this.selectedCompanyAccessLevelArray = [];
    company.forEach((element) => {
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
                selectedList: [],
              });
            }
            if (this.localStoreDepartmentId.length) {
              this.localStoreDepartmentId.forEach((element) => {
                this.selectedCompanyAccessLevelArray.forEach((el1, index) => {
                  if (el1.company.companyId === element.company.companyId) {
                    el1.selectedList = element.selectedList;
                  }
                });
              });
            }
          },
        });
    });
  }

  checkDeparmentAccess(event, value, index) {
    //console.log("event, value, index", event.target.checked, value, index);
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
    //console.log(this.selectedCompanies);

    this.getProjectByCompany(event);
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
            "/application-settings/user-management/user/list",
          ]);
        }
      }
    });
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
  openModalCreateAddUser() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Add User ";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submit();
        } else {
          this.goBack();
        }
      }
    });
  }

  submit() {
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

    //console.log("paayload", payload);
    this.userService
      .postUser(this.CommonFunctionService.clean(payload))
      .subscribe(
        (res) => {
          this.success(res);
          this.openModalView(res)
          // this.router.navigate([
          //   "/application-settings/user-management/user/list",
          // ]);
        },
        (err) => {
          //console.log(err, "jj");
          this.openModaWaringConf(err);
        }
      );
  }

  
  checkdisableFunction() {
    this.selectedCompanyAccessLevelArray.forEach((element) => {
      element.se;
    });
  }

  checkUncheckAll(company, event) {}

  goBack() {

    if(this.label== "Add Employee Profile "){
      this.router.navigate(["/application-settings/user-management/user/employee-profile-list"]);
    }else{
    this.router.navigate(["/application-settings/user-management/user/list"]);}
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

  openModalView(res: any) {
    if (res.userId) {
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
            this.gotoView(res.userId);
          } else {
            this.goBack();
          }
        }
      });
    } else {
      this.goBack();
    }
  }
  gotoView(id: any) {
    UserProfileService.selectedUserId = id;
    this.router.navigate([
      "/application-settings/user-management/user/view",
    ]);
  }
}
