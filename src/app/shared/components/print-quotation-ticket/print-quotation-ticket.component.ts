
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
  selector: 'app-print-quotation-ticket',
  templateUrl: './print-quotation-ticket.component.html',
  styleUrl: './print-quotation-ticket.component.scss'
})
export class PrintQuotationTicketComponent implements OnInit, OnChanges {
  quotationObject: any = {};
  mX_quotationItem: any = [];
  @Input() QuotId:any=''
  @Input() ticketInfo: any;
  imgUrl: any = environment.apiUrl;
  isProject: boolean = false;
  departmentDetail: any = {};

  constructor(
    private commonFunctionService: CommonFunctionService,
    // private modalService: NgbModal,
    private authAssetService: AuthAssetService,
    private quotationService: QuotationService,
    private modalService: NgbModal,
    private ticketService: TicketService,
    public router: Router,
    public print: NgxPrintElementService,
    private departmentService: DepartmentService
  ) {
    this.isProject = this.authAssetService.getisProject();
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getDepartmentDetail(this.ticketInfo.projectId);
    this.getV2_MX_QuotationAndItemDetails(this.QuotId)

  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  getDepartmentDetail(departmentId) {
    this.departmentService.getDepartmentDetail(departmentId).subscribe({
      next: (res: any) => {
        this.departmentDetail = res.data;
        console.log("  this.departmentDetail =", this.departmentDetail)
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
        this.mX_quotationItem = res.objList.mX_quotationItem;
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
