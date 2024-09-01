
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

@Component({
  selector: 'app-upload-attachments-work-progress-modal',
  templateUrl: './upload-attachments-work-progress-modal.component.html',
  styleUrl: './upload-attachments-work-progress-modal.component.scss'
})
export class UploadAttachmentsWorkProgressModalComponent {


  @Input() followUpId: any = {};
  @Input() projectId: any = {};
  public Editor = ClassicEditor;
  ProcessModalForm: FormGroup;
  url = environment.apiUrl
  isFirstImageVisible: boolean;
  projectProcessDocList: any = [];
  typeArray = ['Document', 'Video', 'Image']
  constructor(private modalService: NgbModal, public formBuilder: FormBuilder,
    public departmentService: DepartmentService,
    private commonFunctionService: CommonFunctionService, private lightbox: Lightbox, public modal: NgbActiveModal
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnInit(): void {
    this.getfromBinding();
  }

  getfromBinding() {
    this.ProcessModalForm = this.formBuilder.group({
      frmdescription: [null, Validators.required],
      frmtitle: [null, Validators.required],
      frmtype: [null, Validators.required],

    });
  }

  get frmdescription() {
    return this.ProcessModalForm.get("frmdescription");
  }
  get frmtitle() {
    return this.ProcessModalForm.get("frmtitle");
  }
  get frmtype() {
    return this.ProcessModalForm.get("frmtype");
  }

  close(value, event: any) {
    event.preventDefault();
    this.modal.close(value);
  }
  submit(value) {
    event.preventDefault();
    this.modal.close(value);
  }

  
  files: File[] = [];

  onSelect(event: any) {
    if (this.files.length > 0) {
      this.files.splice(this.files.indexOf(event), 1);
    }
    this.files.push(...event.addedFiles);
    console.log(this.files, "event");
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
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

  submitprocessFromDetails(){
    
  }

}
