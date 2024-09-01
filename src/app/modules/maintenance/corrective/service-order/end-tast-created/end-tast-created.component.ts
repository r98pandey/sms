import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { UtilService } from 'src/app/core/services/util.service';
import { environment } from 'src/environments/environment';
import { AuthAssetService } from '../../../../../core/services/auth-asset.service';

@Component({
  selector: "app-end-tast-created",
  templateUrl: "./end-tast-created.component.html",
  styleUrls: ["./end-tast-created.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EndTastCreatedComponent implements OnInit {
  ticketingAssetList: any;
  @Input() ticketId: any;
  isProject: boolean = false;
  baseUrl: any;
  maxCharsDecision = 300;
  assetList: any;
  imageOneUrl: any;
  imageTwoUrl: any;
  imageThreeUrl: any;
  isFirstImageVisible: boolean = false;
  isSecondImageVisible: boolean = false;
  isThirdImageVisible: boolean = false;
  formGroup: FormGroup;
  payload: any;
  listData: any;

  constructor(
    private modal: NgbActiveModal,
    private auth: AuthAssetService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private maintenanceService: MaintenanceService,
    private formBuilder: FormBuilder
  ) {
    this.baseUrl = environment.apiUrl;
    this.isProject = this.auth.getisProject();
  }

  ngOnInit(): void {
    this.imageOneUrl = "../../../../../../assets/images/blankasset.png";
    this.imageTwoUrl = "../../../../../../assets/images/blankasset.png";
    this.imageThreeUrl = "../../../../../../assets/images/blankasset.png";
    this.buildForm();
    this.GetTicketingAssetList(this.ticketId);
  }

  GetTicketingAssetList(ticketId) {
    this.maintenanceService.GetTicketingAssetList(ticketId).subscribe(
      (res: any) => {
        this.ticketingAssetList = res.list;
      },
      (err) => {
        //console.log(err, "err");
      }
    );
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

  passBack(value) {
    this.modal.close(value);
  }

  returnClassname(task) {
    return (
      "status-workTaskStatuId-" +
      task.woTaskStatusId +
      "-" +
      task.woTaskStatusName
    );
  }

  returnClassStatus(id) {
    return this.utilService.returnStatusClasses(id);
  }

  updateAsset(upadatePopup, list): void {
    this.getAssetStatus();
    this.listData = list;
    this.modalService
      .open(upadatePopup, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
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

  getAssetStatus() {
    this.maintenanceService.getAssetStatusList().subscribe(
      (res) => {
        this.assetList = res;
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
      this.imageOneUrl = "../../../../../../assets/images/blankasset.png";
      this.isFirstImageVisible = false;
    }
  }

  crossSecondImage(url): void {
    if (url) {
      this.imageTwoUrl = "../../../../../../assets/images/blankasset.png";
      this.isSecondImageVisible = false;
    }
  }

  crossThirdImage(url): void {
    if (url) {
      this.imageTwoUrl = "../../../../../../assets/images/blankasset.png";
      this.isThirdImageVisible = false;
    }
  }

  Submit(): void {
    if (!this.formGroup.valid) {
      return;
    } else {
      let formData = this.formGroup.value;
      const assetStatus = this.assetList.find((d) => {
        return d.assetStatusId === formData.status;
      });
      this.payload = {
        TicketItemId: this.listData?.ticketItemId,
        TicketItemStatusId: assetStatus?.assetStatusId,
        TicketItemStatusName: assetStatus?.assetStatus,
        TechnitionRemark: formData?.remark,
      };
      if (
        this.imageOneUrl != "../../../../../../assets/images/blankasset.png"
      ) {
        this.payload.TechIMGURL1Base64 = this.imageOneUrl
          ? this.imageOneUrl.replace(/^data:image\/[a-z]+;base64,/, "")
          : null;
      }
      if (
        this.imageTwoUrl != "../../../../../../assets/images/blankasset.png"
      ) {
        this.payload.TechIMGURL2Base64 = this.imageTwoUrl
          ? this.imageTwoUrl.replace(/^data:image\/[a-z]+;base64,/, "")
          : null;
      }
      if (
        this.imageThreeUrl != "../../../../../../assets/images/blankasset.png"
      ) {
        this.payload.TechIMGURL3Base64 = this.imageThreeUrl
          ? this.imageThreeUrl.replace(/^data:image\/[a-z]+;base64,/, "")
          : null;
      }

      this.updateAssetDetail();
    }
  }

  updateAssetDetail(): void {
    this.maintenanceService.updateAsset(this.payload).subscribe(
      (res) => {
        this.GetTicketingAssetList(this.ticketId);
        this.modalService.dismissAll();
        this.formGroup.reset();
      },
      (err) => {
        //console.log("err", err);
      }
    );
  }

  viewImageValue: any;
  ImageUrl = environment.apiUrl;
  confirmForViewImage(content, value: any) {
    this.viewImageValue = this.ImageUrl + value;
    //console.log(" this.viewImageValue", this.viewImageValue);
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
