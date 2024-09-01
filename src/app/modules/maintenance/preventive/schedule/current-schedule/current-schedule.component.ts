import {
  Component,
  ElementRef,
  NgZone,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { DecimalPipe, Location } from "@angular/common";
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

import { CheckScheduleComponent } from "../check-schedule/check-schedule.component";
// Light Box
import { Lightbox } from "ngx-lightbox";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { CompanyService } from "src/app/core/services/company.service";
import { AwaitingCureentScheduleComponent } from "../awaiting-cureent-schedule/awaiting-cureent-schedule.component";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import { ServiceOrderService } from "src/app/core/services/service-order.service";
@Component({
  selector: "app-current-schedule",
  templateUrl: "./current-schedule.component.html",
  styleUrls: ["./current-schedule.component.scss"],
})
export class CurrentScheduleComponent {
  defaultNavActiveId: number = 1;
  openCardWithIndex = -1;
  label: any = "Preventive Management";
  linkVideo: any = '';
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

  scheduleItemCheckStatusAwaitingAction45 = 0;
  scheduleItemCheckStatusVerified_Passed24 = 0;
  scheduleItemCheckStatusVerified_Failed49 = 0;
  scheduleItemCheckStatusVerified_NotAppicable1 = 0;
  scheduleAssetItemCheckStatusPending2 = 0;
  scheduleAssetItemCheckStatusIn_Progress30 = 0;
  scheduleAssetItemCheckStatusCompleted25 = 0;

  companyData: any = {};
  pic_url0: string;
  default_pic_url0: string;
  pic_url1: string;
  default_pic_url1: string;
  pic_url2: string;
  default_pic_url2: string;

  isFirstImageVisible: boolean = false;
  isSecondImageVisible: boolean = false;
  isThirdImageVisible: boolean = false;
  mX_WOTechAssignment: any = [];
  imgURl = environment.apiUrl;
  mx_WOStartEndTask: any;
  deleteButtonAddButtonShown: boolean = true;
  disableAllButtonForStatusUpdate: boolean = true;
  storeInfomationVideo: any;
  isTaskStart: boolean=false;
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
    private ngZone: NgZone,
    private maintenanceService: MaintenanceService,
    private location: Location,
    private serviceOrderService:ServiceOrderService
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();

    this.storeConfigScheduleId = this.preventiveService.scheduleId
      ? this.preventiveService.scheduleId
      : 0;

    this.paylod.scheduleId = this.storeConfigScheduleId;
    if (this.storeConfigScheduleId == 0 || this.storeConfigScheduleId == null) {
      this.location.back();
      // this.router.navigate([
      //   "maintenance-management/preventive/schedule/list-schedule",
      // ]);
    } else {
      this.getV2_MX_PM_ScheduleAndAsset();
    
    }
  }

  afterSubmitServiceOrder(event){
    this.getV2_MX_PM_ScheduleAndAsset();  
  }
  
  ngOnInit(): void {
    this.pic_url0 = this.default_pic_url0 =
      "../../../../../assets/images/placeholderimage.png";
    this.pic_url1 = this.default_pic_url1 =
      "../../../../../assets/images/placeholderimage.png";
    this.pic_url2 = this.default_pic_url2 =
      "../../../../../assets/images/placeholderimage.png";

    this.defaultNavActiveId = 1;

    if (
      JSON.parse(localStorage.getItem("currentUser")).role === "Client User"
    ) {
      this.disableAllButtonForStatusUpdate = false;
    }
    
  }

  GetPreventiveTaskAvailablity() {
    let payload = {
      WOId: this.storeConfigScheduleId
    }
  
    this.serviceOrderService.GetPreventiveTaskAvailablity(payload).subscribe((res: any) => {
      console.log(res, "gg")
      this.isTaskStart = res.obj.isTaskStart
      

    })

  }

  downloadPdf(scheduleId, RenderFormat, formt) {
    this.preventiveService.getTestReport(scheduleId, RenderFormat).subscribe(
      (blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;

        // Set the file name based on the RenderFormat (you can customize this)
        a.download = `test_report.${formt.toLowerCase()}`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(blobUrl);
      },
      (error) => {
        console.error(`Error downloading ${formt}:`, error);
      }
    );
  }
  refreshThePage() {
    this.defaultNavActiveId = 1;
    this.getV2_MX_PM_ScheduleAndAsset();
  }


  getV2_MX_PM_ScheduleAndAsset() {
    this.assetTicketItem = [];
    this.assetTicketItem_new = [];
    this.collectionSize = 0;
    this.AssetData = [];
    this.masterScheduleList = {};
    this.preventiveService
      .getV2_MX_PM_ScheduleAndAsset(this.paylod)
      .subscribe((res: any) => {
        Object.keys(res.list).forEach((key) => {
          if (res.list[key] === null) {
            res.list[key] = [];
          }
        });
        this.GetPreventiveTaskAvailablity();
        this.getV2_MX_PM_ScheduleAndAssetCheckListByScheudleId(
          this.storeConfigScheduleId
        );
        this.masterScheduleList = res.list.schedule;
        this.assetTicketItem = res.list.assetList;
        this.assetTicketItem_new = res.list.assetList;
        this.mX_WOTechAssignment = res.list.mX_WOTechAssignment;
        this.mx_WOStartEndTask = res.list.mx_WOStartEndTask;
        if (this.assetTicketItem_new.length) {
          this.checkTheAssetStatusValue();
        }
        let payload: any = {};
        if (this.masterScheduleList?.companyId) {
          payload.companyId = Number(this.masterScheduleList?.companyId);
          this.getViewData(payload);
        }
        if (
          this.masterScheduleList.scheduleStatusId == 32 ||
          this.masterScheduleList.scheduleStatusId == 61 ||
          this.masterScheduleList.scheduleStatusId == 62
        ) {
          this.deleteButtonAddButtonShown = false;
        } else {
          this.deleteButtonAddButtonShown = true;
        }
        console.log(this.activeIndex)
        this.scrollToIndex(this.activeIndex)
      });
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
        (err) => { }
      );
  }
  scheduleAndAssetCheckList: any = {};

  getV2_MX_PM_ScheduleAndAssetCheckListByScheudleId(ScheduleId) {
    this.pm_ScheduleAndAssetCheckList = [];
    this.scheduleAndAssetCheckList = [];
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
        this.checkTheCheckListItemValue();

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
        if(this.activeIndex){
          this.scrollToIndex(this.activeIndex)
        }
      });
  }

  checkTheCheckListItemValue() {
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
        } else if (currentItem.scheduleItemCheckStatusId === 24) {
          this.scheduleItemCheckStatusVerified_Passed24++;
        }else if (currentItem.scheduleItemCheckStatusId === 1) {
          this.scheduleItemCheckStatusVerified_NotAppicable1++;
        }
      }
    }
  }
  checkTheAssetStatusValue() {
    if (this.assetTicketItem_new.length != 0) {
      this.scheduleAssetItemCheckStatusPending2 = 0;
      this.scheduleAssetItemCheckStatusIn_Progress30 = 0;
      this.scheduleAssetItemCheckStatusCompleted25 = 0;

      for (var i = 0; i < this.assetTicketItem_new.length; i++) {
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
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  AssetData: any[];
  totalRecords: number = 0;
  imgUrl = environment.apiUrl;

  // getAssetData() {
  //   this.assetTicketItem = this.AssetData.slice(
  //     (this.page - 1) * this.pageSize,
  //     (this.page - 1) * this.pageSize + this.pageSize
  //   );
  //   this.to =
  //     this.page * this.pageSize > this.AssetData.length
  //       ? this.AssetData.length
  //       : this.page * this.pageSize;
  //   let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
  //   this.from = fromvalue < 1 ? 1 : fromvalue;
  //   this.from = this.AssetData.length == 0 ? 0 : this.from;
  //   this.totalRecords = this.AssetData.length;
  //   this.assetTicketItem.forEach((ele) => {
  //     ele.selected = false;
  //   });
  // }

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
    // this.router.navigate([
    //   "maintenance-management/preventive/schedule/list-schedule",
    // ]);
    this.location.back()
  }

  open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    // this.lightbox.open(_albums);

    this.lightbox.open(_albums, 0, {
      wrapAround: true,
      showImageNumberLabel: true,
      showRotate: true,
    });
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
          setTimeout(() => {
            this.printReport();
          }, 1300);
        } else if (result === "close") {
          this.imageShown = true;
          setTimeout(() => {
            this.printReport();
          }, 1300);
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
          //console.log("Print operation completed");
        });
      }, 10);
    });
  }

  sideColumValue: boolean = false;

  openSideColum() {
    this.sideColumValue = false;
  }

  closeSideColum() {
    this.sideColumValue = true;
  }
  seheduleData: any = {};



  scrollToIndex(index: number) 
  {
    setTimeout(() => {
      const element = document.getElementById(index.toString());
      console.log(element,"elment")
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // This ensures the element is centered vertically
          inline: 'center' // This ensures the element is centered horizontally, if needed
        });
      }
    }, 100); // 100ms delay to ensure DOM is updated
  }

  openEditSchedule(data: any, content: any,currentIndex) {
    this.activeIndex=currentIndex
    this.seheduleData = data;

    if (this.seheduleData.pic_url) {
      this.pic_url0 = this.imageUrl + this.seheduleData.pic_url;
      this.isFirstImageVisible = true;
    } else {
      this.isFirstImageVisible = false;
      this.pic_url0 = "../../../../../assets/images/placeholderimage.png";
    }
    if (this.seheduleData.pic_url1) {
      this.pic_url1 = this.imageUrl + this.seheduleData.pic_url1;
      this.isSecondImageVisible = true;
    } else {
      this.isSecondImageVisible = false;
      this.pic_url1 = "../../../../../assets/images/placeholderimage.png";
    }
    if (this.seheduleData.pic_url2) {
      this.isThirdImageVisible = true;
      this.pic_url2 = this.imageUrl + this.seheduleData.pic_url2;
    } else {
      this.isThirdImageVisible = false;
      this.pic_url2 = "../../../../../assets/images/placeholderimage.png";
    }
    this.offcanvasService
      .open(content, {
        ariaLabelledBy: "offcanvas-basic-title",
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvas ",
      })
      .result.then(
        (result) => { 
          
          this.scrollToIndex(currentIndex)
      
        },
        (reason) => { 
      
          this.scrollToIndex(currentIndex)
      
        }
      );
  }
  seheduleAssetChecklistData: any = {};
  activeIndex=-1;
  openEditScheduleAssetChecklist(data: any,currentIndex) {
    this.activeIndex=currentIndex
    const modalRef = this.offcanvasService.open(
      AwaitingCureentScheduleComponent,
      {
        scroll: true,
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvas ",
      }
    );
    modalRef.componentInstance.seheduleData = data;
    modalRef.result
      .then((result) => {
        //console.log(result, "result");
      
          this.scrollToIndex(currentIndex)
      
      })
      .catch((error) => {
        //console.log(error, "error");

        if (error == true) {

          this.getV2_MX_PM_ScheduleAndAsset();
        }
      
          this.scrollToIndex(currentIndex)
      
      
      });
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.pic_url0 = event.target.result;
        this.uploadImage({
          ScheduleItemChecklistId: this.seheduleData.scheduleItemChecklistId,
          Pic_urlBase64String:
            this.pic_url0 != "../../../../../assets/images/placeholderimage.png"
              ? this.pic_url0.replace(/^data:image\/[a-z]+;base64,/, "")
              : null,
        });
      };

      reader.onerror = () => {
        this.pic_url0 = this.default_pic_url0;
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.pic_url0 = this.default_pic_url0;
      }
    } else {
      this.pic_url0 = this.default_pic_url0;
    }
  }

  uploadImage(payload: any, type = "update") {
    this.preventiveService.updateAssetIChecklistImage(payload).subscribe(
      (res) => {
        this.success(res);
        if (type == "update") {
          this.isFirstImageVisible = true;
        } else {
          this.isFirstImageVisible = false;
        }

        this.getV2_MX_PM_ScheduleAndAsset();
      },
      (err) => {
        //console.log("err", err);
      }
    );
  }

  onSelectFile2(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.pic_url2 = event.target.result;
        this.uploadImage2({
          ScheduleItemChecklistId: this.seheduleData.scheduleItemChecklistId,
          Pic_urlBase64String2:
            this.pic_url2 != "../../../../../assets/images/placeholderimage.png"
              ? this.pic_url2.replace(/^data:image\/[a-z]+;base64,/, "")
              : null,
        });
      };

      reader.onerror = () => {
        this.pic_url2 = this.default_pic_url2;
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.pic_url2 = this.default_pic_url2;
      }
    } else {
      this.pic_url2 = this.default_pic_url2;
    }
  }

  uploadImage2(payload, type = "update") {
    this.preventiveService.updateAssetIChecklistImage2(payload).subscribe(
      (res) => {
        if (type == "update") {
          this.isThirdImageVisible = true;
        } else {
          this.isThirdImageVisible = false;
        }
        this.success(res);
        this.getV2_MX_PM_ScheduleAndAsset();
      },
      (err) => {
        //console.log("err", err);
      }
    );
  }

  onSelectFile1(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.pic_url1 = event.target.result;
        this.uploadImage1({
          ScheduleItemChecklistId: this.seheduleData.scheduleItemChecklistId,
          Pic_urlBase64String1:
            this.pic_url1 != "../../../../../assets/images/placeholderimage.png"
              ? this.pic_url1.replace(/^data:image\/[a-z]+;base64,/, "")
              : null,
        });
      };

      reader.onerror = () => {
        this.pic_url1 = this.default_pic_url1;
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.pic_url1 = this.default_pic_url1;
      }
    } else {
      this.pic_url1 = this.default_pic_url1;
    }
  }

  uploadImage1(payload: any, type = "update") {
    this.preventiveService.updateAssetIChecklistImage1(payload).subscribe(
      (res) => {
        if (type == "update") {
          this.isSecondImageVisible = true;
        } else {
          this.isSecondImageVisible = false;
        }
        this.success(res);
        this.getV2_MX_PM_ScheduleAndAsset();
      },
      (err) => {
        //console.log("err", err);
      }
    );
  }

  crossFirstImage(url) {
    if (url) {
      const modalRef = this.modalService.open(SuccessModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = "Are you sure you want to delete this image?";
      modalRef.componentInstance.subTitle = "You won't be able to revert this?";
  
        modalRef.result.then((result) => {
          if (result) {
            if (result == "success") {
            this.uploadImage(
              {
                ScheduleItemChecklistId:
                  this.seheduleData.scheduleItemChecklistId,
                Pic_urlBase64String: null,
              },
              "delete"
            );
            this.pic_url0 = "../../../../../assets/images/placeholderimage.png";
            this.isFirstImageVisible = false;
            this.resetFileInput("pic_url0");}
          }
        });
    
    }


  }

  crossSecondImage(url) {
    if (url) {
      const modalRef = this.modalService.open(SuccessModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = "Are you sure you want to delete this image?";
      modalRef.componentInstance.subTitle = "You won't be able to revert this?";
  
        modalRef.result.then((result) => {
          if (result) {
            if (result == "success") {
            this.uploadImage1(
              {
                ScheduleItemChecklistId:
                  this.seheduleData.scheduleItemChecklistId,
                Pic_urlBase64String1: null,
              },
              "delete"
            );
            this.pic_url1 = "../../../../../assets/images/placeholderimage.png";
            this.isSecondImageVisible = false;
            this.resetFileInput("pic_url1");}}
        });
    
    }

    
  }

  crossThirdImage(url) {
    if (url) {
      const modalRef = this.modalService.open(SuccessModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = "Are you sure you want to delete this image?";
      modalRef.componentInstance.subTitle = "You won't be able to revert this?";
  
        modalRef.result.then((result) => {

          if (result) {
            if (result == "success") {
            this.uploadImage2(
              {
                ScheduleItemChecklistId:
                  this.seheduleData.scheduleItemChecklistId,
                Pic_urlBase64String2: null,
              },
              "delete"
            );
            this.pic_url2 = "../../../../../assets/images/placeholderimage.png";
            this.isThirdImageVisible = false;
            this.resetFileInput("pic_url2");}}
        });
    
    }

  }

  resetFileInput(id) {
    const fileInput: any = document.getElementById(id);
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }

  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  technicianList: any = [];
  selectedTech: any = [];
  loadTechnician(): void {
    this.maintenanceService
      .getTechnician(this.masterScheduleList.projectId)
      .subscribe(
        (response: any) => {
          if (response) {
            this.technicianList = response?.data;
            this.technicianList.forEach((element) => {
              element.checked = false;
              element.disabled = false;
            });
            if (this.mX_WOTechAssignment.length > 0) {
              this.technicianList.forEach((ele1) => {
                this.mX_WOTechAssignment.forEach((ele) => {
                  if (ele.techId === ele1.userId) {
                    ele1.checked = true;
                    ele1.disabled=true;
                  }
                });
              });
            }
            this.filteredTechnicianList = [...this.technicianList];
          }
        },
        (error) => {
          //console.log("err", error);
        }
      );
  }

  openModalTechnician(content: any) {
    // this.checktheUserAlreadySelected(this.mX_WOTechAssignment);
    this.modalService.open(content, { size: "lg", centered: true });
    this.loadTechnician();
  }
  getTechnicianIndex(userId) {
    return this.technicianList.findIndex((i) => i.userId === userId);
  }

  getSelectedTechnicianIndex(userId) {
    return this.selectedTech.findIndex((i) => i.userId === userId);
  }

  selectTechnician(technicianList, i, tech) {
    if(this.filteredTechnicianList[i].disabled){
      return
    }
    const index = this.getTechnicianIndex(tech.userId);
    if (this.technicianList[index].checked) {
      this.technicianList[index].checked = false;
    } else {
      this.technicianList[index].checked = true;
    }
    this.getTodoListChecked(technicianList[i].checked, tech);
  }
  getTodoListChecked(isSelected: any, tech: any) {
    if (isSelected == true) {
      this.selectedTech.push(tech);
    } else {
      this.selectedTech.forEach((value, index) => {
        if (value.userId == tech.userId) {
          this.selectedTech.splice(index, 1);
        }
      });
    }
  }

  unCheckItem(tech) {
    const index = this.getTechnicianIndex(tech.userId);
    this.technicianList[index].checked = false;
    const selectedTechnicianIndex = this.getSelectedTechnicianIndex(
      tech.userId
    );
    this.selectedTech.splice(selectedTechnicianIndex, 1);
  }

  filteredTechnicianList: any[] = [];
  technicianSearchText: string = "";
  filterTechnician(event) {
    //console.log(event, "event");
    this.filteredTechnicianList = this.technicianList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
  }
  clearTeach(event) {
    this.technicianSearchText = "";
    this.filteredTechnicianList = this.technicianList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
    //console.log("this.filteredTechnicianList", this.filteredTechnicianList);
  }
  openModalDeleteConf(techobject) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to delete a Member ?";
    modalRef.componentInstance.subTitle =
      "Deleting your Member will remove for this Schedule list";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.DeleteTechnitionforScheudle(techobject);
        }
      }
    });
  }

  DeleteTechnitionforScheudle(element) {
    let sendingPayloadArrayh = {
      TicketTechId: element.ticketTechId,
      techId: element.techId,
    };
    this.preventiveService
      .DeleteTechnitionforScheudle(sendingPayloadArrayh)
      .subscribe(
        (res: any) => {
          this.getV2_MX_PM_ScheduleAndAsset();
        },
        (err) => {
          if (err) {
            this.openModaWaringConf(err);
          }
        }
      );
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
      if (result) {
        if (result == "confirm") {
          // location.reload();
        }
      }
    });
  }

  sweetAlertUpdateTechinionDetails() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Add additional member for this  Schedule list?";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submitTechinionDetails();
        } else {
         // this.onBack();
        }
      }
    });
  }
  

  submitAddMemberModal() {
    Swal.fire({
      title:
        "Do you want to add an additional member for this  Schedule list?",
      text: "You won't be able to revert this!",
      icon: "info",
      showCancelButton: true,
      //confirmButtonColor: '#727CF5',
      cancelButtonColor: "#FF3366",
      confirmButtonText: "<span class='swal2-confirm '> Yes, Update it!</span>",
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitTechinionDetails();
      }
    });
  }

  resetValue(){

    this.selectedTech = [];
  }

  submitTechinionDetails() {
    let sendingPayloadArray = [];
    this.selectedTech.forEach((element) => {
      sendingPayloadArray.push({
        techId: element.userId,
        techName: element.fullName,
        ticketId: this.masterScheduleList.scheduleId,
      });
    });
    this.preventiveService
      .InsertTechnitionforSchedule(sendingPayloadArray)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        this.selectedTech = [];
        this.getV2_MX_PM_ScheduleAndAsset();
      });
  }




  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;


  openModaVideeo(link, content) {
    this.storeInfomationVideo = link
    this.linkVideo = environment.apiUrl + link.videoFileURL;
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

  returnCurrentStatusClassesStatus(value: any){
    return this.commonFunctionService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any){
    return this.commonFunctionService.getStatusColorCircle(value);
  }

  sweetAlertDeleteMessage() {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You can not delete this member because its under "+this.masterScheduleList.scheduleStatusName +" process";
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {

        }
      }
    });
  }

}
