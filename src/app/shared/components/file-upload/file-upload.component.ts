
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

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent implements OnInit, OnChanges {
  @Input() TicketId: any;
  @Input() type: any;
  @Input() listOfDocumentAlreadyUpload: any;
  maxCharMessage: any = 300;
  remarkContain: any = ''
  public Editor = ClassicEditor;

  ProcessModalForm: FormGroup;
  url = environment.apiUrl
  constructor(private modalService: NgbModal,
    public formBuilder: FormBuilder,
    public ticketService: TicketService,
    private commonFunctionService: CommonFunctionService,
    private lightbox: Lightbox,
    private authAssetService: AuthAssetService,
    public modal: NgbActiveModal
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnInit(): void {


  }


  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  resetFileInput() {
    const fileInput: any = document.getElementById("asset_id0");
    if (fileInput) {
      fileInput.value = "";
    }
  }



  files: File[] = [];
  showExistFileLabel: boolean = false;
  onSelect(event: any) {
    if (this.files.length > 0) {
      this.files.splice(this.files.indexOf(event), 1);
    }
    this.showExistFileLabel = false;
    let checkerFile: File[] = [];
    checkerFile.push(...event.addedFiles);

    for (let i = 0; i < this.listOfDocumentAlreadyUpload.length; i++) {
      if (this.listOfDocumentAlreadyUpload[i].fileName == checkerFile[0].name) {
        this.showExistFileLabel = true;
        this.warning();
        break;
      }
    }
    if (!this.showExistFileLabel) {
      this.files.push(...event.addedFiles);

    }



    console.log(this.files, "event");
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.remarkContain = ''
  }

  onRemoveImage(event: any) {
    // Remove the selected file
    let insex: any = this.file.indexOf(event);
    this.file.splice(insex, 1);
    this.base64Strings.splice(insex, 1);

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

  error(err: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err,
      showConfirmButton: false,
      timer: 1000,
    });
  }
  file: File[] = [];

  onSelectFile(event: any) {
    // Add the newly selected files without removing existing ones
    this.file = [];
    this.file.push(...event.addedFiles);
    this.base64Strings = [];
    this.onSelectwithbase64(event)
  }
  base64Strings: string[] = [];

  onSelectwithbase64(event: any) {

    // Loop through each added file
    event.addedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Add the prefix if it's not present
        const base64String = e.target.result.includes('data:image')
          ? e.target.result
          : 'data:image/png;base64,' + e.target.result.split(',')[1];

        this.base64Strings.push(base64String);
        console.log(this.base64Strings, 'cfghihg');
      };

      reader.readAsDataURL(file);
    });
  }



  resetFileValue() {
    this.files = [];
    this.file = []
    this.base64Strings = [];

  }

  submitprocessFromDetails(): void {

    const formdata = new FormData();
    formdata.append("TicketId", this.TicketId);
    formdata.append("AccessGroup", this.authAssetService.getaccessGroupName());
    formdata.append("file", this.files[0], this.files[0].name);  
    formdata.append("Remark", this.remarkContain);
    formdata.append("type", this.type == 'File' ? 'Document' : 'Video');
    if (this.type == 'File') {
      this.ticketService.uploadTicketSingleDocument(formdata).subscribe({
        next: (response) => {
          this.success(response);
          this.close(response)
        },
        error: (error) => {

        },
      });
    } else {
      this.ticketService.uploadTicketSingleVideo(formdata).subscribe({
        next: (response) => {
          this.success(response);
          this.close(response)
        },
        error: (error) => {

        },
      });
    }
  }

  close(res) {
    this.modal.close(res)
  }

  open(image): void {
    const album = {
      src: environment.apiUrl + image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }

  linkVideo: any = ''
  openModaVideeo(link, content) {
    this.linkVideo = environment.apiUrl + link;
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    modalRef.result.then((result) => {
      if (result) {
        if (result == "confirm") {

        }
      }
    });
  }

  goToLink(url: string) {
    window.open(environment.apiUrl + url, "_blank");
  }

  checkButtonDisable() {
    let checked = true;
    if (this.ProcessModalForm.valid) {
      if (this.files.length != 0 || this.file.length != 0) {
        checked = false;
      } else {
        checked = true;
      }

    } else {
      checked = true;

    }
    return checked;
  }


  warning() {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: 'You can not upload same file. ',
      showConfirmButton: false,
      timer: 3000,
    });
  }
}


