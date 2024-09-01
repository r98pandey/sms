import {
  Component,
  ElementRef,
  NgZone,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Observable } from "rxjs";
import { NgbModal, NgbNav, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { TicketService } from "src/app/core/services/ticket.service";
import { Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { environment } from "src/environments/environment";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import Swal from "sweetalert2";
import { PreventiveService } from "src/app/core/services/preventive.service";
import { getTestBed } from "@angular/core/testing";
import { CheckScheduleComponent } from "../check-schedule/check-schedule.component";
// Light Box
import { Lightbox } from "ngx-lightbox";

@Component({
  selector: "app-view-schedule",
  templateUrl: "./view-schedule.component.html",
  styleUrls: ["./view-schedule.component.scss"],
})
export class ViewScheduleComponent {
  defaultNavActiveId: number = 1;
  openCardWithIndex = -1;
  label: any = "Preventive Management";
  breadCrumbItems: any = [
    { label: "Configuration" },
    { label: "Configuration List", active: true },
  ];
  storeConfigScheduleId: any;
  isProject: any;
  activeId: number = 1;
  imageUrl: any = environment.apiUrl;
  viewQuotationTabShown: boolean = false;
  deleteId: any;
  @ViewChild("customNav") customNav: NgbNav; // Reference to the ngbNav component
  @ViewChild("defaultNav") defaultNav: NgbNav; // Reference to the ngbNav component
  storePreventiveCategoryId: number;
  paylod: any = { scheduleId: null };
  assetTicketItem: any = [];
  masterScheduleList: any = [];
  pm_ScheduleAndAssetCheckList: any = [];
  assetTicketItem_new: any;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private preventiveService: PreventiveService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    private commonFunctionService: CommonFunctionService,
    private offcanvasService: NgbOffcanvas,
    private lightbox: Lightbox,
    private ngZone: NgZone
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();

    this.storeConfigScheduleId = this.preventiveService.scheduleId
      ? this.preventiveService.scheduleId
      : 0;

    this.paylod.scheduleId = this.storeConfigScheduleId;
    if (this.storeConfigScheduleId == 0 || this.storeConfigScheduleId == null) {
      this.router.navigate([
        this.preventiveService.lastStorePreventiveRouterName
      ]);
    } else {
      this.getV2_MX_PM_ScheduleAndAsset();
    }
  }

  ngOnInit(): void {
    this.defaultNavActiveId = 1;
  }
  refreshThePage() {
    this.defaultNavActiveId = 1;
    this.getV2_MX_PM_ScheduleAndAsset();
  }
  scrollToSection(sectionId: any) {
    //console.log(sectionId);
    const element = document.getElementById("ass" + sectionId);
    //console.log(element, "element");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }

  getV2_MX_PM_ScheduleAndAsset() {
    this.preventiveService
      .getV2_MX_PM_ScheduleAndAsset(this.paylod)
      .subscribe((res: any) => {
        Object.keys(res.list).forEach((key) => {
          if (res.list[key] === null) {
            res.list[key] = [];
          }
        });
        this.getV2_MX_PM_ScheduleAndAssetCheckListByScheudleId(
          this.storeConfigScheduleId
        );
        this.masterScheduleList = res.list.schedule;
        this.assetTicketItem = res.list.assetList;
        this.assetTicketItem.forEach((ele) => {
          ele.selected = false;
        });
        this.assetTicketItem_new = res.list.assetList;

        this.AssetData = res.list.assetList;
        this.collectionSize = res.list.assetList.length;
        this.getAssetData();
      });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  checkValue: boolean = false;
  openCardWithIndexOpen(index) {
    this.assetTicketItem[index].selected =
      !this.assetTicketItem[index].selected;
  }
  getTestBedetV2_MX_PM_ScheduleAndAssetCheckList(data) {
    let Payload = {
      ScheduleItemId: data,
    };
    this.preventiveService
      .GetV2_MX_PM_ScheduleAndAssetCheckList(Payload)
      .subscribe(
        (res: any) => {
          this.pm_ScheduleAndAssetCheckList = res.list;
          if (res.list) {
            this.openModalViewSchude(res.list);
          }
        },
        (err) => {}
      );
  }
  scheduleAndAssetCheckList: any = {};

  getV2_MX_PM_ScheduleAndAssetCheckListByScheudleId(ScheduleId) {
    let data: any = {
      ScheduleId: ScheduleId,
    };

    this.preventiveService
      .getV2_MX_PM_ScheduleAndAssetCheckListByScheudleId(data)
      .subscribe((res: any) => {
        let results = res.list;

        this.pm_ScheduleAndAssetCheckList = res.list;
        if (this.pm_ScheduleAndAssetCheckList.length != 0) {
          this.assetTicketItem_new.forEach((ele: any) => {
            results.forEach((element) => {
              if (ele.scheduleItemId == element.scheduleItemId) {
                if (!this.scheduleAndAssetCheckList[ele.scheduleItemId]) {
                  this.scheduleAndAssetCheckList[ele.scheduleItemId] = [];
                }
                this.scheduleAndAssetCheckList[ele.scheduleItemId].push(
                  element
                );
              }
            });
          });
        }
      });
  }

  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  AssetData: any[];
  totalRecords: number = 0;
  imgUrl = environment.apiUrl;

  getAssetData() {
    this.assetTicketItem = this.AssetData.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.to =
      this.page * this.pageSize > this.AssetData.length
        ? this.AssetData.length
        : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.AssetData.length == 0 ? 0 : this.from;
    this.totalRecords = this.AssetData.length;
    this.assetTicketItem.forEach((ele) => {
      ele.selected = false;
    });
  }

  openModalViewSchude(pm_ScheduleAndAssetCheckList) {
    if (pm_ScheduleAndAssetCheckList.length > 0) {
      const modalRef = this.offcanvasService.open(CheckScheduleComponent, {
        scroll: true,
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvas ",
      });
      modalRef.componentInstance.pm_ScheduleAndAssetCheckList =
        pm_ScheduleAndAssetCheckList;
    }
  }

  goback() {
    this.router.navigate([
      this.preventiveService.lastStorePreventiveRouterName
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

  printReport() {
    this.ngZone.runOutsideAngular(() => {
      // Run the print operation outside the Angular zone
      setTimeout(() => {
        try {
          document.execCommand("print", false, null);
        } catch {
          // Fallback to window.print() if execCommand is not supported
          window.print();
        }
        this.ngZone.run(() => {
          // //console.log("Print operation completed");
        });
      }, 50);
    });
  }


  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;

  storeInfomationVideo:any='';
  linkVideo:any='';
  openModaVideeo(link,content) {
    this.storeInfomationVideo=link
    this.linkVideo=environment.apiUrl+link.videoFileURL;
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
   
    modalRef.result.then((result) => {
      if (result) {
        if (result == "confirm") {
      
        }
      }
    });
  }
  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }
  playPause() {
    var myVideo: any = document.getElementById("my_video_1");
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }

  makeBig() {
    var myVideo: any = document.getElementById("my_video_1");
    myVideo.width = 560;
  }

  makeSmall() {
    var myVideo: any = document.getElementById("my_video_1");
    myVideo.width = 320;
  }

  makeNormal() {
    var myVideo: any = document.getElementById("my_video_1");
    myVideo.width = 420;
  }

  skip(value) {
    let video: any = document.getElementById("my_video_1");
    video.currentTime += value;
  }

  restart() {
    let video: any = document.getElementById("my_video_1");
    video.currentTime = 0;
  }
}
