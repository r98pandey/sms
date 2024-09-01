import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { HelpDeskService } from "../../../../core/services/help-desk.service";
import { CommonFunctionService } from "../../../../shared/Service-common/common-function.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-signature-tech",
  templateUrl: "./signature-tech.component.html",
  styleUrls: ["./signature-tech.component.scss"],
})
export class SignatureTechComponent implements OnInit, OnChanges {
  @Input() incidentList: any;
  @Input() ticketData: any;
  signtaureData: any = null;
  public Editor = ClassicEditor;
  editorHeight = "300px";
  isFirstImageVisible: boolean = false;
  isSecondImageVisible: boolean = false;
  isThirdImageVisible: boolean = false;
  isFourthImageVisible: boolean = false;
  tech_img0: any;
  default_tech_img0: any;
  tech_img1: any;
  default_tech_img1: any;
  tech_img2: any;
  default_tech_img2: any;
  tech_img3: any;
  default_tech_img3: any;
  addTech: FormGroup;

  constructor(
    public modal: NgbOffcanvas,
    public formBuilder: FormBuilder,
    private helpDeskService: HelpDeskService,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.getfromBinding();
  }
  ngOnInit(): void {
    this.getfromBinding();
  }
  passBack(value) {
    this.modal.dismiss(value);
  }
  getfromBinding() {
    this.tech_img0 = this.default_tech_img0 =
      "../../../../../assets/images/placeholderimage.png";
    this.tech_img1 = this.default_tech_img1 =
      "../../../../../assets/images/placeholderimage.png";
    this.tech_img2 = this.default_tech_img2 =
      "../../../../../assets/images/placeholderimage.png";
    this.tech_img3 = this.default_tech_img3 =
      "../../../../../assets/images/placeholderimage.png";

    this.addTech = this.formBuilder.group({
      editorText: [null, Validators.required],
      techImageURL: [],
      techImageURL1: [],
      techImageURL2: [],
      techImageURL3: [],
    });
  }

  get editorText() {
    return this.addTech.get("editorText");
  }
  get techImageURL() {
    return this.addTech.get("techImageURL");
  }
  get techImageURL1() {
    return this.addTech.get("techImageURL1");
  }
  get techImageURL2() {
    return this.addTech.get("techImageURL2");
  }
  get techImageURL3() {
    return this.addTech.get("techImageURL3");
  }

  crossFirstImage(url) {
    if (url) {
      this.tech_img0 = "../../../../../assets/images/placeholderimage.png";
      this.isFirstImageVisible = false;
      this.resetFileInput("tech_id0");
    }
  }

  crossSecondImage(url) {
    if (url) {
      this.tech_img1 = "../../../../../assets/images/placeholderimage.png";
      this.isSecondImageVisible = false;
      this.resetFileInput("tech_id1");
    }
  }

  crossThirdImage(url) {
    if (url) {
      this.tech_img2 = "../../../../../assets/images/placeholderimage.png";
      this.isThirdImageVisible = false;
      this.resetFileInput("tech_id2");
    }
  }

  crossFourthImage(url) {
    if (url) {
      this.tech_img3 = "../../../../../assets/images/placeholderimage.png";
      this.isFourthImageVisible = false;
      this.resetFileInput("tech_id3");
    }
  }
  resetFileInput(id) {
    const fileInput: any = document.getElementById(id);
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        this.tech_img0 = event.target.result;
        this.isFirstImageVisible = true;
      };
      reader.onerror = () => {
        this.tech_img0 = this.default_tech_img0;
        this.techImageURL.setValue("");
      };
      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con) reader.readAsDataURL(event.target.files[0]);
      else {
        this.tech_img0 = this.default_tech_img0;
        this.techImageURL.setValue("");
      }
    } else {
      this.tech_img0 = this.default_tech_img0;
      this.techImageURL.setValue("");
    }
  }
  onSelectFile2(event) {
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        this.tech_img2 = event.target.result;
        this.isThirdImageVisible = true;
      };

      reader.onerror = () => {
        this.tech_img2 = this.default_tech_img2;
        this.techImageURL2.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con) reader.readAsDataURL(event.target.files[0]);
      else {
        this.tech_img2 = this.default_tech_img2;
        this.techImageURL2.setValue("");
      }
    } else {
      this.tech_img2 = this.default_tech_img2;
      this.techImageURL2.setValue("");
    }
  }
  onSelectFile1(event) {
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        this.tech_img1 = event.target.result;
        this.isSecondImageVisible = true;
      };

      reader.onerror = () => {
        this.tech_img1 = this.default_tech_img1;
        this.techImageURL1.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con) reader.readAsDataURL(event.target.files[0]);
      else {
        this.tech_img1 = this.default_tech_img1;
        this.techImageURL1.setValue("");
      }
    } else {
      this.tech_img1 = this.default_tech_img1;
      this.techImageURL1.setValue("");
    }
  }
  onSelectFile3(event) {
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        this.tech_img3 = event.target.result;
        this.isFourthImageVisible = true;
      };

      reader.onerror = () => {
        this.tech_img3 = this.default_tech_img3;
        this.techImageURL3.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con) reader.readAsDataURL(event.target.files[0]);
      else {
        this.tech_img3 = this.default_tech_img3;
        this.techImageURL3.setValue("");
      }
    } else {
      this.tech_img3 = this.default_tech_img3;
      this.techImageURL3.setValue("");
    }
  }
  getSignData(event) {
    if (event) {
      this.signtaureData = event && event.split(",")[1];
    } else {
      this.signtaureData = null;
    }
  }

  updateV2_SignatureTech() {
    let paylod = {
      IncidentId: this.incidentList.incidentId,
      IncidentRemark: this.editorText.value,
      TecgUpdatemage1URLBase64:
        this.tech_img0 != "../../../../../assets/images/placeholderimage.png"
          ? this.tech_img0.split(",")[1]
          : null,
      TecgUpdatemage2URLBase64:
        this.tech_img1 != "../../../../../assets/images/placeholderimage.png"
          ? this.tech_img1.split(",")[1]
          : null,
      TecgUpdatemage3URLBase64:
        this.tech_img2 != "../../../../../assets/images/placeholderimage.png"
          ? this.tech_img2.split(",")[1]
          : null,
      TecgUpdatemage4URLBase64:
        this.tech_img3 != "../../../../../assets/images/placeholderimage.png"
          ? this.tech_img3.split(",")[1]
          : null,
      IncindetTechSignDateTimeBase64: this.signtaureData,
    };
    //console.log(paylod, "event");
    this.helpDeskService
      .updateV2_SignatureTech(this.commonFunctionService.clean(paylod))
      .subscribe((res) => {
        this.passBack(res);
      });
  }
  // &&this.tech_img1 == "../../../../../assets/images/placeholderimage.png" &&
  // this.tech_img2 == "../../../../../assets/images/placeholderimage.png" &&
  // this.tech_img3 == "../../../../../assets/images/placeholderimage.png"
  openUpdateModal(contect) {
    // if (this.tech_img0 == "../../../../../assets/images/placeholderimage.png") {
    //   this.waring("Please select  First image required ");
    //   return;
    // }
    this.modalService
      .open(contect, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          this.updateV2_SignatureTech();
        },
        (reason) => {}
      );
  }

  waring(message) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
}
