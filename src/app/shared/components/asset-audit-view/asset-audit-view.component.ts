import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Lightbox } from "ngx-lightbox";
import {
  fromEvent,
  filter,
  debounceTime,
  distinctUntilChanged,
  tap,
} from "rxjs";
import { AssetService } from "src/app/core/services/asset.service";
import { AuditService } from "src/app/core/services/audit.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-asset-audit-view",
  templateUrl: "./asset-audit-view.component.html",
  styleUrls: ["./asset-audit-view.component.scss"],
})
export class AssetAuditViewComponent
  implements OnInit, OnChanges, AfterViewInit
{
  isProject: boolean = false;
  @Input() auditId: any;

  payload: any = {
    assetAuditId: null,
    SearchAssetName: null,
    SearchAssetTagId: null,
    displayLength: 10,
    displayStart: 0,
    SearchAssetStatusId: null,
  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  assetList = [];
  page = 1;
  collectionSize = 0;
  assetQrData: any;
  typeAssetNameValue: any;
  typeAssetTagIdValue: any;
  imageUrl = environment.apiUrl;
  defaultNavActiveId: any = 1;
  assetAuditNotMatch: any = [];
  arrayListDropDownAssetStatus: any = [];
  selectedDropDownAssetStatusIdValue: any = null;
  constructor(
    private router: Router,
    private auditService: AuditService,
    private authService: AuthAssetService,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private assetService: AssetService,
    private lightbox: Lightbox
  ) {
    this.isProject = this.authService.getisProject();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.payload = {
      assetAuditId: this.auditId,
      SearchAssetName: null,
      SearchAssetTagId: null,
      displayLength: 10,
      displayStart: 0,
      SearchAssetStatusId: null,
    };
    this.loadData();
    this.getAssetAuditNotMatch(this.auditId);
    this.getAssetStatusList("AssetList");
  }

  ngOnInit(): void {}

  getAssetAuditNotMatch(auditId: any) {
    let payload = {
      assetAuditId: auditId,
    };
    this.auditService.getAssetAuditNotMatch(payload).subscribe((res: any) => {
      this.assetAuditNotMatch = res ? res : [];
    });
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  loadData() {
    this.auditService
      .getTransactionAssetAudit_ByPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.assetList = res.list;
        if (this.assetList.length > 0) {
          this.totalRecordsFromApi = res.list[0].totalCount;
          this.from = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.to = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.pageSize = this.payload.displayLength;
        } else {
          this.totalRecordsFromApi = 0;
          this.from = 0;
          this.to = 0;
          this.pageSize = this.payload.displayLength;
        }
      });
  }

  onDropdownAssetStatusValueChange($event) {
    this.payload.SearchAssetStatusId = this.selectedDropDownAssetStatusIdValue;
    this.loadData();
  }
  getAssetStatusList(id: any) {
    this.assetService.getAssetStatusList(id).subscribe(
      (res: any) => {
        this.arrayListDropDownAssetStatus = res;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  onTypeAssetNameChange(isDebounce) {
    if (this.typeAssetNameValue.length) {
      this.page = 1;
      this.payload.displayStart = this.pageSize * (this.page - 1);
      this.payload.SearchAssetName = this.typeAssetNameValue;
      this.loadData();
    } else {
      this.typeAssetNameValue = null;
      this.page = 1;
      this.payload.displayStart = this.pageSize * (this.page - 1);
      this.payload.SearchAssetName = this.typeAssetNameValue;
      this.loadData();
    }
  }

  onTypeAssetTagIdChange(isDebounce) {
    if (this.typeAssetTagIdValue.length) {
      this.page = 1;
      this.payload.displayStart = this.pageSize * (this.page - 1);
      this.payload.SearchAssetTagId = this.typeAssetTagIdValue;
      this.loadData();
    } else {
      this.typeAssetTagIdValue = null;
      this.page = 1;
      this.payload.displayStart = this.pageSize * (this.page - 1);
      this.payload.SearchAssetTagId = this.typeAssetTagIdValue;
      this.loadData();
    }
  }
  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

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

  @ViewChild("inputer", { static: true }) input: ElementRef;
  @ViewChild("inputerTagId", { static: true }) inputerTagId: ElementRef;

  ngAfterViewInit() {
    // server-side search
    if (this.input && this.input.nativeElement) {
      fromEvent(this.input?.nativeElement, "input")
        .pipe(
          filter(Boolean),
          debounceTime(1000),
          distinctUntilChanged(),
          tap((event: KeyboardEvent) => {
            //console.log("gfdsdfg");
            this.onTypeAssetNameChange(true);
          })
        )
        .subscribe();
    }
    if (this.typeAssetTagIdValue && this.inputerTagId.nativeElement) {
      fromEvent(this.inputerTagId?.nativeElement, "input")
        .pipe(
          filter(Boolean),
          debounceTime(1000),
          distinctUntilChanged(),
          tap((event: KeyboardEvent) => {
            this.onTypeAssetTagIdChange(true);
          })
        )
        .subscribe();
    }
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

  resetSerachVariable() {
    this.typeAssetNameValue = null;
    this.typeAssetTagIdValue = null;
    this.selectedDropDownAssetStatusIdValue = null;
    this.payload = {
      assetAuditId: this.auditId,
      SearchAssetName: null,
      SearchAssetTagId: null,
      displayLength: 10,
      displayStart: 0,
      SearchAssetStatusId: null,
    };
    this.page = 1;
    this.loadData();
  }
}
