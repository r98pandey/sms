
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { ViewEventFullDetailsComponent } from '../../project-setup/view-event-full-details/view-event-full-details.component';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { fromEvent, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment.prod';
import { Location } from '@angular/common';
import { UpdateStatusComponent } from 'src/app/shared/components/update-status/update-status.component';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';



@Component({
  selector: 'app-task-list-dashbaord',
  templateUrl: './task-list-dashbaord.component.html',
  styleUrl: './task-list-dashbaord.component.scss'
})
export class TaskListDashbaordComponent implements OnInit {
  activeId = 1;
  imgUrl: any = environment.apiUrl;
  arrayListDropDownStatus: any = [];
  isProject: boolean = false;
  label: any = "Task Schedule Management";
  breadCrumbItems: any = [
    { label: "Task Schedule" },
    { label: "Task Schedule View", active: true },
  ];
  @Input() storeProjectScheduleId: number = 1;
  projectScheduleListTask: any = [];
  storeProjectScheduleObject: any;
  payload: any = {
    displayLength: 12,
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
  ) {
    this.isProject = this.authService.getisProject();

  }
  selectedDropDownTaskStatusIdValue: any = null
  ngOnInit(): void {
    this.storeProjectScheduleId
    this.apiCall()
  }
  apiCall() {
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
  






  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
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





}
