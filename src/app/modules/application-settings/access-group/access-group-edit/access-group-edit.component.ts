import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccessGroupService } from 'src/app/core/services/access-group.service';
import { LocalStoreService } from "src/app/core/services/local-store.service";
import { RoleService } from 'src/app/core/services/role.service';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import Swal from "sweetalert2";
interface Task {
  sendtokeys: string;
  name: string;
  value: boolean;
  remark: string
}

interface ObjectMakerToViewAccessRight {
  [key: string]: Task[];
}

@Component({
  selector: 'app-access-group-edit',
  templateUrl: './access-group-edit.component.html',
  styleUrls: ['./access-group-edit.component.scss']
})
export class AccessGroupEditComponent implements OnInit {
  label: any = "Access Group";
  activeIdTop: number = 1
  breadCrumbItems: any = [
    { label: "Access Group" },
    { label: "Access Group Edit", active: true },
  ];
  masterAccessList: any[] = [];
  masterAccessValue: any;
  selectMasterAccess: any;
  menuSubMenuList: any[] = []
  accessGroupData: any;

  successMessageVisible: boolean = false;
  projectManagementDepartmentUserAccessObje: any
  constructor(
    private accessGroupService: AccessGroupService,
    private localStorage: LocalStoreService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.accessGroupData = JSON.parse(this.localStorage.getItem('access-group-data'));
  }

  ngOnInit(): void {

    this.getMasterAccessList();
    this.get_V3_ProjectManagementDepartmentUserAccess();

  }


  get_V3_ProjectManagementDepartmentUserAccess() {
    this.initializationTheObjectProjectAccessRight();
    let payload = {
      "AccessGroupId": this.accessGroupData.accessGroupMasterId
    }
    this.accessGroupService.get_V3_ProjectManagementDepartmentUserAccess(payload).subscribe(
      (res: any) => {
        this.projectManagementDepartmentUserAccessObje = res.obj;
        this.bindAccessRights()
      },
      (err) => {
        //console.log('err', err);
      }
    )
  }
  getMasterAccessList(): void {
    this.accessGroupService.getProductList().subscribe(
      (res: any) => {
        this.masterAccessList = res.data;
        this.selectMasterAccess = this.masterAccessList[0].masterApplicationName;
        this.changeMasterAccessHandler();
      },
      (err) => {
        //console.log('err', err);
      }
    )
  }

  changeMasterAccessHandler() {
    //console.log('selectMasterAccess', this.selectMasterAccess)
    //console.log('this.accessGroupData', this.accessGroupData);
    this.getMenuSubMenu();
    ////console.log(JSON.parse(this.localStorage.getItem('access-group-data-name')));
  }

  getMenuSubMenu() {
    this.accessGroupService.getMenuSubMenu(this.accessGroupData.accessGroupMasterId, this.selectMasterAccess).subscribe(
      (res: any) => {
        this.menuSubMenuList = res.data;
        //this.updatelodings = false;

        //console.log("menuSubMenuList->", this.menuSubMenuList);
      },
      (err) => {
        //this.updatelodings = false;
        //console.log(err)
      }
    );
  }
  updateCheckboxValue(i: any, j: any, name: string, event: any) {
    let index = 0;
    event = event.target.checked;
    //console.log("i", i, "j", j, "value=", event);
    let typename = name;
    this.menuSubMenuList.forEach((ele, index1) => {
      if (index1 == i && j == 0) {
        switch (typename) {
          case "Access-i":
            ele.access = event;
            if (!event) {
              ele.add = event;
              ele.edit = event;
              ele.delete = event;
              ele.reportView = event;
              ele.reportPrint = event;
              ele.subMenuList.forEach((subEle) => {
                subEle.access = event;
                subEle.add = event;
                subEle.edit = event;
                subEle.delete = event;
                subEle.reportView = event;
                subEle.reportPrint = event;
              });
            }
            break;
          case "Add-i":
            ele.add = event;
            break;
          case "Edit-i":
            ele.edit = event;
            break;
          case "Delete-i":
            ele.delete = event;
            break;
          case "ReportView-i":
            ele.reportView = event;
            break;
          case "ReportPrint-i":
            ele.reportPrint = event;
            break;
          default:
            //console.log("No such  exists!");
            break;
        }
      }
      ele.subMenuList.forEach((ele2, index2) => {
        if (index1 == i && index2 == j) {
          switch (typename) {
            case "Access":
              ele2.access = event;
              if (!event) {
                ele2.add = event;
                ele2.edit = event;
                ele2.delete = event;
                ele2.reportView = event;
                ele2.reportPrint = event;
              }
              break;
            case "Add":
              ele2.add = event;
              break;
            case "Edit":
              ele2.edit = event;
              break;
            case "Delete":
              ele2.delete = event;
              break;
            case "ReportView":
              ele2.reportView = event;
              break;
            case "ReportPrint":
              ele2.reportPrint = event;
              break;
            default:
              //console.log("No such  exists!");
              break;
          }
        }
      });
    });
    //console.log("this.menuSubMenuList", this.menuSubMenuList);
  }


