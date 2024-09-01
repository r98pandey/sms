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
// Light Box
import { Lightbox } from "ngx-lightbox";
import { forEach } from "lodash";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { CompanyService } from "src/app/core/services/company.service";
import { CheckScheduleComponent } from "../../preventive/schedule/check-schedule/check-schedule.component";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { SeheduleSignatureComponent } from "../sehedule-signature/sehedule-signature.component";
@Component({
  selector: "app-schedule-details-signature",
  templateUrl: "./schedule-details-signature.component.html",
  styleUrls: ["./schedule-details-signature.component.scss"],
})
export class ScheduleDetailsSignatureComponent {
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
  assetTicketItem_new: any = [];

  scheduleItemCheckStatusAwaitingAction45 = 0;
  scheduleItemCheckStatusVerified_Passed24 = 0;
  scheduleItemCheckStatusVerified_Failed49 = 0;
  scheduleItemCheckStatusVerified_NotAppicable1 = 0;
  companyData: any = {};
  scheduleTypeAdminAndClient: any;
  scheduleTypeClientSignature: boolean = false;
  scheduleTypeAdminSignature: boolean = false;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private preventiveService: PreventiveService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    private commonFunctionService: CommonFunctionService,
    private offcanvasService: NgbOffcanvas,
    private lightbox: Lightbox,
    private companyService: CompanyService,
    private helpDeskService: HelpDeskService,
    private ngZone: NgZone
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();
    this.scheduleTypeAdminAndClient =
      this.helpDeskService.scheduleTypeAdminAndClient;
    this.storeConfigScheduleId = this.preventiveService.scheduleId
      ? this.preventiveService.scheduleId
      : 0;

