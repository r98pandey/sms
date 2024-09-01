import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Lightbox } from "ngx-lightbox";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-dashboard-client",
  templateUrl: "./dashboard-client.component.html",
  styleUrls: ["./dashboard-client.component.scss"],
})
export class DashboardClientComponent implements OnInit {
  productionUrl: string = environment.apiUrl;

  userData: any = {};
  companyList: any = [];
  rolesList: any = {};
  accessGroupList: any = {};

  isProject: any;
  projectList: any = {};
  emailNotificationList: any;
  titleAndContentArrayCreated: any = {};
  titleAndContentArrayDelete: any = {};
  myTaskRulesActiveCount: any = [];
  profile_img: any;
  default_profile_img: string;
  imgUrl = environment.apiUrl;
  constructor(
    private userService: UserProfileService,
    private dropDownService: DropdownService,
    private departmentService: DepartmentService,
    private commonFunctionService: CommonFunctionService,
    private router: Router,
    private authAssetService: AuthAssetService,
    private modalService: NgbModal,
    private lightbox: Lightbox
  ) {}
  ngOnInit(): void {
    this.isProject = this.authAssetService.getisProject();
    this.getRoles();
    this.getUserDetail(this.authAssetService.getUserInfoID());
    this.getCompanyDropDownList();
    this.getV2_V2_EmailNotificationList(this.authAssetService.getUserInfoID());
    this.getV2_MyTaskRulesActiveCountByUserId(
      this.authAssetService.getUserInfoID()
    );
    this.maketheJsonArrayOfShowingTitle();
    this.myTaskRulesActiveCount = [
      // {
      //   name: "New Ticket Queue",
      //   type: "newTicket",
      //   checked: false,
      // },
      // {
      //   name: "Create  Quotation",
      //   type: "awaitQuotation",
      //   checked: false,
      // },
      // {
      //   name: "Service Order Generation",
      //   type: "generateNewSO",
      //   checked: false,
      // },
      // {
      //   name: "Assign Member & Site Visit Date Time",
      //   type: "expectedStartTaskDateTime",
      //   checked: false,
      // },
      // {
      //   name: "Tech Signature Required",
      //   type: "techSignatureRequired",
      //   checked: false,
      // },
      {
        name: "Incident Report Close Confirmation Required",
        type: "clientSignatureRequired",
        checked: false,
      },
      {
        name: "Closing Ticket Status (Global)",
        type: "pendingForCloseTicketProcess",
        checked: false,
      },

      {
        name: " Schedule Completion Acknowlegement Client",
        type: "pmScheduleCompletionAcknowlegementClient",
        checked: false,
      },
      // {
      //   name: "Quotation To Proceed Finance",
      //   type: "quotationToProceedFinance",
      //   checked: false,
      // },

      {
        name: "Audit Completion Acknowledgement  Client",
        type: "auditCompletionAcknowlegementClient",
        checked: false,
      },
    ];
  }

  portalArrayList = [
    {
      name: "Notification of Incident Report Verification by Client",
      checked: false,
    },
    {
      name: "Notification of Close Ticket Request",
      checked: false,
    },
    {
      name: "Notification for Schedule Maintenance Completion By Client",
      checked: false,
    },
    {
      name: "Notification for Audit Completion Acknowledgement  Client",
      checked: false,
    },
  ];
  getRoles() {
    this.userService.GetRoleList().subscribe({
      next: (res: any) => {
        const obj = {};
        res.data.forEach((i) => {
          obj[i.id] = i.name;
        });
        this.rolesList = obj;
      },
    });
  }

  getAccessGroup(id) {
    this.userService.GetAccessGroupListByAccessGroupId(id).subscribe({
      next: (res: any) => {
        const obj = {};
        res.data.forEach((i) => {
          obj[i.accessGroupMasterId] = i.name;
        });
        this.accessGroupList = obj;
      },
    });
  }

  getUserDetail(id) {
    this.userService.getUserListByUserId(id).subscribe({
      next: (res: any) => {
        const userData = res.data;
        this.userData = userData;
        this.getAccessGroup(userData.roleId);
        this.profile_img = this.userData.profileImageUrl
          ? this.imgUrl + this.userData.profileImageUrl
          : "../../../../../../assets/images/userClientPlaceholder.png";
        userData.list.forEach((i) => {
          this.getProjectByCompany(i.companyId);
        });
      },
    });
  }

