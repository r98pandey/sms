import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { CommonFunctionService } from "../../../../shared/Service-common/common-function.service";
import { environment } from "src/environments/environment";
import { TicketService } from "../../../../core/services/ticket.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { Lightbox } from "ngx-lightbox";

@Component({
  selector: "app-view-asset-ticket",
  templateUrl: "./view-asset-ticket.component.html",
  styleUrls: ["./view-asset-ticket.component.scss"],
})
export class ViewAssetTicketComponent implements OnInit, OnChanges {
  @Input() assetList: any[] = [];
  @Input() ticketData: any[] = [];
  @Input() mX_WorkOder: any = {};
  @Output() updateStatusAssetList = new EventEmitter();
  maxCharsDecision: number = 300;
  filteredList: any = [];
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  imageUrl: any = environment.apiUrl;
  assetStatusList: any = [];

  baseUrl: any;
  imageOneUrl: any;
  imageTwoUrl: any;
  imageThreeUrl: any;
  isFirstImageVisible: boolean = false;
  isSecondImageVisible: boolean = false;
  isThirdImageVisible: boolean = false;
  formGroup: FormGroup;
  payload: any;
  listData: any;
  deleteId: any;
  constructor(
    public commonFunctionService: CommonFunctionService,
    private ticketService: TicketService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public authService: AuthAssetService,
    private lightbox: Lightbox
  ) {}
  ngOnInit(): void {
    // if (this.assetList.length != 0) {
    //   this.totalRecords = this.assetList.length;
    //   this.filteredList = this.assetList;
    //   this.filteredList.forEach((element) => {
    //     element.imageAll = [];
    //     element.imageAll.push(
    //       element.techIMGURL1
    //         ? this.imageUrl + element.techIMGURL1
    //         : "../../../../../assets/images/placeholderimage.png",
    //       element.techIMGURL2
    //         ? this.imageUrl + element.techIMGURL2
    //         : "../../../../../assets/images/placeholderimage.png",
    //       element.techIMGURL3
    //         ? this.imageUrl + element.techIMGURL3
    //         : "../../../../../assets/images/placeholderimage.png"
    //     );
    //   });
    //   this.collectionSize = this.filteredList.length;
    //   this.getLocalPagination();
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("ticketData", this.ticketData);
    if (this.assetList.length != 0) {
      this.totalRecords = this.assetList.length;
      this.filteredList = this.assetList;
      this.filteredList.forEach((element) => {
        element.imageAll = []; // Initialize as an array if not already
        element.imageAll.push(
          element.techIMGURL1 ? this.imageUrl + element.techIMGURL1 : null,
          element.techIMGURL2 ? this.imageUrl + element.techIMGURL2 : null,
          element.techIMGURL3 ? this.imageUrl + element.techIMGURL3 : null
        );
      });
      this.collectionSize = this.filteredList.length;
      this.getLocalPagination();
    }
    this.imageOneUrl = "../../../../../assets/images/placeholderimage.png";
    this.imageTwoUrl = "../../../../../assets/images/placeholderimage.png";
    this.imageThreeUrl = "../../../../../assets/images/placeholderimage.png";
    this.buildForm();
    this.getAssetStatus("TicketAssetStatus");
  }

  getBorderBagde(id) {
    return this.commonFunctionService.returnAssetStatusBorderAndBadgeClasses(
      id
    );
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

  updateAsset(upadatePopup, list): void {
    this.imageOneUrl = "../../../../../assets/images/placeholderimage.png";
    this.imageTwoUrl = "../../../../../assets/images/placeholderimage.png";
    this.imageThreeUrl = "../../../../../assets/images/placeholderimage.png";
    this.isFirstImageVisible = false;
    this.isSecondImageVisible = false;
    this.isThirdImageVisible = false;
    this.buildForm();

    this.listData = list;
    this.modalService
      .open(upadatePopup, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.formGroup.reset();
        },
        (reason) => {
          this.formGroup.reset();
        }
      );
  }
  getAssetStatus(pageName) {
    this.ticketService.getMaintenanceStatus(pageName).subscribe(
      (res) => {
        this.assetStatusList = res;
      },
      (err) => {
        //console.log("err", err);
      }
    );
  }

