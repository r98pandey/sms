
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { HelpDeskService } from '../../../../core/services/help-desk.service';
import { CommonFunctionService } from '../../../../shared/Service-common/common-function.service';
@Component({
  selector: 'app-signature-client',
  templateUrl: './signature-client.component.html',
  styleUrls: ['./signature-client.component.scss']
})
export class SignatureClientComponent implements OnInit, OnChanges {
  @Input() incidentList: any
  @Input() ticketData: any;
  signtaureData: any = null;
  public Editor = ClassicEditor;
  editorHeight = '300px';
  addTech: FormGroup;

  constructor(
    public modal: NgbOffcanvas,
    public formBuilder: FormBuilder,
    private helpDeskService: HelpDeskService,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal
  ) {

  }
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

    this.addTech = this.formBuilder.group({
      editorText: [null, Validators.required],
      isResolved: [false, [Validators.required]],


    });


  }

  get editorText() {
    return this.addTech.get("editorText");
  }
  get isResolved() {
    return this.addTech.get('isResolved');
  }

  getSignData(event) {
    if (event) {
      this.signtaureData = event && event.split(",")[1];
    } else {
      this.signtaureData = null;
    }


  }


  updateSignatureClient() {
    let paylaod: any = {
      IncidentId: this.incidentList.incidentId,
      IsSolved: this.isResolved.value,
      isSolvedRemark: this.editorText.value,
      IncindetClientSignDateTimeBase64: this.signtaureData,
    };
    this.helpDeskService.updateSignatureClient(this.commonFunctionService.clean(paylaod)).subscribe((res) => {
      this.passBack(res);

    })
  }


  openUpdateModal(contect) {

    this.modalService.open(contect, {
      backdrop: 'static',
      keyboard: false, centered: true
    }).result.then((result) => {
      this.updateSignatureClient()
    }, (reason) => {
    });


  }
}