  getCompanyDropDownList() {
    this.dropDownService.GetCompanyListDrobDown({}).subscribe({
      next: (res: any) => {
        const obj = {};
        res.list.forEach((i) => {
          obj[i.companyId] = i.companyName;
        });
        this.companyList = obj;
      },
    });
  }

  getProjectByCompany(companyId) {
    this.departmentService
      .getDepartmentTableList_LocalPagination({ SearchCompanyId: companyId })
      .subscribe({
        next: (res: any) => {
          const obj = {};
          res.list.forEach((i) => {
            obj[i.departmentId] = i.departmentName;
          });
          this.projectList = { ...this.projectList, ...obj };
        },
      });
  }

  goBack() {
    if (JSON.parse(localStorage.getItem("currentUser")).role != "Super Admin") {
      if (
        JSON.parse(localStorage.getItem("currentUser")).role === "Client User"
      ) {
        {
          this.router.navigate([
            "/maintenance-management/dashboard/client-dashboard",
          ]);
        }
      } else {
        this.router.navigate([
          "maintenance-management/dashboard/help-desk-dashboard",
        ]);
      }
    }
  }
  getV2_V2_EmailNotificationList(userId) {
    let payload = {
      userId: userId,
    };
    this.userService
      .getV2_V2_EmailNotificationList(payload)
      .subscribe((res: any) => {
        this.emailNotificationList = res.data;
        //console.log(" this.emailNotificationList", this.emailNotificationList);
        this.portalArrayList.forEach((ele: any) => {
          this.emailNotificationList.forEach((element) => {
            if (element.action == ele.name) {
              ele.checked = true;
            }
          });
        });
      });
  }

  checkTheEmailNotificationValue(event: any, index) {
    if (event.target.checked) {
      const stringWithSpacesReplacedCreate = event.target.value.replace(
        / /g,
        ""
      );
      this.openModalCreateConf(
        this.titleAndContentArrayCreated[stringWithSpacesReplacedCreate],
        event.target.value,
        index
      );
    } else {
      const stringWithSpacesReplacedDelete = event.target.value.replace(
        / /g,
        ""
      );
      this.openModalDeleteConf(
        this.titleAndContentArrayDelete[stringWithSpacesReplacedDelete],
        event.target.value,
        index
      );
    }
  }

  maketheJsonArrayOfShowingTitle() {
    this.titleAndContentArrayCreated.NotificationofIncidentReportVerificationbyClient =
      {
        title:
          "Are you sure you want to add this users email for portal notifications in the Notification of Incident Report Verification by Client? ",
        subTitle:
          "This means that when a Billable Service Order or Incident Report task is completed and requires technical authorization for document signing before proceeding to the client for job completion,this user will receive both email and portal notifications.",
      };
    this.titleAndContentArrayDelete.NotificationofIncidentReportVerificationbyClient =
      {
        title:
          "Are you sure you want to remove this users email for portal notifications in the Notification of Incident Report Verification by Client? ",
        subTitle:
          "This means that when a Billable Service Order or Incident Report task is completed and requires technical authorization for document signing before proceeding to the client for job completion,this user will not receive both email and portal notifications.",
      };

    this.titleAndContentArrayCreated.NotificationofCloseTicketRequest = {
      title:
        "Are you sure you want to add this users email for portal notifications in the Notification of Close Ticket Request? ",
      subTitle:
        "This means that when a Billable Service Order or Incident Report task is completed and requires technical authorization for document signing before proceeding to the client for job completion,this user will receive both email and portal notifications.",
    };
    this.titleAndContentArrayDelete.NotificationofCloseTicketRequest = {
      title:
        "Are you sure you want to remove this users email for portal notifications in the Notification of Close Ticket Request? ",
      subTitle:
        "This means that when a Billable Service Order or Incident Report task is completed and requires technical authorization for document signing before proceeding to the client for job completion,this user will not receive both email and portal notifications.",
    };

    this.titleAndContentArrayCreated.NotificationforScheduleMaintenanceCompletionByClient =
      {
        title:
          "Are you sure you want to add this users email for portal notifications in the Notification for Schedule Maintenance Completion By Admin ",
        subTitle:
          "Scheduled maintenance completion by the administrator means that upon successful execution of the maintenance tasks, the designated administrators or relevant personnel will be notified, ensuring effective communication and awareness of the completed maintenance activities.",
      };
    this.titleAndContentArrayDelete.NotificationforScheduleMaintenanceCompletionByClient =
      {
        title:
          "Are you sure you want to remove this users email for portal notifications in the Notification for Schedule Maintenance Completion By Admin ",
        subTitle:
          "When a deletion task is successfully executed by the administrator, the designated administrators or relevant personnel will be notified. This notification ensures effective communication and awareness of the completed deletion activities",
      };

    this.titleAndContentArrayCreated.NotificationforAuditCompletionAcknowlegementClient =
      {
        title:
          "Are you sure you want to add this users email for portal notifications in the Notification for Audit Completion Acknowledgement  Client? ",
        subTitle:
          "Scheduled maintenance completion by the administrator means that upon successful execution of the maintenance tasks, the designated administrators or relevant personnel will be notified, ensuring effective communication and awareness of the completed maintenance activities.",
      };
    this.titleAndContentArrayDelete.NotificationforAuditCompletionAcknowlegementClient =
      {
        title:
          "Are you sure you want to remove this users email for portal notifications in the Notification for Audit Completion Acknowledgement  Client? ",
        subTitle:
          "When a deletion task is successfully executed by the administrator, the designated administrators or relevant personnel will be notified. This notification ensures effective communication and awareness of the completed deletion activities",
      };
  }

