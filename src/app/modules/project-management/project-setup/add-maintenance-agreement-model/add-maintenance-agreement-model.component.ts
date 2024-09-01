import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { DepartmentService } from 'src/app/core/services/department.service';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonHttpServiceCallerService } from 'src/app/core/services/common-http-service-caller.service';
import { event } from 'jquery';

@Component({
  selector: 'app-add-maintenance-agreement-model',
  templateUrl: './add-maintenance-agreement-model.component.html',
  styleUrl: './add-maintenance-agreement-model.component.scss'
})
export class AddMaintenanceAgreementModelComponent implements OnInit, OnChanges {
  addMaintenanceAgreementForm!: FormGroup;
  selectedmaintenanceTypeName: any = null;
  projectOwnerList: any = [];
  @Input() projectId: any;
  @Input() storeProjectScheduleObject: any;
  @Input() commeToProject: boolean
  projectOwnerStoreValue: any = null;
  imgUrl: any = environment.apiUrl;
  public Editor = ClassicEditor;
  selectedFiles: File[] = [];
  @Input() dDetail: any

  constructor(public formBuilder: FormBuilder, private departmentService: DepartmentService,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private datePipe: DatePipe, private commonHttpServiceCallerService: CommonHttpServiceCallerService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getfromBinding();
  }
  maintenanceTypeList: any = []
  getMaintenanceTypeList() {
    let url = 'api/ProjectManagement/GetMaintenanceTypeList'
    this.commonHttpServiceCallerService.getWithoutParmaMethod(url).subscribe((res: any) => {
      this.maintenanceTypeList = res
    })
  }
  ngOnInit(): void {
    this.getfromBinding();
    this.getMaintenanceTypeList();
  }
  clearChangeStartDate() {
    this.StartDate.reset();
    this.clearChangeEndDate();
  }

  clearChangeEndDate() {
    this.EndDate.reset();
  }

  getfromBinding() {
    this.addMaintenanceAgreementForm = this.formBuilder.group({
      MaintenanceAgreementTitle: [null, Validators.required],
      Description: [null, Validators.required],
      StartDate: [null, Validators.required],
      EndDate: [null, Validators.required],
      maintenanceType: [null, Validators.required],
    });
  }

  onChangesMaintaineType(event: any) {
    console.log(event.maintenanceTypeName)
    this.selectedmaintenanceTypeName = event.maintenanceTypeName

  }

  get MaintenanceAgreementTitle() {
    return this.addMaintenanceAgreementForm.get("MaintenanceAgreementTitle");
  }

  get Description() {
    return this.addMaintenanceAgreementForm.get("Description");
  }
  get maintenanceType() {
    return this.addMaintenanceAgreementForm.get("maintenanceType");
  }

  get StartDate() {
    return this.addMaintenanceAgreementForm.get("StartDate");
  }

  get EndDate() {
    return this.addMaintenanceAgreementForm.get("EndDate");
  }
  fileErrors: string[] = [];
  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // Check if the file is already selected
      const isDuplicate = this.selectedFiles.some((selectedFile, selectedIndex) => {
        return selectedFile && selectedFile.name === file.name && selectedIndex !== index;
      });
      if (isDuplicate) {
        this.fileErrors[index] = 'This file has already been selected. Please choose a different file.';
        event.target.value = '';
      } else {
        this.fileErrors[index] = ''; // Clear any previous error
        this.selectedFiles[index] = file;
      }


    }
  }

  CheckTheFileUploadOrNot() {
  
    if (this.selectedFiles.length) {
      this.messageBoxOpenWithFileUpload()
    } else {
      this.messageBoxOpenWithNoFileUpload()
    }
  }

  messageBoxOpenWithNoFileUpload() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You did not upload any document. Therefore, you will not be able to upload the document in the next step. Are you sure you want to continue?";
    modalRef.componentInstance.buttonName = "Submit It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addMaintenanceAgreementSucessModal()
        }
      }
    });
  } 
   messageBoxOpenWithFileUpload() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure want to submit?";
    modalRef.componentInstance.buttonName = "Submit It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addMaintenanceAgreementSucessModal()
        }
      }
    });
  }
  addMaintenanceAgreementSucessModal() {
    const formData = new FormData();
    formData.append("ProjectId", this.projectId);
    formData.append("Title", this.MaintenanceAgreementTitle.value);
    formData.append("maintenanceType", this.selectedmaintenanceTypeName);
    formData.append("maintenanceTypeId", this.maintenanceType.value);
    formData.append("Description", this.Description.value);
    formData.append("StartDate", this.datePipe.transform(this.StartDate.value, "yyyy-MM-dd"));
    formData.append("EndDate", this.datePipe.transform(this.EndDate.value, "yyyy-MM-dd"));
    // if (this.selectedFiles.length) {
    //   if (this.selectedFiles[0]?.name) {
    //     formData.append('file', this.selectedFiles[0], this.selectedFiles[0]?.name);
    //     formData.append('type', 'document');
    //   } else if (this.selectedFiles[1]?.name) {
    //     formData.append('file', this.selectedFiles[1], this.selectedFiles[1]?.name);
    //     formData.append('type', 'document');
    //   } else if (this.selectedFiles[2]?.name) {
    //     formData.append('file', this.selectedFiles[2], this.selectedFiles[2]?.name);
    //     formData.append('type', 'document');
    //   } else {

    //   }
    // }
    if (this.selectedFiles.length) {
      this.selectedFiles.forEach((file, index) => {
        if (file?.name) {
          formData.append('file', file, file.name);
        }
      });
      formData.append('type', 'document');
    }
    
    let url = '';
    if (this.commeToProject) {
      url = 'api/ProjectManagement/CreateV2_MX_MaintenanceAgreement_MaintenanceModule';
    } else {
      url = 'api/ProjectManagement/CreateV2_MX_MaintenanceAgreement';
    }
    this.commonHttpServiceCallerService.postWithFormDataMethod(url, formData).subscribe((res) => {
      this.success(res);
      this.close('submit', res);
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

  close(value, res: any = {}) {
    if (value === "submit") {
      let sendObject = {
        value: value,
        res: res,
      };
      this.modal.close(sendObject);
    } else {
      this.modal.close({
        value: value
      });
    }
  }

  clearFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.fileErrors.splice(index, 1);
    
    const inputElement = document.getElementById(`formFile${index + 1}`) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

}