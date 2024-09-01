


import { Component } from '@angular/core';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { Router } from '@angular/router';
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProjectDocumentViewActionComponent } from '../project-document-view-action/project-document-view-action.component';
import { MaintenanceDocumentionsViewComponent } from '../maintenance-documentions-view/maintenance-documentions-view.component';
import { ProjectTaskDetailsComponent } from '../../task-management/project-task-details/project-task-details.component';
import { MainTaskSubTaskViewComponent } from '../main-task-sub-task-view/main-task-sub-task-view.component';

@Component({
  selector: 'app-main-task-sub-task-list',
  templateUrl: './main-task-sub-task-list.component.html',
  styleUrl: './main-task-sub-task-list.component.scss'
})
export class MainTaskSubTaskListComponent {
  myTaskSendObject: any = {}
  label: any = "My Dashboard";
  breadCrumbItems: any = [
    { label: "My Dashboard" },
    { label: "Project Document List ", active: true },
  ];
  payload: any = {
    "ProjectProcessId": null,
    "ProjectTaskStatusId": null,
    "displayLength": 10,
    "displayStart": 0

  }
  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  preventiveScheduleList = [];
  page = 1;
  collectionSize = 0;
  projectProcessHeaderDocList_ApprovalPending: any[] = [];
  isProject: any;

  constructor(private offcanvasService: NgbOffcanvas, private commonFunctionService: CommonFunctionService, private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private router: Router, private authAssetService: AuthAssetService) {
    console.log("this.CommonHttpServiceCallerService.myTaskSendObject", this.CommonHttpServiceCallerService.myTaskSendObject)
    if (Object.keys(this.CommonHttpServiceCallerService.myTaskSendObject).length == 0) {
      this.goBack()
    } else {
      this.myTaskSendObject = this.CommonHttpServiceCallerService.myTaskSendObject
      this.payload.ProjectProcessId = this.myTaskSendObject.projectProcessId;
      this.payload.ProjectTaskStatusId = this.myTaskSendObject.ProjectTaskStatusId;
      this.payload[this.myTaskSendObject.type] = true;
      this.GetV3_ProjectManagement_MainTask_Verification_Ack_Approval_ListPaging_Latest();
    }
  }
  ngOnInit(): void {
    this.isProject = this.authAssetService.getisProject();

  }

  GetV3_ProjectManagement_MainTask_Verification_Ack_Approval_ListPaging_Latest() {
    //  let url: any = 'api/ProjectManagementDash/GetV3_ProjectManagement_MainTask_Verification_Ack_Approval_ListPaging';
    let url: any = 'api/ProjectManagementDash/GetV3_ProjectManagement_MainTask_Verification_Ack_Approval_ListPaging_Latest';
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, this.payload).subscribe((res: any) => {
      this.projectProcessHeaderDocList_ApprovalPending = res.list
      this.projectProcessHeaderDocList_ApprovalPending = res.list;
      if (this.projectProcessHeaderDocList_ApprovalPending.length > 0) {
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
        this.goBack();
      }
    });

  }

  openViewHandleTask(projectTaskId, projectScheduleObject): void {
    const modalRef = this.offcanvasService.open(MainTaskSubTaskViewComponent, {
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
        this.GetV3_ProjectManagement_MainTask_Verification_Ack_Approval_ListPaging_Latest();
      })
      .catch((result) => {
        this.GetV3_ProjectManagement_MainTask_Verification_Ack_Approval_ListPaging_Latest();
      });



  }


  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.GetV3_ProjectManagement_MainTask_Verification_Ack_Approval_ListPaging_Latest();
    }
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  goBack() {
    this.router.navigate(['/project-management/my-task/my-task-list'])
  }
}

