import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccessGroupService } from "src/app/core/services/access-group.service";
import { LocalStoreService } from "src/app/core/services/local-store.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { RoleService } from "src/app/core/services/role.service";
import { UserProfileService } from "src/app/core/services/user.service";
import Swal from "sweetalert2";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
interface Task {
  sendtokeys: string;
  name: string;
  value: boolean;
  remark:string
}

interface ObjectMakerToViewAccessRight {
  [key: string]: Task[];
}
@Component({
  selector: "app-access-group-list",
  templateUrl: "./access-group-list.component.html",
  styleUrls: ["./access-group-list.component.scss"],
})
export class AccessGroupListComponent implements OnInit {
  isTableView: boolean;
  loadingTableData: boolean;
  roleDisable: boolean;
  accessGroupData: any[] = [];
  accessGroupList: any[] = [];
  totalRecords: number = 0;
  collectionSize: number = 0;
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  label: any = "Access Groups";
  breadCrumbItems: any = [
    { label: "User Management" },
    { label: "Access Groups", active: true },
  ];

  accessGroupForm: FormGroup;
  editMode = {
    isEdit: false,
    data: {},
  };

  roleList: any[] = [];

  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  trueAccessRights: any = {};
  falseAccessRights: any = {};
  shownUnDisable: boolean = true;

  constructor(
    private accessGroupService: AccessGroupService,
    private modalService: NgbModal,
    private router: Router,
    private localStorage: LocalStoreService,
    //private modalService: NgbModal,
    public roleService: RoleService,
    private formBuilder: FormBuilder,
    private userService: UserProfileService,
    private menuService: MenuServiceService,
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);

