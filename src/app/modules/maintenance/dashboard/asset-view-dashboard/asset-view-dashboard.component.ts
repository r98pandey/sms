import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AssetService } from "src/app/core/services/asset.service";
import { environment } from "src/environments/environment";
import { Lightbox } from "ngx-lightbox";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuccessModalWithRemarkComponent } from "src/app/shared/components/success-modal-with-remark/success-modal-with-remark.component";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import Swal from "sweetalert2";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
@Component({
  selector: "app-asset-view-dashboard",
  templateUrl: "./asset-view-dashboard.component.html",
  styleUrls: ["./asset-view-dashboard.component.scss"],
})
export class AssetViewDashboardComponent implements OnInit, OnDestroy {
  breadCrumbItems!: Array<{}>;
  storeAssetID: any;
  assetDetailsObj: any = {};
  apiUrl: any = environment.apiUrl;
  addSpartListShown: boolean = false;
  activeId: number = 1;
  shownButtonSpareList: boolean = false;
  storeWorkflowObject: any;
  storeMasterWorkflowId: any;
  storeApproverType: any;
  storeAssetObject: any;
  constructor(
    private assetService: AssetService,
    private router: Router,
    private lightbox: Lightbox,
    private modalService: NgbModal,
    private helpDeskService: HelpDeskService,
    private commonFunctionService: CommonFunctionService
  ) {
    this.breadCrumbItems = [
      { label: "Asset Management" },
      { label: "Asset Detail", active: true },
    ];
    this.storeWorkflowObject = { ...this.helpDeskService.workflowObject };
    this.storeMasterWorkflowId = this.storeWorkflowObject.masterWorkflowId
      ? this.storeWorkflowObject.masterWorkflowId
      : 0;
    this.storeApproverType = this.storeWorkflowObject.approverType;
    this.storeAssetID = this.assetService.sendAssetId;
    this.storeAssetObject = { ...this.assetService.storeAssetObject };
    if (this.storeAssetID == 0 || this.storeAssetID == null) {
      this.router.navigate([
        "maintenance-management/dashboard/asset-list-dashboard",
      ]);
    } else {
      this.getAssetDetailsByAssetId(this.storeAssetID);
      this.addSpartListShown = this.router.url.includes("addSpareList");
      if (this.addSpartListShown === true) {
        this.activeId = 2;
        this.shownButtonSpareList = true;
      } else {
        this.activeId = 1;
        this.shownButtonSpareList = false;
      }
    }
  }

  ngOnInit(): void {
    this.topFunction();
  }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  getAssetDetailsByAssetId(assetId: Number) {
    this.assetService.getAssetProfileDetails(assetId).subscribe((res: any) => {
      this.assetDetailsObj = res.data;
    });
  }
  onBack() {
    this.router.navigate([
      "maintenance-management/dashboard/asset-list-dashboard",
    ]);
  }

  open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  openModalSucccessWithRemark(asset: any, type: any ,shownValue:any) {
    const modalRef = this.modalService.open(SuccessModalWithRemarkComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      " Do you want to " + shownValue + " this asset";
    modalRef.componentInstance.subTitle = "( " + asset.assetName + " ) ";
    modalRef.componentInstance.subTitle1 = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = shownValue + " It";
    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result.value == "success") {
          this.requestHandler(asset, result.remark, type);
        }
      }
    });
  }

  requestHandler(asset, remark, actionStatus: any) {
    //New Asset Confirmation

    let actionStatusdata: any;
    if (actionStatus == "Approver") {
      actionStatusdata = "Approved";
    } else if (actionStatus == "Reviewer") {
      actionStatusdata = "Reviewed";

    } else if (actionStatus == "Reject") {
      actionStatusdata = "Rejected";
    }
    if (this.storeMasterWorkflowId == 1) {
      let requestData = {
        WfAssetCreationId: this.storeAssetObject.wfAssetCreationId,
        WfAssetCreationDetailId: this.storeAssetObject.wfAssetCreationDetailId,
        ApproverType: this.storeWorkflowObject.approverType,
        ActionStatus: actionStatusdata,
        AssetId: asset.id,
        Remark: remark,
      };

      //console.log("requestData", requestData);
      this.assetService
        .postUpdateReviewerApproverProcess(requestData)
        .subscribe((res: any) => {
          this.success(res);
          this.onBack();
        },(err: any) => {
        //console.log(err);
        this.openModaWaringConf(err);
      })
    
  }
}
  openModaWaringConf(message) {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = message;
    modalRef.componentInstance.subTitle = "";
    modalRef.result.then((result) => {
      console.log(result, "result");
      if (result) {
        if (result == "Close click") {
          this.router.navigate(['/maintenance-management/dashboard/asset-list-dashboard']);
        }
      }
    });
  }


  success(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.action,
      text: res.message,
      showConfirmButton: false,
      timer: 1000,
      showCloseButton: true, // Add this line
    });
  }

  goToEditHandler(assetId: any) {
    this.assetService.sendAssetId = assetId;
    this.assetService.assetBackRoute =
    "maintenance-management/dashboard/asset-view-dashboard";
    this.router.navigate(["/asset-management/asset/editasset"]);
  }
  ngOnDestroy(): void {
    // this.assetService.sendAssetId = 0;
  }
}
