import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbOffcanvas, NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { SubTaskCount, TaskDetail } from '../work-progress-task-interface';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import Swal from 'sweetalert2';
import { StartandstropModaalComponent } from 'src/app/shared/components/startandstrop-modaal/startandstrop-modaal.component';
import { NewGetV2UserListApplicationComponent } from 'src/app/shared/components/new-get-v2-user-list-application/new-get-v2-user-list-application.component';
import { environment } from 'src/environments/environment';
import { UpdateStatusComponent } from 'src/app/shared/components/update-status/update-status.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { forEach } from 'lodash';
import { UploadAttachmentsWorkProgressModalComponent } from '../upload-attachments-work-progress-modal/upload-attachments-work-progress-modal.component';
import { ProjectWorkProgressViewWithSubTaskComponent } from '../project-work-progress-view-with-sub-task/project-work-progress-view-with-sub-task.component';
import { AddSubTaskWorkProgressComponent } from '../add-sub-task-work-progress/add-sub-task-work-progress.component';
import { forkJoin } from 'rxjs';
import { WorkProgressProjectTaskApporvalAccesRightComponent } from '../work-progress-project-task-apporval-acces-right/work-progress-project-task-apporval-acces-right.component';
@Component({
  selector: 'app-project-work-progress-task-details',
  templateUrl: './project-work-progress-task-details.component.html',
  styleUrl: './project-work-progress-task-details.component.scss'
})
export class ProjectWorkProgressTaskDetailsComponent implements OnInit, AfterViewChecked, OnDestroy {
  activeTaskTab: number = 1
  @Input() ProjectTaskId: any
  @Input() projectScheduleObject: any;
  taskList: TaskDetail;
  taskProgressUpdateList: any[] = [];
  taskFileValue: any;
  maxCharMessage = 3000
  MessageContainTask: any = ''
  askStartEndCondition: any = {
    "techAttendacenId": 0,
    "startTask": ""
  };
  timeDifference: string;
  private intervalId: any;
  projectManagementStatusList: any = [];
  startTaskAccessRight: boolean = false;
  imageUrl = environment.apiUrl;
  currentUserID: any;
  attendanceTaskSubTaskList: any[] = [];
  mainTaskCompleteUpdateButtonCheckConditionShownHide: boolean = false;
  isAddSubTaskVisible: any;
  projectTaskApproversList: any;
  ShowHidetheApprovalADDAndDelete: boolean = false;
  currentUserRole: any;
  currentUserAccessGroup: any;

  constructor(private projectScheduleService: ProjectScheduleService,
    private offcanvasService: NgbOffcanvas
    , public activeOffcanvas: NgbActiveOffcanvas, private modalService: NgbModal, private commonFunctionService: CommonFunctionService,
    private authService: AuthAssetService, private commonHttpServiceCallerService: CommonHttpServiceCallerService
  ) {

  }
  ngOnInit(): void {
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    this.currentUserID = JSON.parse(localStorage.getItem("currentUser")).userId;

    this.currentUserAccessGroup = JSON.parse(localStorage.getItem("currentUser")).accessGroupName;

    this.apiCall();
  }
  onNavChange() {
    this.apiCall()
  }

  checkingTheApprovalADDAndDelete() {
    this.ShowHidetheApprovalADDAndDelete = false;
    if (String(this.authService.getRole()).trim().toLocaleLowerCase() === String("Super Admin").trim().toLocaleLowerCase()) {
      this.ShowHidetheApprovalADDAndDelete = true;
    } else if (String(this.authService.getRole()).trim().toLocaleLowerCase() === String("System Administrator").trim().toLocaleLowerCase()) {
      this.ShowHidetheApprovalADDAndDelete = true;
    } else if (this.authService.getUserInfoID() == this.taskList.projectOwnerId) {
      this.ShowHidetheApprovalADDAndDelete = true
    } else if (this.authService.getUserInfoID() == this.taskList.createdById) {
      this.ShowHidetheApprovalADDAndDelete = true
    }
    return this.ShowHidetheApprovalADDAndDelete;

  }
  apiCall() {
    
    this.getV2_MX_ProjectScheduleTaskDetail();
    this.getV2_TaskProgressupdatelist();
    this.GetV2_ProjectTaskStartEndCondition();
    this.getV2_MX_ProjectTaskMembersList();
    this.getProjectManagementStatus('ProjectTaskStatusUpdatePortal');
    this.get_V3_MainTaskCompleteUpdateButtonCheckCondition();
    this.getV3_GetProjectTaskApproversList()
  }

