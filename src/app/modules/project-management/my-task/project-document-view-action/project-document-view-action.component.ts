
import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from 'src/app/core/services/department.service';
import Swal from 'sweetalert2';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { environment } from 'src/environments/environment';
import { Lightbox } from 'ngx-lightbox';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { Router } from '@angular/router';
import { A } from '@fullcalendar/core/internal-common';
import { SuccessModalWithRemarkComponent } from 'src/app/shared/components/success-modal-with-remark/success-modal-with-remark.component';

@Component({
  selector: 'app-project-document-view-action',
  templateUrl: './project-document-view-action.component.html',
  styleUrl: './project-document-view-action.component.scss'
})
export class ProjectDocumentViewActionComponent implements OnInit, OnChanges {
  @Input() projectProcessTransactId: any;
  @Input() projectProcessHeaderDocId: any;
  myTaskSendObject: any;
  editorDescription: any = null;
  @Input() project: any;
  listDoc: any = [];
  listHeaderDoc:any=[];
  // listHeaderDoc: any;
  constructor(private authService: AuthAssetService,
    public modal: NgbOffcanvas,
    private lightbox: Lightbox,
    private commonFunctionService: CommonFunctionService,
    private departmentService: DepartmentService,
    private modalService: NgbModal,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.myTaskSendObject = this.CommonHttpServiceCallerService.myTaskSendObject
    this.getMX_ProjectProcessHeaderDocList_ApprovalPending();
  }
  getMX_ProjectProcessHeaderDocList_ApprovalPending() {
    let payload = {
      projectProcessTransactId: this.projectProcessTransactId,
      projectProcessHeaderDocId: this.projectProcessHeaderDocId
    }
    let url: any = 'api/ProjectManagementDash/GetMX_ProjectProcessHeaderDocList_ApprovalPending';
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe((res: any) => {
      this.listHeaderDoc = res.listHeaderDoc
      this.listDoc = res.listDoc
    });

  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  close(value: any) {
    this.modal.dismiss({
      type: value,
    });
  }
  submit(value: any) {
    this.modal.dismiss({
      type: value,
    });
  }

  toUpperCaseword(data: string) {
    if (data) return data.toUpperCase();
    return "";
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
  }  success_new(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  transformInnerHTML(string: any) {
    return this.commonFunctionService.transform(string);
  }
  goToLink(url: string) {
    window.open(environment.apiUrl + url, "_blank");
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

  warning(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: res,
      showConfirmButton: false,
      timer: 3000,
    });
  }



  returnType() {
    console.log(this.myTaskSendObject, "heyy reyiro" )
    if (this.myTaskSendObject.type == 'IsVerified') {
      return 'Verification';
    } else if (this.myTaskSendObject.type == 'IsAcknowledgement') {
      return "Acknowledgement";
    } else if (this.myTaskSendObject.type == 'IsApprove') {
      return "Approval";
    }
  }


  
  returnNameType() {
    if (this.myTaskSendObject.type == 'IsVerified') {
      return 'Verify';
    } else if (this.myTaskSendObject.type == 'IsAcknowledgement') {
      return "Acknowledge";
    } else if (this.myTaskSendObject.type == 'IsApprove') {
      return "Approve";
    }
  }


  openModalUpdateHandler() {
    const modalRef = this.modalService.open(SuccessModalWithRemarkComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      " Are you sure you want to  " + this.returnNameType();
    modalRef.componentInstance.subTitle1 = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = this.returnNameType() + " It";
    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result.value == "success") {
          this.requestHandler(result.remark);
        }
      }
    });
  }
  requestHandler(remark) {
    let requestData = {
      "projectProcessTransactId": this.projectProcessTransactId,
      "projectProcessHeaderDocId": this.projectProcessHeaderDocId,
      "Process": this.returnType(),
      "remark": remark
    }
    let url: any = 'api/ProjectManagementDash/GetV3_ProjectManagement_DocumentProcess_ApprovalUpdate';
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, requestData).subscribe((res: any) => {
      this.success(res);
      this.submit('success');
    });
  }

  downloadFileDocument(fileUrl:any,) {
    // let filename:any= fileUrl.substring(fileUrl.lastIndexOf('\\') + 1); ;
    // this.CommonHttpServiceCallerService.downloadFile(fileUrl, filename).subscribe({
    //   next: () => this.success_new('Download completed successfully'),
    //   error: (err) => console.error('Download failed', err),
    // });
    let con = fileUrl.substring(fileUrl.lastIndexOf('\\') + 1).split(".")
    let payload = {
      FileURL: fileUrl,
      ContentType: 'application/' + con[con.length - 1]
    }
    
    this.CommonHttpServiceCallerService.downloadTikcetFile(payload).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.download = fileUrl.substring(fileUrl.lastIndexOf('\\') + 1);
      link.href = window.URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    });
  }

}



