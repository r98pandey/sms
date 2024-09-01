import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { environment } from "src/environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { Lightbox } from "ngx-lightbox";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
@Component({
  selector: "app-not-match-asset",
  templateUrl: "./not-match-asset.component.html",
  styleUrls: ["./not-match-asset.component.scss"],
})
export class NotMatchAssetComponent implements OnInit, OnChanges {
  @Input() assetList: any[] = [];
  isProject: boolean = false;
  filteredList: any = [];
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  constructor(
    public authService: AuthAssetService,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal
  ) {
    this.isProject = this.authService.getisProject();
  }
  ngOnInit(): void {
    //console.log("assetList", this.assetList);
    if (this.assetList.length != 0) {
      this.totalRecords = this.assetList.length;
      this.filteredList = this.assetList;
      this.collectionSize = this.filteredList.length;
      this.getLocalPagination();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.assetList.length != 0) {
      this.totalRecords = this.assetList.length;
      this.filteredList = this.assetList;
      this.collectionSize = this.filteredList.length;
      this.getLocalPagination();
    }
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  getLocalPagination() {
    this.filteredList = this.assetList.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.to =
      this.page * this.pageSize > this.assetList.length
        ? this.assetList.length
        : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.assetList.length == 0 ? 0 : this.from;
  }
  assetQrData: any;
  imageUrl = environment.apiUrl;
  viewQrCodeImage(content, asset): void {
    this.assetQrData = asset;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }
}
