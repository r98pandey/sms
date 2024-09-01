import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { QuotationService } from "src/app/core/services/quotation.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-view-quotation",
  templateUrl: "./view-quotation.component.html",
  styleUrls: ["./view-quotation.component.scss"],
})
export class ViewQuotationComponent implements OnInit, OnChanges {
  @Input() ticketInfo: any;
  @Input() quotationId: any;
  @Input() ticketId: any;
  @Input() viewQuationApproveReviewButtons: boolean = false;
  @Input() quotationObjectWorkFlow: any = {};
  @Input() quotationObjectFromTheDashbaordWorkFlowTable: any = {};
  imgUrl: any = environment.apiUrl;
  viewQuationProcessInvoiceButtons: boolean = false;
  billingEligibilityDecisionRemarkValue: any = '';
  maxCharsBillingEligibilityDecision = 300;
  isProject: boolean = false;
  quotationObject: any = {};

  mX_quotationItem: any = [];

  @ViewChild("isApproveReviewQuotationModalPopup", { static: true })
  isApproveReviewQuotationModalPopup: ElementRef;
  @ViewChild("isRejectedQuotationModalPopup", { static: true })
  isRejectedQuotationModalPopup: ElementRef;
  @ViewChild("successDataModalQuotation", { static: true })
  successDataModalQuotation: ElementRef;
  departmentDetail: any=[];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonFunctionService: CommonFunctionService,