  getV2_TechAttendanceTaskSubTaskList_ServerPaging(): void {
    let payload = {
      ProjectTaskId: this.ProjectTaskId,
      TaskType: 'Main-Task',
      displayLength: 10,
      displayStart: 0
    }

    this.projectScheduleService
      .getV2_TechAttendanceTaskSubTaskList_ServerPaging(this.commonFunctionService.clean(payload))
      .subscribe(
        (res: any) => {
          this.attendanceTaskSubTaskList = res?.list;

        },
        (err) => {

        }
      );
  }

  get_V3_MainTaskCompleteUpdateButtonCheckCondition() {
    let url = "api/ProjectManagement/Get_V3_MainTaskCompleteUpdateButtonCheckCondition";
    let paylod = {
      ProjectTaskId: this.ProjectTaskId,
    }
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {

      this.mainTaskCompleteUpdateButtonCheckConditionShownHide = res.obj.isCompleteUpdateButton
      this.GetV3_CheckCreateAddSubTaskAvailability();
    });


  }
  getV3_GetProjectTaskApproversList() {
    this.projectTaskApproversList=[];
   let url = "api/ProjectManagement/GetV3_GetProjectTaskApproversList";
    let paylod = {
      ProjectTaskId: this.ProjectTaskId,
    }
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.projectTaskApproversList = res.list ? res.list : []
    });


  }


  openAddModelPopu(accesRight) {
    // if(this.dDetail.departmentStatusId==49){
    //   const modalRef = this.modalService.open(MessageModalComponent, {
    //     ariaLabelledBy: "modal-basic-title",
    //     size: "md",
    //     centered: true,
    //     backdrop: "static",
    //     keyboard: false,
    //   });
    //   modalRef.componentInstance.title = 'You can proceed with the process because the project has been deleted.';
    //   modalRef.componentInstance.subTitle = "";
    //   modalRef.componentInstance.buttonName = 'Ok'
    //   modalRef.result.then((result) => {
    //     //console.log(result, "result");
    //     if (result) {
    //       if (result == "Close click") {

    //       }
    //     }

    //   });

    // }else{
    const modalRef = this.offcanvasService.open(
      WorkProgressProjectTaskApporvalAccesRightComponent,
      {
        scroll: true,
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvasNooverflow",
      }
    );


    modalRef.componentInstance.accessRightName = accesRight;
    modalRef.componentInstance.accessRight = this.projectTaskApproversList;
    modalRef.componentInstance.projectDepartmentId = this.taskList.projectId
    modalRef.componentInstance.scheduleId = this.taskList.projectScheduleId
    modalRef.componentInstance.projectTaskId = this.taskList.projectTaskId

    modalRef.result
      .then((result) => {
        if (result.type == 'success') {
          this.createV2_ProjectProcessApprovalUser(result.selectObjectSend)
        }
      })
      .catch((result) => {
        if (result.type == 'success') {
          this.createV2_ProjectProcessApprovalUser(result.selectObjectSend)
        }
      });
  }

  createV2_ProjectProcessApprovalUser(selectObjectSend) {
    let url = 'api/ProjectManagement/Insert_V3_ProjectTaskApprover';
    const requests = selectObjectSend.map(element => this.commonHttpServiceCallerService.postWithJsonDataMethod(url, element));
    forkJoin(requests).subscribe(
      (res: any[]) => {
        res.forEach(response => {
          this.getV3_GetProjectTaskApproversList();
        });
        this.success(res);
      },
      (err) => {
        console.error('Error in processing requests', err);

      }
    );
  }

  GetV3_CheckCreateAddSubTaskAvailability() {
    let url = "api/ProjectManagement/GetV3_CheckCreateAddSubTaskAvailability";
    let paylod = {
      ProjectTaskId: this.ProjectTaskId,
    }
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {

      this.isAddSubTaskVisible = res.isAddSubTaskVisible


    });


  }





  openModalDeleteConf(TaskMembersId, type) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You are about to delete this Member?";
    modalRef.componentInstance.subTitle =
      "Deleting your Member will remove for the database";
    modalRef.result.then((result) => {
      if (result) {

        if (result == "delete") {
          if (type == 1) {
            this.deleteV3_MainTaskMember(TaskMembersId);
          } else {
            this.deleteV3_MainTask_ApprovalUpdate_Latest(TaskMembersId);
          }
        }
      }
    });
  }
  deleteV3_MainTaskMember(TaskMembersId) {
    let url = "api/ProjectManagement/DeleteV3_MainTaskMember";
    let paylod = {
      TaskMembersId: TaskMembersId
    }
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.success(res);
      this.getV2_MX_ProjectTaskMembersList();

    });


  }
  deleteV3_MainTask_ApprovalUpdate_Latest(ProjectProcessUserId) {
    let url = "api/ProjectManagementDash/DeleteV3_MainTask_ApprovalUpdate_Latest";
    let paylod = {
      ProjectProcessUserId: ProjectProcessUserId
    }
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.success(res);
      this.apiCall()

    });


  }

  getHoursAndMinutesDifference(pastDateStr) {
    return this.commonFunctionService.getHoursAndMinutesDifference(pastDateStr)
  }

  getProjectManagementStatus(type) {
    this.projectScheduleService.getProjectManagementStatus(type).subscribe((res: any) => {
      this.projectManagementStatusList = res
    })
  }


  openStatusModal(data) {
    if (this.askStartEndCondition.startTask == 'False' &&
      this.askStartEndCondition.techAttendacenId > 0) {
      this.openMessageIfProgressTasktaskStop();
      this.get_V3_MainTaskCompleteUpdateButtonCheckCondition();
    } else {
      const modalRef = this.modalService.open(UpdateStatusComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });

      let filteredData = this.projectManagementStatusList.filter(item => item.assetStatusId !== data.projectTaskStatusId);

      if (data.projectTaskStatusId == 30) {
        filteredData = filteredData.filter(item => item.assetStatusId !== 2);
      }
      filteredData = filteredData.filter(item => item.assetStatusId !== 30);


      modalRef.componentInstance.assetListStatus = filteredData;
      modalRef.result.then((result) => {
        if (result) {
          if (result.value == "success") {
            this.GetV2_UpdateMX_ProjectTaskStatus(result);
          } else {
            this.getV2_MX_ProjectScheduleTaskDetail();
            this.get_V3_MainTaskCompleteUpdateButtonCheckCondition()

          }
        }
      });
    }
  }

  openMessageIfProgressTasktaskStop() {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = 'Your task has already started, so first stop the task. After that, you can update the task status.';
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      if (result) {

      }
    });
  }

  GetV2_UpdateMX_ProjectTaskStatus(sendObject: any) {
    let paylod = {
      ProjectTaskId: this.ProjectTaskId,
      ProjectTaskStatusId: sendObject.statusId,
      ProjectTaskStatusName: sendObject.statusName,
      Remark: sendObject.remark
    }
    this.projectScheduleService.GetV2_UpdateMX_ProjectTaskStatus(paylod).subscribe((res: any) => {
      this.success(res);
      this.getV2_MX_ProjectScheduleTaskDetail();
      this.GetV2_ProjectTaskStartEndCondition()
      this.get_V3_MainTaskCompleteUpdateButtonCheckCondition()
      this.activeTaskTab = 1
    }, (err: any) => {
      console.log("err", err)
      this.openModaAfterGetFollowUpId(err)
    })
  }

  openModaAfterGetFollowUpId(message) {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = 'ERROR';
    modalRef.componentInstance.subTitle = message;
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      //console.log(result, "result");
      if (result) {
        if (result == "Close click") {
          this.getV2_MX_ProjectScheduleTaskDetail();
          this.GetV2_ProjectTaskStartEndCondition()
          this.activeTaskTab = 1
        }
      }

    });
  }
  GetV2_ProjectTaskStartEndCondition() {
    let paylod = {
      ProjectTaskId: this.ProjectTaskId,
      TaskType: 'Main-Task'
    }
    this.projectScheduleService.GetV2_ProjectTaskStartEndCondition(paylod).subscribe((res: any) => {
      this.askStartEndCondition = res.obj

      if (this.askStartEndCondition.startDateTime) {
        this.timeDifference = this.getHoursAndMinutesDifference(this.askStartEndCondition.startDateTime + '');


        this.intervalId = setInterval(() => {
          this.timeDifference = this.getHoursAndMinutesDifference(this.askStartEndCondition.startDateTime + '');
        }, 1000);
      }
    })
  }
  getV2_MX_ProjectScheduleTaskDetail() {
    let paylod = {
      ProjectTaskId: this.ProjectTaskId
    }
    this.projectScheduleService.getV2_MX_ProjectScheduleTaskDetail(paylod).subscribe((res: any) => {
      this.taskList = res.obj
      this.checkingTheApprovalADDAndDelete();
      this.getV2_TechAttendanceTaskSubTaskList_ServerPaging();

    })
  }
  getTaskStatus(totalTask: number, totalTaskCompleted: number) {
    if (totalTask == 0 && totalTaskCompleted == 0) {
      return 0
    }
    const pendingTasks = totalTask - totalTaskCompleted;
    const pendingPercentage = (pendingTasks / totalTask) * 100;
    const completedPercentage = 100 - pendingPercentage;
    return completedPercentage;
  }

  transformInnerHTML(string: any) {
    return this.commonFunctionService.transform(string);
  }


  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  close(value: any) {
    this.activeOffcanvas.close(value)
  }
  addDocumentsModal() {

    const modalRef = this.modalService.open(UploadAttachmentsWorkProgressModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    //modalRef.componentInstance.projectId = this.projectDepartmentId;
    //modalRef.componentInstance.followUpId = this.followUpId;

    modalRef.result.then((result) => {
      if (result) {
        if (result == 'submit') {
          //this.getV2_FollowUpDocList();
        }
      }
    });

  }
  startStopModal(value: any) {

    const modalRef = this.modalService.open(StartandstropModaalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.type = value;

    modalRef.result.then((result) => {
      if (result) {
        console.log("result", result)
        if (result.value == 'success') {
          if (value == 'Start') {
            this.createV2_MX_TechAttendanceProject_Start(result)
          } else if (value == 'Stop') {
            this.UpdateV2_MX_TechAttendanceProject_End(result)
          } else {

          }
        }
      }
    });

  }

  onFileSelected(event: any, type: any) {
    this.taskFileValue = null;
    const file = event.target.files[0];
    console.log(file, "ss")
    if (file) {
      this.taskFileValue = {
        file: file,
        fileType: this.getFileType(file)
      }

    }
  }
  getFileType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension) {
      return 'Unknown';
    }
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov'];
    const zipExtensions = ['zip'];
    const rarExtensions = ['rar'];
    const dwgExtensions = ['dwg'];

    if (imageExtensions.includes(extension)) {
      return 'Image';
    } else if (documentExtensions.includes(extension)) {
      return 'Document';
    } else if (videoExtensions.includes(extension)) {
      return 'Video';
    } else if (zipExtensions.includes(extension)) {
      return 'Zip';
    } else if (rarExtensions.includes(extension)) {
      return 'Rar';
    } else if (dwgExtensions.includes(extension)) {
      return 'Dwg';
    } else {
      return 'Unknown';
    }
  }
  deltefileMedia() {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You are about to delete a File?";
    modalRef.componentInstance.subTitle =
      "You won't be able to revert this!";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.taskFileValue = null;

          this.resetDelete('taskFile')

        }
      }
    });

  }
  getFileIcon(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension) {
      return 'Unknown';
    }
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov'];
    const zipExtensions = ['zip'];
    const rarExtensions = ['rar'];

    if (imageExtensions.includes(extension)) {
      return 'ri-image-line b2';
    } else if (documentExtensions.includes(extension)) {
      return "ri-file-line";
    } else if (videoExtensions.includes(extension)) {
      return 'ri-video-line';
    } else if (zipExtensions.includes(extension)) {
      return 'ri-folder-zip-line';
    } else if (rarExtensions.includes(extension)) {
      return 'ri-survey-fill';
    } else {
      return 'ri-file-list-line';
    }
  }
  resetDelete(id) {
    const fileInput: any = document.getElementById(id);
    if (fileInput) {
      fileInput.value = "";
    }
  }
  @ViewChild("scrollframeTask", { static: false })
  scrollframeTask: ElementRef;

  scrollContainerTask: any;
  submitChatTask() {
    const formdata = new FormData();
    formdata.append("TaskId", this.ProjectTaskId);
    formdata.append("ScheduleNo", this.projectScheduleObject.scheduleNo);
    formdata.append("TaskNo", this.taskList.taskNo);
    formdata.append("IsClient", this.authService.getRole() === "Client User" ? 'true' : 'false');
    formdata.append("AccessGroup", this.authService.getaccessGroupName());
    if (this.MessageContainTask) {
      formdata.append("MessageContain", this.MessageContainTask.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>'));
    }
    if (this.taskFileValue) {
      formdata.append("FileType", this.taskFileValue.fileType);
      formdata.append("file", this.taskFileValue.file, this.taskFileValue.file.name); // Assuming single file upload

    }
    this.projectScheduleService.CreateV2_TaskProgressupdate(formdata).subscribe((res) => {
      this.scrollToTop();
      this.resetDelete('taskFile')
      this.MessageContainTask = "";
      this.success(res);
      this.apiCall();
      this.taskFileValue = null
    });

  }
  scrollToTop() {
    if (this.scrollContainerTask) {
      this.scrollContainerTask.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  ngAfterViewChecked(): void {
    if (this.taskProgressUpdateList.length != 0) {
      if (this.scrollframeTask && !this.scrollContainerTask) {
        this.scrollContainerTask = this.scrollframeTask.nativeElement;
      }
    }

  }

  AfterDeleteCall(event) {
    this.getV2_TaskProgressupdatelist();
  }
  taskTotalRecordsFromApi: number = 0;
  taskFrom: number = 0;
  taskTo: number = 0;
  taskPageSize: number = 10;
  getV2_TaskProgressupdatelist(
    displayLength: number = 500,
    startIndex: Number = 0
  ) {
    let payload = {
      TaskId: this.ProjectTaskId,
      // displayLength: displayLength,
      // displayStart: startIndex,
    };
    this.taskProgressUpdateList = []
    this.projectScheduleService.getV2_TaskProgressupdatelist(payload)
      .subscribe((res: any) => {
        if (res.list.length > 0) {
          this.taskProgressUpdateList = res.list ? res.list : [];

          this.taskProgressUpdateList.sort((a, b) => b.taskProgressUpdateId - a.taskProgressUpdateId);

          this.taskTotalRecordsFromApi =
            res.list[0].totalCount;
          this.taskFrom = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.taskTo = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.taskPageSize = displayLength;
        } else if (
          this.taskProgressUpdateList.length == 0 &&
          res.list.length == 0
        ) {
          this.taskProgressUpdateList = []
          // this.ticketDisscusionPage = 1;
          this.taskTotalRecordsFromApi = 0;
          this.taskFrom = 0;
          this.taskTo = 0;
          this.taskPageSize = displayLength;
        }
        this.get_V3_MainTaskCompleteUpdateButtonCheckCondition();
      });
  }


  createV2_MX_TechAttendanceProject_Start(value: any) {
    let requestData: any = {
      TechPicUrlStartBase64: value.webcamImageimageAsDataUrl,
      StartRemark: value.remark,
      ProjectTaskId: this.ProjectTaskId,
      TaskType: "Main-Task",
      ProjectScheduleId: this.projectScheduleObject.projectScheduleId
    };
    this.projectScheduleService.CreateV2_MX_TechAttendanceProject_Start(requestData).subscribe(
      (res: any) => {
        this.success(res);

        this.apiCall()
        this.activeTaskTab = 1
      },
      (err) => {
        this.error(err);
        this.openModaWaringConf(err)
      }
    );

  }

  UpdateV2_MX_TechAttendanceProject_End(value: any) {
    let requestData: any = {
      TechPicUrlEndBase64: value.webcamImageimageAsDataUrl,
      EndRemark: value.remark,
      TechAttendacenId: this.askStartEndCondition.techAttendacenId
    };
    this.projectScheduleService.UpdateV2_MX_TechAttendanceProject_End(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.apiCall()
        this.activeTaskTab = 1
      },
      (err) => {
        this.error(err);
        this.openModaWaringConf(err)

      }
    );

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
      if (result) {
        if (result == "Close click") {
          this.apiCall()
          this.activeTaskTab = 1
        }
      }
    });
  }
  error(err: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err,
      showConfirmButton: false,
      timer: 1000,
    });
  }
  selectedTech: any = []
  openModalMember() {

    const modalRef = this.modalService.open(NewGetV2UserListApplicationComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.nameTitle = "Member";
    modalRef.componentInstance.followUpMemberList = this.projectTaskMembersList.length != 0 ? this.projectTaskMembersList : [];
    modalRef.componentInstance.projectId = this.taskList.projectId;

    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {

          if (result.selectedTech) {

            this.selectedTech = result.selectedTech ? result.selectedTech : [];
            this.submit(result.selectedTech)
          }
        }
      }
    });
  }
  projectTaskMembersList: any = []
  getV2_MX_ProjectTaskMembersList() {
    let payload = {
      ProjectTaskId: this.ProjectTaskId
    }
    this.projectScheduleService
      .GetV2_MX_ProjectTaskMembersList(
        payload
      )
      .subscribe((res: any) => {
        this.selectedTech=[];
        this.projectTaskMembersList = res.list ? res.list : [];

        if (this.projectTaskMembersList.length > 0) {
          this.projectTaskMembersList.forEach((ele: any) => {
            ele.id = ele.userId
          });
          this.checkTheSelectTechLoginOrNot(this.projectTaskMembersList)
        } else {
          this.selectedTech=[];
          this.startTaskAccessRight = false
        }
      });
  }

  checkTheSelectTechLoginOrNot(selectedTech) {

    selectedTech.forEach((ele) => {
      if (this.currentUserID == ele.userId) {
        this.startTaskAccessRight = true
      }
    })

  }
  submit(selectedTechValue) {
    let sendingPayloadArray = [];
    selectedTechValue.forEach((element) => {
      sendingPayloadArray.push({
        UserId: element.id,
        ProjectTaskId: this.ProjectTaskId
      });
    });
    this.projectScheduleService
      .CreateV2_MX_ProjectTaskMembers(sendingPayloadArray)
      .subscribe((res: any) => {
        this.success(res);
        this.getV2_MX_ProjectTaskMembersList();
        this.get_V3_MainTaskCompleteUpdateButtonCheckCondition();
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

  openEventFullDetailsSubTaskModalPopup(ProjectTaskId, projectSubTaskId) {
    const modalRef = this.offcanvasService.open(
      ProjectWorkProgressViewWithSubTaskComponent,
      {
        scroll: true,
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvas4 ",
      }
    );
    modalRef.componentInstance.ProjectTaskId = ProjectTaskId;
    modalRef.componentInstance.ProjectsubTaskId = projectSubTaskId;
    modalRef.componentInstance.projectScheduleObject = this.taskList;


    modalRef.result
      .then((result) => {
        this.apiCall()

      })
      .catch((result) => {
        this.apiCall()
      });
  }


  GetV3_CheckCreateAddSubTaskAvailability_new(projectTaskDetails) {
    let url = "api/ProjectManagement/GetV3_CheckCreateAddSubTaskAvailability";
    let paylod = {
      ProjectTaskId: projectTaskDetails.projectTaskId,
    }
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {

      this.isAddSubTaskVisible = res.isAddSubTaskVisible;
      if (res.isAddSubTaskVisible == 1) {


        const modalRef = this.modalService.open(AddSubTaskWorkProgressComponent, {
          ariaLabelledBy: "modal-basic-title",
          size: "lg",
          centered: true,
          backdrop: "static",
          keyboard: false, scrollable: true
        });
        modalRef.componentInstance.taskList = projectTaskDetails;
        modalRef.result.then((result) => {
          if (result) {
            if (result.value == "submit") {
              if (result) {
                this.openSuccessModalSubTask(result.res, projectTaskDetails.projectTaskId,);

              }
            }
            document.body.style.overflow = 'auto';
          }
        });
      } else if (res.isAddSubTaskVisible == 0) {
        this.openModalAddDetletedTime('You cannot add a subtask because work on the main task has already begin.');

      }


    });


  }

  createSubTask(projectTaskDetails): void {

    this.GetV3_CheckCreateAddSubTaskAvailability_new(projectTaskDetails)

  }
  openModalAddDetletedTime(value) {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = value;
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      //console.log(result, "result");
      if (result) {

      }

    });
  }

  openSuccessModalSubTask(successMesage, projectTaskId,) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Sub-task created successfully. Would you like to create another sub-task?"
    modalRef.componentInstance.subTitle1 = "Alternatively, if you want to set up the sub-task you just created, please press 'Yes'.";
    modalRef.componentInstance.buttonName = " Update Sub Task";
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.openEventFullDetailsSubTaskModalPopup(projectTaskId, successMesage.projectSubTaskId);
          this.apiCall()
        } else {
          this.apiCall()
        }
      }
    });

  }

  openInfo(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
        scrollable: true
      })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

