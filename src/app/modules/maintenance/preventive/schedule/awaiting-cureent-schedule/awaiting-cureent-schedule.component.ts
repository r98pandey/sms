import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { PreventiveService } from "src/app/core/services/preventive.service";
import Swal from "sweetalert2";
import { CommonFunctionService } from "../../../../../shared/Service-common/common-function.service";

@Component({
  selector: "app-awaiting-cureent-schedule",
  templateUrl: "./awaiting-cureent-schedule.component.html",
  styleUrls: ["./awaiting-cureent-schedule.component.scss"],
})
export class AwaitingCureentScheduleComponent implements OnInit, OnChanges {
  pic_url0: string;
  default_pic_url0: string;
  pic_url1: string;
  default_pic_url1: string;
  pic_url2: string;
  default_pic_url2: string;
  @Input() seheduleData: any;
  isFirstImageVisible: boolean = false;
  isSecondImageVisible: boolean = false;
  isThirdImageVisible: boolean = false;
  maxCharsDecision: number = 300;

  updateScheduleFrom: FormGroup;
  constructor(
    private preventiveService: PreventiveService,
    public modal: NgbOffcanvas,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.getFromBinding();
    
  }
  ngOnInit(): void {
    this.pic_url0 = "../../../../../assets/images/placeholderimage.png";

    this.pic_url1 = "../../../../../assets/images/placeholderimage.png";

    this.pic_url2 = "../../../../../assets/images/placeholderimage.png";

    this.getFromBinding();
    console.log("seheduleData", this.seheduleData);
  }

  getFromBinding() {
    this.updateScheduleFrom = this.formBuilder.group({
      statusType: [24, [Validators.required]],
      remark: ["", [Validators.required]],
    });
  }
  get statusType() {
    return this.updateScheduleFrom.get("statusType");
  }
  get remark() {
    return this.updateScheduleFrom.get("remark");
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.pic_url0 = event.target.result;
        this.isFirstImageVisible = true;
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

  onSelectFile2(event) {
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        this.pic_url2 = event.target.result;
        this.isThirdImageVisible = true;
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

  onSelectFile1(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        this.pic_url1 = event.target.result;
        this.isSecondImageVisible = true;
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

  crossFirstImage(url) {
    this.pic_url0 = "../../../../../assets/images/placeholderimage.png";
    this.isFirstImageVisible = false;
    this.resetFileInput("asset_id0");
  }

  crossSecondImage(url) {
    this.pic_url1 = "../../../../../assets/images/placeholderimage.png";
    this.isSecondImageVisible = false;
    this.resetFileInput("asset_id1");
  }

  crossThirdImage(url) {
    this.pic_url2 = "../../../../../assets/images/placeholderimage.png";
    this.isThirdImageVisible = false;
    this.resetFileInput("asset_id2");
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

  close(sendValue: boolean = false) {
    this.modal.dismiss(sendValue);
  }

  submit() {
    let payload: any = {
      Base64Pic_url:
        this.pic_url0 != "../../../../../assets/images/placeholderimage.png"
          ? this.pic_url0.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
      Base64Pic_url1:
        this.pic_url1 != "../../../../../assets/images/placeholderimage.png"
          ? this.pic_url1.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
      Base64Pic_url2:
        this.pic_url2 != "../../../../../assets/images/placeholderimage.png"
          ? this.pic_url2.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
      ScheduleId: this.seheduleData.scheduleId,
      ScheduleItemId: this.seheduleData.scheduleItemId,
      ScheduleItemChecklistId: this.seheduleData.scheduleItemChecklistId,
      Note: this.remark.value,
      ScheduleItemCheckStatusId: this.statusType.value == 24 ? 24 : this.statusType.value == 58 ? 58 : 1,
      ScheduleItemCheckStatusName:
        this.statusType.value == 24 ? "Verified-Passed" : this.statusType.value == 58 ? "Verified - Failed" : "Not Applicable",
    };
console.log("pay",payload)
    this.preventiveService
      .updateV2_MX_ScheduleAssetChecklist(
        this.commonFunctionService.clean(payload)
      )
      .subscribe((res) => {
        if (res) {
          this.close(true);
        }
      });
  }
}
