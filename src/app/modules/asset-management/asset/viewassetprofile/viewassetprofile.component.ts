import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetService } from 'src/app/core/services/asset.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { WorkflowService } from 'src/app/core/services/workflow.service';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-viewassetprofile',
  templateUrl: './viewassetprofile.component.html',
  styleUrls: ['./viewassetprofile.component.scss']
})
export class ViewassetprofileComponent implements OnInit {
  assetsDatailsList: any;
  _assetId: any;
  assetProfileData: any;
  ImageUrl: string;
  _approverType: any;
  checkValue: boolean;
  checkResult: boolean;
  loadingprofileData: boolean;
  _masterWorkflowId: number;
  doToDatailsList: any;
  _approverTypeService: string;
  masterWorkflowIdService: number;
  depriciatioScheduleList: any;
  isProject: boolean = false;
  defaultNavActiveId=1
  assestIdStore: any;
  constructor(
    private companyService: CompanyService,
    private router: Router,
    private modalService: NgbModal,
    private assetService: AssetService,
    private dashboardService: DashboardService,
    private workflowService: WorkflowService,
    private authService: AuthAssetService
  ) {
    this.loadingprofileData = true;
    this.ImageUrl = environment.apiUrl;
    this._approverType = this.workflowService.approverType;
    //console.log("view  this._approverType", this._approverType);
    this.assetsDatailsList = { ...this.dashboardService.viewItem };
    this._assetId = this.assetsDatailsList.id;
    this.checkResult = false;
    this.doToDatailsList = { ...this.dashboardService.dotoItem };
    this._masterWorkflowId = this.doToDatailsList.masterWorkflowId;
    this.masterWorkflowIdService = this.dashboardService._masterWorkflowId;
    this._approverTypeService = this.dashboardService._approverType;
    this.assestIdStore = this._assetId;
    //console.log("  this._assetId", this._assetId)
    if (this.assetsDatailsList["id"] || this.assetsDatailsList["id"] == 0) {
    } else {
      this.router.navigate(["/asset-management/asset/todolist"]);
    }
    this.isProject = this.authService.getisProject();
  }


  ngOnInit(): void {
    this.assetProfileData = [];
    this.getAssetDetails();
  }
  getasststoreValue(){

    this.assestIdStore = this._assetId;
  }


  getAssetDetails() {
    this.dashboardService.getAssetProfileDetails(this._assetId).subscribe(
      (res: any) => {
        //this.loadingIndicator = false;
        this.assetProfileData = res.data;
        if (this.assetProfileData.depreciationID == 2) {
          this.getDepriciatioSchedule(
            this.assetProfileData.purchaseDate,
            this.assetProfileData.purchasePrice,
            this.assetProfileData.residualAmount,
            this.assetProfileData.assetLifeSpan,
            this.assetProfileData.disposeDate
          );
        }
        //console.log("assetProfileData->", this.assetProfileData);
        this.loadingprofileData = false;
      },
      (err) => {
        //console.log(err)
      }
    );
  }

  getDepriciatioSchedule(purchasedDateValue: any = null, purchasedPriceValue: number = null, residualAmountValue: number = null, lifeSpan: number = null, disposeDate: any = null) {
    //console.log(purchasedDateValue, lifeSpan, purchasedPriceValue, residualAmountValue, disposeDate);
    this.assetService
      .getDepriciatioSchedule(
        purchasedDateValue,
        purchasedPriceValue,
        residualAmountValue,
        lifeSpan,
        disposeDate
      )
      .subscribe(
        (res: any) => {
          this.depriciatioScheduleList = res.data;
          //console.log("depriciatioScheduleList->", this.depriciatioScheduleList);
        },
        (err) => {
          //console.log(err)
        }
      );
  }
  /**
  /**
 * @description reviewer api call
 */


