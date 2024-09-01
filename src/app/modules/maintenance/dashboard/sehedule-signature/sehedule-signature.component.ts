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
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
@Component({
  selector: "app-sehedule-signature",
  templateUrl: "./sehedule-signature.component.html",
  styleUrls: ["./sehedule-signature.component.scss"],
})
export class SeheduleSignatureComponent implements OnInit, OnChanges {
  @Input() scheduleDetails: any;
  @Input() ticketData: any;
  signtaureData: any = null;
  public Editor = ClassicEditor;
  editorHeight = "300px";
  addTech: FormGroup;
  maxCharsDecision = 300;
  scheduleTypeAdminAndClient: any;
  constructor(
    public modal: NgbOffcanvas,
    public formBuilder: FormBuilder,
    private helpDeskService: HelpDeskService,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private authAssetService: AuthAssetService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.scheduleTypeAdminAndClient =
      this.helpDeskService.scheduleTypeAdminAndClient;
    this.getfromBinding();
  }
  ngOnInit(): void {
    this.scheduleTypeAdminAndClient =
      this.helpDeskService.scheduleTypeAdminAndClient;
    this.getfromBinding();
  }
  passBack(value) {
    this.modal.dismiss(value);
  }
  getfromBinding() {
    this.addTech = this.formBuilder.group({
      editorText: ["", Validators.required],
    });
  }

  get editorText() {
    return this.addTech.get("editorText");
  }

  getSignData(event) {
    if (event) {
      this.signtaureData = event && event.split(",")[1];
    } else {
      this.signtaureData = null;
    }
  }

  updateSignatureUserSignature() {
    let paylaod: any = {
      ScheduleId: this.scheduleDetails.scheduleId,
      ScheduleAcknoledgeRemark: this.editorText.value,
      ScheduleAcknoledgeSignImageURLBase64: this.signtaureData,
      ScheduleAcknoledgeDesig: this.authAssetService.getaccessGroupName(),
    };
    this.helpDeskService
      .updateV2_ScheudleSignatureUser(this.commonFunctionService.clean(paylaod))
      .subscribe((res) => {
        this.passBack(res);
      });
  }
  updateSignatureClientSignature() {
    let paylaod: any = {
      ScheduleId: this.scheduleDetails.scheduleId,
      ScheduleClosedRemark: this.editorText.value,
      ScheduleCloseSignImageURLBase64: this.signtaureData,
      ScheduleClosedDesig: this.authAssetService.getaccessGroupName(),
    };
    this.helpDeskService
      .updateV2_ScheudleSignatureClient(
        this.commonFunctionService.clean(paylaod)
      )
      .subscribe((res) => {
        this.passBack(res);
      });
  }

  openUpdateModal(contect) {
    this.modalService
      .open(contect, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          if (this.helpDeskService.scheduleTypeAdminAndClient == "Admin") {
            this.updateSignatureUserSignature();
          } else if (
            this.helpDeskService.scheduleTypeAdminAndClient == "Client"
          ) {
            this.updateSignatureClientSignature();
          }
        },
        (reason) => {}
      );
  }
}
