
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { environment } from 'src/environments/environment';
import { ProjectTaskDetailsComponent } from '../../task-management/project-task-details/project-task-details.component';
import { ProjectScheduleViewSubTaskSingleComponent } from '../project-schedule-view-sub-task-single/project-schedule-view-sub-task-single.component';
import { DropdownService } from 'src/app/shared/Service-common/dropdown.service';

@Component({
  selector: 'app-assign-task-appvoval-pending',
  templateUrl: './assign-task-appvoval-pending.component.html',
  styleUrl: './assign-task-appvoval-pending.component.scss'
})
export class AssignTaskAppvovalPendingComponent implements OnInit ,OnChanges {
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  currentUserRole: any;
  projectTaskSubTaskUnionList: any = [];
  CurrentStatusId: any=101;
  @Output() completeEmit = new EventEmitter();
  constructor(private dropdownServices: DropdownService, private commonFunctionService: CommonFunctionService, private modalService: NgbModal, private offcanvasService: NgbOffcanvas, private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private authAssetService: AuthAssetService,) {

  }
  ngOnChanges(changes: SimpleChanges): void {
  
  }
  isProject: boolean = true;
  disabledWithAceessGroup: boolean = false;
  imgUrl: any = environment.apiUrl;
  projectDepartmentFieldDisiabled: boolean = false;
  ngOnInit(): void {
    this.isProject = this.authAssetService.getisProject();
    this.getDropdownCompanyList();
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    }
    if (localStorage.getItem('objectSerachForMainTask' + this.CurrentStatusId)) {
      this.getObjectAfterRefresh();
    } else {
      this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
    }
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    }
    if (localStorage.getItem('objectSerachForMainTask' + this.CurrentStatusId)) {
      this.getObjectAfterRefresh();
    } else {
      this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
    }

  }
  
  payload: any = {
    PageNumber: 1,
    PageSize: 10,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    
  }
  page = 1;
  pageNo = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;

  GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging() {
    let url = 'api/ProjectManagementMobile/GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging'
    
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, this.commonFunctionService.clean(this.payload)).subscribe((response: any) => {
      this.projectTaskSubTaskUnionList = response.list;
      this.setObjectBeforeRefesh()
      if (this.projectTaskSubTaskUnionList.length > 0) {
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
    this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
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
          this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.CommonHttpServiceCallerService.letOpenOffCancvas = false
          this.resetScroll();
          this.completeEmit.emit(true)
        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
          this.pageSize = 10;
          this.pageNo = 1;
          this.payload.PageSize = this.pageSize;
          this.payload.PageNumber = this.pageNo;
          this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
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
          this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.CommonHttpServiceCallerService.letOpenOffCancvas = false
          this.resetScroll();
          this.completeEmit.emit(true)
        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
          this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.CommonHttpServiceCallerService.letOpenOffCancvas = false
          this.resetScroll();
          this.completeEmit.emit(true)
        }, 100);
      });



  }

  resetScroll() {
    document.body.style.overflow = 'auto';
  }

  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (this.currentUserRole === "Client User") {
        this.selectedDropDownCompanyIdValue =
          this.arrayListDropDownCompany[0].companyId;
        this.onDropdownCompanyValueChange("");
      }
    
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceClientDropDownList(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        if (this.currentUserRole === "Client User") {
          this.selectedDropDownClientIdValue =
            this.arrayListDropDownClientList[0].clientId;
          this.onDropdownClientValueChange("");
        }
        this.setObjectBeforeRefesh();
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceDepartmentDropDownList(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownProjectOrDeparmentList = res.list;
        if (res.list.length != 0) {
          if (this.currentUserRole === "Client User") {
            if (res.list.length >= 2) {
              this.projectDepartmentFieldDisiabled = false;
            } else {
              this.projectDepartmentFieldDisiabled = true;
              this.selectedDropDownProjectOrDeparmentIdValue =
                this.arrayListDropDownProjectOrDeparmentList[0].departmentId;
              this.onDropdownDepartmentValueChange("");
            }
          }
        }
        this.setObjectBeforeRefesh();
      });
  }
  onDropdownCompanyValueChange($event) {
    this.pageNo = 1;
    this.payload.PageSize = this.pageSize;
    this.payload.PageNumber = this.pageNo;
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;

    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.arrayListDropDownProjectOrDeparmentList = [];
    if (this.selectedDropDownCompanyIdValue) {
      this.getDropdownClientlist();
    }
    this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
  }
  onDropdownClientValueChange($event) {
    this.pageNo = 1;
    this.payload.PageSize = this.pageSize;
    this.payload.PageNumber = this.pageNo;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.selectedDropDownClientIdValue) {
      this.getDropdownDepartmentList();
    }
    this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
  }
  onDropdownDepartmentValueChange($event) {
    this.pageNo = 1;
    this.payload.PageSize = this.pageSize;
    this.payload.PageNumber = this.pageNo;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
  }
  /**
   * End  For Dropdown Company ,client,project
   */


  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForMainTask: any = JSON.parse(
      localStorage.getItem('objectSerachForMainTask' + this.CurrentStatusId)
    );
    console.log("objectSerachForMainTask get",objectSerachForMainTask)

    //Company Value
    this.selectedDropDownCompanyIdValue = objectSerachForMainTask.SearchCompanyId
      ? objectSerachForMainTask.SearchCompanyId
      : null;
    //Client List
    this.arrayListDropDownClientList =
      objectSerachForMainTask.arrayListDropDownClientList
        ? objectSerachForMainTask.arrayListDropDownClientList
        : [];
    //Client Value
    this.selectedDropDownClientIdValue = objectSerachForMainTask.SearchClientId
      ? objectSerachForMainTask.SearchClientId
      : null;
    //ProjectOrDeparment List
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForMainTask.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForMainTask.arrayListDropDownProjectOrDeparmentList
        : [];
    //ProjectOrDeparment Value
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForMainTask.SearchProjectId
        ? objectSerachForMainTask.SearchProjectId
        : null;



    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;


    if (objectSerachForMainTask.PageNumber) {
      this.payload.PageSize = objectSerachForMainTask.PageSize;
      this.payload.PageNumber = objectSerachForMainTask.PageNumber;
      this.pageNo = objectSerachForMainTask.PageNumber;
      this.page= objectSerachForMainTask.PageNumber;
      this.pageSize = objectSerachForMainTask.PageSize;
    }
    this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
  }

  /**
 * for Set object to refesh
 */
  setObjectBeforeRefesh() {
    let objectSerachForMainTask: any = {};
    //Company
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForMainTask.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    //Client Value
    if (this.selectedDropDownClientIdValue)
      objectSerachForMainTask.SearchClientId = this.selectedDropDownClientIdValue;
    //Client list
    if (this.arrayListDropDownClientList) {
      objectSerachForMainTask.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    //ProjectOrDeparment Value
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForMainTask.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    //ProjectOrDeparment list
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForMainTask.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }

    if (this.pageNo) {
      objectSerachForMainTask.PageSize = this.pageSize;
      objectSerachForMainTask.PageNumber = this.pageNo;
    }
    console.log("objectSerachForMainTask", objectSerachForMainTask)
    localStorage.setItem(
      "objectSerachForMainTask" + this.CurrentStatusId,
      JSON.stringify(objectSerachForMainTask)
    );
  }


  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload = {
      PageSize: 10,
      PageNumber: 1,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,

    };

    localStorage.removeItem('objectSerachForMainTask'+this.CurrentStatusId);
    if (this.currentUserRole === "Client User") {
      this.resetAfterClientUser();
    } else {
      this.pageNo = 1;
      this.payload.PageSize = this.pageSize;
      this.payload.PageNumber = this.pageNo;
      this.GetV2_MX_ProjectTaskSubTaskUnionList_WaitingApproval_ServerPaging();
    }
  }
  resetAfterClientUser() {
    this.selectedDropDownCompanyIdValue =
      this.arrayListDropDownCompany[0].companyId;
    this.onDropdownCompanyValueChange("");
    if (this.arrayListDropDownClientList.length != 0) {
      this.selectedDropDownClientIdValue = this.arrayListDropDownClientList[0].clientId;
      this.onDropdownClientValueChange("");
    }
    if (this.arrayListDropDownProjectOrDeparmentList.length != 0) {
      if (this.currentUserRole === "Client User") {
        if (this.arrayListDropDownProjectOrDeparmentList.list.length >= 2) {
          this.projectDepartmentFieldDisiabled = false;
        } else {
          this.projectDepartmentFieldDisiabled = true;
          this.selectedDropDownProjectOrDeparmentIdValue =
            this.arrayListDropDownProjectOrDeparmentList[0].departmentId;
          this.onDropdownDepartmentValueChange("");
        }
      }
    }
  }
}

