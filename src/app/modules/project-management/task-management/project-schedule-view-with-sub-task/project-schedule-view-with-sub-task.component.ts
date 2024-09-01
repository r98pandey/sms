import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbOffcanvas, NgbModal, NgbOffcanvasRef, NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { AddSubTaskModalComponent } from '../add-sub-task-modal/add-sub-task-modal.component';
import { SubTaskListModalComponent } from '../sub-task-list-modal/sub-task-list-modal.component';
import { ProjectSchedule, SubTask, SubTaskCount, TaskDetail } from '../task-interface';
import { UploadAttachmentsModalComponent } from '../upload-attachments-modal/upload-attachments-modal.component';
import Swal from 'sweetalert2';
import { StartandstropModaalComponent } from 'src/app/shared/components/startandstrop-modaal/startandstrop-modaal.component';
import { NewGetV2UserListApplicationComponent } from 'src/app/shared/components/new-get-v2-user-list-application/new-get-v2-user-list-application.component';
import { environment } from 'src/environments/environment';
import { UpdateStatusComponent } from 'src/app/shared/components/update-status/update-status.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { CommonHttpServiceCallerService } from 'src/app/core/services/common-http-service-caller.service';
import { event } from 'jquery';



@Component({
  selector: 'app-project-schedule-view-with-sub-task',
  templateUrl: './project-schedule-view-with-sub-task.component.html',
  styleUrl: './project-schedule-view-with-sub-task.component.scss'
})
export class ProjectScheduleViewWithSubTaskComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ProjectTaskId: any
  @Input() projectScheduleObject: any
  subTaskList: SubTask[];
  subTaskView: any
  subTaskCount: SubTaskCount;
  subTaskListDetails: any
  public Editor = ClassicEditor;
  askStartEndCondition: any = {
    "techAttendacenId": 0,
    "startTask": ""
  };
  taskList: TaskDetail;
  timeDifference: string;
  private intervalId: any;
  subTaskactiveId: number = 1
  @Input() ProjectsubTaskId: any;
  projectManagementStatusList: any;
  currentUserID: any;
  startTaskAccessRight: boolean = false;
  attendanceTaskSubTaskList: any[] = [];
  subTaskCompleteUpdateButtonCheckConditionShownHide: boolean = false;
  currentUserRole: any;
  currentUserId: any;
  currentUserAccessGroup: any;

  constructor(private authService: AuthAssetService,
    public modal: NgbOffcanvas, private lightbox: Lightbox,
    private commonFunctionService: CommonFunctionService,
    private departmentService: DepartmentService,
    private modalService: NgbModal, private projectScheduleService: ProjectScheduleService,
    private offcanvasService: NgbOffcanvas
    , public activeOffcanvas: NgbActiveOffcanvas, private cdr: ChangeDetectorRef, private commonHttpServiceCallerService: CommonHttpServiceCallerService
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnInit(): void {

    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    this.currentUserId = JSON.parse(localStorage.getItem("currentUser")).userId;
    this.currentUserAccessGroup = JSON.parse(localStorage.getItem("currentUser")).accessGroupName;

    this.apiCall()

  }
  apiCall() {
    this.currentUserID = this.authService.getUserInfoID();
    this.getV2_MX_ProjectSubTaskList()
    this.getV2_MX_ProjectScheduleTaskDetail();


  }

  getV2_TechAttendanceTaskSubTaskList_ServerPaging(): void {
    let payload = {
      ProjectTaskId: this.ProjectsubTaskId,
      TaskType: 'Sub-Task',
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
  GetV2_ProjectTaskStartEndCondition() {
    let paylod = {
      ProjectTaskId: this.ProjectsubTaskId,
      TaskType: 'Sub-Task'
    }
    this.projectScheduleService.GetV2_ProjectTaskStartEndCondition(paylod).subscribe((res: any) => {
      this.askStartEndCondition = res.obj

      if (this.askStartEndCondition.startDateTime) {
        this.timeDifference = this.getHoursAndMinutesDifference(this.askStartEndCondition.startDateTime + '');


        this.intervalId = setInterval(() => {
          this.timeDifference = this.getHoursAndMinutesDifference(this.askStartEndCondition.startDateTime + '');
        }, 1000);
        this.getV2_TechAttendanceTaskSubTaskList_ServerPaging();
      }
    })
  }

  getHoursAndMinutesDifference(pastDateStr) {
    return this.commonFunctionService.getHoursAndMinutesDifference(pastDateStr)
  }

  getV2_MX_ProjectScheduleTaskDetail() {
    let payload = {
      ProjectTaskId: this.ProjectTaskId
    }
    this.projectScheduleService.getV2_MX_ProjectScheduleTaskDetail(payload).subscribe((res: any) => {
      this.taskList = res.obj;

    })

  }


  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  toUpperCaseword(data: string) {
    if (data) return data.toUpperCase();
    return "";
  }
  close(value: any) {
    this.activeOffcanvas.dismiss(value)
  }



  getV2_MX_ProjectSubTaskList() {
    let payload = {
      ProjectTaskId: this.ProjectTaskId
    }
    this.subTaskListDetails = {}
    this.projectScheduleService.getV2_MX_ProjectSubTaskList(payload).subscribe((res: any) => {
      this.subTaskList = res.subTaskList;
      if (this.subTaskList.length == 0) {
        this.close('Cross click')
      }
      this.subTaskCount = res.subTaskCount
      if (this.ProjectsubTaskId == 0) {
        if (this.subTaskList.length != 0) {
          this.getV2_MX_ProjectScheduleSubTaskDetail(this.subTaskList[0].projectSubTaskId)
        }
      } else {
        this.getV2_MX_ProjectScheduleSubTaskDetail(this.ProjectsubTaskId)
      }

    })
  }
  getV2_MX_ProjectScheduleSubTaskDetail(ProjectSubTaskId) {
    this.ProjectsubTaskId = ProjectSubTaskId;
    this.subTaskactiveId = 1
    this.subTaskListDetails = {}
    console.log("ProjectSubTaskId", ProjectSubTaskId)
    this.cdr.detectChanges();
    let payload = {
      ProjectSubTaskId: ProjectSubTaskId
    }
    this.selectedTech = []
    this.projectScheduleService.getV2_MX_ProjectScheduleSubTaskDetail(payload).subscribe((res: any) => {
      this.subTaskListDetails = res.obj;
      this.getV2_subTaskProgressupdatelist();
      this.GetV2_MX_ProjectSubTaskMembersList();
      this.GetV2_ProjectTaskStartEndCondition();
      this.getV2_TechAttendanceTaskSubTaskList_ServerPaging();
      this.Get_V3_SubTaskCompleteUpdateButtonCheckCondition()

    })
  }
  AfterDeleteCall(event) {
    this.getV2_subTaskProgressupdatelist();
  }
  Get_V3_SubTaskCompleteUpdateButtonCheckCondition() {
    let url = "api/ProjectManagement/Get_V3_SubTaskCompleteUpdateButtonCheckCondition";
    let paylod = {
      ProjectSubTaskId: this.ProjectsubTaskId,
    }
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {

      this.subTaskCompleteUpdateButtonCheckConditionShownHide = res.obj.isCompleteUpdateButton


    });


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
  // createSubTask(): void {
  //   const modalRef = this.modalService.open(AddSubTaskModalComponent, {
  //     ariaLabelledBy: "modal-basic-title",
  //     size: "lg",
  //     centered: true,
  //     backdrop: "static",
  //     keyboard: false,
  //   });
  //   modalRef.componentInstance.ProjectTaskId = this.ProjectTaskId;
  //   modalRef.componentInstance.taskList = this.taskList;
  //   modalRef.result.then((result) => {
  //     if (result) {
  //       if (result.value == "submit") {
  //         if (result) {
  //           this.getV2_MX_ProjectSubTaskList();
  //         }

  //       }
  //     }
  //   });


  // }
  isAddSubTaskVisible: any
  GetV3_CheckCreateAddSubTaskAvailability(projectTaskDetails) {
    let url = "api/ProjectManagement/GetV3_CheckCreateAddSubTaskAvailability";
    let paylod = {
      ProjectTaskId: this.ProjectTaskId,
    }
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {

      this.isAddSubTaskVisible = res.isAddSubTaskVisible;
      if (res.isAddSubTaskVisible == 1) {


        const modalRef = this.modalService.open(AddSubTaskModalComponent, {
          ariaLabelledBy: "modal-basic-title",
          size: "lg",
          centered: true,
          backdrop: "static",
          keyboard: false,
          scrollable: true
        });
        modalRef.componentInstance.taskList = projectTaskDetails;
        modalRef.result.then((result) => {
          if (result) {
            if (result.value == "submit") {
              if (result) {
                this.openSuccessModalSubTask(result.res, projectTaskDetails.projectTaskId,);

              }
            }
          }
        });
      } else if (res.isAddSubTaskVisible == 0) {
        this.openModalAddDetletedTime('You cannot add a subtask because work on the main task has already begin.');

      }

    });


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
  createSubTask(projectTaskDetails): void {
    this.GetV3_CheckCreateAddSubTaskAvailability(projectTaskDetails)

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
      "Sub-task created successfully. Do you want to create another sub-task??"
    modalRef.componentInstance.subTitle1 = "";
    modalRef.componentInstance.buttonName = " New Create Sub Task";
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.apiCall();
          this.createSubTask(this.taskList);
          // this.getV2_MX_ProjectScheduleSubTaskDetail(successMesage.projectSubTaskId);

        } else {
          this.apiCall()
        }
      }
    });

  }

  openTaskList(content: any) {
    const modalRef = this.offcanvasService.open(content, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas2",
    });

    modalRef.result
      .then((result) => {

      })
      .catch((error) => {

      });

  }


  addDocumentsModal() {

    const modalRef = this.modalService.open(UploadAttachmentsModalComponent, {
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
  subTaskProgressUpdateList: any[] = [];
  subTaskFileValue: any;
  maxCharMessage = 3000
  MessageContainsubTask: any = ''

  onFileSelected(event: any, type: any) {
    this.subTaskFileValue = null;
    const file = event.target.files[0];
    console.log(file, "ss")
    if (file) {
      this.subTaskFileValue = {
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
  checkDeleteButtonVisible(createdById, projectTaskStatusId) {
    return this.authService.getRole() == 'System Administrator' || (createdById == this.authService.getUserInfoID() && projectTaskStatusId == 2) ? true : false
  }
  openModalDeleteSubtask(projectSubTask: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to delete the Sub-Task?";
    modalRef.componentInstance.subTitle =
      "Deleting your Sub-Task will remove it from the database";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.DeleteV2_ProjectScheduleSubTask(projectSubTask.projectSubTaskId)
        }
      }
    });
  }
  DeleteV2_ProjectScheduleSubTask(id) {
    let url = 'api/ProjectManagement/DeleteV2_ProjectScheduleSubTask'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, { ProjectSubTaskId: id }).subscribe({
      next: (res) => {
        this.ProjectsubTaskId = 0
        this.apiCall();
        this.success(res)
      },
    });
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
          this.subTaskFileValue = null;
          this.resetDelete('subTaskFile')

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
  @ViewChild("scrollframesubTask", { static: false })
  scrollframesubTask: ElementRef;

  scrollContainersubTask: any;
  submitChatsubTask() {
    const formdata = new FormData();
    formdata.append("SubTaskId", this.ProjectsubTaskId);
    formdata.append("ScheduleNo", this.projectScheduleObject.scheduleNo);
    formdata.append("SubTaskNo", this.subTaskListDetails.subTaskNo);
    formdata.append("IsClient", this.authService.getRole() === "Client User" ? 'true' : 'false');
    formdata.append("AccessGroup", this.authService.getaccessGroupName());
    if (this.MessageContainsubTask) {
      formdata.append("MessageContain", this.MessageContainsubTask.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>'));
    }
    if (this.subTaskFileValue) {
      formdata.append("FileType", this.subTaskFileValue.fileType);
      formdata.append("file", this.subTaskFileValue.file, this.subTaskFileValue.file.name); // Assuming single file upload

    }
    this.projectScheduleService.createV2_SubTaskProgressupdate(formdata).subscribe((res) => {
      this.scrollToTop();
      this.resetDelete('subTaskFile')
      this.MessageContainsubTask = "";
      this.success(res);
      this.getV2_subTaskProgressupdatelist();
      this.getV2_TechAttendanceTaskSubTaskList_ServerPaging();
      this.Get_V3_SubTaskCompleteUpdateButtonCheckCondition()
      this.subTaskFileValue = null
    });

  }
  scrollToTop() {
    if (this.scrollContainersubTask) {
      this.scrollContainersubTask.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
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
  ngAfterViewChecked(): void {
    if (this.subTaskProgressUpdateList.length != 0) {
      if (this.scrollframesubTask && !this.scrollContainersubTask) {
        this.scrollContainersubTask = this.scrollframesubTask.nativeElement;
      }
    }

  }
  subTaskTotalRecordsFromApi: number = 0;
  subTaskFrom: number = 0;
  subTaskTo: number = 0;
  subTaskPageSize: number = 10;
  getV2_subTaskProgressupdatelist(
    displayLength: number = 500,
    startIndex: Number = 0
  ) {
    this.subTaskProgressUpdateList = [];
    let payload = {
      SubTaskId: this.ProjectsubTaskId,
      // displayLength: displayLength,
      // displayStart: startIndex,
    };
    this.projectScheduleService.getV2_SubTaskProgressupdatelist(payload)
      .subscribe((res: any) => {
        if (res.list.length > 0) {
          this.subTaskProgressUpdateList = res.list;

          this.subTaskProgressUpdateList.sort((a, b) => b.subTaskProgressUpdateId - a.subTaskProgressUpdateId);

          this.subTaskTotalRecordsFromApi =
            res.list[0].totalCount;
          this.subTaskFrom = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.subTaskTo = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.subTaskPageSize = displayLength;
        } else if (
          this.subTaskProgressUpdateList.length == 0 &&
          res.list.length == 0
        ) {
          // this.ticketDisscusionPage = 1;
          this.subTaskTotalRecordsFromApi = 0;
          this.subTaskFrom = 0;
          this.subTaskTo = 0;
          this.subTaskPageSize = displayLength;
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

  createV2_MX_TechAttendanceProject_Start(value: any) {
    let requestData: any = {
      TechPicUrlStartBase64: value.webcamImageimageAsDataUrl,
      StartRemark: value.remark,
      ProjectTaskId: this.ProjectsubTaskId,
      TaskType: "Sub-Task",
      ProjectScheduleId: this.projectScheduleObject.projectScheduleId
    };
    this.projectScheduleService.CreateV2_MX_TechAttendanceProject_Start(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.GetV2_ProjectTaskStartEndCondition();
        this.apiCall();

        this.subTaskactiveId = 1
      },
      (err) => {
        this.error(err);
        this.openModaWaringConf(err)
      }
    );

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

  UpdateV2_MX_TechAttendanceProject_End(value: any) {
    let requestData: any = {
      TechPicUrlEndBase64: value.webcamImageimageAsDataUrl,
      EndRemark: value.remark,
      TechAttendacenId: this.askStartEndCondition.techAttendacenId
    };
    this.projectScheduleService.UpdateV2_MX_TechAttendanceProject_End(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.GetV2_ProjectTaskStartEndCondition();
        this.apiCall();
        this.subTaskactiveId = 1
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
          this.GetV2_ProjectTaskStartEndCondition();
          this.apiCall();
          this.subTaskactiveId = 1
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
    modalRef.componentInstance.followUpMemberList = this.selectedTech.length != 0 ? this.selectedTech : [];
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
  GetV2_MX_ProjectSubTaskMembersList() {
    let payload = {
      ProjectSubTaskId: this.ProjectsubTaskId
    }
    this.projectScheduleService
      .GetV2_MX_ProjectSubTaskMembersList(
        payload
      )
      .subscribe((res: any) => {
        this.selectedTech=[];
        this.projectTaskMembersList = res.list ? res.list : [];
        if (this.projectTaskMembersList.length > 0) {
          this.projectTaskMembersList.forEach((ele: any) => {
            this.selectedTech.push({
              id: ele.userId
              , ...ele
            })
          })
          this.checkTheSelectTechLoginOrNot(this.projectTaskMembersList)


        } else {
          this.startTaskAccessRight = false;
          this.selectedTech=[];
        }
        this.Get_V3_SubTaskCompleteUpdateButtonCheckCondition()
      });
  }
  checkTheSelectTechLoginOrNot(selectedTech) {

    selectedTech.forEach((ele) => {
      if (this.currentUserID == ele.userId) {
        this.startTaskAccessRight = true
      }
    })

  }

  imageUrl = environment.apiUrl;
  submit(selectedTechValue) {
    let sendingPayloadArray = [];
    selectedTechValue.forEach((element) => {
      sendingPayloadArray.push({
        UserId: element.id,
        ProjectSubTaskId: this.ProjectsubTaskId
      });
    });
    this.projectScheduleService
      .CreateV2_MX_ProjectSubTaskMembers(sendingPayloadArray)
      .subscribe((res: any) => {
        this.success(res);
        this.selectedTech = []
        this.GetV2_MX_ProjectSubTaskMembersList();
      });
  }


  getProjectManagementStatus(type, data) {
    if (this.askStartEndCondition.startTask == 'False' &&
      this.askStartEndCondition.techAttendacenId > 0) {
      this.openMessageIfProgressTaskSubtaskStop();
    } else {
      this.projectScheduleService.getProjectManagementStatus(type).subscribe((res: any) => {
        this.projectManagementStatusList = res
        this.openStatusModal(data)
      })
    }
  }

  openMessageIfProgressTaskSubtaskStop() {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = 'Your Subtask has already started, so first stop the Subtask. After that, you can update the Subtask status.';
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      if (result) {

      }
    });
  }

  openStatusModal(data) {
    console.log(data, "gg")
    const modalRef = this.modalService.open(UpdateStatusComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    // const filteredData = this.projectManagementStatusList.filter(item => item.assetStatusId !== data.projectSubTaskStatusId);
    let filteredData = this.projectManagementStatusList.filter(item => item.assetStatusId !== data.projectSubTaskStatusId);
    if (data.projectSubTaskStatusId == 30) {
      filteredData = filteredData.filter(item => item.assetStatusId !== 2);
    }
    modalRef.componentInstance.assetListStatus = filteredData;
    modalRef.result.then((result) => {
      if (result) {
        if (result.value == "success") {
          this.GetV2_UpdateMX_ProjectSubTaskStatus(result);
          this.Get_V3_SubTaskCompleteUpdateButtonCheckCondition();

        } else {
          this.getV2_MX_ProjectScheduleSubTaskDetail(this.ProjectsubTaskId);
          this.Get_V3_SubTaskCompleteUpdateButtonCheckCondition()
        }
      }
    });
  }


  GetV2_UpdateMX_ProjectSubTaskStatus(sendObject: any) {
    let paylod = {
      ProjectSubTaskId: this.ProjectsubTaskId,
      ProjectSubTaskStatusId: sendObject.statusId,
      ProjectSubTaskStatusName: sendObject.statusName,
      Remark: sendObject.remark
    }



    this.projectScheduleService.GetV2_UpdateMX_ProjectSubTaskStatus(paylod).subscribe((res: any) => {
      this.getV2_MX_ProjectScheduleSubTaskDetail(this.ProjectsubTaskId);
      this.apiCall()
      this.GetV2_ProjectTaskStartEndCondition()
      this.Get_V3_SubTaskCompleteUpdateButtonCheckCondition()
      this.success(res)
    })
  }

  openModalDeleteConf(SubTaskMembersId) {
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
          this.deleteV3_SubTaskMember(SubTaskMembersId);
        }
      }
    });
  }
  deleteV3_SubTaskMember(SubTaskMembersId) {
    let url = "api/ProjectManagement/DeleteV3_SubTaskMember";
    let paylod = {
      SubTaskMembersId: SubTaskMembersId
    }
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.success(res);
      this.GetV2_MX_ProjectSubTaskMembersList();

    });


  }
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
