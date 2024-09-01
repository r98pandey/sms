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
import { Lightbox } from "ngx-lightbox";
import { AuditService } from "../../../../core/services/audit.service";
@Component({
  selector: "app-audit-signature",
  templateUrl: "./audit-signature.component.html",
  styleUrls: ["./audit-signature.component.scss"],
})
export class AuditSignatureComponent implements OnInit, OnChanges {
  @Input() auditDetails: any;
  signtaureData: any = null;
  public Editor = ClassicEditor;
  editorHeight = "300px";
  addTech: FormGroup;
  maxCharsDecision = 300;
  auditTypeAdminAndClient: any;
  constructor(
    public modal: NgbOffcanvas,
    public formBuilder: FormBuilder,
    private helpDeskService: HelpDeskService,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private authAssetService: AuthAssetService,
    private lightbox: Lightbox,
    private auditService: AuditService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.auditTypeAdminAndClient = this.helpDeskService.auditTypeAdminAndClient;
    this.getfromBinding();
  }
  ngOnInit(): void {
    this.auditTypeAdminAndClient = this.helpDeskService.auditTypeAdminAndClient;
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
  x;

  getSignData(event) {
    if (event) {
      this.signtaureData = event && event.split(",")[1];
    } else {
      this.signtaureData = null;
    }
  }

  updateSignatureUserSignature() {
    let paylaod: any = {
      AcknowledgeRemark: this.editorText.value,
      AssetAuditId: this.auditDetails.assetAuditId,
      AcknowledSignImageURLBase64: this.signtaureData,
      AcknowledDesig: this.authAssetService.getaccessGroupName(),
    };
    this.auditService
      .UpdateV2_AuditAcknowledge(this.commonFunctionService.clean(paylaod))
      .subscribe((res) => {
        this.passBack(res);
      });
  }
  updateSignatureClientSignature() {
    let paylaod: any = {
      AssetAuditId: this.auditDetails.assetAuditId,
      VerifiedRemark: this.editorText.value,
      VerifiedSignImageURLBase64: this.signtaureData,
      VerifiedDesig: this.authAssetService.getaccessGroupName(),
    };
    this.auditService
      .UpdateV2_AuditApprove(this.commonFunctionService.clean(paylaod))
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
          if (this.helpDeskService.auditTypeAdminAndClient == "Admin") {
            this.updateSignatureUserSignature();
          } else if (this.helpDeskService.auditTypeAdminAndClient == "Client") {
            this.updateSignatureClientSignature();
          }
        },
        (reason) => {}
      );
  }
}
