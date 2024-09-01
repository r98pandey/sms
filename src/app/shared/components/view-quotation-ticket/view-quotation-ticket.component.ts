import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Config, NgxPrintElementService } from "ngx-print-element";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { QuotationService } from "src/app/core/services/quotation.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-view-quotation-ticket",
  templateUrl: "./view-quotation-ticket.component.html",
  styleUrls: ["./view-quotation-ticket.component.scss"],
})
export class ViewQuotationTicketComponent implements OnInit, OnChanges {
  @Input() quotationObject: any = {};
  @Input() mX_quotationItem: any = [];
  @Input() ticketInfo: any;
  @Output() resubmitQuotation = new EventEmitter();
  imgUrl: any = environment.apiUrl;
  isProject: boolean = false;
  viewQuationProcessInvoiceButtons: boolean = false;
  @Input() resubmitButtonView: boolean = false;
  departmentDetail: any={};

  constructor(
    private commonFunctionService: CommonFunctionService,
    // private modalService: NgbModal,
    private authAssetService: AuthAssetService,
    private quotationService: QuotationService,
    private modalService: NgbModal,
    private ticketService: TicketService,
    public router: Router,
    public print: NgxPrintElementService,
    private departmentService:DepartmentService
  ) {
    this.isProject = this.authAssetService.getisProject();
  }

  ngOnInit(): void {
    if (
      this.quotationObject.quotStatusId == 56 &&
      this.ticketInfo[0].ticketStatusId == 32 &&
      this.ticketService.ticketPageAction == "Basic Quotation Page"
    ) {
      this.viewQuationProcessInvoiceButtons = this.quotationObject
        .isQuotationBilled
        ? false
        : true;
    } else {
      this.viewQuationProcessInvoiceButtons = false;
    }

    console.log("mX_quotationItem::",this.mX_quotationItem);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.quotationObject.quotStatusId == 56 &&
      this.ticketInfo[0].ticketStatusId == 32 &&
      this.ticketService.ticketPageAction == "Basic Quotation Page"
    ) {
      this.viewQuationProcessInvoiceButtons = this.quotationObject
        .isQuotationBilled
        ? false
        : true;
    } else {
      this.viewQuationProcessInvoiceButtons = false;
    }

    this.getDepartmentDetail( this.ticketInfo[0].projectId)
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
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

  getDepartmentDetail(departmentId) {
    this.departmentService.getDepartmentDetail(departmentId).subscribe({
      next: (res: any) => {
        this.departmentDetail = res.data;
        console.log("  this.departmentDetail =",  this.departmentDetail)
      },
    });
  }
  openModalRejectQuotation() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to send this resubmitted quotation for the invoice process? ";
    modalRef.componentInstance.subTitle =
      "Once you proceed, it cannot be reverted back";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          this.resubmitButtonView = false;
          //console.log(" this.resubmitButtonView ", this.resubmitButtonView);
          this.resubmitQuotation.emit(true);
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

  public config: Config = {
    printMode: "template",
    popupProperties:
      "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,fullscreen=yes",
    pageTitle: "",
    templateString: "{{printBody}}",
    stylesheets: [
      {
        rel: "stylesheet",
        href: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
      },
    ],
    styles: [
      "header, footer{ text-align: center; }",
      "body .bg-success{ background-color: #4dcf83 !important; }",
      "body .bg-danger{ background-color: #f96868 !important; }",
    ],
  };

  onPrint2(el: ElementRef<HTMLTableElement | HTMLElement>) {
    this.print.print(el, this.config).subscribe();
  }
  @ViewChild("tableRef") tableElement!: ElementRef<HTMLTableElement>;
}
