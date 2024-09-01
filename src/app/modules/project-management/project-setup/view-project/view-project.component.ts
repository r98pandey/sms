
import { Component, ViewChild, Input, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { CdkStep, CdkStepper } from "@angular/cdk/stepper";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AddFollowComponent } from "../add-follow/add-follow.component";
import { ViewEventFullDetailsComponent } from "../view-event-full-details/view-event-full-details.component";
import { environment } from "src/environments/environment";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewNewProccessComponent } from "../view-new-proccess/view-new-proccess.component";
import { NewGetV2UserListApplicationComponent } from 'src/app/shared/components/new-get-v2-user-list-application/new-get-v2-user-list-application.component';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { ShepherdService } from "angular-shepherd";

import Step from 'shepherd.js/src/types/step';
import { el } from "@fullcalendar/core/internal-common";
import { AccessGroupService } from "src/app/core/services/access-group.service";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.scss'
})
export class ViewProjectComponent {
  label: any = "Department Detail";
  breadCrumbItems: any = [
    { label: "Department" },
    { label: "Department Detail", active: true },
  ];
  pmProjectActiveTabId:any=1;
  activeIdWorkingHoursTop_Attendance:number=1;
  @ViewChild('cdkStepper') wizardForm: CdkStepper;
  @ViewChild('step1') step1: CdkStep;
  @ViewChild('step2') step2: CdkStep;
  @ViewChild('step2') step3: CdkStep;
  public Editor = ClassicEditor;
  apiUrl: any = environment.apiUrl;
  dDetail: any = {};
  projectProcessId: any;
  departmentProjectLabel: string = "";
  projectProcessHeaderByProjectList: any = [];
  projectActivityAuditList: any[] = []
  activeIdTop: number = 1;


  dataSource: any;
  @ViewChild('dataTable')

  displayedColumns: string[] = ['task', 'subItem', 'dueDate', 'status', 'priority', 'action'];
  AssignedData: any;


  projectListWidgets: any[] = [];

  processList: any = [];
  projectDepartmentId: any;
  base64Strings: string[] = [];

  payload: any = {
    displayLength: 1000,
    displayStart: 0,
    ProjectId: null,
  };

  to = 0;
  from = 0;
  pageSize = 12;
  totalRecordsFromApi: number = 0;
  auditList = [];
  page = 1;
  collectionSize = 0;
  masterFollowList: any[] = [];
  teamMemberList: any[] = [];
  maintenanceUserMemberList: any[] = []
  //invite member code

  addMemberList: any[] = [];
  mX_WOTechAssignment: any = [];
  imgURl: any = environment.apiUrl;


  technicianList: any = [];
  @Input() followUpMemberList: any[];
  @Input() nameTitle: any = 'Technicians';
  @Output() setUpdateListValue = new EventEmitter();
  addTechnicianList: any = [];
  projectProcessUserApprvalList: any;
  totalTaskMaintenanceListByProjectAccessRightWithUserId: any[];
  maintenanceUserClientList: any = [];
  selectedMaintenanceUserClient: any[] = []
  clientList: any = [];
  maintenanceProcessUserApprval: any[];
  oldDataSaveSelectedTab: any;
  currentUserRole: any;
  currentUserId: any;
  currentUserAccessGroup: any;
  constructor(
    private departmentService: DepartmentService,
    public authService: AuthAssetService,
    private route: ActivatedRoute,
    private router: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private offcanvasService: NgbOffcanvas,
    public modal: NgbActiveModal,
    public CommonHttpServiceCallerService: CommonHttpServiceCallerService,
    private shepherdService: ShepherdService, private cdr: ChangeDetectorRef
    , private accessGroupService: AccessGroupService,

  ) {

    this.departmentProjectLabel = this.authService.getisProject()
      ? "Project"
      : "Department";

    this.label = `${this.departmentProjectLabel} Detail`;
    this.breadCrumbItems = [
      { label: `${this.departmentProjectLabel}` },
      { label: `${this.departmentProjectLabel} Detail`, active: true },
    ];

    const departmentId = DepartmentService.editDepartmentId;
    this.projectDepartmentId = DepartmentService.editDepartmentId;
    if (departmentId == 0) {
      this.router.navigate(["/project-management/project-setup/list-project"]);
    } else {
      this.getDepartmentDetail(departmentId);
      this.getV2_MX_MasterProjectProcessHeaderByProject(departmentId)
      this.loadData()
    }



  }
  clientStatus: any;

  GetClientStatus(ClientId: any) {
    let url = 'api/V2_Master/GetClientStatus';
    let payload = {
      ClientId: ClientId
    }
    this.CommonHttpServiceCallerService
      .postWithJsonDataMethod(
        url, payload
      )
      .subscribe((res: any) => {
        this.clientStatus = res.obj
      });

  }