  onSelectFirstFile(event): void {
    let file = event["target"].files[0];
    if (event["target"].files && event["target"].files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event["target"].files[0]); // read file as data url
      reader.onload = (event) => {
        this.imageOneUrl = event["target"].result;
        this.isFirstImageVisible = true;
      };
    }
  }

  onSelectSecondFile(event): void {
    let fileTwo = event["target"].files[0];
    if (event["target"].files && event["target"].files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event["target"].files[0]); // read file as data url
      reader.onload = (event) => {
        this.imageTwoUrl = event["target"].result;
        this.isSecondImageVisible = true;
      };
    }
  }

  onSelectThirdFile(event): void {
    let fileTwo = event["target"].files[0];
    if (event["target"].files && event["target"].files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event["target"].files[0]); // read file as data url
      reader.onload = (event) => {
        this.imageThreeUrl = event["target"].result;
        this.isThirdImageVisible = true;
      };
    }
  }

  crossFirstImage(url): void {
    if (url) {
      this.imageOneUrl = "../../../../../assets/images/placeholderimage.png";
      this.isFirstImageVisible = false;
    }
  }

  crossSecondImage(url): void {
    if (url) {
      this.imageTwoUrl = "../../../../../assets/images/placeholderimage.png";
      this.isSecondImageVisible = false;
    }
  }

  crossThirdImage(url): void {
    if (url) {
      this.imageTwoUrl = "../../../../../assets/images/placeholderimage.png";
      this.isThirdImageVisible = false;
    }
  }

  Submit(): void {
    if (!this.formGroup.valid) {
      return;
    } else {
      let formData = this.formGroup.value;
      const assetStatus = this.assetStatusList.find((d) => {
        return d.assetStatusId === formData.status;
      });
      this.payload = {
        TicketItemId: this.listData?.ticketItemId,
        TicketItemStatusId: assetStatus?.assetStatusId,
        TicketItemStatusName: assetStatus?.assetStatus,
        TechnitionRemark: formData?.remark,
      };
      if (
        this.imageOneUrl != "../../../../../assets/images/placeholderimage.png"
      ) {
        this.payload.TechIMGURL1Base64 = this.imageOneUrl
          ? this.imageOneUrl.replace(/^data:image\/[a-z]+;base64,/, "")
          : null;
      }
      if (
        this.imageTwoUrl != "../../../../../assets/images/placeholderimage.png"
      ) {
        this.payload.TechIMGURL2Base64 = this.imageTwoUrl
          ? this.imageTwoUrl.replace(/^data:image\/[a-z]+;base64,/, "")
          : null;
      }
      if (
        this.imageThreeUrl !=
        "../../../../../assets/images/placeholderimage.png"
      ) {
        this.payload.TechIMGURL3Base64 = this.imageThreeUrl
          ? this.imageThreeUrl.replace(/^data:image\/[a-z]+;base64,/, "")
          : null;
      }

      this.updateAssetDetail();
    }
  }

  updateAssetDetail(): void {
    this.ticketService.updateAsset(this.payload).subscribe((res) => {
      this.modalService.dismissAll();
      this.formGroup.reset();
      this.success(res);
      this.updateStatusAssetList.emit(res);
    });
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      status: [null, [Validators.required]],
      remark: ["", [Validators.required]],
      picOne: [""],
      picTwo: [""],
      picThree: [""],
    });
  }

  get status() {
    return this.formGroup.get("status");
  }
  get remark() {
    return this.formGroup.get("remark");
  }
  get picOne() {
    return this.formGroup.get("picOne");
  }
  get picTwo() {
    return this.formGroup.get("picTwo");
  }
  get picThree() {
    return this.formGroup.get("picThree");
  }
  success(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  returnHeaderShownByTicket(value: any) {
    if (this.authService.getRole() == "Client User") {
      return false;
    }
    if (value.ticketStatusId == 31) {
      return false;
    } else if (value.ticketStatusId == 32) {
      return false;
    } else if (value.ticketStatusId == 19) {
      return false;
    } else if (value.ticketStatusId == 34) {
      return false;
    } else {
      return true;
    }
  }
  returnHeaderShownByTicketStatusId(value: any) {
    if (this.authService.getRole() !== "Client User") {
      if (
        this.ticketService.ticketPageAction == "Basic Service Page" ||
        this.ticketService.ticketPageAction == "Basic Ticket Page" ||
        this.ticketService.ticketPageAction == "Software Support Dashboard Page"
      ) {
        if (value == 45 || value == 38 || value == 39) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  deleteData(deleteId): void {
    let payload = { TicketItemId: deleteId };
    this.ticketService.deletedAssetTicketByTech(payload).subscribe((res) => {
      this.success(res);
      this.updateStatusAssetList.emit(res);
    });
  }

  goBack() {}

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
}
