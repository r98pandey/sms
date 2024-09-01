


import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from 'src/app/core/services/department.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { Lightbox } from 'ngx-lightbox';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
@Component({
  selector: 'app-add-upload-attchament-warranty',
  templateUrl: './add-upload-attchament-warranty.component.html',
  styleUrl: './add-upload-attchament-warranty.component.scss'
})
export class AddUploadAttchamentWarrantyComponent implements OnInit, OnChanges {
  @Input() projectWarrentyId: any ;
  @Input() projectId: any ;

@Input() listOfDocumentAlreadyUpload:any[]

  public Editor = ClassicEditor;
  ProcessModalForm: FormGroup;
  url = environment.apiUrl
  isFirstImageVisible: boolean;
  projectProcessDocList: any = [];
  typeArray = ['Document', 'Video', 'Image']
  constructor(private modalService: NgbModal, public formBuilder: FormBuilder,
    public departmentService: DepartmentService,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService,
    private commonFunctionService: CommonFunctionService, private lightbox: Lightbox, public modal: NgbActiveModal
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnInit(): void {

  }


  processDocUrls(docurl) {
    return this.commonFunctionService.processDocUrls(docurl)
  }



  resetFileInput() {
    const fileInput: any = document.getElementById("asset_id0");
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
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
      if (this.processDocUrls(this.listOfDocumentAlreadyUpload[i].docURL) == checkerFile[0].name) {
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


    formdata.append("ProjectWarrentyId", this.projectWarrentyId);
    formdata.append("ProjectId", this.projectId);
    formdata.append("Type", 'Document');
    formdata.append("file", this.files[0], this.files[0].name);

    let url = 'api/ProjectManagement/CreateV2_ProjectWarrentyDocument'

    this.CommonHttpServiceCallerService.postWithFormDataMethod(url, formdata).subscribe({
      next: (response) => {

        this.resetFileValue()
        this.submit(response)
      },
      error: (error) => {
        console.log("Upload error", error);

      },
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


  checkButtonDisable() {
    let checked = true;
    if (this.files.length != 0 || this.file.length != 0) {
      checked = false;
    } else {
      checked = true;
    }
    return checked;
  }
  submitZBeforConfirmation() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Add this File";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submitprocessFromDetails();
        }
      }
    });
  }
}