  // projectStart(dDetail: any) {
  //   let url = 'api/ProjectManagement/UpdateV2_ProjectManagementStatus';
  //   let paylload = {
  //     ProjectId: this.projectDepartmentId,
  //   }
  //   this.CommonHttpServiceCallerService
  //     .postWithJsonDataMethod(
  //       url, paylload
  //     )
  //     .subscribe((res: any) => {
  //       this.success(res);
  //       this.getAfterComplete(res)
  //     });
  // }
  openSuccessprojectStart() {
    if(this.dDetail.departmentStatusId==49){
      const modalRef = this.modalService.open(MessageModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = 'You cannot be start the project because the  Project status is deleted.';
      modalRef.componentInstance.subTitle = "";
      modalRef.componentInstance.buttonName = 'Ok'
      modalRef.result.then((result) => {
        //console.log(result, "result");
        if (result) {
          if (result == "Close click") {
          
          }
        }
      
      });

    }else{
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.title = 'Are you sure you want to start the project?';
    modalRef.componentInstance.subTitle = "Please indicate whether this project should be classified under the 'Ad-hoc Project' category or the 'Maintenance Project' category.";
    modalRef.componentInstance.showProjectCategory = true;
    modalRef.componentInstance.buttonName = '';
    modalRef.componentInstance.CancelName = 'No';

    modalRef.result.then((result) => {
      if (result.type === 'success') {
        this.projectStart(result);
      }
    });}
  }

  projectStart(result: any) {
    let url = 'api/ProjectManagement/UpdateV2_ProjectManagementStatus';
    let payload = {
      ProjectId: this.projectDepartmentId,
      IsProjectManagement: result.projectCategory == 'Ad-hoc' ? true : false,
      // IsMaintenance:result.projectCategory == 'Maintenance' ? true : false
    };

    this.CommonHttpServiceCallerService
      .postWithJsonDataMethod(url, payload)
      .subscribe((res: any) => {
        this.success(res);
        this.getAfterComplete(res);
      });
  }

  openSuccessAwarded() {
    if(this.dDetail.departmentStatusId==49){
      const modalRef = this.modalService.open(MessageModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = 'You cannot be awarded the project because the  Project status is deleted.';
      modalRef.componentInstance.subTitle = "";
      modalRef.componentInstance.buttonName = 'Ok'
      modalRef.result.then((result) => {
        //console.log(result, "result");
        if (result) {
          if (result == "Close click") {
          
          }
        }
      
      });

    }else{
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are You Sure the Project is Awarded? ";
    modalRef.componentInstance.subTitle = "Once the project is awarded, you able to start the project and carry out the maintenance process";

    modalRef.componentInstance.buttonName = '',
      modalRef.componentInstance.CancelName = 'No',
      modalRef.result.then((result) => {
        if (result) {
          if (result == "success") {
            this.AwardedUpdate(this.dDetail);
          }
        }
      });
  }}
  AwardedUpdate(dDetail: any) {
    let url = 'api/ProjectManagement/UpdateV2_ProjectManagementAwarded';
    let paylload = {
      ProjectId: this.projectDepartmentId,
    }
    this.CommonHttpServiceCallerService
      .postWithJsonDataMethod(
        url, paylload
      )
      .subscribe((res: any) => {
        this.success(res);
        this.getAfterComplete(res)
      });

  }
  ngOnInit(): void {
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    this.currentUserAccessGroup = JSON.parse(localStorage.getItem("currentUser")).accessGroupName;
    this.currentUserId = JSON.parse(localStorage.getItem("currentUser")).userId;

    this.getProjectTeamMemberList();
    this.getProjectClientList();
    this.getV2_MyTaskMaintenanceMemberAndMyTaskListApplication();
    this.get_V2_MaintenanceProcessUserApprval();
    this.get_V2_ProjectProcessUserApprval()
    this.getV2_MyTaskMaintenanceMemberAndMyTaskListClient();

    if (this.authService.getaccessGroupId() != 0) {
      this.get_V3_ProjectManagementDepartmentUserAccess()
    }
    this.pmProjectActiveTabId = sessionStorage.getItem("pm-project-ActiveTab") ? Number(sessionStorage.getItem("pm-project-ActiveTab")) : 1;

    
    this.activeIdWorkingHoursTop_Attendance = sessionStorage.getItem("activeIdWorkingHoursTop_Attendance") ? Number(sessionStorage.getItem("activeIdWorkingHoursTop_Attendance")) : 1;

  }







  onNavChange_Attendance(currentId: any) {
    sessionStorage.setItem("activeIdWorkingHoursTop_Attendance", "" + currentId)

  }
  onNavChange(currentId: any) {
    sessionStorage.setItem("pm-project-ActiveTab", ""+currentId)

  }
  loadData() {
    this.payload.ProjectId = this.projectDepartmentId

    this.departmentService
      .getV2_MX_MasterFollowWithMembersList_ServerPaging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.masterFollowList = res.list;
        if (this.masterFollowList.length > 0) {
          this.totalRecordsFromApi = res.list[0].totalCount;
          this.from = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.to = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.pageSize = this.payload.displayLength;
        } else {
          this.totalRecordsFromApi = 0;
          this.from = 0;
          this.to = 0;
          this.pageSize = this.payload.displayLength;
        }
      });
  }
  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  againCall: boolean = true
  getDepartmentDetail(departmentId) {
    this.dDetail = {};
    this.departmentService.getDepartmentDetail(departmentId).subscribe({
      next: (res: any) => {
        this.dDetail = res.data;
        this.GetClientStatus(this.dDetail?.clientId)
        if (this.againCall) {
          if (this.authService.getRole() === 'System Administrator' || this.authService.getRole() == 'Super Admin' ||
            this.authService.getUserInfoID() === this.dDetail.createdBy) {
            this.againCall = false

            const builtInButtons = {
              cancel: {
                classes: 'cancel-button',
                secondary: true,
                text: 'Exit',
                type: 'cancel'
              },
              next: {
                classes: 'btn btn-success',
                text: 'Next',
                type: 'next'
              },
              back: {
                classes: 'back-button',
                secondary: true,
                text: 'Back',
                type: 'back'
              },
              finish: {
                classes: 'btn btn-primary',
                text: 'Okay!',
                type: 'cancel'
              },
            };

            const defaultStepOptions: Step.StepOptions = {
              classes: 'shepherd-theme-arrows custom-default-class',
              scrollTo: { behavior: 'smooth', block: 'center' },
              cancelIcon: {
                enabled: true
              },
              canClickTarget: false,
            };
            if (this.dDetail.isAwarded == false) {
              let steps: Step.StepOptions[] = [
                {
                  attachTo: {
                    element: '.actions',
                    on: 'bottom'
                  },
                  buttons: [
                    builtInButtons.finish
                  ],
                  classes: 'custom-class-name-1 custom-class-name-2',
                  id: 'intro',
                  title: 'Awarded!',
                  text: 'The project has been created and is awaiting the award process. If this process is successfully completed, click on the "Awarded" button to proceed with the Maintenance Agreement.'
                },
              ];

              this.shepherdService.defaultStepOptions = defaultStepOptions;
              this.shepherdService.modal = true;
              this.shepherdService.confirmCancel = false;
              this.shepherdService.addSteps(steps);
              this.shepherdService.start();
            }
            else if (this.dDetail.isAwarded == true &&
              this.dDetail.isProjectManagement == false &&
              this.dDetail.isMaintenance == false &&
              this.dDetail.projectManagementStatusId != 125) {
              let steps: Step.StepOptions[] = [
                {
                  attachTo: {
                    element: '.actions',
                    on: 'bottom'
                  },
                  buttons: [
                    builtInButtons.finish
                  ],
                  classes: 'custom-class-name-1 custom-class-name-2',
                  id: 'intro',
                  title: 'Project Start !',
                  text: 'The project has not started yet. Once the project starts, the status will change to "Project Initiated," and it will be ready for creating the project schedule.'
                },
              ];

              this.shepherdService.defaultStepOptions = defaultStepOptions;
              this.shepherdService.modal = true;
              this.shepherdService.confirmCancel = false;
              this.shepherdService.addSteps(steps);
              this.shepherdService.start();
            }
          }
        }
      }
    });
  }