  openSuccessMessage() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Access Group Updated Successfully!";
    modalRef.componentInstance.subTitle = "Do you want to stay?";
    modalRef.componentInstance.CancelName = 'No',
      modalRef.componentInstance.buttonName = '',

      modalRef.result.then((result) => {
        if (result) {
          if (result == "success") {
            this.closeSuccess();
          } else {
            this.goBack();
          }
        }
      });
  }
  submitUpdateMenuSubMenu() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Update Access Group";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addACeesGroupSucessModal();
        } else {
          // this.onBack();
        }
      }
    });
  }

  addACeesGroupSucessModal() {
    let requestData = this.menuSubMenuList;
    this.accessGroupService.postUpdateMenuSubMenu(requestData).subscribe(
      (res: any) => {
        this.openSuccessMessage()

        // popup, do u want to say or go back list
        //this.goBack();
      }, (err) => {
        //console.log("error", err);
        // this.error(err);
      });
  }

  closeSuccess() {

  }

  goBack() {
    this.router.navigate(['/application-settings/access-group/access-group-list']);
  }

  openConfirmPopup(content): void {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true, backdrop: 'static',
      keyboard: false,
    }).result.then((result) => {
      if (result === 'No') {
        this.goBack();
      }
    }, (reason) => {

    });
  }

  objectMakerToViewAccessRight: ObjectMakerToViewAccessRight;
  trueAccessRights: any = {};
  falseAccessRights: any = {};
  shownUnDisable: boolean = true;
  groupOrder = [
    'Project Administration Procedure',
    'Project Team Tab Access',
    'Project Document Submission Tab Access',
    'Maintenance Team Tab Access ',
    'Warranty Tab Access',
    'Maintenance Agreement Tab Access',
    'Asset Tab Access',
    'Workflow Tab Access',
    'Project Schedule Tab Access'
  ];

  changesMyTaskRulesActive(event: any, groupName: string, index: number) {
    const task = this.objectMakerToViewAccessRight[groupName][index];
    task.value = event.target.checked;
  
    if (!task.value) {
      this.uncheckDependentValues(task, groupName);
    }
  
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
  console.log("this.trueAccessRights",this.trueAccessRights,this.falseAccessRights,"this.falseAccessRights")
    this.shownUnDisable = this.returnSelectionValue();
  }
  
  uncheckDependentValues(task: any, groupName: string) {
    const accessRights = this.objectMakerToViewAccessRight[groupName];
  
    if (task.sendtokeys === 'Project_Tab_View') {
      this.uncheckTasks([
        'PM_InternalUser_Tab_View',
        'PM_InternalUser_SelectMember',
        'PM_InternalUser_CreateProfile',
        'PM_ExternalUser_Tab_View',
        'PM_ExternalUser_SelectMember',
        'PM_ExternalUser_CreateProfile',
        'Warrenty_InternalUser_Tab_View',
        'Warrenty_InternalUser_SelectMember',
        'Warrenty_ExternalUser_Tab_View',
        'Warrenty_ExternalUser_SelectMember',
        'DocumentSubmission_SelectMember'
      ], accessRights);
    }
  
    if (task.sendtokeys === 'PM_InternalUser_Tab_View') {
      this.uncheckTasks([
        'PM_InternalUser_SelectMember',
        'PM_InternalUser_CreateProfile'
      ], accessRights);
    }
  
    if (task.sendtokeys === 'PM_ExternalUser_Tab_View') {
      this.uncheckTasks([
        'PM_ExternalUser_SelectMember',
        'PM_ExternalUser_CreateProfile'
      ], accessRights);
    }
  
    if (task.sendtokeys === 'Warrenty_InternalUser_Tab_View') {
      this.uncheckTasks([
        'Warrenty_InternalUser_SelectMember',
        'Warrenty_ExternalUser_Tab_View',
      ], accessRights);
    }
  
    if (task.sendtokeys === 'Warrenty_ExternalUser_Tab_View') {
      this.uncheckTasks([
        'Warrenty_ExternalUser_SelectMember'
      ], accessRights);
    }

    if (task.sendtokeys === 'DocumentSubmission_Tab_View') {
      this.uncheckTasks([
        'DocumentSubmission_Tab_Add',
        'DocumentSubmission_CompleteConfirmation'
      ], accessRights);
    }


    // Uncheck and disable dependent checkboxes for "Maintenance Tab View"
  if (task.sendtokeys === 'Maintenance_Tab_View') {
    this.uncheckTasks([
      'Maintenance_InternalUser_Tab_View',
      'Maintenance_ExternalUser_Tab_View',
      'Maintenance_InternalUser_SelectMember',
      'Maintenance_InternalUser_CreateProfile',
      'Maintenance_ExternalUser_SelectMember',
      'Maintenance_ExternalUser_CreateProfile'
    ], accessRights);
  }

  // Uncheck and disable dependent checkboxes for "Maintenance Internal Member Tab Access"
  if (task.sendtokeys === 'Maintenance_InternalUser_Tab_View') {
    this.uncheckTasks([
      'Maintenance_InternalUser_SelectMember',
      'Maintenance_InternalUser_CreateProfile'
    ], accessRights);
  }

  // Uncheck and disable dependent checkboxes for "Maintenance External Member Tab Access"
  if (task.sendtokeys === 'Maintenance_ExternalUser_Tab_View') {
    this.uncheckTasks([
      'Maintenance_ExternalUser_SelectMember',
      'Maintenance_ExternalUser_CreateProfile'
    ], accessRights);
  }


   // Warranty Tab Access dependencies
   if (task.sendtokeys === 'Warrenty_Tab_View') {
    this.uncheckTasks([
      'Warrenty_Add',
      'Warrenty_Cancelled'
    ], accessRights);
  }

  // Workflow Tab Access dependencies
  if (task.sendtokeys === 'workflow_Tab_View') {
    this.uncheckTasks([
      'workflow_Modification'
    ], accessRights);
  }

  // Project Schedule Tab Access dependencies
  if (task.sendtokeys === 'projectSchedule_Tab_View') {
    this.uncheckTasks([
      'projectSchedule_Add',
      'projectSchedule_Delete'
    ], accessRights);
  }

  if (task.sendtokeys === 'Asset_Tab_View') {
    this.uncheckTasks([
      'Asset_InternalUser_Tab_View',
      'Asset_ExternalUser_Tab_View',
      'Asset_InternalUser_SelectMember',
      'Asset_InternalUser_CreateProfile',
      'Asset_ExternalUser_SelectMember',
      'Asset_ExternalUser_CreateProfile'
    ], accessRights);
  }

  // Internal Member Tab Access dependencies
  if (task.sendtokeys === 'Asset_InternalUser_Tab_View') {
    this.uncheckTasks([
      'Asset_InternalUser_SelectMember',
      'Asset_InternalUser_CreateProfile'
    ], accessRights);
  }

  // External Member Tab Access dependencies
  if (task.sendtokeys === 'Asset_ExternalUser_Tab_View') {
    this.uncheckTasks([
      'Asset_ExternalUser_SelectMember',
      'Asset_ExternalUser_CreateProfile'
    ], accessRights);
  }

  if (task.sendtokeys === 'MaintenanceAgreement_Tab_View') {
    this.uncheckTasks([
      'MaintenanceAgreement_InternalUser_View',
      'MaintenanceAgreement_ExternalUser_View',
      'MaintenanceAgreement_InternalUser_SelectMember',
      'MaintenanceAgreement_ExternalUser_SelectMember',
      'MaintenanceAgreement_Add',
      'MaintenanceAgreement_Cancelled'
    ], accessRights);
  }

  // Internal Member Tab Access dependencies
  if (task.sendtokeys === 'MaintenanceAgreement_InternalUser_View') {
    this.uncheckTasks([
      'MaintenanceAgreement_InternalUser_SelectMember'
    ], accessRights);
  }

  // External Member Tab Access dependencies
  if (task.sendtokeys === 'MaintenanceAgreement_ExternalUser_View') {
    this.uncheckTasks([
      'MaintenanceAgreement_ExternalUser_SelectMember'
    ], accessRights);
  }

  

  // Internal Member Tab Access dependencies
  if (task.sendtokeys === 'ProjectDefaultAwardConfirmation') {
    this.uncheckTasks([
      'ProjectDefaultProjectStartConfirmation'
    ], accessRights);
  }

  
  }
  
  
  uncheckTasks(taskKeys: string[], accessRights: any[]) {
    taskKeys.forEach(key => {
      const dependentTask = accessRights.find(t => t.sendtokeys === key);
      if (dependentTask) {
        dependentTask.value = false; // Uncheck the dependent task
      }
    });
  }
  
  initializationTheObjectProjectAccessRight() {
    this.objectMakerToViewAccessRight = {
      "Project Administration Procedure": [
      
        {
          "sendtokeys": "ProjectDefaultAwardConfirmation",
          "name": "Project Awarded",
          "value": false,
          "remark": "Once the project has been created and is awaiting the award process. By giving this access the authorised member can award the project and proceed with the Maintenance Agreement."
        },
        {
          "sendtokeys": "ProjectDefaultProjectStartConfirmation",
          "name": "Project start",
          "value": false,
          "remark": "Once project awarded, By giving this access the authorised member can start the project, by classifying whether this project should be under the 'Ad-hoc Project' category or the 'Maintenance Project' category."
        }
      ],

      "Project Team Tab Access": [
        {
          "sendtokeys": "Project_Tab_View",
          "name": "View Project Team Tab Access",
          "value": false,
          "remark": ''
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

      "Maintenance Team Tab Access ": [
        {
          "sendtokeys": "Maintenance_Tab_View",
          "name": "Maintenance Tab View",
          "value": false,
          "remark": ""
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
        },

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
      ],
      

      "Workflow Tab Access": [
        {
          "sendtokeys": "workflow_Tab_View",
          "name": "Workflow Tab View",
          "value": false,
          "remark": "By granting this access, we authorize the user to confirm new assets, verify billing eligibility internally, validate general quotations within the internal process, and handle the client-approval-required quotations process"
        },
        {
          "sendtokeys": "workflow_Modification",
          "name": "Workflow Modification",
          "value": false,
          "remark": "By granting this access, we authorize the user to update the new assets, verify billing eligibility internally, validate general quotations within the internal process, and handle the client-approval-required quotations process"
        },
      ],

      "Project Schedule Tab Access":[
        {
          "sendtokeys": "projectSchedule_Tab_View",
          "name": "Project Schedule Tab View",
          "value": false,
          "remark": "The user can access the scheduling process, including  schedules, main tasks, and subtasks."
        },{
          "sendtokeys": "projectSchedule_Add",
          "name": "Project Schedule Add",
          "value": false,
          "remark": "The user can access the scheduling process, including adding schedules, main tasks, and subtasks"
        },{
          "sendtokeys": "projectSchedule_Delete",
          "name": "Project Schedule Delete ",
          "value": false,
          "remark": "The user can access the scheduling process, including delete schedules, main tasks, and subtasks."
        },
      ]
    }
    this.updateTrueFalseAccessRights()
  }
  updateTrueFalseAccessRights() {
    this.trueAccessRights = {};
    this.falseAccessRights = {};

    for (const group in this.objectMakerToViewAccessRight) {
      this.objectMakerToViewAccessRight[group].forEach(item => {
        if (item.value) {
          this.trueAccessRights[item.sendtokeys.trim()] = true;
        } else {
          this.falseAccessRights[item.sendtokeys.trim()] = false;
        }
      });
    }
    this.shownUnDisable = this.returnSelectionValue();
  }

  returnSelectionValue() {
    const trueAccessRightsCount = Object.keys(this.trueAccessRights).length;
    console.log(trueAccessRightsCount, "Object.keys(this.trueAccessRights).length");
    return trueAccessRightsCount !== 0 ? false : true;
  }


  bindAccessRights() {
    for (const key in this.projectManagementDepartmentUserAccessObje) {
      if (this.projectManagementDepartmentUserAccessObje[key] === true) {
        for (const category in this.objectMakerToViewAccessRight) {
          this.objectMakerToViewAccessRight[category].forEach(item => {
            if (item.sendtokeys.toLowerCase() === key.toLowerCase()) {
              item.value = true;
            }
          });
        }
      }

    }
    this.updateTrueFalseAccessRights()

  }

  updateProjectAccess() {

    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to update  Project Permission levels ";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.Update_V3_AccessGroupMasterProjectSetup();
        }
      }
    });
  }

  Update_V3_AccessGroupMasterProjectSetup() {

    let requestData = {
      DefaultProjectSetupId: this.projectManagementDepartmentUserAccessObje.defaultProjectSetupId,
      ...this.trueAccessRights,
      ...this.falseAccessRights

    };

    this.accessGroupService.Update_V3_AccessGroupMasterProjectSetup(requestData).subscribe(
      (res: any) => {
        this.success(res)
        this.get_V3_ProjectManagementDepartmentUserAccess();
      },
      (error) => {
        this.error(error);
        this.get_V3_ProjectManagementDepartmentUserAccess();
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
  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 2000,
    });
  }
  isDisabled(task: any, group: any): boolean {
    const accessRights = this.objectMakerToViewAccessRight[group];
  
    if (task.sendtokeys === 'PM_InternalUser_Tab_View' || task.sendtokeys === 'PM_ExternalUser_Tab_View' || task.sendtokeys === 'Warrenty_InternalUser_Tab_View' || task.sendtokeys === 'Warrenty_ExternalUser_Tab_View' || task.sendtokeys === 'DocumentSubmission_SelectMember') {
      return !accessRights.find(t => t.sendtokeys === 'Project_Tab_View')?.value;
    }
  
    if (task.sendtokeys === 'PM_InternalUser_SelectMember' || task.sendtokeys === 'PM_InternalUser_CreateProfile') {
      return !accessRights.find(t => t.sendtokeys === 'PM_InternalUser_Tab_View')?.value;
    }
  
    if (task.sendtokeys === 'PM_ExternalUser_SelectMember' || task.sendtokeys === 'PM_ExternalUser_CreateProfile') {
      return !accessRights.find(t => t.sendtokeys === 'PM_ExternalUser_Tab_View')?.value;
    }
  
    if (task.sendtokeys === 'Warrenty_InternalUser_SelectMember') {
      return !accessRights.find(t => t.sendtokeys === 'Warrenty_InternalUser_Tab_View')?.value;
    }
  
    if (task.sendtokeys === 'Warrenty_ExternalUser_SelectMember') {
      return !accessRights.find(t => t.sendtokeys === 'Warrenty_ExternalUser_Tab_View')?.value;
    }
  
     // New logic for Document Submission Tab
  if (task.sendtokeys === 'DocumentSubmission_Tab_Add' || task.sendtokeys === 'DocumentSubmission_CompleteConfirmation') {
    return !accessRights.find(t => t.sendtokeys === 'DocumentSubmission_Tab_View')?.value;
  }


  if (task.sendtokeys === 'Maintenance_InternalUser_Tab_View' || task.sendtokeys === 'Maintenance_ExternalUser_Tab_View') {
    return !accessRights.find(t => t.sendtokeys === 'Maintenance_Tab_View')?.value;
  }

  if (task.sendtokeys === 'Maintenance_InternalUser_SelectMember' || task.sendtokeys === 'Maintenance_InternalUser_CreateProfile') {
    return !accessRights.find(t => t.sendtokeys === 'Maintenance_InternalUser_Tab_View')?.value;
  }

  if (task.sendtokeys === 'Maintenance_ExternalUser_SelectMember' || task.sendtokeys === 'Maintenance_ExternalUser_CreateProfile') {
    return !accessRights.find(t => t.sendtokeys === 'Maintenance_ExternalUser_Tab_View')?.value;
  }

  // Existing logic for other dependencies...
  if (task.sendtokeys === 'PM_InternalUser_Tab_View' || task.sendtokeys === 'PM_ExternalUser_Tab_View' || task.sendtokeys === 'Warrenty_InternalUser_Tab_View' || task.sendtokeys === 'Warrenty_ExternalUser_Tab_View' || task.sendtokeys === 'DocumentSubmission_SelectMember') {
    return !accessRights.find(t => t.sendtokeys === 'Project_Tab_View')?.value;
  }

  if (task.sendtokeys === 'DocumentSubmission_Tab_Add' || task.sendtokeys === 'DocumentSubmission_CompleteConfirmation') {
    return !accessRights.find(t => t.sendtokeys === 'DocumentSubmission_Tab_View')?.value;
  }


  if (task.sendtokeys === 'Warrenty_Add' || task.sendtokeys === 'Warrenty_Cancelled') {
    return !accessRights.find(t => t.sendtokeys === 'Warrenty_Tab_View')?.value;
  }

  // Workflow Tab Access dependencies
  if (task.sendtokeys === 'workflow_Modification') {
    return !accessRights.find(t => t.sendtokeys === 'workflow_Tab_View')?.value;
  }

  // Project Schedule Tab Access dependencies
  if (task.sendtokeys === 'projectSchedule_Add' || task.sendtokeys === 'projectSchedule_Delete') {
    return !accessRights.find(t => t.sendtokeys === 'projectSchedule_Tab_View')?.value;
  }
  if (task.sendtokeys === 'Asset_InternalUser_Tab_View' || task.sendtokeys === 'Asset_ExternalUser_Tab_View') {
    return !accessRights.find(t => t.sendtokeys === 'Asset_Tab_View')?.value;
  }

  if (task.sendtokeys === 'Asset_InternalUser_SelectMember' || task.sendtokeys === 'Asset_InternalUser_CreateProfile') {
    return !accessRights.find(t => t.sendtokeys === 'Asset_InternalUser_Tab_View')?.value;
  }

  if (task.sendtokeys === 'Asset_ExternalUser_SelectMember' || task.sendtokeys === 'Asset_ExternalUser_CreateProfile') {
    return !accessRights.find(t => t.sendtokeys === 'Asset_ExternalUser_Tab_View')?.value;
  }

   // Maintenance Agreement Tab Access dependencies
   if (task.sendtokeys === 'MaintenanceAgreement_InternalUser_View' || task.sendtokeys === 'MaintenanceAgreement_ExternalUser_View' || task.sendtokeys === 'MaintenanceAgreement_Add' || task.sendtokeys === 'MaintenanceAgreement_Cancelled') {
    return !accessRights.find(t => t.sendtokeys === 'MaintenanceAgreement_Tab_View')?.value;
  }

  if (task.sendtokeys === 'MaintenanceAgreement_InternalUser_SelectMember') {
    return !accessRights.find(t => t.sendtokeys === 'MaintenanceAgreement_InternalUser_View')?.value;
  }

  if (task.sendtokeys === 'MaintenanceAgreement_ExternalUser_SelectMember') {
    return !accessRights.find(t => t.sendtokeys === 'MaintenanceAgreement_ExternalUser_View')?.value;
  }
  if (task.sendtokeys === 'ProjectDefaultProjectStartConfirmation') {
    return !accessRights.find(t => t.sendtokeys === 'ProjectDefaultAwardConfirmation')?.value;
  }
  

    return false;
  }
  

}
