import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { environment } from 'src/environments/environment';
import { ProjectTaskDetailsComponent } from '../../task-management/project-task-details/project-task-details.component';
import { ProjectScheduleViewSubTaskSingleComponent } from '../project-schedule-view-sub-task-single/project-schedule-view-sub-task-single.component';

@Component({
  selector: 'app-start-main-task-sub-task-list',
  templateUrl: './start-main-task-sub-task-list.component.html',
  styleUrl: './start-main-task-sub-task-list.component.scss'
})
export class StartMainTaskSubTaskListComponent implements OnInit {
  imgUrl: any = environment.apiUrl;
  projectTaskSubTaskUnionList_StartTask: any = [];
  @Output() completeEmit = new EventEmitter();
  constructor(private commonFunctionService: CommonFunctionService, private modalService: NgbModal, private offcanvasService: NgbOffcanvas, private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private authAssetService: AuthAssetService,) {

  }
  isProject: boolean = true;
  ngOnInit(): void {
    this.isProject = this.authAssetService.getisProject();

    this.GetV2_MX_ProjectTaskSubTaskUnionList_StartTaskOnly_ServerPaging();
  }

  payload: any = {
    PageNumber: 1,
    PageSize: 10,
  }
  page = 1;
  pageNo = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;

  GetV2_MX_ProjectTaskSubTaskUnionList_StartTaskOnly_ServerPaging() {
    let url = 'api/ProjectManagementMobile/GetV2_MX_ProjectTaskSubTaskUnionList_StartTaskOnly_ServerPaging'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, this.payload).subscribe((response: any) => {
      this.projectTaskSubTaskUnionList_StartTask = response.list;
      if (this.projectTaskSubTaskUnionList_StartTask.length > 0) {
        this.totalRecords = response.list[0].totalCount;
        this.from = response.list.reduce(
          (min, p) => (p.rowNum < min ? p.rowNum : min),
          response.list[0].rowNum
        );
        this.to = response.list.reduce(
          (max, p) => (p.rowNum > max ? p.rowNum : max),
          response.list[0].rowNum
        );
        this.pageSize = this.payload.PageSize;
      } else {
        this.totalRecords = 0;
        this.from = 0;
        this.to = 0;
        this.pageSize = this.payload.PageSize;
      }
    })
  }

  loadPage(pageNo: number) {
    this.pageNo = pageNo;
    this.payload.PageSize = this.pageSize;
    this.payload.PageNumber = pageNo;
    this.GetV2_MX_ProjectTaskSubTaskUnionList_StartTaskOnly_ServerPaging();
  }


  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
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
  openViewHandleTask(projectTaskId, projectScheduleObject): void {
    this.CommonHttpServiceCallerService.letOpenOffCancvas = true
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
          this.pageSize = 10;
          this.pageNo = 1;
          this.payload.PageSize = this.pageSize;
          this.payload.PageNumber = this.pageNo;
          this.GetV2_MX_ProjectTaskSubTaskUnionList_StartTaskOnly_ServerPaging();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.resetScroll();
          this.completeEmit.emit(true)

          this.CommonHttpServiceCallerService.letOpenOffCancvas = false
        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
          this.pageSize = 10;
          this.pageNo = 1;
          this.payload.PageSize = this.pageSize;
          this.payload.PageNumber = this.pageNo;
          this.GetV2_MX_ProjectTaskSubTaskUnionList_StartTaskOnly_ServerPaging();
          this.offcanvasService.dismiss();

          this.CommonHttpServiceCallerService.letOpenOffCancvas = false
          this.modalService.dismissAll()
          this.resetScroll();
          this.completeEmit.emit(true)

        }, 100);
      });
  }
  openViewHandleSubTask(projectTaskId, projectSubTaskId, projectScheduleObject): void {
    this.CommonHttpServiceCallerService.letOpenOffCancvas = true
    const modalRef = this.offcanvasService.open(ProjectScheduleViewSubTaskSingleComponent, {
      scroll: false,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4",
    });
    modalRef.componentInstance.ProjectTaskId = projectTaskId;
    modalRef.componentInstance.projectSubTaskId = projectSubTaskId;
    modalRef.componentInstance.projectScheduleObject = projectScheduleObject;
    modalRef.result
      .then((result) => {
        setTimeout(() => {
          this.GetV2_MX_ProjectTaskSubTaskUnionList_StartTaskOnly_ServerPaging(); this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.resetScroll();
          this.CommonHttpServiceCallerService.letOpenOffCancvas = false
          this.completeEmit.emit(true)

        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
          this.GetV2_MX_ProjectTaskSubTaskUnionList_StartTaskOnly_ServerPaging(); this.offcanvasService.dismiss();

          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.CommonHttpServiceCallerService.letOpenOffCancvas = false
          this.completeEmit.emit(true)

          this.resetScroll();
        }, 100);
      });



  }
  resetScroll() {
    document.body.style.overflow = 'auto';
  }

  timeDifference: any
  getTimeProgress(startDateTime) {
    return this.getHoursAndMinutesDifference(startDateTime);
  }


  getHoursAndMinutesDifference(targetDateString) {
    // Parse the target date string
    const timeData = targetDateString.split(' ').filter(item => item !== "").join(' ');

    // Parse the cleaned date string
    const targetDate = new Date(timeData);
    const currentDate = new Date();

    if (isNaN(targetDate.getTime())) {
      return 'Invalid date';
    }

    // Calculate the absolute difference in milliseconds
    const differenceInMs = Math.abs(currentDate.getTime() - targetDate.getTime());

    // Convert milliseconds to total seconds
    const differenceInSeconds = Math.floor(differenceInMs / 1000);

    // Convert total seconds to total minutes and remaining seconds
    const totalMinutes = Math.floor(differenceInSeconds / 60);
    const remainingSeconds = differenceInSeconds % 60;

    // Convert total minutes to total hours and remaining minutes
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${totalHours} hrs : ${remainingMinutes} min : ${remainingSeconds} sec`;
  }



}
