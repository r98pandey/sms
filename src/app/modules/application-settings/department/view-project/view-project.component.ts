
import { Component, ViewChild, Input, EventEmitter, Output } from "@angular/core";
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
import { environment } from "src/environments/environment";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewGetV2UserListApplicationComponent } from 'src/app/shared/components/new-get-v2-user-list-application/new-get-v2-user-list-application.component';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { ViewEventFullDetailsComponent } from "src/app/modules/project-management/project-setup/view-event-full-details/view-event-full-details.component";
import { AddFollowComponent } from "src/app/modules/project-management/project-setup/add-follow/add-follow.component";
import Step from 'shepherd.js/src/types/step';
import { ShepherdService } from "angular-shepherd";

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
  activateTabs: number = 1
  //invite member code

  addMemberList: any[] = [];
  mX_WOTechAssignment: any = [];
  imgURl: any = environment.apiUrl;


  technicianList: any = [];
  @Input() followUpMemberList: any[];
  @Input() nameTitle: any = 'Technicians';
  @Output() setUpdateListValue = new EventEmitter();
  addTechnicianList: any = [];
  projectProcessUserApprvalList: any[];
  maintenanceProcessUserApprval: any[];

  constructor(
    private departmentService: DepartmentService,
    private authService: AuthAssetService,
    private route: ActivatedRoute,
    private router: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private offcanvasService: NgbOffcanvas,
    public modal: NgbActiveModal,
    public CommonHttpServiceCallerService: CommonHttpServiceCallerService,
    private shepherdService: ShepherdService,

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
      this.router.navigate(["/application-settings/department/project-list"]);
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

  ngOnInit(): void {

    this.getProjectTeamMemberList();


  }

  goback() {
    this.router.navigate(['application-settings/department/project-list'])
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


  getDepartmentDetail(departmentId) {
    this.departmentService.getDepartmentDetail(departmentId).subscribe({
      next: (res: any) => {
        this.dDetail = res.data;
        this.GetClientStatus(this.dDetail?.clientId);
        if (this.dDetail.isAwarded) {

          if (this.dDetail.isMaintenance == false) {
            this.activateTabs = 4;
          } else if (this.dDetail.isMaintenance == true && this.dDetail.maintenanceStatusId != 28) {
            this.activateTabs = 4;

          }
        } else {
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
        console.log("activateTabs", this.activateTabs)
      },
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
    this.router.navigate(["/application-settings/department/project-list"]);
  }

  callingFollowListApi() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.loadData()
  }


  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }


  getV2_MX_MasterProjectProcessHeaderByProject(ProjectId: any) {
    let payload = {
      ProjectId: ProjectId
    }
    this.departmentService.getV2_MX_MasterProjectProcessHeaderByProject(payload).subscribe({
      next: (res: any) => {
        this.projectProcessHeaderByProjectList = res.list;
        if (res.list.length !== 0) {
          let allComplete = res.list.every(item => item.isComplete); // Check if all items are complete
          if (allComplete) {
            this.selectedTab = res.list[0];
            this.activeIndex = 0;
          } else {
            res.list.forEach((element, index) => {
              if (element.isActive) {
                this.selectedTab = element;
                this.activeIndex = index;
                return; // Exit the loop after finding the first active item
              }
            });
          }
        }
      }
    });

  }

  getAfterComplete(event) {
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
    this.selectedTab = data
  }




  file: File[] = [];

  onFileChange(event: any) {
    // Add the newly selected files without removing existing ones
    this.file.push(...event.addedFiles);

    this.onSelectwithbase64(event)
  }

  onSelectwithbase64(event: any) {
    // Loop through each added file
    event.addedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Add the prefix if it's not present
        const base64String = e.target.result.includes('data:image')
          ? e.target.result
          : 'data:image/png;base64,' + e.target.result.split(',')[1];

        this.base64Strings.push(base64String);

      };

      reader.readAsDataURL(file);
    });
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
  selectedTech: any = []
  openModalMember() {
    console.log("this.projectId", this.projectDepartmentId)
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
    modalRef.componentInstance.addButton = true;

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
  selectedClient: any = []
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
    modalRef.componentInstance.addButton = true;
    modalRef.componentInstance.clientApi = true;

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
  clientList: any = [];

  getProjectClientList() {
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

        this.success(res);
        this.getProjectClientList();
      });
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

  openSuccessprojectStart() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you sure you want to start the project? ";
    modalRef.componentInstance.subTitle = "If yes, the project status will be changed to 'Project Initiate' and will be ready for creating the project schedule.";

    modalRef.componentInstance.buttonName = '',

      modalRef.result.then((result) => {
        if (result) {
          if (result == "success") {
            this.projectStart(this.dDetail);
          }
        }
      });
  }
  projectStart(dDetail: any) {

    let url = 'api/ProjectManagement/UpdateV2_ProjectManagementStatus';
    let paylload = {
      ProjectId: this.projectDepartmentId,
      // CurrentProcessId: 80,
      // CurrentProcessName: "Project Initiate"
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

  openSuccessAwarded() {
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
  }
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
}