  requestHandler(remark: any, actionStatus: any) {
    // Asset  Loan workflow 
    if (this._masterWorkflowId == 4) {
      let requestData = {
        WfAssetCreationId: this.assetsDatailsList.wfAssetCreationId,
        WfAssetCreationDetailId: this.assetsDatailsList.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        ActionStatus: actionStatus,
        AssetId: this.assetsDatailsList.id,
        Remark: remark,
      };
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateLoanReviewApproverProcess(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.goto();
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
        WfAssetCreationId: this.assetsDatailsList.wfAssetCreationId,
        WfAssetCreationDetailId: this.assetsDatailsList.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        ActionStatus: actionStatus,
        AssetId: this.assetsDatailsList.id,
        Remark: remark,
      };
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateReviewerApproverProcess(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.goto();
          },
          (err) => {
            this.error(err);
            this.checkResult = false;
            //console.log("error", err);
          }
        );
    }
    else if (this._masterWorkflowId == 3) {
      //New Asset Confirmation
      let requestData = {
        WfAssetCreationId: this.assetsDatailsList.wfAssetCreationId,
        WfAssetCreationDetailId: this.assetsDatailsList.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        ActionStatus: actionStatus,
        AssetId: this.assetsDatailsList.id,
        Remark: remark,
      };
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateReviewerApproverAssetTrasnferProcessWF3(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.goto();
          },
          (err) => {
            this.error(err);
            this.checkResult = false;
            //console.log("error", err);
          }
        );
    }
    else if (this._masterWorkflowId == 2) {
      //New Asset Confirmation
      let requestData = {
        WfAssetCreationId: this.assetsDatailsList.wfAssetCreationId,
        WfAssetCreationDetailId: this.assetsDatailsList.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        ActionStatus: actionStatus,
        AssetId: this.assetsDatailsList.id,
        Remark: remark,
      };
      //console.log("requestData", requestData)
      this.workflowService
        .postUpdateReviewerApproverAssetTrasnferProcessWF2(requestData)
        .subscribe(
          (res: any) => {
            this.success(res);
            this.checkResult = true;
            this.goto();
          },
          (err) => {
            this.error(err);
            this.checkResult = false;
            //console.log("error", err);
          }
        );
    }
    else {
      let requestData = {
        WfAssetCreationId: this.assetsDatailsList.wfAssetCreationId,
        WfAssetCreationDetailId: this.assetsDatailsList.wfAssetCreationDetailId,
        ApproverType: this._approverType,
        ActionStatus: actionStatus,
        AssetId: this.assetsDatailsList.id,
        Remark: remark,
      };
      //console.log("requestData", requestData)
    }
    return this.checkResult;
  }

  sweetAlertApproverConfirmation() {
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

        this.requestHandler(result.value, 'Approved');
        //   setTimeout(() => {
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
  sweetAlertReviewerConfirmation() {
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
        this.requestHandler(result.value, 'Reviewed');

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
        //   } }, 1000);

      }

    });
  }

  sweetAlertRejectConfirmation() {
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
          this.requestHandler(result.value, 'Rejected');

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
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 3000,

    });

  }

  /**
* @description for back to page 
*/
  goto() {
    this.dashboardService._masterWorkflowId = this.masterWorkflowIdService;
    this.dashboardService._approverType = this._approverTypeService
    this.router.navigate(['/asset-management/asset/todolist']);

  }
  returnClassStatus(id) {
    if (id == 2) {
      return 'badge-2-pending';}
    else if (id == 3) {
      return 'badge-3-Inservice';
    } else if (id == 19) {
      return 'badge-19-canceled';
    } else if (id == 25) {
      return 'badge-25-completed';
    } else if (id == 29) {
      return 'badge-29-open';
    } else if (id == 30) {
      return 'badge-30-inProgress';
    } else if (id == 32) {
      return 'badge-32-closed';
    } else if (id == 34) {
      return 'badge-34-onhold';
    } else if (id == 31) {
      return 'badge-31-Resolved';
    } else if (id == 38) {
      return 'badge-38-Waiting-for-Parts';
    } else if (id == 39) {
      return 'badge-39-Inspection-Required';
    } else if (id == 40) {
      return 'badge-40-Follow-up-Required';
    } else if (id == 41) {
      return 'badge-41-Service-Required';
    } else if (id == 42) {
      return 'badge-42-Replacement-Required';
    } else if (id == 43) {
      return 'badge-43-Replacement-Completed';
    } else if (id == 44) {
      return 'badge-44-Warranty-Claim';
    } else if (id == 45) {
      return 'badge-45-Awaiting-Action';
    } else if (id == 46) {
      return 'badge-46-Unusable';
    }
  }

  viewImageValue:any;
  confirmForViewImage(content, value: any) {
    this.viewImageValue = this.ImageUrl + value;

    //console.log(" this.viewImageValue", this.viewImageValue)
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
}