    this.paylod.scheduleId = this.storeConfigScheduleId;
    if (this.storeConfigScheduleId == 0 || this.storeConfigScheduleId == null) {
      this.router.navigate([
        "maintenance-management/dashboard/schedule-list-adminandclient",
      ]);
    } else {
      this.getV2_MX_PM_ScheduleAndAsset();
    }
  }

  ngOnInit(): void {
    this.defaultNavActiveId = 1;
  }
  openSignatureUser() {
    const modalRef = this.offcanvasService.open(SeheduleSignatureComponent, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas2",
    });
    modalRef.componentInstance.scheduleDetails = this.masterScheduleList;

    modalRef.result
      .then((result) => {
        //console.log(result, "result");
        this.goback();
      })
      .catch((error) => {
        //console.log(error, "error");
        this.goback();
      });
  }

  refreshThePage() {
    this.defaultNavActiveId = 1;
    this.getV2_MX_PM_ScheduleAndAsset();
  }
  afterSubmitServiceOrder(event){
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

        this.mX_WOTechAssignment = res.list.mX_WOTechAssignment;
        this.mx_WOStartEndTask = res.list.mx_WOStartEndTask;
        console.log(
          "mX_WOTechAssignment",
          this.mX_WOTechAssignment,
          this.mx_WOStartEndTask,
          " this.mx_WOStartEndTask"
        );
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
        if (this.assetTicketItem_new.length != 0) {
          this.checkTheAssetStatusValue();
        }
        let payload: any = {};
        payload.companyId = Number(this.masterScheduleList?.companyId);
        this.getViewData(payload);
      });

    if (this.scheduleTypeAdminAndClient === "Admin") {
      this.scheduleTypeAdminSignature = true;
      this.scheduleTypeClientSignature = false;
    } else if (this.scheduleTypeAdminAndClient === "Client") {
      this.scheduleTypeAdminSignature = true;
      this.scheduleTypeClientSignature = true;
    } else {
      this.scheduleTypeAdminSignature = false;
      this.scheduleTypeClientSignature = false;
    }
  }
  getViewData(paylod: any) {
    this.companyService.getCompanyDetail(paylod).subscribe((res: any) => {
      this.companyData = res?.data;
      ////console.log(this.companyData);
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
        this.pm_ScheduleAndAssetCheckList.forEach((element) => {
          element.imgPath = [];
          element.imgPath.push(
            element.pic_url ? this.imageUrl + element.pic_url : null,
            element.pic_url1 ? this.imageUrl + element.pic_url1 : null,
            element.pic_url2 ? this.imageUrl + element.pic_url2 : null
          );
        });
        this.checkTheValue();
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

  checkTheValue() {
    if (this.pm_ScheduleAndAssetCheckList.length != 0) {
      this.scheduleItemCheckStatusAwaitingAction45 = 0;
      this.scheduleItemCheckStatusVerified_Passed24 = 0;
      this.scheduleItemCheckStatusVerified_Failed49 = 0;
      this.scheduleItemCheckStatusVerified_NotAppicable1 = 0;
      for (var i = 0; i < this.pm_ScheduleAndAssetCheckList.length; i++) {
        var currentItem = this.pm_ScheduleAndAssetCheckList[i];
        if (currentItem.scheduleItemCheckStatusId === 45) {
          this.scheduleItemCheckStatusAwaitingAction45++;
        } else if (currentItem.scheduleItemCheckStatusId === 58) {
          this.scheduleItemCheckStatusVerified_Failed49++;
        }
        // else if (currentItem.scheduleItemCheckStatusId === 49) {
        //   this.scheduleItemCheckStatusVerified_Failed49++;
        // } 
        else if (currentItem.scheduleItemCheckStatusId === 24) {
          this.scheduleItemCheckStatusVerified_Passed24++;
        }else if (currentItem.scheduleItemCheckStatusId === 1) {
          this.scheduleItemCheckStatusVerified_NotAppicable1++;
        }
      }
    }
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
      "maintenance-management/dashboard/schedule-list-adminandclient",
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
  imageShown: any = false;

  openModalCreateConf() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Would you like a file with the image report?";
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = "";
    modalRef.componentInstance.CancelName = "No !";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          this.imageShown = false;
          this.printReport();
        } else if (result === "close") {
          this.imageShown = true;
          this.printReport();
        }
      }
    });
  }

  printReport() {
    // setTimeout(() => {
    //   try {
    //     document.execCommand("print", false, null);
    //   } catch {
    //     window.print();
    //   }
    // }, 200);

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
  sideColumValue: boolean = false;
  openSideColum() {
    this.sideColumValue = false;
  }

  closeSideColum() {
    this.sideColumValue = true;
  }

  scheduleAssetItemCheckStatusPending2 = 0;
  scheduleAssetItemCheckStatusIn_Progress30 = 0;
  scheduleAssetItemCheckStatusCompleted25 = 0;

  checkTheAssetStatusValue() {
    if (this.assetTicketItem_new?.length != 0) {
      this.scheduleAssetItemCheckStatusPending2 = 0;
      this.scheduleAssetItemCheckStatusIn_Progress30 = 0;
      this.scheduleAssetItemCheckStatusCompleted25 = 0;

      for (var i = 0; i < this.assetTicketItem_new?.length; i++) {
        var currentItem = this.assetTicketItem_new[i];
        if (currentItem.scheduleItemStatusId === 2) {
          this.scheduleAssetItemCheckStatusPending2++;
        } else if (currentItem.scheduleItemStatusId === 30) {
          this.scheduleAssetItemCheckStatusIn_Progress30++;
        } else if (currentItem.scheduleItemStatusId === 25) {
          this.scheduleAssetItemCheckStatusCompleted25++;
        }
      }
    }
  }
  open_new(data, changes): void {
    let _albums: any = [];
    let index = 0;
    data.forEach((element) => {
      if (element) {
        _albums.push({
          src: element,
          caption: "",
          thumb: "thumb",
        });
      }
    });
    if (_albums.length != 0) {
      for (let i = 0; i <= _albums.length; i++) {
        if (_albums[i].src == changes) {
          index = i;
          break;
        }
      }
    }
    console.log(_albums, index, "_albums, index");
    this.lightbox.open(_albums, index, {
      wrapAround: true,
      showImageNumberLabel: true,
      showRotate: true,
    });
  }

  mx_WOStartEndTask: any;
  mX_WOTechAssignment: any = [];






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
