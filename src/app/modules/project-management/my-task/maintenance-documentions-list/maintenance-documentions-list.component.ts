
import { Component } from '@angular/core';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { Router } from '@angular/router';
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProjectDocumentViewActionComponent } from '../project-document-view-action/project-document-view-action.component';
import { MaintenanceDocumentionsViewComponent } from '../maintenance-documentions-view/maintenance-documentions-view.component';

@Component({
  selector: 'app-maintenance-documentions-list',
  templateUrl: './maintenance-documentions-list.component.html',
  styleUrl: './maintenance-documentions-list.component.scss'
})
export class MaintenanceDocumentionsListComponent {
  myTaskSendObject: any = {}
  label: any = "My Dashboard";
  breadCrumbItems: any = [
    { label: "My Dashboard" },
    { label: "Project Document List ", active: true },
  ];
  payload: any = {
    "ProjectProcessId": null,
    "MaintenanceStatusId": null,
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
      this.payload.MaintenanceStatusId = this.myTaskSendObject.maintenanceStatusId;
      this.payload[this.myTaskSendObject.type] = true;
      this.getV3_Maintenance_MyTask_Verification_Ack_ApprovalList_ServerPaging();
    }
  }
  ngOnInit(): void {
    this.isProject = this.authAssetService.getisProject();

  }

  getV3_Maintenance_MyTask_Verification_Ack_ApprovalList_ServerPaging() {
    let url: any = 'api/ProjectManagementDash/GetV3_Maintenance_MyTask_Verification_Ack_ApprovalList_ServerPaging';
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

  navigateToView(maintenanceObject: any) {

    const modalRef = this.offcanvasService.open(MaintenanceDocumentionsViewComponent, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4 ",
    });
    
    modalRef.componentInstance.MaintenanceId = maintenanceObject.maintenanceId;
    modalRef.componentInstance.ProjectId = maintenanceObject.projectId;

    modalRef.componentInstance.MaintenanceDocumentionsObject = maintenanceObject;
    modalRef.result
      .then((result) => {
        console.log(result);
        this.getV3_Maintenance_MyTask_Verification_Ack_ApprovalList_ServerPaging();
      })
      .catch((result) => {
        console.log(result);
        this.getV3_Maintenance_MyTask_Verification_Ack_ApprovalList_ServerPaging();
      });

  }
  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.getV3_Maintenance_MyTask_Verification_Ack_ApprovalList_ServerPaging();
    }
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  goBack(){
    this.router.navigate(['/project-management/my-task/my-task-list'])
  }
}
