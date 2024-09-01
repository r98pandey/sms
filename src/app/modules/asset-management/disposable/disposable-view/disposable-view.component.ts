import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AssetService } from "src/app/core/services/asset.service";
import { environment } from "src/environments/environment";
import { Lightbox } from "ngx-lightbox";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { DecimalPipe, Location } from '@angular/common';
import { DisposableService } from "src/app/core/services/disposable.service";

@Component({
  selector: 'app-disposable-view',
  templateUrl: './disposable-view.component.html',
  styleUrl: './disposable-view.component.scss'
})
export class DisposableViewComponent {
  isProject: boolean = false;
  label: any = "Disposable Management";
  breadCrumbItems: any = [
    { label: "Disposable" },
    { label: "Disposable View", active: true },
  ];
  disposeBatchHeaderMaster:any={}
  disposeBatchHeaderAndAssetList: any = [];
  apiUrl: any = environment.apiUrl;
  activeId: number = 1;
  storeDisposeTransactionId: any;

  constructor(
    private assetService: AssetService,
    private router: Router,
    private lightbox: Lightbox,
    private commonFunctionService: CommonFunctionService,
    private authService: AuthAssetService,
    private disposableService: DisposableService, private location: Location,
  ) {
    this.isProject = this.authService.getisProject();
    this.storeDisposeTransactionId = this.disposableService.disposableId;
    if (this.storeDisposeTransactionId !== 0) {
      this.getV2_DisposeBatchHeaderAndAssetList();
    } else {
      this.location.back();

    }
  }

  ngOnInit(): void {

  }
  refreshThePage(){
    this.getV2_DisposeBatchHeaderAndAssetList();
  }
  getV2_DisposeBatchHeaderAndAssetList() {
    let payload = {
      MasterDisposeTransactionId: this.storeDisposeTransactionId
    }
    this.disposableService
      .GetV2_DisposeBatchHeaderAndAssetList(payload)
      .subscribe((res: any) => {
        this.disposeBatchHeaderMaster = res.master.length!=0 ? res.master[0] : {};
        this.disposeBatchHeaderAndAssetList=res.detail?res.detail:[];
      });
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
  downloadReport(value) {
    let payload: any = {};
    let newDate = new Date();
    let projectName = 'DisposableReport ';
    payload.MasterDisposeTransactionId = this.storeDisposeTransactionId
    payload.downloadType = value;
    console.log(payload);
    this.disposableService
      .getV2_DisposeReportBatch(this.commonFunctionService.clean(payload))
      .subscribe((data: Blob) => {
        const filename =
          value === "PDF"
            ? projectName + newDate + ".pdf"
            : projectName + newDate + ".xls";
        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }
}
