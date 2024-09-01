import { Component, Inject, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetService } from 'src/app/core/services/asset.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { WorkflowService } from 'src/app/core/services/workflow.service';
import { DOCUMENT } from '@angular/common';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss']
})
export class TodolistComponent implements OnInit{
  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  rows = [];
  bulkUpdate: boolean;
  companyList: any = {};
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  _companyId: any;
  loadingTableData: boolean
  cName: any;
  page = 1;
  collectionSize = 0;
  assetData: any[];
  totalRecords: number = 0;
  flag: boolean = false;
  _globalCompanyId: string;
  confirmResut: string;
  wFActivityList: any;
  assetId: any;
  assignType: any;
  assetImagePath: any;
  assetName: any;
  assetTagId: any;
  ImageUrl: any
  doToDatailsList: any;
  _approverType: any;
  _masterWorkflowId: any;
  checkResult: boolean;
  allSeletectedAsset: any[];
  pageNo: number;
  isTableView: boolean;
  _assetWorkflowStatus: any;
  _assetWorkflowStatusId: any;
  workflowId: any;
  oldWorkflowId: any;
  isProject: boolean = false;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    
    private companyService: CompanyService,
    private router: Router,
    private modalService: NgbModal,
    private assetService: AssetService,
    private dashboardService: DashboardService,
    private workflowService: WorkflowService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthAssetService

  ) {
    //approverType: "Reviewer"
    this.bulkUpdate = false;
    this.wFActivityList = [];
    this.loadingTableData = false;
    // this.checkResult = true
    this.ImageUrl = environment.apiUrl;
    this.doToDatailsList = { ...this.dashboardService.dotoItem };
    this.dashboardService._masterWorkflowId =
      this.doToDatailsList.masterWorkflowId;
    this.dashboardService._approverType = this.doToDatailsList.approverType;
    this._masterWorkflowId = this.dashboardService._masterWorkflowId;
    this._approverType = this.dashboardService._approverType;
    this.allSeletectedAsset = [];
    this.isTableView = false;
    this.activatedRoute.params.subscribe((params) => {
      this.workflowId = params;
      const routeParams = this.activatedRoute.snapshot.params;
      //console.log("routeParams",routeParams)
      this.loadData(routeParams["id"], routeParams["type"]);
    });
    //console.log("  this.doToDatailsList", this.doToDatailsList)
    if (
      this.doToDatailsList["masterWorkflowId"] ||
      this.doToDatailsList["masterWorkflowId"] == 0
    ) {
    } else {
      this.router.navigate(["/dashboard"]);
    }
    this.isProject = this.authService.getisProject();
  }
  ngOnInit(): void {

    this._globalCompanyId = localStorage.getItem('globalCompanyId')
    this.from = this.page;
    this.to = this.pageSize;
  this.loadData(this._masterWorkflowId, this._approverType);
    
  }
   

  navigateToAdd() {
    //console.log('navigate to add')
    this.router.navigate(["/dashboard"]);
  }





  checkAllCheckBox(ev, rows: any) {
    this.allSeletectedAsset = [];
    this.rows.forEach((x) => (x.checked = ev.target.checked));
    //console.log("row", rows);
    //console.log("ev", ev.target.checked);
    if (ev.target.checked == true) {
      this.rows.forEach((ele, index) => {
        this.allSeletectedAsset.push({
          WfAssetCreationId: ele.wfAssetCreationId,
          WfAssetCreationDetailId: ele.wfAssetCreationDetailId,
          ApproverType: this._approverType,
          //ActionStatus: "Approved",
          AssetId: ele.id,
        });
      });
    } else {
      this.allSeletectedAsset = [];
    }

    //console.log("'this.allSeletectedAsset", this.allSeletectedAsset)
  }

  isAllCheckBoxChecked() {
    return this.rows.every(p => p.checked);
  }

  getTodolistChecked(isSelected: any, asset: any) {
    //this.allSeletectedAsset=[]
    //console.log(isSelected, asset)
    if (isSelected == true) {
      this.allSeletectedAsset.push({
        WfAssetCreationId: asset.wfAssetCreationId,
        WfAssetCreationDetailId: asset.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        //ActionStatus: "Approved",
        AssetId: asset.id,
      });
    } else {
      this.allSeletectedAsset.forEach((value, index) => {
        if (
          value.WfAssetCreationId == asset.wfAssetCreationId &&
          value.WfAssetCreationDetailId == asset.wfAssetCreationDetailId &&
          value.AssetId == asset.id &&
          value.ApproverType == this._approverType
        ) {
          this.allSeletectedAsset.splice(index, 1);
        }
      });
    }

    //console.log("'this.allSeletectedAsset", this.allSeletectedAsset)
  }




  /**
     * @description for back to page 
     */
  goto() {
    this.router.navigate(['/dashboard']);
  }

  /**
   * 
   * @param content 
   * @param asset 
   * @description confirm  for workflow
   */
  viewWFActivityData(content, asset: any) {
    //console.log("assets", asset)
    this.assetId = asset.id;
    (this.assignType = asset.workflowName),
      (this.assetImagePath = asset.assetImagePath),
      (this.assetName = asset.assetName),
      (this.assetTagId = asset.assetTagId),
      (this._assetWorkflowStatus = asset.assetWorkflowStatus);
    this._assetWorkflowStatusId = asset.assetWorkflowStatusId;
    this._masterWorkflowId = asset.masterWorkflowId;
    this.getWFActivityData(
      this.assetId,
      this._masterWorkflowId,
      this._assetWorkflowStatusId
    );
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "xl",
        scrollable: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.confirmResut = `Closed with: ${result}`;
        },
        (reason) => {
          this.confirmResut = `Dismissed with: ${reason}`;
        }
      );
  }
  /**
   * 
   * @param assetId 
   * @param assignType
   * @description get  workflow activity data  
   */
  getWFActivityData(assetId: number, masterWorkflowId: number, assetWorkflowStatusId: number) {
    this.assetService.getWFActivityList__New(assetId, masterWorkflowId, assetWorkflowStatusId).subscribe(
      (res: any) => {
        this.wFActivityList = res.data;
        //console.log(" wFActivityList->", this.wFActivityList);
      },
      (err) => {
        //console.log(err)
      }
    );
  }

  /**
   * 
   * @param $event 
   * @param data 
   * @description for view  page of asset
   */

  viewHandler(event, data: any) {
    event.target.parentElement.parentElement.blur();
    this.dashboardService.viewItem = { ...data };
    this.workflowService.approverType = this._approverType;
    this.router.navigate(['/asset-management/asset/viewasset']);
  }


  /**
   * @description reviewer api call
   */
  requestHandler(asset, remark, actionStatus: any) {
    this.checkResult = true;
    //console.log("asset", asset);
    // Asset  Loan workflow
    if (this._masterWorkflowId == 4) {
      let requestData = {
        WfAssetCreationId: asset.wfAssetCreationId,
        WfAssetCreationDetailId: asset.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        ActionStatus: actionStatus,
        AssetId: asset.id,
        Remark: remark,
      };
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateLoanReviewApproverProcess(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.loadData(
              this._masterWorkflowId,
              this._approverType,
              this.pageSize,
              this.from - 1
            );
          },
          (err) => {
            this.error(err);
            this.checkResult = false;
            //console.log("error", err);
          }
        );
    } else if (this._masterWorkflowId == 1) {
      //New Asset Confirmation
      let requestData = {
        WfAssetCreationId: asset.wfAssetCreationId,
        WfAssetCreationDetailId: asset.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        ActionStatus: actionStatus,
        AssetId: asset.id,
        Remark: remark,
      };
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateReviewerApproverProcess(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.loadData(
              this._masterWorkflowId,
              this._approverType,
              this.pageSize,
              this.from - 1
            );

            //  this.goto();
          },
          (err) => {
            this.error(err);
            this.checkResult = false;
            //console.log("error", err);
          }
        );
    } else if (this._masterWorkflowId == 3) {
      //New Asset Confirmation
      let requestData = {
        WfAssetCreationId: asset.wfAssetCreationId,
        WfAssetCreationDetailId: asset.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        ActionStatus: actionStatus,
        AssetId: asset.id,
        Remark: remark,
      };
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateReviewerApproverAssetTrasnferProcessWF3(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.loadData(
              this._masterWorkflowId,
              this._approverType,
              this.pageSize,
              this.from - 1
            );

            //  this.goto();
          },
          (err) => {
            this.error(err);
            this.checkResult = false;
            //console.log("error", err);
          }
        );
    } else if (this._masterWorkflowId == 2) {
      //New Asset Confirmation
      let requestData = {
        WfAssetCreationId: asset.wfAssetCreationId,
        WfAssetCreationDetailId: asset.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        ActionStatus: actionStatus,
        AssetId: asset.id,
        Remark: remark,
      };
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateReviewerApproverAssetTrasnferProcessWF2(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.loadData(
              this._masterWorkflowId,
              this._approverType,
              this.pageSize,
              this.from - 1
            );

            //  this.goto();
          },
          (err) => {
            this.error(err);
            this.checkResult = false;
            //console.log("error", err);
          }
        );
    } else {
      let requestData = {
        WfAssetCreationId: asset.wfAssetCreationId,
        WfAssetCreationDetailId: asset.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        ActionStatus: actionStatus,
        AssetId: asset.id,
        Remark: remark,
      };
      //console.log("requestData", requestData)
    }
    return this.checkResult;
  }

  sweetAlertApproverConfirmation(asset: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      input: 'textarea',
      inputAttributes: {
        maxlength: '100'
      },
      inputPlaceholder: "Remark",

      cancelButtonColor: '#FF3366',
      confirmButtonText: '<span class=\'swal2-confirm \'> Yes,  Approve it!</span>'
    }).then((result) => {
      if (result.isConfirmed) {
        this.requestHandler(asset, result.value, 'Approved');

        //   setTimeout(() => {
        //   if (this.checkResult == true) {
        //     Swal.fire(
        //       'Approver!',
        //       'Your asset has been  Approvered.',
        //       'success'
        //     );


        //   }
        //   else {
        //     Swal.fire(
        //       'Not Approvered!',
        //       'Your asset has been  Not Approvered.',
        //       'warning'
        //     );
        //   } 
        // },3000);


      }

    });
  }
  sweetAlertReviewerConfirmation(asset: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      input: 'textarea',
      inputAttributes: {
        maxlength: '100'
      },
      inputPlaceholder: "Remark",
      cancelButtonColor: '#FF3366',
      confirmButtonText: '<span class=\'swal2-confirm \'> Yes, Reviewer it!</span>'
    }).then((result) => {
      if (result.isConfirmed) {
        this.requestHandler(asset, result.value, 'Reviewed');

        // setTimeout(() => {
        //   if (this.checkResult == true) {
        //     Swal.fire(
        //       'Reviewed!',
        //       'Your asset has been Reviewed.',
        //       'success'
        //     );
        //   }
        //   else{
        //     Swal.fire(
        //       'Not Reviewed!',
        //       'Your asset has been  Not Reviewed.',
        //       'warning'
        //     );
        //   }
        // });

      }

    });
  }

  sweetAlertRejectConfirmation(asset: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      input: 'textarea',
      inputAttributes: {
        maxlength: '100'
      },
      inputPlaceholder: "Remark",
      inputValidator: result => !result && 'You need to select something!',
      cancelButtonColor: '#FF3366',
      confirmButtonText: '<span class=\'swal2-confirm \'> Yes, Reject it!</span>'
    }).then((result) => {
      if (result.value) {
        if (result.isConfirmed) {
          this.requestHandler(asset, result.value, 'Rejected');

          // setTimeout(() => {
          //   if (this.checkResult == true) {
          //     Swal.fire(
          //       'Rejected!',
          //       'Your asset has been Rejected.',
          //       'success'
          //     );


          //   }
          //   else {
          //     Swal.fire(
          //       'Cancel!',
          //       'Your asset has been  Not Rejected.',
          //       'warning'
          //     );
          //   }
          // });


        }
      }
    });
  }

  requestHandlerSelectedAll(remark: any, actionStatus: any) {
    this.checkResult == true
    this.bulkUpdate = true;

    if (this._masterWorkflowId == 4) {
      this.allSeletectedAsset.forEach((ele: any, index) => {
        ele.ActionStatus = actionStatus;
        ele.Remark = remark;
      });
      let requestData = this.allSeletectedAsset;
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateMultiLoanReviewApproverProcess(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.bulkUpdate = false;
            this.loadData(
              this._masterWorkflowId,
              this._approverType,
              this.pageSize,
              this.from - 1
            );
            this.allSeletectedAsset = [];
          },
          (err) => {
            this.checkResult = false;
            this.error(err);

            //console.log("error", err);
          }
        );
    } else if (this._masterWorkflowId == 1) {
      this.allSeletectedAsset.forEach((ele: any, index) => {
        (ele.ActionStatus = actionStatus), (ele.Remark = remark);
      });
      let requestData = this.allSeletectedAsset;
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateReviewerMultiApproverProcess(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.bulkUpdate = false;
            this.loadData(
              this._masterWorkflowId,
              this._approverType,
              this.pageSize,
              this.from - 1
            );

            this.allSeletectedAsset = [];
          },
          (err) => {
            this.checkResult = false;
            this.error(err);

            //console.log("error", err);
          }
        );
    } else if (this._masterWorkflowId == 3) {
      this.allSeletectedAsset.forEach((ele: any, index) => {
        (ele.ActionStatus = actionStatus), (ele.Remark = remark);
      });
      let requestData = this.allSeletectedAsset;
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateMultipleTransferReviewApproverProcessWF3(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.bulkUpdate = false;
            this.loadData(
              this._masterWorkflowId,
              this._approverType,
              this.pageSize,
              this.from - 1
            );

            this.allSeletectedAsset = [];
          },
          (err) => {
            this.checkResult = false;
            this.error(err);

            //console.log("error", err);
          }
        );
    } else if (this._masterWorkflowId == 2) {
      this.allSeletectedAsset.forEach((ele: any, index) => {
        (ele.ActionStatus = actionStatus), (ele.Remark = remark);
      });
      let requestData = this.allSeletectedAsset;
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateMultipleTransferReviewApproverProcessWF2(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.bulkUpdate = false;
            this.loadData(
              this._masterWorkflowId,
              this._approverType,
              this.pageSize,
              this.from - 1
            );

            this.allSeletectedAsset = [];
          },
          (err) => {
            this.checkResult = false;
            this.error(err);

            //console.log("error", err);
          }
        );
    } else {
      this.allSeletectedAsset.forEach((ele: any, index) => {
        (ele.ActionStatus = actionStatus), (ele.Remark = remark);
      });
      let requestData = this.allSeletectedAsset;
      //console.log("requestData", requestData)
    }

  }
  sweetAlertApproverMultiConfirmation() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      input: 'textarea',
      inputAttributes: {
        maxlength: '100'
      },
      inputPlaceholder: "Remark",
      cancelButtonColor: '#FF3366',

      confirmButtonText: '<span class=\'swal2-confirm \'> Yes,  Approve it!</span>'
    }).then((result) => {
      if (result.isConfirmed) {
        this.requestHandlerSelectedAll(result.value, 'Approved');

        // setTimeout(() => {
        //   if (this.checkResult == true) {
        //     Swal.fire(
        //       'Approver!',
        //       'Your asset has been  Approvered.',
        //       'success'
        //     );
        //   }
        //   else  {
        //     Swal.fire(
        //       'Not Approvered!',
        //       'Your asset has been  Not Approvered.',
        //       'warning'
        //     );
        //   }
        // }, 1000);


      }

    });
  }
  sweetAlertReviewerMultiConfirmation() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      input: 'textarea',
      inputAttributes: {
        maxlength: '100'
      },
      inputPlaceholder: "Remark",
      cancelButtonColor: '#FF3366',
      confirmButtonText: '<span class=\'swal2-confirm \'> Yes, Reviewer it!</span>'
    }).then((result) => {
      if (result.isConfirmed) {
        this.requestHandlerSelectedAll(result.value, 'Reviewed');

        // setTimeout(() => {
        //   if (this.checkResult == true) {
        //     Swal.fire(
        //       'Reviewed!',
        //       'Your asset has been Reviewed.',
        //       'success'
        //     );

        //   }
        //   else  {
        //     Swal.fire(
        //       'Not Reviewed!',
        //       'Your asset has been  Not Reviewed.',
        //       'warning'
        //     );
        //   }}, 1000);

      }

    });
  }

  sweetAlertRejectMultiConfirmation() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      input: 'textarea',
      inputAttributes: {
        maxlength: '100'
      },
      inputPlaceholder: "Remark",
      inputValidator: result => !result && 'You need to select something!',
      cancelButtonColor: '#FF3366',
      confirmButtonText: '<span class=\'swal2-confirm \'> Yes, Reject it!</span>'
    }).then((result) => {
      if (result.value) {
        if (result.isConfirmed) {
          this.requestHandlerSelectedAll(result.value, 'Rejected');

          // setTimeout(() => {
          //   if (this.checkResult == true) {
          //     Swal.fire(
          //       'Rejected!',
          //       'Your asset has been Rejected.',
          //       'success'
          //     );

          //   } else {
          //     Swal.fire(
          //       'Cancel!',
          //       'Your asset has been  Not Rejected.',
          //       'warning'
          //     );
          //   } }, 1000);


        }
      }
    });
  }

  success(res) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: res.message,
      showConfirmButton: false,
      timer: 3000,

    });
  }
  error(err) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: err.message || err.error.message,
      showConfirmButton: false,
      timer: 2000,

    });

  }

  loadPage(pageNo: number) {
    //  this.departmentName,this.categoryName,this.subCategoryName
    this.pageNo = pageNo;
    this.loadData(
      this._masterWorkflowId,
      this._approverType,
      this.pageSize,
      this.pageSize * (pageNo - 1)
    );
    //console.log(pageNo);
  }

  loadData(masterWorkflowId: any, approverType: any, displayLength: number = 10, startIndex: Number = 0) {
    this.loadingIndicator = true;
    this.isTableView = true;
    this.dashboardService.getDashboardTodoListDetails_Paging(this._globalCompanyId, masterWorkflowId, approverType, displayLength, startIndex).subscribe(
      (res: any) => {
        //console.log(res);
        this.rows = res;
        if (this.rows.length > 0) {
          this.totalRecordsFromApi = res[0].totalCount;
          this.from = res.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res[0].rowNum
          );
          this.to = res.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res[0].rowNum
          );
          this.pageSize = displayLength;
        } else {
          this.totalRecordsFromApi = 0;
          this.from = 0;
          this.to = 0;
          this.pageSize = displayLength;
          this.goto();
        }

        this.loadingIndicator = false;
      },
      (err) => {
        //console.log(err)
      }
    );
  }
  reloadPage() {
    //this.loadData();
    this.loadData(this._masterWorkflowId, this._approverType, this.pageSize, 0);
  }
}