  toUpperCaseword(data: string) {
    if (data) return data.toUpperCase();
    return "";
  }

  openEventFullDetailsModalPopup(followUpId) {
    const modalRef = this.offcanvasService.open(
      ViewEventFullDetailsComponent,
      {
        scroll: true,
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvas4 ",
      }
    );
    modalRef.componentInstance.dDetail = this.dDetail;
    modalRef.componentInstance.projectDepartmentId = this.projectDepartmentId;
    modalRef.componentInstance.followUpId = followUpId
    modalRef.result
      .then((result) => {
        console.log("result", result)
        this.callingFollowListApi()
      })
      .catch((result) => {
        console.log("result", result)
        this.callingFollowListApi()
      });
  }

  goBack() {
    this.router.navigate(["/project-management/project-setup/list-project"]);
  }

  callingFollowListApi() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.loadData()
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  returnWorkFlowStatusBadgeClassesid(id: any) {
    return this.commonFunctionService.returnWorkFlowStatusBadgeClasses(id);
  }

  getV2_MX_MasterProjectProcessHeaderByProject(ProjectId: any) {
    this.projectProcessHeaderByProjectList = []
    let payload = {
      ProjectId: ProjectId
    }
    this.departmentService.getV2_MX_MasterProjectProcessHeaderByProject(payload).subscribe((res: any) => {
      this.projectProcessHeaderByProjectList = res.list;
      if (res.list.length !== 0) {
        console.log(
          this.selectedTab, "this.selectedTab"
        )
        if (this.selectedTab == null) {
          let allComplete = res.list.every(item => item.isComplete); // Check if all items are complete
          if (allComplete) {
            this.selectedTab = res.list[0];
            this.activeIndex = 0;
          } else {
            res.list.forEach((element, index) => {
              if (element.isActive) {
                this.selectedTab = element;
                this.activeIndex = index;
                return;
              }
            });
          }
        }
      }

    })

  }

  getAfterComplete(event) {
    console.log("gh", event)
    if (event == 'Complete') {
      this.selectedTab = null
    }
    this.getV2_MX_MasterProjectProcessHeaderByProject(this.projectDepartmentId);
    this.getDepartmentDetail(this.projectDepartmentId)


  }
  selectedTab: any;
  activeIndex: number = -1
  getDataItem(data: any, index: number) {
    if (!data.isActive && !data.isComplete) {
      return
    }
    this.activeIndex = index
    this.selectedTab = data;
    this.oldDataSaveSelectedTab = this.selectedTab
  }


  openViewMore(content: any) {
    const modalRef = this.offcanvasService.open(content, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas3",
    });

