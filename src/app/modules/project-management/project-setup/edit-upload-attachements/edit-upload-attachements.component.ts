import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from '../../../../core/services/department.service';

@Component({
  selector: 'app-edit-upload-attachements',
  templateUrl: './edit-upload-attachements.component.html',
  styleUrl: './edit-upload-attachements.component.scss'
})
export class EditUploadAttachementsComponent implements OnInit, OnChanges {
  @Input() setData: any
  EditAttachementModalForm: FormGroup;
  public Editor = ClassicEditor;

  constructor(
    public formBuilder: FormBuilder,
    private modalService: NgbModal,
    private departmentService: DepartmentService, public modal: NgbActiveModal
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.frmdescription.setValue(this.setData.remark)
    this.frmtitle.setValue(this.setData.title)
  }

  ngOnInit(): void {
    this.getfromBinding();
    this.frmdescription.setValue(this.setData.remark)
    this.frmtitle.setValue(this.setData.title)
  }

  getfromBinding() {
    this.EditAttachementModalForm = this.formBuilder.group({
      frmdescription: [null, Validators.required],
      frmtitle: [null, Validators.required]
    });
  }

  get frmdescription() {
    return this.EditAttachementModalForm.get("frmdescription");
  }
  get frmtitle() {
    return this.EditAttachementModalForm.get("frmtitle");
  }

  submitprocessFromDetails() {
    let payload = {
      ProjectFollowUpDocId: this.setData.projectFollowUpDocId,
      Title: this.frmtitle.value,
      Remark: this.frmdescription.value
    }

    this.departmentService.UpdateV2_MX_ProjecFollowUpDocRemarkTitle(payload).subscribe((res) => {
      this.success(res)
      this.submit('submit')
    })
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
  close(value, event: any) {
    event.preventDefault();
    this.modal.close(value);
  }
  submit(value) {
    event.preventDefault();
    this.modal.close(value);
  }
}
