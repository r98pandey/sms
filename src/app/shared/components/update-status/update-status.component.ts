import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from '../success-modal/success-modal.component';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrl: './update-status.component.scss'
})
export class UpdateStatusComponent implements OnInit {
  maxCharsDecision: number = 100
  @Input() assetListStatus: any[]
  @Input() title:any
  statusName: any = null;
  constructor(public modal: NgbActiveModal, private formBuilder: FormBuilder,private modalService: NgbModal,) { }
  ngOnInit(): void {
    this.buildForm();
  }
  formGroup: FormGroup;

  close(value) {
    event.preventDefault();
    let sendobject = {
      value: value
    }
    this.modal.close(sendobject);
    this.formGroup.reset();
  }
  onChangeStatus(event) {
    this.statusName = event.assetStatus
  }
  submit(value) {
    event.preventDefault();
    let sendobject = {
      value: value,
      statusId: this.status.value,
      remark: this.remark.value,
      statusName: this.statusName
    }
    this.modal.close(sendobject);
    this.formGroup.reset()
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      status: [null, [Validators.required]],
      remark: ["", [Validators.required]],

    });
  }

  get status() {
    return this.formGroup.get("status");
  }
  get remark() {
    return this.formGroup.get("remark");
  }

  openModalUpdateStatus() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure want to update Status?";
    modalRef.componentInstance.subTitle1 =
      "You won't be able to revert this!"
    modalRef.componentInstance.buttonName = "Update It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submit(result)
        }
      }
    });
  }
}