    modalRef.result
      .then((result) => {

      })
      .catch((error) => {

      });

  }

  openModalFullView(content: any) {
    this.offcanvasService.open(content, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4",
    });
  }

  /**
  * Delete Model Open
  */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  storefollowUpId: any = null;

  addFollowUp(): void {
    if(this.dDetail.departmentStatusId==49){
      const modalRef = this.modalService.open(MessageModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = 'You cannot be add the todo  because the  Project status is deleted.';
      modalRef.componentInstance.subTitle = "";
      modalRef.componentInstance.buttonName = 'Ok'
      modalRef.result.then((result) => {
        //console.log(result, "result");
        if (result) {
          if (result == "Close click") {
          
          }
        }
      
      });

    }else{
    const modalRef = this.modalService.open(AddFollowComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.ProjectId = this.projectDepartmentId;
    modalRef.result.then((result) => {
      if (result) {
        if (result.value == "submit") {
          if (result.res.followUpId) {
            this.storefollowUpId = result.res.followUpId

            this.openModaAfterGetFollowUpId(this.storefollowUpId)
            // 
          }

        }
      } else {
        this.loadData()
      }
    });
  }

  }

  openModaAfterGetFollowUpId(followUpId) {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = 'Your Todo has been successfully created. You are now ready to start your Todo activities.';
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      //console.log(result, "result");
      if (result) {
        if (result == "Close click") {
          this.openEventFullDetailsModalPopup(followUpId)
        }
      }
      this.loadData()
    });
  }
  selectedTech: any = [];
  assetUserAccessList: any = [];
  selectedAssetUserAccessTech: any = [];
  assetUserClientAccessList: any = [];
  selectedAssetUserClient: any = [];
  selectedClient: any = [];
  selectedMaintenance: any = [];

  /*
   For Project Team
  */
  openModalMember() {
    const modalRef = this.modalService.open(NewGetV2UserListApplicationComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.nameTitle = "Internal Users";
    modalRef.componentInstance.followUpMemberList = this.selectedTech.length != 0 ? this.selectedTech : [];
    modalRef.componentInstance.projectId = this.projectDepartmentId;
    modalRef.componentInstance.addButton = this.currentObjectFindWithAccessRight.pM_InternalUser_CreateProfile;
    modalRef.componentInstance.comingWhichTab = 'Project';

    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {
          if (result.selectedTech) {
            this.selectedTech = result.selectedTech ? result.selectedTech : [];
            this.memberSubmit()
          }
        } else {
          this.getProjectTeamMemberList()
        }
      }
    });
  }

  openModalClient() {

    const modalRef = this.modalService.open(NewGetV2UserListApplicationComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.nameTitle = "External Users";
    modalRef.componentInstance.followUpMemberList = this.selectedClient.length != 0 ? this.selectedClient : [];
    modalRef.componentInstance.projectId = this.projectDepartmentId;
    modalRef.componentInstance.addButton = this.currentObjectFindWithAccessRight.pM_ExternalUser_CreateProfile;
    modalRef.componentInstance.clientApi = true;
    modalRef.componentInstance.comingWhichTab = 'Project';
    modalRef.componentInstance.clientObject = {
      clientId: this.dDetail.clientId,
      clientName: this.dDetail.clientName
    };



    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {
          if (result.selectedTech) {
            this.selectedClient = result.selectedTech ? result.selectedTech : [];
            this.clientSubmit()
          }
        } else {
          this.getProjectClientList()
        }
      }
    });
  }
  getProjectTeamMemberList() {
    this.selectedTech = [];
    this.payload.SearchProjectId = this.projectDepartmentId;
    this.payload.SearchUserType = "Application"
    this.departmentService
      .GetV2_GetMX_ProjectUserAccessList_ServerPaging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.teamMemberList = res.list;
        if (this.teamMemberList.length > 0) {
          this.teamMemberList.forEach((ele: any) => {
            this.selectedTech.push({
              id: ele.userId
              , ...ele
            })
          })
        }


      });
  }

  getProjectClientList() {
    this.selectedClient = [];
    this.payload.SearchProjectId = this.projectDepartmentId
    this.payload.SearchUserType = "Client"
    this.departmentService
      .GetV2_GetMX_ProjectUserAccessList_ServerPaging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.clientList = res.list;
        if (this.clientList.length > 0) {
          this.clientList.forEach((ele: any) => {
            this.selectedClient.push({
              id: ele.userId
              , ...ele
            })
          })
        }
      });
  }

  get_V2_ProjectProcessUserApprval() {
    let payload = {
      ProjectId: this.projectDepartmentId
    }
    let url = 'api/Account/Get_V2_ProjectProcessUserApprval'
    this.CommonHttpServiceCallerService
      .postWithJsonDataMethod(
        url, payload
      )
      .subscribe((res: any) => {
        this.projectProcessUserApprvalList = res.list;



      });
  }
  memberSubmit() {
    let sendingPayloadArray = [];
    this.selectedTech.forEach((element) => {
      sendingPayloadArray.push({
        userId: element.id,
      });
    });
    let payload = {
      "ProjectId": this.projectDepartmentId,
      "userIdObject": sendingPayloadArray
    };
    this.departmentService
      .CreateV2_MX_ProjectUserAccessBulkUser(payload)
      .subscribe((res: any) => {
        this.selectedTech = [];
        this.success(res);
        this.getProjectTeamMemberList();
      });
  }


  clientSubmit() {

    let sendingPayloadArray = [];
    this.selectedClient.forEach((element) => {
      sendingPayloadArray.push({
        userId: element.id,
      });
    });
    let payload = {
      "ProjectId": this.projectDepartmentId,
      "userIdObject": sendingPayloadArray
    };
    this.departmentService
      .CreateV2_MX_ProjectUserAccessBulkClientUser(payload)
      .subscribe((res: any) => {
        this.selectedClient = [];
        this.success(res);
        this.getProjectClientList();
      });
  }


  /*
 For End Project Team
*/


  /*
   For Maintenance Team
  */
  openModalMaintenanceUserClient() {

    const modalRef = this.modalService.open(NewGetV2UserListApplicationComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.nameTitle = "External Users";
    modalRef.componentInstance.followUpMemberList = this.selectedMaintenanceUserClient.length != 0 ? this.selectedMaintenanceUserClient : [];
    modalRef.componentInstance.projectId = this.projectDepartmentId;
    modalRef.componentInstance.addButton = this.currentObjectFindWithAccessRight.maintenance_ExternalUser_CreateProfile;
    modalRef.componentInstance.clientApi = true;
    modalRef.componentInstance.comingWhichTab = 'Maintenance';
    modalRef.componentInstance.clientObject = {
      clientId: this.dDetail.clientId,
      clientName: this.dDetail.clientName
    };


    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {
          if (result.selectedTech) {
            this.selectedMaintenanceUserClient = result.selectedTech ? result.selectedTech : [];
            this.maintenanceUserClientSubmit()
          }
        } else {
          this.getV2_MyTaskMaintenanceMemberAndMyTaskListClient()
        }
      }
    });
  }

  openModalMaintenanceUserMember() {
    const modalRef = this.modalService.open(NewGetV2UserListApplicationComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.nameTitle = "Internal Users";
    modalRef.componentInstance.followUpMemberList = this.selectedMaintenance.length != 0 ? this.selectedMaintenance : [];
    modalRef.componentInstance.projectId = this.projectDepartmentId;
    modalRef.componentInstance.addButton = this.currentObjectFindWithAccessRight.maintenance_InternalUser_CreateProfile;;
    modalRef.componentInstance.comingWhichTab = 'Maintenance';
    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {
          if (result.selectedTech) {
            this.selectedMaintenance = result.selectedTech ? result.selectedTech : [];
            this.maintenanceMemberSubmit()
          }
        } else {
          this.getV2_MyTaskMaintenanceMemberAndMyTaskListApplication()
        }
      }
    });
  }

  get_V2_MaintenanceProcessUserApprval() {
    let payload = {
      ProjectId: this.projectDepartmentId
    }
    let url = 'api/Account/Get_V2_MaintenanceProcessUserApprval'
    this.CommonHttpServiceCallerService
      .postWithJsonDataMethod(
        url, payload
      )
      .subscribe((res: any) => {
        this.maintenanceProcessUserApprval = res.list;



      });
  }

  getV2_MyTaskMaintenanceListByProject() {
    let payload = {
      SearchProjectId: this.projectDepartmentId
    };
    let url = 'api/MaintentDash/GetV2_MyTaskMaintenanceListByProject';
    this.CommonHttpServiceCallerService
      .postWithJsonDataMethod(url, payload)
      .subscribe((res: any) => {
        this.totalTaskMaintenanceListByProjectAccessRightWithUserId = res.data;

        if (this.maintenanceUserClientList.length != 0) {
          console.log("Client List is not empty");
        }

        if (this.maintenanceUserMemberList.length != 0) {
          console.log("Member List is not empty");

          this.maintenanceUserMemberList.forEach((ele) => {
            let matched = false;

            this.totalTaskMaintenanceListByProjectAccessRightWithUserId.forEach((eleUser) => {
              if (ele.userId === eleUser.userId) {
                matched = true;
                ele.myTaskId = eleUser.myTaskId;
                let taskRules = this.returnTaskRulesActiveCountUserMember();
                taskRules.forEach((element) => {
                  Object.keys(eleUser).forEach((el: any) => {
                    if (el === element.type) {
                      console.log(`Matching Element: ${el}, Value: ${eleUser[el]}`);
                      element.checked = eleUser[el];
                    }
                  });
                });
                ele.accessRight = [...taskRules]; // Spread operator to ensure a new array reference
              }
            });

            if (!matched) {
              ele.accessRight = [];
            }
          });


          this.cdr.detectChanges(); // Trigger change detection

          console.log("Updated Member List: ", this.maintenanceUserMemberList);
        }
      });
  }


  getV2_MyTaskMaintenanceMemberAndMyTaskListApplication() {
    this.selectedMaintenance = [];
    let payload = {
      SearchProjectId: this.projectDepartmentId,
      SearchUserType: "Application"
    };
    let url = 'api/MaintentDash/GetV2_MyTaskMaintenanceMemberAndMyTaskList';
    this.CommonHttpServiceCallerService
      .postWithJsonDataMethod(url, payload)
      .subscribe((res: any) => {
        this.maintenanceUserMemberList = res.list;

        if (this.maintenanceUserMemberList.length > 0) {
          this.maintenanceUserMemberList.forEach((ele: any) => {
            this.selectedMaintenance.push({
              id: ele.userId,
              ...ele
            });

            let matched = false;

            if (ele.childList.length !== 0) {
              ele.childList.forEach((eleUser) => {
                matched = true;

                let taskRules = this.returnTaskRulesActiveCountUserMember();
                taskRules.forEach((element) => {
                  if (eleUser.hasOwnProperty(element.type)) {
                    element.checked = eleUser[element.type];
                  }
                });
                ele.accessRight = [...taskRules]; // Spread operator to ensure a new array reference

              });
            }
            if (!matched) {
              ele.accessRight = [];
            }
          });
        }
      });
  }

  getV2_MyTaskMaintenanceMemberAndMyTaskListClient() {
    this.selectedMaintenanceUserClient = [];
    let payload = {
      SearchProjectId: this.projectDepartmentId,
      SearchUserType: "Client"
    };
    let url = 'api/MaintentDash/GetV2_MyTaskMaintenanceMemberAndMyTaskList';
    this.CommonHttpServiceCallerService
      .postWithJsonDataMethod(url, payload)
      .subscribe((res: any) => {
        this.maintenanceUserClientList = res.list;
        if (this.maintenanceUserClientList.length > 0) {
          this.maintenanceUserClientList.forEach((ele: any) => {
            this.selectedMaintenanceUserClient.push({
              id: ele.userId
              , ...ele
            })


            let matched = false;

            if (ele.childList.length !== 0) {
              ele.childList.forEach((eleUser) => {
                matched = true;

                let taskRules = this.returnTaskRulesActiveCountUserMember();
                taskRules.forEach((element) => {
                  if (eleUser.hasOwnProperty(element.type)) {
                    element.checked = eleUser[element.type];
                  }
                });
                ele.accessRight = [...taskRules];

              });
            }
            if (!matched) {
              ele.accessRight = [];
            }


          })
        }

      })
  }

  maintenanceUserClientSubmit() {
    let sendingPayloadArray = [];
    this.selectedMaintenanceUserClient.forEach((element) => {
      sendingPayloadArray.push({
        userId: element.id,
      });
    });
    let payload = {
      "ProjectId": this.projectDepartmentId,
      "userIdObject": sendingPayloadArray
    };
    this.departmentService
      .CreateV2_MX_MaintenanceUserAccessBulkClientUser(payload)
      .subscribe((res: any) => {
        this.selectedMaintenanceUserClient = [];
        this.success(res);
        this.getV2_MyTaskMaintenanceMemberAndMyTaskListClient();
      });
  }

  maintenanceMemberSubmit() {
    let sendingPayloadArray = [];
    this.selectedMaintenance.forEach((element) => {
      sendingPayloadArray.push({
        userId: element.id,
      });
    });
    let payload = {
      "ProjectId": this.projectDepartmentId,
      "userIdObject": sendingPayloadArray
    };
    this.departmentService
      .CreateV2_MX_MaintenanceUserAccessBulkUser(payload)
      .subscribe((res: any) => {

        this.success(res);
        this.selectedMaintenance = []
        this.getV2_MyTaskMaintenanceMemberAndMyTaskListApplication();
      });
  }
  /*
For End Maintenance Team
*/


  /*
   For Asset Team
  */
  openModalAssetUserMember() {
    const modalRef = this.modalService.open(NewGetV2UserListApplicationComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.nameTitle = "Internal Users";
    modalRef.componentInstance.followUpMemberList = this.selectedAssetUserAccessTech.length != 0 ? this.selectedAssetUserAccessTech : [];
    modalRef.componentInstance.projectId = this.projectDepartmentId;
    modalRef.componentInstance.addButton = this.currentObjectFindWithAccessRight.asset_InternalUser_CreateProfile;
    modalRef.componentInstance.comingWhichTab = 'Asset';
    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {
          if (result.selectedTech) {
            this.selectedAssetUserAccessTech = result.selectedTech ? result.selectedTech : [];
            this.assetMemberSubmit()
          }
        } else {
          this.getAssetUserAccessList()
        }
      }
    });
  }

  openModalAssetUserClient() {
    const modalRef = this.modalService.open(NewGetV2UserListApplicationComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.nameTitle = "External Users";
    modalRef.componentInstance.followUpMemberList = this.selectedAssetUserClient.length != 0 ? this.selectedAssetUserClient : [];
    modalRef.componentInstance.projectId = this.projectDepartmentId;
    modalRef.componentInstance.addButton = this.currentObjectFindWithAccessRight.asset_ExternalUser_CreateProfile;
    modalRef.componentInstance.clientApi = true;
    modalRef.componentInstance.comingWhichTab = 'Asset';
    modalRef.componentInstance.clientObject = {
      clientId: this.dDetail.clientId,
      clientName: this.dDetail.clientName
    };
    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {
          if (result.selectedTech) {
            this.selectedAssetUserClient = result.selectedTech ? result.selectedTech : [];
            this.assetUserClientSubmit()
          }
        } else {
          this.getAssetClientAccessList()
        }
      }
    });
  }
  getAssetClientAccessList() {
    this.selectedAssetUserClient = [];
    let payload =
    {
      SearchProjectId: this.projectDepartmentId,
      SearchUserType: "Client"
    }
    let url = 'api/AssetManagement/GetV2_GetMX_AssetUserAccessList_ServerPaging'
    this.CommonHttpServiceCallerService
      .postWithJsonDataMethod(
        url, payload
      )

      .subscribe((res: any) => {
        this.assetUserClientAccessList = res.list;
        if (this.assetUserClientAccessList.length > 0) {
          this.assetUserClientAccessList.forEach((ele: any) => {
            this.selectedAssetUserClient.push({
              id: ele.userId
              , ...ele
            })
          })
        }
      });
  }

  getAssetUserAccessList() {
    this.selectedAssetUserAccessTech = [];
    let payload =
    {
      SearchProjectId: this.projectDepartmentId,
      SearchUserType: "Application"
    }
    let url = 'api/AssetManagement/GetV2_GetMX_AssetUserAccessList_ServerPaging'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload)
      .subscribe((res: any) => {
        this.assetUserAccessList = res.list;
        if (this.assetUserAccessList.length > 0) {
          this.assetUserAccessList.forEach((ele: any) => {
            this.selectedAssetUserAccessTech.push({
              id: ele.userId
              , ...ele
            })
          })
        }


      });
  }

  assetUserClientSubmit() {
    let sendingPayloadArray = [];
    this.selectedAssetUserClient.forEach((element) => {
      sendingPayloadArray.push({
        userId: element.id,
      });
    });
    let payload = {
      "ProjectId": this.projectDepartmentId,
      "userIdObject": sendingPayloadArray
    };
    this.departmentService
      .CreateV2_MX_AssetUserAccessBulkClient(payload)
      .subscribe((res: any) => {
        this.selectedAssetUserClient = [];
        this.success(res);
        this.getAssetClientAccessList();
      });
  }

  assetMemberSubmit() {
    let sendingPayloadArray = [];
    this.selectedAssetUserAccessTech.forEach((element) => {
      sendingPayloadArray.push({
        userId: element.id,
      });
    });
    let payload = {
      "ProjectId": this.projectDepartmentId,
      "userIdObject": sendingPayloadArray
    };
    this.departmentService
      .CreateV2_MX_AssetUserAccessBulkUser(payload)
      .subscribe((res: any) => {

        this.success(res);
        this.selectedAssetUserAccessTech = []
        this.getAssetUserAccessList();
      });
  }
  /*
   For End Asset Team
  */

  callAfterDelete(event) {
    if (event.comingWhichTab == 'Asset') {
      this.getAssetUserAccessList();
      this.getAssetClientAccessList();
    } else if (event.comingWhichTab == 'Project') {
      this.getProjectTeamMemberList();
      this.getProjectClientList();
    } else if (event.comingWhichTab == 'Maintenance') {
      this.getV2_MyTaskMaintenanceMemberAndMyTaskListApplication();
      this.getV2_MyTaskMaintenanceMemberAndMyTaskListClient();
    } else {

    }

  }


  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  close(value) {
    this.modal.close({
      value: value,
      selectedTech: this.selectedTech
    });
  }


  getV2_GetMX_ProjectActivityAuditList_ServerPaging() {
    let payload: any = {
      displayLength: 1000,
      displayStart: 0,
      ProjectId: this.projectDepartmentId
    }

    this.departmentService.getV2_GetMX_ProjectActivityAuditList_ServerPaging(payload).subscribe((res: any) => {
      console.log(res, "res")

      this.projectActivityAuditList = res.list
    })
  }



  /// for new way ad access right 
  returnTaskRulesActiveCountUserMember(): any[] {
    return [
      {
        "name": "New Ticket Queue",
        "type": "newTicket",
        "checked": false,
        "remark": "Once a ticket is generated, the authorized member can view the new ticket in the queue and proceed with it accordingly, such as requesting billing eligibility or generating a service order.",
        "group": "Task Process"
      },
      {
        "name": "Create Quotation",
        "type": "awaitQuotation",
        "checked": false,
        "remark": "After confirming that the ticket is eligible for the billing process, the ticket moves to the Awaiting quotation queue, where the authorized member can generate the quotation.",
        "group": "Quotation Process"
      },
      {
        "name": "Service Order Generation",
        "type": "generateNewSO",
        "checked": false,
        "remark": "The authorized member can generate a service order whether the ticket comes from a workflow process or not.",
        "group": "Task Process"
      },
      {
        "name": "Assign Member & Site Visit Date Time",
        "type": "expectedStartTaskDateTime",
        "checked": false,
        "remark": "If a service order is generated but not assigned to any member or technician, the Visit/Attend Date, Visit/Attend Time, and Expected Completion Date can be found in this queue.",
        "group": "Task Process"
      },
      {
        "name": "Tech Signature Required",
        "type": "techSignatureRequired",
        "checked": false,
        "remark": "After the ticket task process is completed, the ticket requires a digital signature from the authorized technician.",
        "group": "Ticket Internal Verification Process"
      },
      // {
      //   "name": "Client Signature Required",
      //   "type": "clientSignatureRequired",
      //   "checked": false,
      //   "remark": "This is the external user process for the global ticket, where the client may be required to provide a digital signature.",
      //   "group": "Ticket External Verification Process"
      // },
      // {
      //   "name": "Closing Ticket Status (Internal)",
      //   "type": "pendingForCloseTicketProcessInternal",
      //   "checked": false,
      //   "remark": "Once all ticket task activities are completed for the internal ticket, the final process is ticket closing.",
      //   "group": "Ticket Internal Verification Process"
      // },
      {
        "name": "Quotation To Proceed Finance",
        "type": "quotationToProceedFinance",
        "checked": false,
        "remark": "Once the quotation verification is done, the quotation moves to this section, from where the authorized member can proceed to the invoice process.",
        "group": "Quotation Process"
      },
      {
        "name": "Quotation Rejected",
        "type": "quotationRejected",
        "checked": false,
        "remark": "If the quotation is rejected by any approver or reviewer during the internal verification process, the quotation is listed here for resubmission.",
        "group": "Quotation Process"
      },
      {
        "name": "Ticket Acknowledgement",
        "type": "ticketAcknowledgmentRequest",
        "checked": false,
        "remark": "Once the ticket is verified by the authorized member, it is listed in the ticket acknowledgment queue.",
        "group": "Ticket Internal Verification Process"
      },
      {
        "name": "Ticket Verification",
        "type": "ticketVerificationForAcknowledgeProcess",
        "checked": false,
        "remark": "After the service order is completed, the ticket is listed in the ticket verification queue.",
        "group": "Ticket Internal Verification Process"
      },
      {
        "name": "Schedule Completion Acknowledgement Admin",
        "type": "pmScheduleCompletionAcknowlegementAdmin",
        "checked": false,
        "remark": "Once the Scheduling process is completed by the technician/member, it requires admin/internal Acknowledgement verification. From this queue, the authorized member can perform the verification.",
        "group": "Schedule Acknowledgement Process"
      },
      {
        "name": "Audit Completion Acknowledgement Admin",
        "type": "auditCompletionAcknowlegementAdmin",
        "checked": false,
        "remark": "Once the auditing process is completed by the technician/member, it requires admin/internal Acknowledgement verification. From this queue, the authorized member can perform the verification.",
        "group": "Audit Acknowledgement Process"
      },
      {
        "name": "Incident Report Close Confirmation Required",
        "type": "clientSignatureRequired",
        "checked": false,
        "remark": "Once all internal verification processes are completed, the incident report requires confirmation to be closed by an external user.",
        "group": "Ticket External Verification Process"
      },
      {
        "name": "Closing Ticket Status (Global)",
        "type": "pendingForCloseTicketProcess",
        "checked": false,
        "remark": "Once the ticket passes all the internal verification processes, it enters this queue where the client/external user can verify and close the ticket.",
        "group": "Ticket External Verification Process"
      },
      {
        "name": "Schedule Completion Acknowledgement Client",
        "type": "pmScheduleCompletionAcknowlegementClient",
        "checked": false,
        "remark": "Once the internal Scheduling verification is completed, it moves to this section for client/external Acknowledgement Process.",
        "group": "Schedule Acknowledgement Process"
      },
      {
        "name": "Audit Completion Acknowledgement Client",
        "type": "auditCompletionAcknowlegementClient",
        "checked": false,
        "remark": "Once the internal audit verification is completed, it moves to this section for client/external Acknowledgement Process.",
        "group": "Audit Acknowledgement Process"
      }
    ]



  }

  currentObjectFindWithAccessRight: any = {
    "defaultProjectSetupId": 0,
    "accessGroupId": 0,
    "project_Tab_View": true,
    "projectDefaultAwardConfirmation": true,
    "projectDefaultProjectStartConfirmation": true,
    "pM_InternalUser_Tab_View": true,
    "pM_InternalUser_SelectMember": true,
    "pM_InternalUser_CreateProfile": true,
    "pM_ExternalUser_Tab_View": true,
    "pM_ExternalUser_SelectMember": true,
    "pM_ExternalUser_CreateProfile": true,
    "documentSubmission_Tab_View": true,
    "documentSubmission_SelectMember": true,
    "documentSubmission_Tab_Add": true,
    "documentSubmission_CompleteConfirmation": true,
    "maintenance_Tab_View": true,
    "maintenance_InternalUser_Tab_View": true,
    "maintenance_InternalUser_SelectMember": true,
    "maintenance_InternalUser_CreateProfile": true,
    "maintenance_ExternalUser_Tab_View": true,
    "maintenance_ExternalUser_SelectMember": true,
    "maintenance_ExternalUser_CreateProfile": true,
    "warrenty_InternalUser_Tab_View": true,
    "warrenty_InternalUser_SelectMember": true,
    "warrenty_ExternalUser_Tab_View": true,
    "warrenty_ExternalUser_SelectMember": true,

    "warrenty_Tab_View": true,
    "warrenty_Add": true,
    "warrenty_Cancelled": true,
    "maintenanceAgreement_InternalUser_View": true,
    "maintenanceAgreement_InternalUser_SelectMember": true,
    "maintenanceAgreement_ExternalUser_View": true,
    "maintenanceAgreement_ExternalUser_SelectMember": true,
    "maintenanceAgreement_Tab_View": true,
    "maintenanceAgreement_Add": true,
    "maintenanceAgreement_Cancelled": true,
    "asset_Tab_View": true,
    "asset_InternalUser_Tab_View": true,
    "asset_InternalUser_SelectMember": true,
    "asset_InternalUser_CreateProfile": true,
    "asset_ExternalUser_Tab_View": true,
    "asset_ExternalUser_SelectMember": true,
    "asset_ExternalUser_CreateProfile": true,
    "workflow_Tab_View": true,
    "workflow_Modification": true,
    "projectSchedule_Tab_View": true,
    "projectSchedule_Add": true,
    "projectSchedule_Delete": true
  }

  get_V3_ProjectManagementDepartmentUserAccess() {
    let payload = {
      "AccessGroupId": this.authService.getaccessGroupId()
    }
    this.accessGroupService.get_V3_ProjectManagementDepartmentUserAccess(payload).subscribe(
      (res: any) => {
        this.currentObjectFindWithAccessRight = res.obj;

      },
      (err) => {
        //console.log('err', err);
      }
    )
  }




  openModalDeleteConf(followUpId) {
    if(this.dDetail.departmentStatusId==49){
      const modalRef = this.modalService.open(MessageModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = 'You cannot be delete the todo  because the Project status is deleted.';
      modalRef.componentInstance.subTitle = "";
      modalRef.componentInstance.buttonName = 'Ok'
      modalRef.result.then((result) => {
        //console.log(result, "result");
        if (result) {
          if (result == "Close click") {
          
          }
        }
      
      });

    }else{ 
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to delete a Todo ?";
    modalRef.componentInstance.subTitle =
      "Deleting your Todo  will remove for this Todo list";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteV2_MX_ProjectFollowUp(followUpId);
        }
      }
    });
  }
  }

  deleteV2_MX_ProjectFollowUp(FollowUpId) {
    let url = 'api/ProjectManagement/DeleteV2_MX_ProjectFollowUp';
    let payload = {
      FollowUpId: FollowUpId
    }
    this.CommonHttpServiceCallerService
      .postWithJsonDataMethod(
        url, payload
      )
      .subscribe((res: any) => {

        this.success(res);
        this.loadData();


      });



  }

  checkDeleteButtonVisible(follow) {
    return (this.authService.getRole() == 'System Administrator' || follow.createdById == this.authService.getUserInfoID() ? true : false )&& follow.followUpStatusId==2
  }

}