    this.roleDisable = true;
    this.loadingTableData = false;
    this.isTableView = false;
  }

  ngOnInit(): void {
    this.getAccessGroupDetails();
  
    this.getRoles();
  }

  getAccessGroupDetails() {
    this.loadingTableData = true;
    this.accessGroupService.getAccessGroupList().subscribe(
      (res: any) => {
        this.accessGroupData = res.data;
        this.accessGroupList = res.data;
        this.totalRecords = this.accessGroupData.length;
        this.isTableView = true;
        this.collectionSize = this.accessGroupData.length;
        this.getAccessGroupData();
        this.loadingTableData = false;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  buildForm() {
    this.accessGroupForm = this.formBuilder.group({
      name: ["", Validators.required],
      roleId: [null, Validators.required],
    });
  }

  get name() {
    return this.accessGroupForm.get("name");
  }
  get roleId() {
    return this.accessGroupForm.get("roleId");
  }

  openModalCreateAccess(modal, event) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Add Access Group ";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.save(modal, event);
        } else {
          this.goBack();
        }
      }
    });
  }

  save(modal, event) {
    modal.dismiss("Ok");
    let requestData = {
      RoleId: this.roleId.value,
      Name: this.name.value,
      projectAccessright: {
        ...this.trueAccessRights,
        ...this.falseAccessRights
      }
    };
    
    this.accessGroupService.postCreateAccessGroup(requestData).subscribe(
      (res: any) => {
        this.accessGroupForm.reset();
        this.getAccessGroupDetails();
      },
      (error) => {
        this.error(error);
        this.accessGroupForm.reset();
        this.getAccessGroupDetails();
      }
    );
  }
  error(err) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  goBack() {
    this.router.navigate([
      "/application-settings/access-group/access-group-list",
    ]);
  }

  openAccessGroupFormModal(modal) {
    this.initializationTheObjectProjectAccessRight();
    this.buildForm();
    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
        size: 'xl',
        scrollable: true
      })
      .result.then(
        (result) => {
          this.getAccessGroupDetails();
        },
        (reason) => { }
      );
  }

  getAccessGroupData() {
    this.accessGroupData = this.accessGroupList.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.to =
      this.page * this.pageSize > this.accessGroupList.length
        ? this.accessGroupList.length
        : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1); // (this.page * this.pageSize) > this.accessGroupList.length ? this.to - ((this.page * this.pageSize) - this.accessGroupList.length) : this.to - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.accessGroupList.length == 0 ? 0 : this.from;
    //console.log("accessGroupList", this.accessGroupList);
  }

  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    this.accessGroupService
      .postDeleteAccessGroup({
        AccessGroupMasterId: id,
      })
      .subscribe((res: any) => {
        if (res?.code == "200") {
          // this.success(res);
          this.getAccessGroupDetails();
        }
      });
  }

  goToNavigation(access: any) {
    this.localStorage.setItem("access-group-data", JSON.stringify(access));
    this.router.navigate([
      "/application-settings/access-group/access-group-edit",
    ]);
  }
  goToAdd() {
    this.router.navigate([
      "/application-settings/access-group/access-group-add",
    ]);
  }

  getRoles() {
    this.userService.getRoleListForAccessGroupCreation().subscribe({
      next: (res: any) => {
        this.roleList = res.data;
      },
    });
  }
  // getRoles() {
  //   this.userService.GetRoleList().subscribe({
  //     next: (res: any) => {
  //       this.createTimeRoleList = res.data;
  //     },
  //   });
  // }

  selectedroleId: any;
  searchTerm: any;

  getRoledetails() {
    //console.log("selectedroleId", this.selectedroleId);
    this.page = 1;
    if (this.selectedroleId) {
      const value = this.selectedroleId;
      this.accessGroupData = this.accessGroupList.filter((i) =>
        i.roleId?.toLowerCase().includes(value?.toLowerCase() || "")
      );
      this.collectionSize = this.accessGroupData.length;
      this.totalRecords = this.accessGroupData.length;
      this.to =
        this.page * this.pageSize > this.accessGroupData.length
          ? this.accessGroupData.length
          : this.page * this.pageSize;
      let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
      this.from = fromvalue < 1 ? 1 : fromvalue;
      this.from = this.accessGroupData.length == 0 ? 0 : this.from;
    } else {
      this.getAccessGroupDetails();
    }
  }

  searchFilter() {
    this.page = 1;
    if (this.searchTerm) {
      const value = this.searchTerm;
      this.accessGroupData = this.accessGroupList.filter((i) =>
        i.name?.toLowerCase().includes(value?.toLowerCase() || "")
      );
      this.collectionSize = this.accessGroupData.length;
      this.totalRecords = this.accessGroupData.length;
      this.to =
        this.page * this.pageSize > this.accessGroupData.length
          ? this.accessGroupData.length
          : this.page * this.pageSize;
      let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
      this.from = fromvalue < 1 ? 1 : fromvalue;
      this.from = this.accessGroupData.length == 0 ? 0 : this.from;
    } else {
      this.getAccessGroupDetails();
    }
  }

  clearAllPayload() {
    this.page = 1;
    this.searchTerm = null;
    this.selectedroleId = null;
    this.getAccessGroupData();
  }



  groupOrder = [
    'Project Administration Procedure',
    'Project Team Tab Access',
    'Project Document Submission Tab Access',
    'Maintenance Team Tab Access',
    'Warranty Tab Access',
    'Maintenance Agreement Tab Access',
    'Asset Tab Access'
  ];


  objectMakerToViewAccessRight: ObjectMakerToViewAccessRight ;

  changesMyTaskRulesActive(event, groupName, index) {
    this.objectMakerToViewAccessRight[groupName][index].value = event.target.checked;
    // console.log("  this.objectMakerToViewAccessRight",  this.objectMakerToViewAccessRight)
    this.trueAccessRights = {};
    this.falseAccessRights = {};

    for (const group in this.objectMakerToViewAccessRight) {
      this.objectMakerToViewAccessRight[group].forEach((item) => {
        if (item.value) {
          this.trueAccessRights[item.sendtokeys.trim()] = true;
        } else {
          this.falseAccessRights[item.sendtokeys.trim()] = false;
        }
      });
    }
    this.shownUnDisable = this.returnSelectionValue()
  }
  initializationTheObjectProjectAccessRight() {
    this.objectMakerToViewAccessRight = {
      "Project Administration Procedure": [
        {
          "sendtokeys": "ProjectDefaultProjectStartConfirmation",
          "name": "Project start",
          "value": false,
          "remark": "Once project awarded, By giving this access the authorised member can start the project, by classifying whether this project should be under the 'Ad-hoc Project' category or the 'Maintenance Project' category."
        },
        {
          "sendtokeys": "ProjectDefaultAwardConfirmation",
          "name": "Project Awarded",
          "value": false,
          "remark": "Once the project has been created and is awaiting the award process. By giving this access the authorised member can award the project and proceed with the Maintenance Agreement."
        }
      ],
  
      "Project Team Tab Access": [
        {
          "sendtokeys": "Project_Tab_View",
          "name": "View Project Team Tab Access",
          "value": false,
          "remark":''
        },
        {
          "sendtokeys": "PM_InternalUser_Tab_View",
          "name": "Internal Member Tab Access",
          "value": false,
          "remark": "Access to view the assigned Internal Member"
        },
        {
          "sendtokeys": "PM_InternalUser_SelectMember",
          "name": "Assign Internal Member Access",
          "value": false,
          "remark": "Access to assign the new Internal Member"
        },
        {
          "sendtokeys": "PM_InternalUser_CreateProfile",
          "name": "Create Internal Member profile",
          "value": false,
          "remark": "By giving this access, able to create new Internal member profile"
        },
        {
          "sendtokeys": "PM_ExternalUser_Tab_View",
          "name": "External Member Tab Access",
          "value": false,
          "remark": "Access to view the assigned External Member"
        },
        {
          "sendtokeys": "PM_ExternalUser_SelectMember",
          "name": "Assign External Member Access",
          "value": false,
          "remark": "Access to assign the new External Member"
        },
        {
          "sendtokeys": "PM_ExternalUser_CreateProfile",
          "name": "Create External Member profile",
          "value": false,
          "remark": "By giving this access, able to create new External member profile"
        },
        {
          "sendtokeys": "DocumentSubmission_SelectMember",
          "name": "Assign Member for documentation",
          "value": false,
          "remark": "Give the authority to the member who can submit the document for project process required."
        },
        {
          "sendtokeys": "Warrenty_InternalUser_Tab_View",
          "name": "Warranty Internal Member Tab Access",
          "value": false,
          "remark": "Able to view the internal member for warranty process"
        },
        {
          "sendtokeys": "Warrenty_InternalUser_SelectMember",
          "name": "Warranty-Assign internal Member",
          "value": false,
          "remark": "Can assign the internal member in warranty document process"
        },
        {
          "sendtokeys": "Warrenty_ExternalUser_Tab_View",
          "name": "Warranty External Member Tab Access",
          "value": false,
          "remark": "Able to view the external member for warranty process"
        },
        {
          "sendtokeys": "Warrenty_ExternalUser_SelectMember",
          "name": "Warranty-Assign External Member",
          "value": false,
          "remark": "Can assign the External member in warranty document process"
        },
        
      ],
  
      "Project Document Submission Tab Access": [
        {
          "sendtokeys": "DocumentSubmission_Tab_View",
          "name": "Document Submission Tab view Access",
          "value": false,
          "remark": "Able to view the document submission process related to the particular project"
        },
        {
          "sendtokeys": "DocumentSubmission_Tab_Add",
          "name": "Document Add Access",
          "value": false,
          "remark": "Able to upload the document into the document submission process"
        },
        {
          "sendtokeys": "DocumentSubmission_CompleteConfirmation",
          "name": "Submitted Document Complete Access",
          "value": false,
          "remark": "Having access to complete the uploaded document in the project process"
        }
      ],
  
      "Maintenance Team Tab Access": [
        {
          "sendtokeys": "Maintenance_Tab_View",
          "name": "Maintenance Tab View",
          "value": false,
          "remark":""
        },
        {
          "sendtokeys": "Maintenance_InternalUser_Tab_View",
          "name": "Maintenance Internal Member Tab Access",
          "value": false,
          "remark": "Able to view the assigned internal member to the maintenance process"
        },
        {
          "sendtokeys": "Maintenance_InternalUser_SelectMember",
          "name": "Maintenance Internal Member Select Member",
          "value": false,
          "remark": "Able to assign internal member to the maintenance process"
        },
        {
          "sendtokeys": "Maintenance_InternalUser_CreateProfile",
          "name": "Maintenance Internal Member Create Profile",
          "value": false,
          "remark": "Able to create the internal member profile for the maintenance process"
        },
        {
          "sendtokeys": "Maintenance_ExternalUser_Tab_View",
          "name": "Maintenance External Member Tab Access",
          "value": false,
          "remark": "Able to view the assigned External member to the maintenance process"
        },
        {
          "sendtokeys": "Maintenance_ExternalUser_SelectMember",
          "name": "Maintenance External Member Select Member",
          "value": false,
          "remark": "Able to assign External member to the maintenance process"
        },
        {
          "sendtokeys": "Maintenance_ExternalUser_CreateProfile",
          "name": "Create External Member profile",
          "value": false,
          "remark": "Able to create the External member profile for the maintenance process"
        }
      ],
  
      "Warranty Tab Access": [
        {
          "sendtokeys": "Warrenty_Tab_View",
          "name": "Warranty Tab Access",
          "value": false,
          "remark": "Able to Access"
        },
        {
          "sendtokeys": "Warrenty_Add",
          "name": "Add warranty agreement",
          "value": false,
          "remark": "Having access to upload the warranty Documents"
        },
        {
          "sendtokeys": "Warrenty_Cancelled",
          "name": "Cancelled warranty Document",
          "value": false,
          "remark": "Having access to cancel the uploaded warranty document"
        }
      ],
  
      "Maintenance Agreement Tab Access": [
        {
          "sendtokeys": "MaintenanceAgreement_Tab_View",
          "name": "Maintenance Agreement Tab Access",
          "value": false,
          "remark": "Vision the external member assigned to the maintenance agreement process"
        },
        {
          "sendtokeys": "MaintenanceAgreement_InternalUser_View",
          "name": "Internal Member Tab Access",
          "value": false,
          "remark": "Vision the internal member assigned to the maintenance agreement process"
        },
        {
          "sendtokeys": "MaintenanceAgreement_InternalUser_SelectMember",
          "name": "Assign Internal Member",
          "value": false,
          "remark": "Having access to assign internal member into the maintenance agreement process"
        },
        {
          "sendtokeys": "MaintenanceAgreement_ExternalUser_View",
          "name": "External Member Tab Access",
          "value": false,
          "remark": "Vision the External member assigned to the maintenance agreement process"
        },
        {
          "sendtokeys": "MaintenanceAgreement_ExternalUser_SelectMember",
          "name": "Assign External Member Access",
          "value": false,
          "remark": "Having access to assign External member into the maintenance agreement process"
        },
      
        {
          "sendtokeys": "MaintenanceAgreement_Add",
          "name": "Upload Maintenance Agreement Access",
          "value": false,
          "remark": "Able to upload the Maintenance agreement"
        },
        {
          "sendtokeys": "MaintenanceAgreement_Cancelled",
          "name": "Cancelled Maintenance Agreement Access",
          "value": false,
          "remark": "Able to cancel the uploaded Maintenance agreement"
        }
      ],
  
      "Asset Tab Access": [
        {
          "sendtokeys": "Asset_Tab_View",
          "name": "Asset Tab Access",
          "value": false,
          "remark": "Vision the Asset tab member"
        },
        {
          "sendtokeys": "Asset_InternalUser_Tab_View",
          "name": "Internal Member Tab Access",
          "value": false,
          "remark": "Having access to view internal member in the Asset Team"
        },
        {
          "sendtokeys": "Asset_InternalUser_SelectMember",
          "name": "Assign Internal Member",
          "value": false,
          "remark": "Having access to assign internal member into the Asset Team"
        },
        {
          "sendtokeys": "Asset_InternalUser_CreateProfile",
          "name": "Create Internal Member profile",
          "value": false,
          "remark": "Having access to create new profile for internal member in the Asset Team"
        },
        {
          "sendtokeys": "Asset_ExternalUser_Tab_View",
          "name": "External Member Tab Access",
          "value": false,
          "remark": "Having access to view external member in the Asset Team"
        },
        {
          "sendtokeys": "Asset_ExternalUser_SelectMember",
          "name": "Assign External Member Access",
          "value": false,
          "remark": "Having access to assign external member into the Asset Team"
        },
        {
          "sendtokeys": "Asset_ExternalUser_CreateProfile",
          "name": "Create External Member profile",
          "value": false,
          "remark": "Having access to create new profile for external member in the Asset Team"
        }
      ]
    }
  }
  
  returnSelectionValue() {
    const trueAccessRightsCount = Object.keys(this.trueAccessRights).length;
    console.log(trueAccessRightsCount, "Object.keys(this.trueAccessRights).length");
    return trueAccessRightsCount !== 0 ? false : true;
  }

}
