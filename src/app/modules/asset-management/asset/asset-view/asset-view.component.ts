import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AssetService } from "src/app/core/services/asset.service";
import { environment } from "src/environments/environment";
import { Lightbox } from "ngx-lightbox";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
@Component({
  selector: "app-asset-view",
  templateUrl: "./asset-view.component.html",
  styleUrls: ["./asset-view.component.scss"],
})
export class AssetViewComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  storeAssetID: any;
  assetDetailsObj: any = {};
  apiUrl: any = environment.apiUrl;
  addSpartListShown: boolean = false;
  activeId: number = 1;
  shownButtonSpareList: boolean = false;

  constructor(
    private assetService: AssetService,
    private router: Router,
    private lightbox: Lightbox,
    private commonFunctionService: CommonFunctionService
  ) {
    this.breadCrumbItems = [
      { label: "Asset Management" },
      { label: "Asset Detail", active: true },
    ];
    this.storeAssetID = this.assetService.sendAssetId;
    if (this.storeAssetID == 0 || this.storeAssetID == null) {
      this.router.navigate(["/asset-management/asset/listasset"]);
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
    let back= this.assetService.assetBackRoute? this.assetService.assetBackRoute:'/asset-management/asset/listasset'
    this.router.navigate([back]);
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
}
