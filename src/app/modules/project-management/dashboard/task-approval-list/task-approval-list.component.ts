
  
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { environment } from 'src/environments/environment';
import { ProjectTaskDetailsComponent } from '../../task-management/project-task-details/project-task-details.component';
import { DropdownService } from 'src/app/shared/Service-common/dropdown.service';

@Component({
  selector: 'app-task-approval-list',
  templateUrl: './task-approval-list.component.html',
  styleUrl: './task-approval-list.component.scss'
})
export class TaskApprovalListComponent  implements OnInit, OnChanges {
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  currentUserRole: any;
  projectTaskSubTaskUnionList: any = [];

  constructor(private dropdownServices: DropdownService, private commonFunctionService: CommonFunctionService, private modalService: NgbModal, private offcanvasService: NgbOffcanvas,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private authAssetService: AuthAssetService,) {

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
    if (localStorage.getItem('onjectSerachForTaskAppoval')) {
      this.getObjectAfterRefresh();
    } else {
      this.GetV2_MX_ProjectTaskSubTaskUnionList_ServerPaging();
    }
  }

  payload: any = {
    PageNumber: 1,
    PageSize: 10,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchStatusId: null,
  }
  page = 1;
  pageNo = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;

  GetV2_MX_ProjectTaskSubTaskUnionList_ServerPaging() {
    let url = 'api/ProjectManagementDash/GetV3_TaskPendingApprovalDelayList_ServerPaging';
  
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
    this.GetV2_MX_ProjectTaskSubTaskUnionList_ServerPaging();
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
          this.GetV2_MX_ProjectTaskSubTaskUnionList_ServerPaging();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.CommonHttpServiceCallerService.letOpenOffCancvas = false
          this.resetScroll();
        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
          this.pageSize = 10;
          this.pageNo = 1;
          this.payload.PageSize = this.pageSize;
          this.payload.PageNumber = this.pageNo;
          this.GetV2_MX_ProjectTaskSubTaskUnionList_ServerPaging();
          this.offcanvasService.dismiss();
          this.CommonHttpServiceCallerService.letOpenOffCancvas = false
          this.modalService.dismissAll()
          this.resetScroll();
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
    this.dropdownServices.Getv3_CompanyDropDownList_ProjectManagement({}).subscribe((res: any) => {
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
      .Getv3_ClientDropDownList_ProjectManagement(payload)
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
      .Getv3_DepartmentDropDownList_ProjectManagement(payload)
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
    this.GetV2_MX_ProjectTaskSubTaskUnionList_ServerPaging();
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
    this.GetV2_MX_ProjectTaskSubTaskUnionList_ServerPaging();
  }
  onDropdownDepartmentValueChange($event) {
    this.pageNo = 1;
    this.payload.PageSize = this.pageSize;
    this.payload.PageNumber = this.pageNo;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.GetV2_MX_ProjectTaskSubTaskUnionList_ServerPaging();
  }
  /**
   * End  For Dropdown Company ,client,project
   */


  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let onjectSerachForTaskAppoval: any = JSON.parse(
      localStorage.getItem('onjectSerachForTaskAppoval')
    );
    console.log("onjectSerachForTaskAppoval get", onjectSerachForTaskAppoval)

    //Company Value
    this.selectedDropDownCompanyIdValue = onjectSerachForTaskAppoval.SearchCompanyId
      ? onjectSerachForTaskAppoval.SearchCompanyId
      : null;
    //Client List
    this.arrayListDropDownClientList =
      onjectSerachForTaskAppoval.arrayListDropDownClientList
        ? onjectSerachForTaskAppoval.arrayListDropDownClientList
        : [];
    //Client Value
    this.selectedDropDownClientIdValue = onjectSerachForTaskAppoval.SearchClientId
      ? onjectSerachForTaskAppoval.SearchClientId
      : null;
    //ProjectOrDeparment List
    this.arrayListDropDownProjectOrDeparmentList =
      onjectSerachForTaskAppoval.arrayListDropDownProjectOrDeparmentList
        ? onjectSerachForTaskAppoval.arrayListDropDownProjectOrDeparmentList
        : [];
    //ProjectOrDeparment Value
    this.selectedDropDownProjectOrDeparmentIdValue =
      onjectSerachForTaskAppoval.SearchProjectId
        ? onjectSerachForTaskAppoval.SearchProjectId
        : null;



    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;


    if (onjectSerachForTaskAppoval.PageNumber) {
      this.payload.PageSize = onjectSerachForTaskAppoval.PageSize;
      this.payload.PageNumber = onjectSerachForTaskAppoval.PageNumber;
      this.pageNo = onjectSerachForTaskAppoval.PageNumber;
      this.page = onjectSerachForTaskAppoval.PageNumber;
      this.pageSize = onjectSerachForTaskAppoval.PageSize;
    }
    this.GetV2_MX_ProjectTaskSubTaskUnionList_ServerPaging();
  }

  /**
 * for Set object to refesh
 */
  setObjectBeforeRefesh() {
    let onjectSerachForTaskAppoval: any = {};
    //Company
    if (this.selectedDropDownCompanyIdValue)
      onjectSerachForTaskAppoval.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    //Client Value
    if (this.selectedDropDownClientIdValue)
      onjectSerachForTaskAppoval.SearchClientId = this.selectedDropDownClientIdValue;
    //Client list
    if (this.arrayListDropDownClientList) {
      onjectSerachForTaskAppoval.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    //ProjectOrDeparment Value
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      onjectSerachForTaskAppoval.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;
    //ProjectOrDeparment list
    if (this.arrayListDropDownProjectOrDeparmentList) {
      onjectSerachForTaskAppoval.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }

    if (this.pageNo) {
      onjectSerachForTaskAppoval.PageSize = this.pageSize;
      onjectSerachForTaskAppoval.PageNumber = this.pageNo;
    }
    console.log("onjectSerachForTaskAppoval", onjectSerachForTaskAppoval)
    localStorage.setItem(
      "onjectSerachForTaskAppoval",
      JSON.stringify(onjectSerachForTaskAppoval)
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

    localStorage.removeItem('onjectSerachForTaskAppoval');
    if (this.currentUserRole === "Client User") {
      this.resetAfterClientUser();
    } else {
      this.pageNo = 1;
      this.payload.PageSize = this.pageSize;
      this.payload.PageNumber = this.pageNo;
      this.GetV2_MX_ProjectTaskSubTaskUnionList_ServerPaging();
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


