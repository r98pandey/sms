
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from 'src/app/core/services/department.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { Lightbox } from 'ngx-lightbox';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
  
  @Component({
    selector: 'app-award-evaluation',
    templateUrl: './award-evaluation.component.html',
    styleUrl: './award-evaluation.component.scss'
  })
  export class AwardEvaluationComponent implements OnInit, OnChanges {
    @Input() selectedTab: any = {};
  @Input() projectId: any = {};
  @Output() completeProcess = new EventEmitter();
  public Editor = ClassicEditor;
  ProcessModalForm: FormGroup;
  url = environment.apiUrl
  isFirstImageVisible: boolean;
  projectProcessDocList: any = [];
  typeArray = ['Document', 'Video', 'Image']
  constructor(private modalService: NgbModal, public formBuilder: FormBuilder,
    public departmentService: DepartmentService,
    private commonFunctionService: CommonFunctionService, private lightbox: Lightbox
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnInit(): void {
    console.log("hh")
    this.getfromBinding();
    this.getMX_ProjectProcessDocList();
  }


  openModalComplete() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Do you want to Complete "+  this.selectedTab.projectProcessName+" Project Proccess";
    modalRef.componentInstance.subTitle = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = "Complete It";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          this.updateMX_ProjectProcessHeaderComplete();
        }
      }
    });
  }

  
  getMX_ProjectProcessDocList() {
    let payload = { "ProjectProcessTransactId": this.selectedTab.projectProcessTransactId }
    this.departmentService.getMX_ProjectProcessDocList(payload).subscribe((res: any) => {
      this.projectProcessDocList = res.list
    
      
    }, (err) => {

    })
  }

  updateMX_ProjectProcessHeaderComplete() {
    let payload = { "ProjectProcessTransactId": this.selectedTab.projectProcessTransactId, "ProjectId": this.projectId }
    this.departmentService.updateMX_ProjectProcessHeaderComplete(payload).subscribe((res: any) => {
     this.success(res);
     this.completeProcess.emit(res)

    }, (err) => {

    })
  }
 
  projectProcessDocDetail: any
  getMX_ProjectProcessDocDetail(ele: any, content) {
    let payload = { "ProjectProcessDocId": ele.projectProcessDocId }
    this.departmentService.getMX_ProjectProcessDocDetail(payload).subscribe((res: any) => {
      this.projectProcessDocDetail = res.obj
      this.modalService.open(content, { size: "md", centered: true })
    }, (err) => {

    })
  }
  goToAddProcess(content: any) {
    this.modalService.open(content, { size: "md", centered: true });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  resetFileInput() {
    const fileInput: any = document.getElementById("asset_id0");
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
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

  submitprocessFromDetails(): void {
    const formdata = new FormData();
    const descriptionValue = this.commonFunctionService.formatDescription(this.frmdescription.value) // Remove HTML tags
    formdata.append("title", this.frmtitle.value);
    formdata.append("remark", descriptionValue);
    formdata.append("type", this.frmtype.value); // Append the value of frmtype
    formdata.append("ProjectProcessTransactId", this.selectedTab.projectProcessTransactId); // Append the value of frmtype
    if (this.frmtype.value == "Document") {
      formdata.append("file", this.files[0], this.files[0].name); // Assuming single file upload
    }
    if (this.frmtype.value == "Image") {
      formdata.append("ImageBase64URL", this.base64Strings[0]?.split(',')[1]); // Assuming single image upload

    }
    if (this.frmtype.value == 'Video') {
      formdata.append("file", this.files[0], this.files[0].name); // Assuming single video upload
    }
    this.departmentService.UploadProjectProcessDocument(formdata).subscribe({
      next: (response) => {
        console.log("Upload success", response);
        this.ProcessModalForm.reset();
        this.resetFileValue()
        this.modalService.dismissAll();
        this.getMX_ProjectProcessDocList();
      },
      error: (error) => {
        console.log("Upload error", error);

      },
    });
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

}