    private authAssetService: AuthAssetService,
    private quotationService: QuotationService,
    private modalService: NgbModal,
    private ticketService: TicketService,
    public router: Router,
    private departmentService: DepartmentService,
  ) {
    this.isProject = this.authAssetService.getisProject();
  }
  textTitle="Internal"
  ngOnInit(): void {

    let data: any = JSON.parse(localStorage.getItem("currentUser"));
    if (data?.role === "Client User") {
      this.textTitle="Client"
    }else{
      this.textTitle="Internal"
    }
    if (this.quotationId) {
      this.getV2_MX_QuotationAndItemDetails(this.quotationId);
    } else {
      this.getV2_MX_QuotationAndItemDetailsByTicketId(this.ticketId);
    }

   

    if (
      this.quotationObject.quotStatusId == 56 &&
      this.ticketInfo.ticketStatusId == 32 &&
      this.ticketService.ticketPageAction == "Basic Quotation Page"
    ) {
      this.viewQuationProcessInvoiceButtons = this.quotationObject
        .isQuotationBilled
        ? false
        : true;
    } else {
      this.viewQuationProcessInvoiceButtons = false;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
   
    if (this.quotationId) {
      this.getV2_MX_QuotationAndItemDetails(this.quotationId);
    } else {
      this.getV2_MX_QuotationAndItemDetailsByTicketId(this.ticketId);
    }
    this.getDepartmentDetail(this.ticketInfo.projectId)

    if (
      this.quotationObject.quotStatusId == 56 &&
      this.ticketInfo.ticketStatusId == 32 &&
      this.ticketService.ticketPageAction == "Basic Quotation Page"
    ) {
      this.viewQuationProcessInvoiceButtons = this.quotationObject
        .isQuotationBilled
        ? false
        : true;
    } else {
      this.viewQuationProcessInvoiceButtons = false;
    }
  }

  getDepartmentDetail(departmentId) {
    this.departmentService.getDepartmentDetail(departmentId).subscribe({
      next: (res: any) => {
        this.departmentDetail = res.data;
        console.log("  this.departmentDetail =",  this.departmentDetail)
      },
    });
  }
  getV2_MX_QuotationAndItemDetails(QuotId: any) {
    let pay = {
      QuotId: QuotId,
    };
    this.quotationService
      .getV2_MX_QuotationAndItemDetails(pay)
      .subscribe((res: any) => {
        this.quotationObject = res.objList.mX_Quotation;
        //console.log(" this.quotationObject", this.quotationObject);
        this.mX_quotationItem = res.objList.mX_quotationItem;
      });
  }
  getV2_MX_QuotationAndItemDetailsByTicketId(TicketId: any) {
    let pay = {
      TicketId: TicketId,
    };
    this.quotationService
      .getV2_MX_QuotationAndItemDetailsByTicketId(pay)
      .subscribe((res: any) => {
        this.quotationObject = res.objList.mX_Quotation;
        //console.log(" this.quotationObject", this.quotationObject);
        this.mX_quotationItem = res.objList.mX_quotationItem;
      });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  openModalForRejectedQuotation() {
    this.billingEligibilityDecisionRemarkValue = '';
    this.successDataModalQuotationMessageObject = {
      name: "",
      remark1: "",
      remark2: "",
      remark3: "",
    };
    this.modalService
      .open(this.isRejectedQuotationModalPopup, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          if (this.quotationObjectWorkFlow.masterWorkflowId == 11) {
            this.updateReviewerApproverQuotationPending("Rejected");
          } else {
            this.updateReviewerApproverQuotationInReview("Rejected");
          }
        },
        (reason) => {}
      );
  }

  openModalApproveReviewQuotation() {
    this.billingEligibilityDecisionRemarkValue = '';
    this.successDataModalQuotationMessageObject = {
      name: "",
      remark1: "",
      remark2: "",
      remark3: "",
    };
    this.modalService
      .open(this.isApproveReviewQuotationModalPopup, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          if (this.quotationObjectWorkFlow.masterWorkflowId == 11) {
            this.updateReviewerApproverQuotationPending(
              this.quotationObjectFromTheDashbaordWorkFlowTable.approverType ==
                "Approver"
                ? "Approved"
                : "Reviewed"
            );
          } else {
            this.updateReviewerApproverQuotationInReview(
              this.quotationObjectFromTheDashbaordWorkFlowTable.approverType ==
                "Approver"
                ? "Approved"
                : "Reviewed"
            );
          }
        },
        (reason) => {}
      );
  }

  successDataModalQuotationMessageObject: any = {};

  updateReviewerApproverQuotationInReview(actionStatus: any) {
    let payload = {
      ProjectId: this.quotationObjectWorkFlow.projectId,
      QuotTicketId: this.quotationObjectWorkFlow.ticketId,
      MasterWorkflowItemId: this.quotationId,
      ApproverType:
        this.quotationObjectFromTheDashbaordWorkFlowTable.approverType,
      ActionStatus: actionStatus,
      WfProcessCreationId: this.quotationObjectWorkFlow.wfProcessCreationId,
      WfProcessCreationDetailId:
        this.quotationObjectWorkFlow.wfProcessCreationDetailId,
      Remark: this.billingEligibilityDecisionRemarkValue,
    };
    //console.log(payload, "payload");
    this.quotationService
      .updateReviewerApproverQuotationInReview(payload)
      .subscribe((res: any) => {
        this.billingEligibilityDecisionRemarkValue = '';
        if (
          res.code == "200" &&
          res.message == "Success Completed Quotation Pending"
        ) {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Review/Approve process successfully.",
            remark1:
              "The quotation has been successfully reviewed and approved.",
            remark2:
              "The system has now escalated this quotation for the client approval process.",
            remark3:
              "Once the client takes action, you will receive a notification.",
          };
          this.successModalFor();
        } else if (
          res.code == "200" &&
          res.message == "Success Completed Service Order Pending"
        ) {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Review/Approve process successfully.",
            remark1:
              "The quotation has been reviewed and approved successfully.",
            remark2: "Can generate a new service order for this ticket.",
            remark3:
              'Please go to "My Tasks" and look for the task labeled "Waiting For Generate New Service Order".',
          };
          this.successModalFor();
        } else if (res.code == "200" && res.message == "Success") {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Review/Approve process successfully.",
            remark1:
              "The quotation has been reviewed and approved successfully.",
            remark2: "Waiting for next Reviewer/Approver",
            remark3: "",
          };
          this.successModalFor();
        } else if (res.code == "200" && res.message == "Success Rejected") {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Rejected process successfully.",
            remark1: "The quotation has been Rejected successfully.",
            remark2: "",
            remark3: "",
          };
          this.successModalFor();
        } else {
        }
      });
  }

  updateReviewerApproverQuotationPending(actionStatus: any) {
    let payload = {
      ProjectId: this.quotationObjectWorkFlow.projectId,
      QuotTicketId: this.quotationObjectWorkFlow.ticketId,
      MasterWorkflowItemId: this.quotationId,
      ApproverType:
        this.quotationObjectFromTheDashbaordWorkFlowTable.approverType,
      ActionStatus: actionStatus,
      WfProcessCreationId: this.quotationObjectWorkFlow.wfProcessCreationId,
      WfProcessCreationDetailId:
        this.quotationObjectWorkFlow.wfProcessCreationDetailId,
      Remark: this.billingEligibilityDecisionRemarkValue,
    };
    //console.log(payload, "payload");
    this.quotationService
      .UpdateReviewerApproverQuotationPending(payload)
      .subscribe((res: any) => {
        this.billingEligibilityDecisionRemarkValue = '';
        if (
          res.code == "200" &&
          res.message == "Success Completed Quotation Pending"
        ) {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Review/Approve process successfully.",
            remark1:
              "The quotation has been successfully reviewed and approved.",
            remark2:
              "The system has now escalated this quotation for the client approval process.",
            remark3:
              "Once the client takes action, you will receive a notification.",
          };
          this.successModalFor();
        } else if (
          res.code == "200" &&
          res.message == "Success Completed Service Order Pending"
        ) {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Review/Approve process successfully.",
            remark1:
              "The quotation has been reviewed and approved successfully.",
            remark2: "Can generate a new service order for this ticket.",
            remark3:
              'Please go to "My Tasks" and look for the task labeled "Waiting For Generate New Service Order".',
          };
          this.successModalFor();
        } else if (res.code == "200" && res.message == "Success") {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Review/Approve process successfully.",
            remark1:
              "The quotation has been reviewed and approved successfully.",
            remark2: "Waiting for next Reviewer/Approver",
            remark3: "",
          };
          this.successModalFor();
        } else if (res.code == "200" && res.message == "Success Completed") {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Review/Approve process successfully.",
            remark1:
              "The quotation has been reviewed and approved successfully.",
            remark2: "Waiting for next Reviewer/Approver",
            remark3: "",
          };
          this.successModalFor();
        } else if (
          res.code == "200" &&
          res.message == "Successfully Reviewed"
        ) {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Review/Approve process successfully.",
            remark1:
              "The quotation has been reviewed and approved successfully.",
            remark2: "Waiting for next Reviewer/Approver",
            remark3: "",
          };
          this.successModalFor();
        } else if (
          res.code == "200" &&
          res.message == "Successfully Approved"
        ) {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Review/Approve process successfully.",
            remark1:
              "The quotation has been reviewed and approved successfully.",
            remark2: "Waiting for next Reviewer/Approver",
            remark3: "",
          };
          this.successModalFor();
        } else if (res.code == "200" && res.message == "Success Rejected") {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Rejected process successfully.",
            remark1: "The quotation has been Rejected successfully.",
            remark2: "",
            remark3: "",
          };
          this.successModalFor();
        } else {
          this.successDataModalQuotationMessageObject = {
            name: "Quotation Approved process successfully.",
            remark1: res.message,
            remark2: "",
            remark3: "",
          };
          this.successModalFor();
        }
      });
  }
  successModalFor() {
    this.modalService
      .open(this.successDataModalQuotation, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          let lastRouter = this.ticketService.lastStoreRouterDashboardName;
          this.router.navigate([lastRouter]);
        },
        (reason) => {}
      );
  }

  openModalAProcessInvoiceQuotation() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to send this quotation for the invoice process? ";
    modalRef.componentInstance.subTitle =
      "Once you proceed, it cannot be reverted back";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          this.updateV2_MaintenanceQuotationBillProcess();
        }
      }
    });
  }

  updateV2_MaintenanceQuotationBillProcess() {
    let payload = {
      QuotId: this.quotationObject.quotId,
    };
    this.quotationService
      .updateV2_MaintenanceQuotationBillProcess(payload)
      .subscribe((res: any) => {
        this.success(res);
        let lastRouter = this.ticketService.lastStoreTicketRouterName;
        this.router.navigate([lastRouter]);
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

  goBack() {
    let lastRouter = this.ticketService.lastStoreRouterDashboardName;
    this.router.navigate([lastRouter]);
  }
}
