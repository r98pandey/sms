
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from 'src/app/core/services/department.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import Swal from 'sweetalert2';
import { Lightbox } from 'ngx-lightbox';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { environment } from 'src/environments/environment';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { forEach } from 'lodash';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-project-file-upload-without-type',
  templateUrl: './project-file-upload-without-type.component.html',
  styleUrl: './project-file-upload-without-type.component.scss'
})
export class ProjectFileUploadWithoutTypeComponent implements OnInit, OnChanges {

  @Input() listOfDocumentAlreadyUpload: any;
  maxCharMessage: number = 300;
  taskAndSubTaskFileValues: Array<any> = [];
  showExistFileLabel: boolean = false;
  constructor(private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
    public modal: NgbActiveModal) { }

  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit(): void { }

  onFileSelected(event: any) {
    this.showExistFileLabel = false;

    event.addedFiles.forEach((file: File) => {
      if (this.listOfDocumentAlreadyUpload.some(doc => doc.fileName === file.name)) {
        this.showExistFileLabel = true;
        this.warning();
      } else {
        this.taskAndSubTaskFileValues.push({
          file: file,
          fileType: this.getFileType(file),
          remark: ''
        });
      }
    });
  }

  removeFile(index: number) {
    this.taskAndSubTaskFileValues.splice(index, 1);
  }

  getFileType(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase();
  // your existing logic for determining file type
  }

  getFileIcon(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension) {
      return 'Unknown';
    }
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov'];
    const zipExtensions = ['zip'];
    const rarExtensions = ['rar'];

    if (imageExtensions.includes(extension)) {
      return 'ri-image-line b2';
    } else if (documentExtensions.includes(extension)) {
      return "ri-file-line";
    } else if (videoExtensions.includes(extension)) {
      return 'ri-video-line';
    } else if (zipExtensions.includes(extension)) {
      return 'ri-folder-zip-line';
    } else if (rarExtensions.includes(extension)) {
      return 'ri-survey-fill';
    } else {
      return 'ri-file-list-line';
    }
  }

  allRemarksEntered(): boolean {
    return this.taskAndSubTaskFileValues.every(fileData => fileData.remark.length > 0);
  }

  openModalUpload() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you sure upload these files?";
    modalRef.componentInstance.subTitle1 = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = "Upload It";

    modalRef.result.then((result) => {
      if (result === "success") {
        this.submitProcessFromDetails();
      }
    });
  }

  submitProcessFromDetails() {
    const filesToUpload = this.taskAndSubTaskFileValues.map(fileData => ({
      type: 'upload',
      file: fileData.file,
      fileType: fileData.fileType,
      remark: fileData.remark,
      fileName: fileData.file.name
    }));

    this.modal.close(filesToUpload);
  }

  warning() {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: 'You cannot upload the same file.',
      showConfirmButton: false,
      timer: 3000,
    });
  }
}
