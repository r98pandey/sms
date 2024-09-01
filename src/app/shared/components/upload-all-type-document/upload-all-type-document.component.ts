
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DepartmentService } from 'src/app/core/services/department.service';
import Swal from 'sweetalert2';
import { from, forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { environment } from 'src/environments/environment';
import { Lightbox } from 'ngx-lightbox';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

@Component({
  selector: 'app-upload-all-type-document',
  templateUrl: './upload-all-type-document.component.html',
  styleUrl: './upload-all-type-document.component.scss'
})
export class UploadAllTypeDocumentComponent implements OnInit, OnChanges {
  storeFileUpload: any[] = [];
  constructor(private lightbox: Lightbox, public modal: NgbActiveModal,
  ) {

  }


  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnInit(): void {

  }



  file: File | null = null;


  onSelect(event: NgxDropzoneChangeEvent) {
    if (event.addedFiles.length > 0) {
      this.file = event.addedFiles[0];
    }
  }

  onRemove() {
    this.file = null;
  }

  upload() {
    this.close('upload', this.file)
  }

  close(type: any, file: any = null) {
    this.modal.close({
      type: type,
      file: file,
      fileType:this.getFileType(file)
    })
  }

  getFileType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension) {
      return 'Unknown';
    }
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov'];
    const zipExtensions = ['zip'];
    const rarExtensions = ['rar'];
    const dwgExtensions = ['dwg'];

    if (imageExtensions.includes(extension)) {
      return 'Image';
    } else if (documentExtensions.includes(extension)) {
      return 'Document';
    } else if (videoExtensions.includes(extension)) {
      return 'Video';
    } else if (zipExtensions.includes(extension)) {
      return 'Zip';
    } else if (rarExtensions.includes(extension)) {
      return 'Rar';
    } else if (dwgExtensions.includes(extension)) {
      return 'Dwg';
    } else {
      return 'Unknown';
    }
  }
}