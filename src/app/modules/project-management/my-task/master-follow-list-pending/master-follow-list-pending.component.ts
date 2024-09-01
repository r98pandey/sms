import { Component, OnInit } from '@angular/core';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { ViewEventFullDetailsComponent } from '../../project-setup/view-event-full-details/view-event-full-details.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
@Component({
  selector: 'app-master-follow-list-pending',
  templateUrl: './master-follow-list-pending.component.html',
  styleUrl: './master-follow-list-pending.component.scss'
})
export class MasterFollowListPendingComponent implements OnInit{
  masterFollowListPending_ServerPaging:any=[];
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  displayLength: number = 10;
  payload = {
    "displayLength": 10,
    "displayStart": 0
  };
  isProject: any;
  constructor(   private authService: AuthAssetService,private offcanvasService: NgbOffcanvas,private CommonHttpServiceCallerService: CommonHttpServiceCallerService,private commonFunctionService:CommonFunctionService){

  }
  ngOnInit(): void {
    this.isProject = this.authService.getisProject();
    this.getV2_MX_MasterFollowListPending_ServerPaging();
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }


  pageChange(pageNo): void {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.getV2_MX_MasterFollowListPending_ServerPaging();
    }
  }
  getV2_MX_MasterFollowListPending_ServerPaging() {
    let url = 'api/ProjectManagementDash/GetV2_MX_MasterFollowListPending_ServerPaging';
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, this.payload).subscribe((res: any) => {
      this.masterFollowListPending_ServerPaging = res.list;
      if (this.masterFollowListPending_ServerPaging.length > 0) {
        this.totalRecords = res.list[0].totalCount;
        this.from = res.list.reduce(
          (min, p) => (p.rowNum < min ? p.rowNum : min),

          res.list[0].rowNum
        );

        this.to = res.list.reduce(
          (max, p) => (p.rowNum > max ? p.rowNum : max),

          res.list[0].rowNum
        );
        this.pageSize = this.displayLength;
      } else {
        this.totalRecords = 0;
        this.from = 0;
        this.to = 0;
        this.pageSize = this.displayLength;
      }
    })
  }

  openEventFullDetailsModalPopup(followUp) {
    this.CommonHttpServiceCallerService.letOpenOffCancvas=true
  
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
    modalRef.componentInstance.projectDepartmentId = followUp.departmentId;
    modalRef.componentInstance.followUpId = followUp.followUpId
    modalRef.componentInstance.checkListOpen = 2;    
    modalRef.result
      .then((result) => {
        this.CommonHttpServiceCallerService.letOpenOffCancvas=false
  
        console.log("result", result)
      
      })
      .catch((result) => {
        this.CommonHttpServiceCallerService.letOpenOffCancvas=false
  
        console.log("result", result)
      
      });
  }
}