  openModalDeleteConf(data: any, value: any, index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = data.title;
    modalRef.componentInstance.subTitle = data.subTitle;

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteV2_EmailNotification(value);
        } else {
          this.portalArrayList[index].checked = true;
        }
      }
    });
  }
  openModalCreateConf(data: any, value: any, index: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = data.title;
    modalRef.componentInstance.subTitle = data.subTitle;

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.createV2_EmailNotification(value);
        } else {
          this.portalArrayList[index].checked = false;
        }
      }
    });
  }

  deleteV2_EmailNotification(action: any) {
    let payload = {
      UserId: UserProfileService.selectedUserId,
      Action: action,
    };
    this.userService
      .deleteV2_EmailNotification(payload)
      .subscribe((res: any) => {
        this.getV2_V2_EmailNotificationList(UserProfileService.selectedUserId);
        this.success(res);
      });
  }
  createV2_EmailNotification(action: any) {
    let payload = {
      UserId: UserProfileService.selectedUserId,
      Action: action,
    };
    this.userService
      .createV2_EmailNotification(payload)
      .subscribe((res: any) => {
        this.getV2_V2_EmailNotificationList(UserProfileService.selectedUserId);
        this.success(res);
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

  getV2_MyTaskRulesActiveCountByUserId(userId) {
    let payload = {
      userId: userId,
    };
    this.userService
      .getV2_MyTaskRulesActiveCountByUserId(payload)
      .subscribe((res: any) => {
        this.myTaskRulesActiveCount.forEach((element) => {
          Object.keys(res.data).forEach((el: any) => {
            if (el == element.type) {
              element.checked = res.data[el];
            }
          });
        });
      });
  }

  changesMyTaskRulesActive(event, index) {
    this.myTaskRulesActiveCount[index].checked = event.target.checked;
    this.openModalCreateMyTask(index, event.target.checked);
  }

  openModalCreateMyTask(index: any, value) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Update My Task ";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.updateTaskRuleActive();
        } else {
          this.myTaskRulesActiveCount[index].checked = !value;
        }
      }
    });
  }

  updateTaskRuleActive() {
    let payload = {
      userId: UserProfileService.selectedUserId,
    };
    this.myTaskRulesActiveCount.forEach((element) => {
      payload[element.type] = element.checked;
    });

    this.userService.updateV2_MX_MyTaskRights(payload).subscribe((res: any) => {
      this.getV2_MyTaskRulesActiveCountByUserId(
        UserProfileService.selectedUserId
      );
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
  isFirstImageVisible: boolean;
  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data imageUrl
      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.profile_img = event.target.result;

        this.openModalUpdateConfimage();
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

  openModalDeleteConfimage(urk) {
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
  openModalUpdateConfimage() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You are about to upadate a Profile Image?";
    modalRef.componentInstance.subTitle =
      "Modifying your profile image will result in the updated image replacing the existing one in the database";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          if (this.profile_img) {
            this.isFirstImageVisible = true;
          }
          this.saveImage();
        } else {
          this.profile_img =
            "../../../../../../assets/images/userClientPlaceholder.png";
          this.isFirstImageVisible = false;
          this.resetFileInput();
        }
      }
    });
  }
}
