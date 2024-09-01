import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { ViewEventFullDetailsComponent } from '../../project-setup/view-event-full-details/view-event-full-details.component';
import { ProjectScheduleViewWithSubTaskComponent } from '../project-schedule-view-with-sub-task/project-schedule-view-with-sub-task.component';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal.component';
import { fromEvent, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment.prod';
import { Location } from '@angular/common';
import { AddSubTaskModalComponent } from '../add-sub-task-modal/add-sub-task-modal.component';
import { ProjectTaskDetailsComponent } from '../project-task-details/project-task-details.component';
import { ProjectSchedule } from '../task-interface';
import { UpdateStatusComponent } from 'src/app/shared/components/update-status/update-status.component';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';



@Component({
  selector: 'app-project-schedule-view-with-task',
  templateUrl: './project-schedule-view-with-task.component.html',
  styleUrl: './project-schedule-view-with-task.component.scss'
})
export class ProjectScheduleViewWithTaskComponent implements OnInit {
  activeId = 1;
  imgUrl: any = environment.apiUrl;
  arrayListDropDownStatus: any = [];
  isProject: boolean = false;
  label: any = "Project Schedule Management"; 
  breadCrumbItems: any = [
    { label: "Project Schedule" },
    { label: "Project Schedule View", active: true },
  ];
  storeProjectScheduleId: number = 1;
  projectScheduleListTask: any = [];
  storeProjectScheduleObject: any;
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchProjectScheduleId: null,
    SearchTaskTitle: null,
    SearchProjectTaskStatusId: null,
  };
  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  projectScheduleList = [];
  page = 1;
  collectionSize = 0;
  projectScheduleeName: any;
  projectManagementStatusList: any = [];
  currrentProjectTaskId: any;
  currentUserRole: any;
  currentUserAccessGroup: any;
  currentUserId: any;
  constructor(
    private departmentService: DepartmentService,
    private authService: AuthAssetService,
    private route: ActivatedRoute,
    private router: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private offcanvasService: NgbOffcanvas,
    private projectScheduleService: ProjectScheduleService,
    private location: Location,
    private commonHttpServiceCallerService: CommonHttpServiceCallerService
  ) {
    this.isProject = this.authService.getisProject();
    if (this.projectScheduleService.sendProjectScheduleId == 0) {
      this.router.navigate(["/project-management/task-setup/project-schedule-list"]);
    } else {
      this.storeProjectScheduleId = this.projectScheduleService.sendProjectScheduleId;
      //  = { ...this.projectScheduleService.projectScheduleObject }
      this.payload.SearchProjectScheduleId = this.storeProjectScheduleId;
      this.apiCall()
    }
  }
  selectedDropDownTaskStatusIdValue: any = null
  ngOnInit(): void {
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    this.currentUserId = JSON.parse(localStorage.getItem("currentUser")).userId;
    this.currentUserAccessGroup = JSON.parse(localStorage.getItem("currentUser")).accessGroupName;

  }
  apiCall() {
    this.loadData();
    this.getV2_MX_ProjectScheduleDetail(this.storeProjectScheduleId);
    this.getProjectManagementStatus('ProjectTaskStatusMobile')
  }

  
 

  
  getProjectManagementStatus(type) {
    
    this.projectScheduleService.getProjectManagementStatus(type).subscribe((res: any) => {
      this.projectManagementStatusList = res
    })
  }
  

  openStatusModal(data) {
    this.currrentProjectTaskId = data.projectTaskId
    const modalRef = this.modalService.open(UpdateStatusComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    const filteredData = this.projectManagementStatusList.filter(item => item.assetStatusId !== data.projectTaskStatusId);


    modalRef.componentInstance.assetListStatus = filteredData;

    modalRef.result.then((result) => {
      if (result) {
        if (result.value == "success") {
          this.GetV2_UpdateMX_ProjectTaskStatus(result);
        } else {
          this.loadData();
          this.getV2_MX_ProjectScheduleDetail(this.storeProjectScheduleId);
          this.getProjectManagementStatus('ProjectTaskStatusUpdatePortal')
        }
      }
    });
  }


  GetV2_UpdateMX_ProjectTaskStatus(sendObject: any) {
    let paylod = {
      ProjectTaskId: this.currrentProjectTaskId,
      ProjectTaskStatusId: sendObject.statusId,
      ProjectTaskStatusName: sendObject.statusName,
      Remark: sendObject.remark
    }
    this.projectScheduleService.GetV2_UpdateMX_ProjectTaskStatus(paylod).subscribe((res: any) => {
      this.loadData();
      this.getV2_MX_ProjectScheduleDetail(this.storeProjectScheduleId);
      this.getProjectManagementStatus('ProjectTaskStatusUpdatePortal')
      this.success(res)
    })
  }
  getV2_MX_ProjectScheduleDetail(ProjectScheduleId) {
    this.storeProjectScheduleObject = {}
    let paylod = {
      ProjectScheduleId: ProjectScheduleId
    }
    this.projectScheduleService.getV2_MX_ProjectScheduleDetail(paylod).subscribe((res: any) => {
      this.storeProjectScheduleObject = res.obj;
     
    })

  }
  onDropdownTaskStatusValueChange(value) {
    this.payload.SearchProjectTaskStatusId = this.selectedDropDownTaskStatusIdValue ? this.selectedDropDownTaskStatusIdValue : null
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.loadData();
  }

  calculateProgress(totalSubTask: number, totalSubTaskCompleted: number): number {
    if (totalSubTask === 0) {
      return 0;
    }
    return Math.round((Number(totalSubTaskCompleted) / Number(totalSubTask)) * 100);
  }

  getProgressStyle(totalSubTask: number, totalSubTaskCompleted: number): any {
    const progress = this.calculateProgress(totalSubTask, totalSubTaskCompleted);
    return {
      background: `conic-gradient(#44a8db ${progress * 3.6}deg, #e0e0e0 ${progress * 3.6}deg)`
    };
  }
  refreshThePage() {

  }

  openEventFullDetailsSubTaskModalPopup(ProjectTaskId, projectSubTaskId) {
    const modalRef = this.offcanvasService.open(
      ProjectScheduleViewWithSubTaskComponent,
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
    modalRef.componentInstance.projectScheduleObject = this.storeProjectScheduleObject;


    modalRef.result
      .then((result) => {
        this.loadData();
        this.getV2_MX_ProjectScheduleDetail(this.storeProjectScheduleId);
        this.getProjectManagementStatus('ProjectTaskStatusUpdatePortal')

      })
      .catch((result) => {
        this.loadData();
        this.getV2_MX_ProjectScheduleDetail(this.storeProjectScheduleId);
        this.getProjectManagementStatus('ProjectTaskStatusUpdatePortal')

      });
  }




  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }



  openEventFullDetailsModalPopup(content: any): void {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          console.log("result", result)
        },
        (reason) => {

        }
      );
  }


  loadData() {

    this.projectScheduleService
      .getV2_MX_ProjectScheduleTaskList_ServerPaging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.projectScheduleListTask = res.list;
        if (this.projectScheduleListTask.length > 0) {
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

  getTaskStatus(totalTask: number, totalTaskCompleted: number) {
    // if (totalTask == 0 && totalTaskCompleted == 0) {
    //   return 0
    // }
    // const pendingTasks = totalTask - totalTaskCompleted;
    // const pendingPercentage = (pendingTasks / totalTask) * 100;
    // const completedPercentage = 100 - pendingPercentage;  
    // return completedPercentage;


    if (totalTask === 0 && totalTaskCompleted === 0) {
      return '0%';
    }
    const completedPercentage = Math.round((totalTaskCompleted / totalTask) * 100);
    return completedPercentage.toString() + '%';

  }

  getTaskStatusColor(totalTask: number, totalTaskCompleted: number) {
    if (totalTask == 0 && totalTaskCompleted == 0) {
      return 0
    }
    const pendingTasks = totalTask - totalTaskCompleted;
    const pendingPercentage = (pendingTasks / totalTask) * 100;
    const completedPercentage = 100 - pendingPercentage;
    return completedPercentage;

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

  createTask(): void {
    if (this.storeProjectScheduleObject.projectScheduleStatusId == 49) {
      this.openModalAddDetletedTime('This schedule has been deleted, so you cannot add a task.');

    } else {
      const modalRef = this.modalService.open(AddTaskModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        centered: true,
        backdrop: "static",
        keyboard: false, scrollable: true
      });
      modalRef.componentInstance.storeProjectScheduleId = this.storeProjectScheduleId;
      modalRef.componentInstance.storeProjectScheduleObject = this.storeProjectScheduleObject;
      modalRef.result.then((result) => {
        if (result) {
          if (result.value == "submit") {
            if (result) {
              this.openSuccessModalTask(result.res);

            }

          }
          this.loadData();
          this.getV2_MX_ProjectScheduleDetail(this.storeProjectScheduleId);
          this.getProjectManagementStatus('ProjectTaskStatusUpdatePortal');
          document.body.style.overflow = 'auto';
        }
      });
    }

  }

  clearData() {
    this.selectedDropDownTaskStatusIdValue = null;
    this.projectScheduleeName = null;
    this.payload.SearchTaskTitle = this.projectScheduleeName;
    this.payload.SearchProjectTaskStatusId = this.selectedDropDownTaskStatusIdValue;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.loadData();

  }
  openSuccessModalTask(successMesage) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Main task created successfully. Would you like to create a sub-task for this task? "
    modalRef.componentInstance.subTitle1 = "Alternatively, if you want to set up your main task to start, please press 'Yes'";
    modalRef.componentInstance.buttonName = " Update Task ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.openViewHandleTask(
            successMesage.projectTaskId, this.storeProjectScheduleObject
          );
        }
        this.loadData();
        this.getV2_MX_ProjectScheduleDetail(this.storeProjectScheduleId);
        this.getProjectManagementStatus('ProjectTaskStatusUpdatePortal')
        document.body.style.overflow = 'auto';
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
          this.loadData();
          this.getV2_MX_ProjectScheduleDetail(this.storeProjectScheduleId);
          this.getProjectManagementStatus('ProjectTaskStatusUpdatePortal');
          document.body.style.overflow = 'auto';
        } else {
          this.loadData();
          this.getV2_MX_ProjectScheduleDetail(this.storeProjectScheduleId);
          this.getProjectManagementStatus('ProjectTaskStatusUpdatePortal');
          document.body.style.overflow = 'auto';
        }
      }
    });

  }


  @ViewChild("inputerProjectScheduleeName", { static: false })
  inputerProjectScheduleeName: ElementRef;

  ngAfterViewInit() {
    // server-side Search
    fromEvent(this.inputerProjectScheduleeName.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeProjectScheduleChange();
        })
      )
      .subscribe();
  }
  onTypeProjectScheduleChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchTaskTitle = this.projectScheduleeName;
    this.loadData();
  }
  showinString(str: string) {
    if (str) {
      if (str.length >= 45) {
        return str.slice(0, 45) + "...";
      } else {
        return str;
      }
    }
    else {
      return str;
    }
  }

  checkDeleteButtonVisible(createdById,projectTaskStatusId) {
    return this.authService.getRole() == 'System Administrator' || (createdById == this.authService.getUserInfoID() && projectTaskStatusId==2) ? true : false
  }

  openModalDeleteProjectSchedule(ProjectTask: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to delete the Task?";
    modalRef.componentInstance.subTitle =
      "Deleting your Task will remove it from the database";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteV2_ProjectScheduleTaskList(ProjectTask.projectTaskId)
        }
      }
    });
  }
  deleteV2_ProjectScheduleTaskList(id) {
    let url='api/ProjectManagement/DeleteV2_ProjectScheduleMainTask'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url,{ ProjectTaskId: id }).subscribe({
      next: (res) => {
        this.loadData();
        this.success(res)
      },
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

  back(): void {
    this.location.back();
  }

  isAddSubTaskVisible: any
  GetV3_CheckCreateAddSubTaskAvailability(projectTaskDetails) {
    let url = "api/ProjectManagement/GetV3_CheckCreateAddSubTaskAvailability";
    let paylod = {
      ProjectTaskId: projectTaskDetails.projectTaskId,
    }
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
     
      this.isAddSubTaskVisible = res.isAddSubTaskVisible;
      if (res.isAddSubTaskVisible == 1) {


        const modalRef = this.modalService.open(AddSubTaskModalComponent, {
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
      }else if(res.isAddSubTaskVisible == 0) {
        this.openModalAddDetletedTime('You cannot add a subtask because work on the main task has already begin.');
  
      }
      
    });


  }

  createSubTask(projectTaskDetails): void {
    if (this.storeProjectScheduleObject.projectScheduleStatusId == 49) {
      this.openModalAddDetletedTime('This schedule has been deleted, so you cannot add a sub-task.');

    } else {
    this.GetV3_CheckCreateAddSubTaskAvailability(projectTaskDetails)
    }
  }



  openViewHandleTask(projectTaskId, projectScheduleObject): void {
    const modalRef = this.offcanvasService.open(ProjectTaskDetailsComponent, {
      scroll: false,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4",
    });
    modalRef.componentInstance.ProjectTaskId = projectTaskId;
    modalRef.componentInstance.projectScheduleObject = projectScheduleObject;
    modalRef.result
      .then((result) => {
        setTimeout(() => {
          this.apiCall();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.resetScroll();
        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
          this.apiCall();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.resetScroll();
        }, 100);
      });



  }
  // Function to reset the scroll style
  resetScroll() {
    document.body.style.overflow = 'auto';
  }
  openModalCantAddTask(StatusName) {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = 'You are unable to create the task because the schedule has already been  ' + StatusName + ' .';
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      console.log(result, "result");
      if (result) {
        if (result == "Close click") {

        }
      }
    });
  }
  ngOnDestroy() {
    this.resetScroll();
  }

}
