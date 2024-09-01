
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
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormArray,
  Validators,
  AbstractControl,
  FormArray,
} from "@angular/forms";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { QuotationService } from "src/app/core/services/quotation.service";
import Swal from "sweetalert2";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { Router } from "@angular/router";
import { DepartmentService } from "src/app/core/services/department.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { ClientService } from "src/app/core/services/client.services";
import { CompanyService } from "src/app/core/services/company.service";
import { environment } from "src/environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
@Component({
  selector: 'app-view-rwif-form',
  templateUrl: './view-rwif-form.component.html',
  styleUrl: './view-rwif-form.component.scss'
})
export class ViewRwifFormComponent implements OnInit, OnChanges {
  @Input() getDataFromSubmitRWIF: any;
  @Input() dDetail: any;
  @Input() projectProcessHeaderDocId: any;
  maxCharsDecision = 300;
  unoAraay = ["CM", "Unit", "box"];
  submitted = false;
  InvoicesForm!: UntypedFormGroup;
  loadingForSubmitBtn: boolean = false;
  paymentSign = "$";
  subtotal = 0;
  taxRate = 0.125;
  shippingRate = 65.0;
  discountRate = 0.0;
  counter = [];
  imgUrl: any = environment.apiUrl;
  isProject: boolean = false;
  companyDetailsObject: any = {
    companyId: 0,
    companyCode: null,
    companyName: null,
    contactPerson: null,
    mobileNo: null,
    address1: null,
    address2: null,
    address3: null,
    postalCode: null,
    country: null,
    officePhoneNo: null,
    officeFaxNo: null,
    companyHead: null,
    companyLogoURL: null,
  };
  clientDetailsObject: any = {
    companyId: 0,
    companyName: null,
    clientId: 0,
    clientCode: null,
    clientName: null,
    contactPerson: null,
    mobileNo: null,
    address1: null,
    address2: null,
    address3: null,
    postalCode: null,
    country: null,
    officePhoneNo: null,
    officeFaxNo: null,
    serviceTaxType: null,
    serviceTaxValue: null,
  };
  todayDate: any;
  maxCharsDecisionTitle = 50;
  departmentDetail: any=[];
  route: any;
  projectProcessMX_ProjectProcessRFWIFormDetail: any;
  mX_ProjectProcessHeaderDoc:any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private companyService: CompanyService,
    private clientService: ClientService,
    private authAssetService: AuthAssetService,
    private quotationService: QuotationService,
    private helpDeskService: HelpDeskService,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
    private sanitizer: DomSanitizer,
    private departmentService: DepartmentService,
    private commonFunctionService: CommonFunctionService,
  ) {
    this.isProject = this.authAssetService.getisProject();
  }
  ngOnChanges(changes: SimpleChanges): void {


    this.todayDate = new Date();
    this.getCompanyDetailsById(this.dDetail.companyId);
    this.getClientDetailsById(this.dDetail.clientId);
    this.getDepartmentDetail(this.dDetail.projectId);
    this.getMX_ProjectProcessMX_ProjectProcessRFWIFormDetail();
  }

  ngOnInit(): void {
   
    this.getCompanyDetailsById(this.dDetail.companyId);
  
  }

  getMX_ProjectProcessMX_ProjectProcessRFWIFormDetail() {
    let payload = {
      ProjectProcessHeaderDocId: this.projectProcessHeaderDocId
    }
    this.departmentService.getMX_ProjectProcessMX_ProjectProcessRFWIFormDetail(payload).subscribe((res: any) => {
      this.projectProcessMX_ProjectProcessRFWIFormDetail = res.obj;
      this.mX_ProjectProcessHeaderDoc = this.projectProcessMX_ProjectProcessRFWIFormDetail.mX_ProjectProcessHeaderDoc;
      console.log("get header data",this.mX_ProjectProcessHeaderDoc);
      console.log("full data::",this.projectProcessMX_ProjectProcessRFWIFormDetail);
    })

  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }


  goBack() {
    this.router.navigate(["/maintenance-management/dashboard/new-ticket-list"]);
  }


  getCompanyDetailsById(companyId: any) {
    let payload = {
      CompanyId: companyId,
    };
    this.companyService.getCompanyDetail(payload).subscribe((res: any) => {
      this.companyDetailsObject = res.data;

      console.log("company ::",this.companyDetailsObject );
    });
  }
  getClientDetailsById(clientId: any) {
    let payload = {
      ClientId: clientId,
    };
    this.clientService.getClientDetailsById(payload).subscribe((res: any) => {
      this.clientDetailsObject = res.data;

      console.log("client::",this.clientDetailsObject);
    });
  }
  getDepartmentDetail(departmentId) {
    this.departmentService.getDepartmentDetail(departmentId).subscribe({
      next: (res: any) => {
        this.departmentDetail = res.data;
      },
    });
  }

 


}


