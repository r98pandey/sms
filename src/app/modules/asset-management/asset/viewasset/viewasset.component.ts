import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetService } from 'src/app/core/services/asset.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { WorkflowService } from 'src/app/core/services/workflow.service';
import { UtilService } from 'src/app/core/services/util.service';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-viewasset',
  templateUrl: './viewasset.component.html',
  styleUrls: ['./viewasset.component.scss']
})
export class ViewassetComponent implements OnInit {
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
  depriciatioScheduleList: any;
  isProject: boolean = false;
  assestIdStore: any;
  defaultNavActiveId = 1
  imgUrl=environment.apiUrl
  constructor(
    private companyService: CompanyService,
    private router: Router,
    private modalService: NgbModal,
    private assetService: AssetService,
    private dashboardService: DashboardService,
    private workflowService: WorkflowService,
    private authService: AuthAssetService,
    private utilService: UtilService
  ) {
    this.loadingprofileData = true;
    this.ImageUrl = environment.apiUrl;
    this.assetsDatailsList = { ...this.dashboardService.viewItem };
    this._assetId = this.assetsDatailsList.id;
    this.checkResult = false;
    this.doToDatailsList = { ...this.dashboardService.dotoItem };
    this._masterWorkflowId = this.doToDatailsList.masterWorkflowId;
    this.assestIdStore = this._assetId;
    //console.log("  this._assetId", this._assetId)
    if (this.assetsDatailsList["id"] || this.assetsDatailsList["id"] == 0) {
    } else {
      this.router.navigate(["asset-management/asset/listasset"]);
    }
    this.isProject = this.authService.getisProject();
  }
  getasststoreValue() {

    this.assestIdStore = this._assetId;
  }

  ngOnInit(): void {
    this.assetProfileData = [];
    this.getAssetDetails();
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
 * @description reviewer api call
 */





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
    this.router.navigate(['asset-management/asset/listasset']);
  }
  returnClassStatus(id) {
    return this.utilService.returnStatusClasses(id);
  }

  viewImageValue:any;
  confirmForViewImage(content, value: any) {
    this.viewImageValue = this.imgUrl + value;

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



