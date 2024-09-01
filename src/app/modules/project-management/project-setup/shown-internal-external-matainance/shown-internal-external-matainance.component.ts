import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { MytaskAccessRightModalInternalExternalMatainanceComponent } from '../mytask-access-right-modal-internal-external-matainance/mytask-access-right-modal-internal-external-matainance.component';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import Swal from 'sweetalert2';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';

@Component({
  selector: 'app-shown-internal-external-matainance',
  templateUrl: './shown-internal-external-matainance.component.html',
  styleUrl: './shown-internal-external-matainance.component.scss'
})
export class ShownInternalExternalMatainanceComponent implements OnInit {

  @Input() internalExternalMatainanceList
  @Input() comingWhichTab: any;
  @Input()  accessRight:any;
  @Input() dDetail:any;
  @Output() afterDeleteSend = new EventEmitter();

  imageUrl: any = environment.apiUrl;
  constructor(private modalService: NgbModal, 
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService) {

  }
  ngOnInit(): void {
    console.log("internalExternalMatainanceList", this.internalExternalMatainanceList)
    this.footerStates = new Array(this.internalExternalMatainanceList.length).fill(false);
  }
  getAccessChildName(type) {
    switch (type) {
      case 'newTicket':
        return 'New Ticket Queue';
      case 'awaitQuotation':
        return 'Create Quotation';
      case 'generateNewSO':
        return 'Service Order Generation';
      case 'expectedStartTaskDateTime':
        return 'Assign Member & Site Visit Date Time';
      case 'techSignatureRequired':
        return 'Tech Signature Required';
      case 'clientSignatureRequired':
        return 'Client Signature Required';
      case 'pendingForCloseTicketProcess':
        return 'Closing Ticket Status (Global)';
      case 'pendingForCloseTicketProcessInternal':
        return 'Closing Ticket Status (Internal)';
      case 'quotationToProceedFinance':
        return 'Quotation To Proceed Finance';
      case 'quotationRejected':
        return 'Quotation Rejected';
      case 'ticketAcknowledgmentRequest':
        return 'Ticket Acknowledgement';
      case 'ticketVerificationForAcknowledgeProcess':
        return 'Ticket Verification';
      case 'pmScheduleCompletionAcknowlegementAdmin':
        return 'Schedule Completion Acknowledgement Admin';
      case 'auditCompletionAcknowlegementAdmin':
        return 'Audit Completion Acknowledgement Admin';
      default:
        return 'Unknown Type';
    }
  }

  currentIndex = -1;
  openFooterCard(index) {
    if (this.currentIndex === index) {
      this.currentIndex = -1;
    } else {
      this.currentIndex = index;
    }
  }
  openMyTaskAccessRightModal(value: any) {
    if(this.dDetail.departmentStatusId==49){
      const modalRef = this.modalService.open(MessageModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = 'You can proceed with the process because the project has been deleted.';
      modalRef.componentInstance.subTitle = "";
      modalRef.componentInstance.buttonName = 'Ok'
      modalRef.result.then((result) => {
        //console.log(result, "result");
        if (result) {
          if (result == "Close click") {
          
          }
        }
      
      });

    }else{
    const modalRef = this.modalService.open(MytaskAccessRightModalInternalExternalMatainanceComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "xl",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.selectedUserId = value.userId;
    modalRef.componentInstance.MyTaskId = value.childList[0].myTaskId;
    modalRef.componentInstance.myTaskRulesActiveCount = value.accessRight;
    modalRef.componentInstance.teamMember = value
    modalRef.result.then((result) => {
      if (result) {
        this.afterDeleteSend.emit({
          res: result,
          comingWhichTab: this.comingWhichTab
        })

      }
    });
  }}

  footerStates: boolean[] = [];

  toggleFooterCard(index: number) {
    this.footerStates[index] = !this.footerStates[index];

  }

  isFooterOpen(index: number): boolean {
    return this.footerStates[index];
  }

  getTotalObjectTrueCount(obj) {

    let count = 0;
    obj.forEach(element => {
      if (element.checked) {
        count = count + 1
      }
    });
    return count
  }

  openModalDeleteConf(projectUserAccessId: any) {
    if(this.dDetail.departmentStatusId==49){
      const modalRef = this.modalService.open(MessageModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = 'You can proceed with the process because the project has been deleted.';
      modalRef.componentInstance.subTitle = "";
      modalRef.componentInstance.buttonName = 'Ok'
      modalRef.result.then((result) => {
        //console.log(result, "result");
        if (result) {
          if (result == "Close click") {
          
          }
        }
      
      });

    }else{
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You Are About to Delete a  "+this.comingWhichTab + " Team Member?";
    modalRef.componentInstance.subTitle =
      "Deleting your User Profile  will remove for the database";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteV2_EmailNotification(projectUserAccessId);
        }
      }
    });
  }}
  deleteV2_EmailNotification(ProjectUserAccessId: any) {
    let payload = {
      ProjectUserAccessId: ProjectUserAccessId

    };
    let url: any;
    if (this.comingWhichTab == 'Project') {
      url = 'api/ProjectManagement/DeleteV2_MX_ProjectUserAccessIndividualUser';
    } else if (this.comingWhichTab == 'Maintenance') {
      url = 'api/Maintenance/DeleteV2_MX_MaintenanceUserAccessIndividualUser'
    } else if (this.comingWhichTab == 'Asset') {
      
      url = 'api/AssetManagement/DeleteV2_MX_AssetUserAccessIndividualUser'
    } else {
    }
    if (url) {
      this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe((res: any) => {
        this.success(res);

        this.afterDeleteSend.emit({
          res: res,
          comingWhichTab: this.comingWhichTab
        })

      });
    } else {
      this.error('Something went wrong')
    }
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
      timer: 2000,
    });
  }
}
