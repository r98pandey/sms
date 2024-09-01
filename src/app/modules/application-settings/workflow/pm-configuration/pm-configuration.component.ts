
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { WorkflowService } from 'src/app/core/services/workflow.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileService } from '../../../../core/services/user.service';
import { environment } from '../../../../../environments/environment.prod';
import { CommonHttpServiceCallerService } from 'src/app/core/services/common-http-service-caller.service';
@Component({
  selector: 'app-pm-configuration',
  templateUrl: './pm-configuration.component.html',
  styleUrl: './pm-configuration.component.scss',
  providers: [NgbModalConfig, NgbModal],
})
export class PmConfigurationComponent implements OnInit, OnChanges {

  workflowDetailsObject: any = {};
  @Input() globalCompanyId: any;
  @Input() globalDepartmentId: any;
  @Input() globalDepartmentName: any;
  @Input() dDetail//
  @Input() workflow_Modification: boolean
  configurationWorkflowDetailsList: any = [];
  requestData: any[];
  _index: any;
  approverSeq: any;
  userList: any;
  imagUrl = environment.apiUrl;
  filterBy: any;
  constructor(
    private workflowService: WorkflowService,
    private router: Router,
    private modalService: NgbModal,
    private userService: UserProfileService,
    private commonHttpServiceCallerService: CommonHttpServiceCallerService
  ) {


  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.globalDepartmentId) {
      this.getWorkflowDetails(this.globalDepartmentId);
      this.getMasterApproverGroupTypeList();
    }
  }
  ngOnInit(): void {


  }

  /**
   *
   * @param _departmentId
   * For Get Master List (side list )
   */
  getWorkflowDetails(_departmentId: any) {
    this.workflowService
      .getWorkflowMasterByDepartment(_departmentId)
      .subscribe((res: any) => {
        this.configurationWorkflowDetailsList = res.data;
      });
  }
  /**
   *
   * @param value
   * @returns colors and class
   */
  returnClassWithStatus(value) {
    if (value === "Pending") {
      return "ri-checkbox-blank-circle-line me-2 text-warning";
    } else if (value === "Active") {
      return "ri-checkbox-blank-circle-line me-2 text-success";
    } else if (value === "Inactive") {
      return "ri-checkbox-blank-circle-line me-2 text-danger";
    } else {
      return "";
    }
  }
  /**
   *
   * @param value
   * @returns colors and class
   */
  returnClassBabgeWithStatus(value) {
    if (value === "Pending") {
      return "badge bg-warning-subtle text-warning badge-border";
    } else if (value === "Active") {
      return "badge bg-success-subtle text-success badge-border";
    } else if (value === "Inactive") {
      return "badge bg-danger-subtle text-danger badge-border";
    } else {
      return "";
    }
  }

  count = 0;
  masterWorkFlowId: any;
  _workFlowName: any;
  approverTypeByGroupTypeIdLength: number = 0;
  approverTypeByGroupTypeIdList: any[] = [];
  updateButtonShowing: boolean = false;
  showWorkflowSetup: boolean = false;
  aproverGroupType: any;
  typeId: any;
  filteredUsers: any = [];
  aproverGroupUserType: any = [];
  _workFlowStatus: any;
  _masterWorkFlowSetupId;
  masterApproverGroupTypeList: any[] = [];

  toCheckUpdateButtonShowing() {
    if (this.approverTypeByGroupTypeIdLength != 0) {
      if (this.approverTypeByGroupTypeIdList.length == this.count) {
        this.updateButtonShowing = true;
      } else {
        this.updateButtonShowing = false;
      }
    }
  }

  /**
   * @description get Approver Type By Group Type Id
   */
  getApproverTypeByGroupTypeId(typeId: any) {
    this.count = 0;
    this.toCheckUpdateButtonShowing();
    this.typeId = typeId;
    this.filteredUsers.forEach((ele) => {
      ele.isSelected = false;
    });
    this.aproverGroupUserType = [];
    this.workflowService
      .getApproverTypeByGroupTypeId(
        typeId,
        this.globalDepartmentId,
        this.masterWorkFlowId
      )
      .subscribe((res: any) => {
        this.approverTypeByGroupTypeIdList = res.data;
        this.approverTypeByGroupTypeIdLength =
          this.approverTypeByGroupTypeIdList.length;
        this.approverTypeByGroupTypeIdList.forEach((ele) => {
          ele.isSelected = false;
        });
      });
  }

  currentFlowListWithUrl = [
    {
      "masterWorkflowId": 1,
      "url": "api/Account/GetUserListByCompanyAndDepartment_AssetMembers/",
      "workflowName": "New Asset Confirmation",
    },
    {
      "masterWorkflowId": 9,
      "workflowName": "Billing Eligibility Verification Process For Ticket",
      "url": "api/Account/GetUserListByCompanyAndDepartment_MaintenanceMembers/"
    },
    {
      "masterWorkflowSetupId": 409,
      "masterWorkflowId": 10,
      "workflowName": "Generated Quotation Verification Internal Process",
      "url": "api/Account/GetUserListByCompanyAndDepartment_MaintenanceMembers/"
    },
    {
      "masterWorkflowSetupId": 410,
      "masterWorkflowId": 11,
      "workflowName": "Quotation Requiring Approval From The Client Process",
      "url": "api/Account/GetUserListByCompanyAndDepartment_MaintenanceClientMembers/"
    }
  ]
  sendConfigDetails(config: any) {
    this.userList = [];
    this.filteredUsers = [];
    let workflowUrl = this.currentFlowListWithUrl.find(item => item.workflowName === config.workflowName);

    this.getUserListByCompany(workflowUrl ? workflowUrl.url : null, this.globalDepartmentId);

    this._masterWorkFlowSetupId = config.masterWorkflowSetupId;
    this._workFlowStatus = config.status;
    this._workFlowName = config.workflowName;
    this.aproverGroupType = config.aproverGroupTypeId;
    this.showWorkflowSetup = true;
    this.count = 0;
    this.masterWorkFlowId = config.masterWorkflowId;
    this.toCheckUpdateButtonShowing();
    this.getApproverTypeByGroupTypeId(this.aproverGroupType);
  }

  /**
   *  @description  default  Approver Data
   */
  getMasterApproverGroupTypeList() {
    this.workflowService.getMasterApproverGroupTypeList().subscribe(
      (res: any) => {
        this.masterApproverGroupTypeList = res.data;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  /**
   *
   * @param aproverGroupTypeId
   */
  getShowWorkFlowSetup(aproverGroupTypeId: any) {
    this.aproverGroupType = aproverGroupTypeId;
    this.showWorkflowSetup = true;
    this.getApproverTypeByGroupTypeId(this.aproverGroupType);
  }

  submitInsertWorkflowUser() {
    this.requestData = [];
    this.approverTypeByGroupTypeIdList.forEach((ele) => {
      this.requestData.push({
        DepartmentId: this.globalDepartmentId,
        UserId: ele.userId,
        AproverGroupTypeId: ele.aproverGroupTypeId,
        AproverTypeId: ele.aproverTypeId,
        MasterWorkflowSetupId: ele.masterWorkflowSetupId,
      });
    });
    let requestData = this.requestData;

    this.workflowService
      .postInsertWorkflowUser(requestData)
      .subscribe((res: any) => {
        this.success(res);
        this._workFlowStatus = "Active";
        this.getWorkflowDetails(this.globalDepartmentId);
        this.getApproverTypeByGroupTypeId(this.typeId);
        //this.goback();
      });
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

  error(err) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  confirmUpdate(content, index) {
    //console.log("index", index);
    this._index = index;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      size: "xl",
      backdrop: "static",
      keyboard: false,
    });
  }
  addApproveUser(approverseq: any, index) {
    this.approverTypeByGroupTypeIdList[index].isSelected = true;
    this.approverSeq = approverseq;
  }

  removeApproveUser(approverseq: any, index: any, userId: any) {
    this.filteredUsers.forEach((user) => {
      if (user.id == userId) {
        user.isSelected = false;
      }
    });
    this.aproverGroupUserType = [];
    this.approverTypeByGroupTypeIdList[index].isSelected = false;
    this.approverTypeByGroupTypeIdList.forEach((ele) => {
      if (ele.seq == approverseq) {
        ele.fullName = null;
        ele.isSelected = false;
        ele.userId = null;
        ele.masterWorkFlowId = 0;
        ele.masterWorkflowSetupId = 0;
      }
    });
    //console.log("count", this.count);
    this.count = this.count - 1;
    this.toCheckUpdateButtonShowing();
    this.approverTypeByGroupTypeIdLength =
      this.approverTypeByGroupTypeIdList.length;
  }

  /**
   *
   * @param id
   * @description for sweet Alert Delete Confirmation
   */
  sweetAlertDeleteConfirmation(content: any) {
    this.modalService.open(content, { centered: true });
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   //confirmButtonColor: '#727CF5',
    //   cancelButtonColor: '#FF3366',
    //   confirmButtonText: '<span class=\'swal2-confirm \'> Yes, remove it!</span>'
    // }).then((result) => {
    //   if (result.isConfirmed) {

    //     this.deleteHandler();

    //   }
    //   else {
    //   }

    // });
  }
  sweetAlertUpdateUserConfirmation() {
    Swal.fire({
      title: "Are you sure   ?",
      text: "Assign User data to be updated",
      icon: "info",
      showCancelButton: true,
      //confirmButtonColor: '#727CF5',
      cancelButtonColor: "#FF3366",
      confirmButtonText: "<span class='swal2-confirm '> Yes, Update it!</span>",
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          this.updateUserHandler();
        }, 1000);

        Swal.fire("Update!", "Your assign user updated.", "success");
      } else {
      }
    });
  }

  /**
   * @description Update Approver user
   */
  updateUserHandler() {
    this.requestData = [];
    this.approverTypeByGroupTypeIdList.forEach((ele) => {
      this.requestData.push({
        UserId: ele.userId,
        AproverGroupTypeId: ele.aproverGroupTypeId,
        MasterWorkflowUserId: ele.masterWorkflowUserId,
        MasterWorkflowSetupId: ele.masterWorkflowSetupId,
      });
    });
    let requestData = this.requestData;
    //console.log("requestData", requestData);

    this.workflowService.postUpdateWorkflowUser(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.getWorkflowDetails(this.globalDepartmentId);
        this.getApproverTypeByGroupTypeId(this.typeId);
      },
      (err) => {
        //console.log("error", err);
        this.error(err);
      }
    );
  }

  /**
   * @description go back function
   */
  goback() {
    //to get back
    this.router.navigate(["/workflowsetup/workflow/listworkflow"]);
  }
  /**
   * @description remove approver user
   */

  deleteHandler() {
    //alert(this.masterWorkflowSetupId)
    let requestData = {
      MasterWorkflowSetupId: this._masterWorkFlowSetupId,
    };
    //console.log("requestData", requestData);

    this.workflowService.postRemoveWorkflowSetup(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this._workFlowStatus = "Inactive";
        this.getWorkflowDetails(this.globalDepartmentId);
        this.getApproverTypeByGroupTypeId(this.typeId);
      },
      (err) => {
        //console.log("error", err);
        this.error(err);
      }
    );
  }

  /**
   * @description for   No  Selection approve user
   */
  addNoSelectionApproveUser(index) {
    // alert(index)
    this.approverTypeByGroupTypeIdList[index].isSelected = false;
  }

  /**
   * @description to assign user function
   * */
  toAssignUser(userdata: any) {
    this.filteredUsers.forEach((user) => {
      if (user.id == userdata.id) {
        user.isSelected = true;
      }
    });
    this.approverTypeByGroupTypeIdList.forEach((ele) => {
      if (ele.seq == this.approverSeq) {
        ele.fullName = userdata.fullName;
        ele.userId = userdata.id;
        ele.masterWorkFlowId = this.masterWorkFlowId;
        ele.masterWorkflowSetupId = this._masterWorkFlowSetupId;
        ele.isSelected = true;
      }
    });
    this.count = this.count + 1;
    this.toCheckUpdateButtonShowing();
    //console.log("count", this.count);
    this.approverTypeByGroupTypeIdLength =
      this.approverTypeByGroupTypeIdList.length;

    //console.log("userdata", userdata);
  }

  filter() {

    this.filteredUsers = [
      ...this.userList.filter((user) =>
        user.fullName.toLowerCase().includes(this.filterBy.trim().toLowerCase())
      ),
    ];


  }



  goBack() {
    this.router.navigate(["/application-settings/workflow-setup/listworkflow"]);
  }

  // getClientUserListByCompany(companyId: any) {
  //   this.workflowService
  //     .getClientUserListByCompany(companyId)
  //     .subscribe((res: any) => {
  //       this.userList = res.data;
  //       this.filteredUsers = [...this.userList];
  //       this.filteredUsers.forEach((ele) => {
  //         ele.isSelected = false;
  //       });
  //     });
  // }
  getUserListByCompany(urlsending, departmentId: any) {
    let url = urlsending + departmentId
    this.commonHttpServiceCallerService.getWithoutParmaMethod(url).subscribe((res: any) => {
      this.userList = res.data;
      this.filteredUsers = [...this.userList];
      this.filteredUsers.forEach((ele) => {
        ele.isSelected = false;
      });
    });
  }

  getClientListByCompany(companyId: any, departmentId: any) {
    let paylod = {

      displayLength: 20000,
      displayStart: 0,
      SearchCompanyId: companyId,
      SearchDepartmentIdAsString: departmentId + '',

    }
    this.userService
      .getV2_ClientUserList(paylod)
      .subscribe((res: any) => {
        this.userList = res.data;
        this.filteredUsers = [...this.userList];
        this.filteredUsers.forEach((ele) => {
          ele.isSelected = false;
        });
      });
  }
}
