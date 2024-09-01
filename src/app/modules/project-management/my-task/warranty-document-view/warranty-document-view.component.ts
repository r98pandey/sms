
import { Component, Input, OnInit } from '@angular/core';
import { NgbOffcanvas, NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import Swal from 'sweetalert2';
import { SuccessModalWithRemarkComponent } from 'src/app/shared/components/success-modal-with-remark/success-modal-with-remark.component';

@Component({
  selector: 'app-warranty-document-view',
  templateUrl: './warranty-document-view.component.html',
  styleUrl: './warranty-document-view.component.scss'
})
export class WarrantyDocumentViewComponent implements OnInit {
  activeTaskTab:any=1
  @Input() ProjectId: any; 
   @Input() WarrantyDocumentObject: any;
  myTaskSendObject: any = {}
  @Input() ProjectWarrentyId: any;
  @Input() ProjectWarrentyName:any;
  warrentyDetails: any;
  agreementDocList: any;
  constructor(private offcanvasService: NgbOffcanvas
    , public activeOffcanvas: NgbActiveOffcanvas, private modalService: NgbModal,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private commonFunctionService: CommonFunctionService) {

  }
  ngOnInit(): void {
    this.myTaskSendObject = this.CommonHttpServiceCallerService.myTaskSendObject
    this.GetV2_ProjectWarrentyDetail();
    this.GetV2_ProjectWarrentyDocList();
  }

  getUpdateResults(){
    this.GetV2_ProjectWarrentyDetail();
    this.GetV2_ProjectWarrentyDocList();
  }

  close(value: any) {
    this.activeOffcanvas.dismiss(value)
  }

  GetV2_ProjectWarrentyDetail() {
    let url: any = 'api/ProjectManagement/GetV2_ProjectWarrentyDetail'
    let paylaod = {
      ProjectWarrentyId: this.ProjectWarrentyId
    }
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, paylaod).subscribe((res: any) => {
      this.warrentyDetails = res.obj;
    });
  }
  GetV2_ProjectWarrentyDocList() {
    let url: any = 'api/ProjectManagement/GetV2_ProjectWarrentyDocList'
    let paylaod = {
      ProjectWarrentyId: this.ProjectWarrentyId
    }
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, paylaod).subscribe((res: any) => {
      this.agreementDocList = res.obj;
    });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }


  submit(value: any) {
    this.activeOffcanvas.dismiss({
      type: value,
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
      "projectId": this.ProjectId,
      "projectWarrentyId": this.ProjectWarrentyId,
      "Process": this.returnType(),
      "remark": remark,
      "masterProjectProcessAccessRightId":this.WarrantyDocumentObject.masterProjectProcessAccessRightId,
      "title":this.WarrantyDocumentObject.title,
      "projectWarrentyNo":this.WarrantyDocumentObject.projectWarrentyNo,
      "projectProcessName":"Warrenty"
      
    }
    let url: any = 'api/ProjectManagementDash/UpdateV3_WarrentyAgreement_ApprovalUpdate';
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, requestData).subscribe((res: any) => {
      this.success(res);
      this.submit('success');
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
}
