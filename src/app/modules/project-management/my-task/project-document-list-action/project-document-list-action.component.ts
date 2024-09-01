import { Component } from '@angular/core';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { Router } from '@angular/router';
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProjectDocumentViewActionComponent } from '../project-document-view-action/project-document-view-action.component';

@Component({
  selector: 'app-project-document-list-action',
  templateUrl: './project-document-list-action.component.html',
  styleUrl: './project-document-list-action.component.scss'
})
export class ProjectDocumentListActionComponent {
  myTaskSendObject: any = {}
  label: any = "My Dashboard";
  breadCrumbItems: any = [
    { label: "My Dashboard" },
    { label: "Project Document List ", active: true },
  ];
  payload: any = {
    "ProjectProcessId": null,
    "ProjectProcessHeaderDocStatusId": null,
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
      this.payload.ProjectProcessHeaderDocStatusId = this.myTaskSendObject.projectProcessHeaderDocStatusId;
      this.payload[this.myTaskSendObject.type] = true;
      this.getMX_ProjectProcessHeaderDocList_ApprovalPending();
    }
  }
  ngOnInit(): void {
    this.isProject = this.authAssetService.getisProject();

  }

  getMX_ProjectProcessHeaderDocList_ApprovalPending() {
    let url: any = 'api/ProjectManagementDash/GetV3_ProjectManagement_MyTask_Verification_Ack_ApprovalList_ServerPaging';
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

  navigateToView(project: any) {
    const modalRef = this.offcanvasService.open(ProjectDocumentViewActionComponent, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4 ",
    });
    modalRef.componentInstance.projectProcessTransactId = project.projectProcessTransactId;
    modalRef.componentInstance.projectProcessHeaderDocId = project.projectProcessHeaderDocId;
    modalRef.componentInstance.project = project;
    modalRef.result
      .then((result) => {
        console.log(result);
        this.getMX_ProjectProcessHeaderDocList_ApprovalPending();
      })
      .catch((result) => {
        console.log(result);
        this.getMX_ProjectProcessHeaderDocList_ApprovalPending();
      });

  }
  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.getMX_ProjectProcessHeaderDocList_ApprovalPending();
    }
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  goBack(){
    this.router.navigate(['/project-management/my-task/my-task-list'])
  }
}
