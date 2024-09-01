import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { CompanyService } from "../../../../../core/services/company.service";
import { ClientService } from "../../../../../core/services/client.services";
import { environment } from "../../../../../../environments/environment.prod";
import { AuthAssetService } from "../../../../../core/services/auth-asset.service";
import * as moment from "moment";
import { QuotationService } from "src/app/core/services/quotation.service";
import Swal from "sweetalert2";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { Router } from "@angular/router";
import { DropdownService } from '../../../../../shared/Service-common/dropdown.service';
import { DepartmentService } from "src/app/core/services/department.service";

@Component({
  selector: "app-add-quotation",
  templateUrl: "./add-quotation.component.html",
  styleUrls: ["./add-quotation.component.scss"],
})
export class AddQuotationComponent implements OnInit {
  @Input() ticketInfo: any;
  @Output() submitAfterQuotation = new EventEmitter();
  @Output() reSubmitedsubmitQuotation = new EventEmitter();
  @Input() reCreatedQuotation: boolean = false;
  @Input() quotationObject: any = {};
  @Input() mX_quotationItem: any = [];
  maxCharItemDesp:number=250;
  maxCharItemtitle:number=100;
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
  maxCharsDecisionTitle = 50;  maxCharsAttenToTitle = 100;
  departmentDetail: any=[];
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

    private departmentService: DepartmentService,
  ) {
    this.isProject = this.authAssetService.getisProject();
  }

  ngOnInit(): void {
   
    this.todayDate = new Date();
    this.getCompanyDetailsById(this.ticketInfo.companyId);
    this.getClientDetailsById(this.ticketInfo.clientId);
    this.getDepartmentDetail(this.ticketInfo.projectId)


    this.InvoicesForm = this.formBuilder.group({
      quotTitle: ["", [Validators.required]],
      attenTo: ["", [Validators.required]],
      totalPrice: [0, [Validators.required]],
      discount: [
        0.0,
        [Validators.min(0), Validators.max(99), Validators.required],
      ],
      items: this.formBuilder.array([]),
      remarkControl: ["", [Validators.required]],
      gSTPrice: ["", [Validators.required]],
      subTotal: ["", [Validators.required]],
      discountPrice: ["", [Validators.required]],
    });

    this.InvoicesForm.controls["items"]["controls"].forEach((ele, index) => {
      this.counter[index] = 0;
    });

    if (Object.keys(this.quotationObject).length != 0) {
      this.InvoicesForm.get("quotTitle").setValue(
        this.quotationObject.quotTitle
      );
      this.InvoicesForm.get("attenTo").setValue(
        this.quotationObject.attentionTo
      );
      this.InvoicesForm.get("remarkControl").setValue(
        this.quotationObject.remark
      );
    }
    if (this.mX_quotationItem?.length != 0) {
      this.mX_quotationItem.forEach((element, index) => {
        if (element) {
          this.addItem(
            index,
            element.itemName,
            element.itemDetail,
            element.assetId
          );
        }
      });
    }
  }
  initRows(value: any = null, itemDetails: any = null, assetId: any = null) {
    return this.formBuilder.group({
      itemName: [value? value:'', [Validators.required]],
      itemDetails: [itemDetails?itemDetails:''],
      rate: [0, [Validators.required]],
      counterValue: [0, [Validators.required]],
      amount: [0, [Validators.required]],
      unoSeleted: [null, [Validators.required]],
      assetId: [assetId],
    });
  }
  get discountControl() {
    return this.InvoicesForm.get("discount");
  }
  get quotTitle() {
    return this.InvoicesForm.get("quotTitle");
  }  get attenTo() {
    return this.InvoicesForm.get("attenTo");
  }
  get itemsValueControl(): FormArray {
    return this.InvoicesForm.get("items") as FormArray;
  }

  /**
   * Form data get
   */
  get form() {
    return this.InvoicesForm.controls;
  }

  /**
   * Save user
   */
  saveUser() {
    this.submitted = true;
  }

  otherPayment(event: any) {
    this.paymentSign = event.target.value;
  }
  // Default

  increment(i) {
    this.counter[i]++;
    this.itemsValueControl.at(i).get("counterValue").setValue(this.counter[i]);
    this.updateQuantity(i);
  }
  decrement(i) {
    this.counter[i]--;
    if (this.counter[i] < 0) {
      this.counter[i] = 0;
    }
    this.itemsValueControl.at(i).get("counterValue").setValue(this.counter[i]);
    this.updateQuantity(i);
  }

  updateQuantity(index: any) {
    this.itemsValueControl.at(index).get("rate").value;
    this.recalculateCart(index);
  }
  totalAmountCalu: number = 0;
  recalculateCart(index: any) {
    const quantity = this.itemsValueControl.at(index).get("counterValue").value;
    const rate = this.itemsValueControl.at(index).get("rate").value;
    const amount = quantity * rate;
    this.itemsValueControl.at(index).get("amount").setValue(amount);
    const subTotal = this.InvoicesForm.get("items").value.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    this.InvoicesForm.get("subTotal").setValue(subTotal);

    const discount = (subTotal * this.discountRate) / 100;
    let sstssgtValue = 0;
    sstssgtValue = Number(this.clientDetailsObject.serviceTaxValue) / 100;
    let sst = 0;
    sst = subTotal * sstssgtValue;
    const totalAmount = subTotal - discount + sst;
    //console.log(totalAmount, "totalAmount");
    // Update the form controls with the calculated values
    this.InvoicesForm.get("subTotal").setValue(subTotal.toFixed(2));
    this.InvoicesForm.get("discountPrice").setValue(discount.toFixed(2));
    this.InvoicesForm.get("gSTPrice").setValue(sst.toFixed(2));
    this.InvoicesForm.get("totalPrice").setValue(totalAmount.toFixed(2));
  }

  calculateDiscount() {
    const discountRate = this.InvoicesForm.get("discount").value / 100;
    const discount = this.InvoicesForm.get("subTotal").value * discountRate;
    this.InvoicesForm.get("discountPrice").setValue(discount.toFixed(2));
    this.InvoicesForm.get("items").value.forEach((element, index) => {
      this.recalculateCart(index);
    });
  }

  // Add Item
  addItem(
    i,
    value: any = null,
    itemDetails: any = null,
    assetId: any = null
  ): void {
    this.formArr.push(this.initRows(value, itemDetails, assetId));
    this.counter[i] = 0;
  }

  get formArr() {
    return this.InvoicesForm.get("items") as FormArray;
  }

  // Remove Item
  removeItem(index: any) {
    (this.selectedAssetList || []).forEach((object: any, index: any) => {
      this.formArr.value.forEach((element: any) => {
        //console.log(object.id, element.assetId, object);
        if (object.id == element.assetId) {
          const indexOfElement = this.selectedAssetList.findIndex(
            (el) => el.id === object.id
          );
          if (indexOfElement !== -1) {
            this.selectedAssetList.splice(indexOfElement, 1);
          }
        }
      });
    });

    (this.InvoicesForm.get("items") as UntypedFormArray).removeAt(index);
    this.InvoicesForm.get("items").value.forEach((element, index) => {
      this.recalculateCart(index);
    });
    this.counter.splice(index, 1);
  }

  openAssetModal(content: any) {
    this.offcanvasService
      .open(content, {
        scroll: true,
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvas2",
      })
      .result.then(
        (result) => {
          this.maketheData();
        },
        (reason) => {
          this.maketheData();
        }
      );
  }

  goBack() {
    this.router.navigate(["/maintenance-management/dashboard/new-ticket-list"]);
  }
  selectedAssetList: any;
  mainSelectedAssetList: any = [];

  allSelectedAssets = [];
  getAllselectAsset(event) {
    let assetArray = [];

    this.selectedAssetList = event;
    const uniqueMap = new Map(
      this.selectedAssetList.map((obj) => [obj.id, obj])
    );
    this.selectedAssetList = Array.from(uniqueMap.values());
    this.allSelectedAssets;

    this.allSelectedAssets = this.selectedAssetList;
  }

  maketheData() {
    //console.log("hdhdgdgh");

    this.InvoicesForm.get("items").value.forEach((item, index) => {
      const isItemExists = this.selectedAssetList.find(
        (i) => i.id === item.assetId
      );
      if (isItemExists) {
      } else if (item.assetId) {
        (this.InvoicesForm.get("items") as UntypedFormArray).removeAt(index);
      }
    });

    this.selectedAssetList = (this.selectedAssetList || []).filter(
      (element) => {
        return !this.formArr.value.some(
          (element1) => element.id === element1.assetId
        );
      }
    );

    this.selectedAssetList.forEach((element: any) => {
      let assetId = element.id;
      let value = element.assetTagId + "(" + element.assetName + ")";
      if (value)
        this.addItem(
          this.InvoicesForm.get("items").value.length,
          value,
          "",
          assetId
        );
    });

    const formValue = this.InvoicesForm.get("items").value;
    //console.log("FormValue", formValue);

    this.selectedAssetList = this.allSelectedAssets;
  }
  getCompanyDetailsById(companyId: any) {
    let payload = {
      CompanyId: companyId,
    };
    this.companyService.getCompanyDetail(payload).subscribe((res: any) => {
      this.companyDetailsObject = res.data;
    });
  }
  getClientDetailsById(clientId: any) {
    let payload = {
      ClientId: clientId,
    };
    this.clientService.getClientDetailsById(payload).subscribe((res: any) => {
      this.clientDetailsObject = res.data;
    });
  }
  getDepartmentDetail(departmentId) {
    this.departmentService.getDepartmentDetail(departmentId).subscribe({
      next: (res: any) => {
        this.departmentDetail = res.data;
      },
    });
  }

  dateFormatter(date) {
    const newDate = moment(date).format("YYYY-MM-DD");
    if (newDate === "1970-01-01") return null;
    else return newDate;
  }

  submitQuotation() {
    this.loadingForSubmitBtn = true;
    if (this.reCreatedQuotation) {
      let invoiceValue = this.InvoicesForm.getRawValue();
      //console.log("invoiceValue", invoiceValue);
      let mX_quotationItem = [];
      this.InvoicesForm.value.items.forEach((element) => {
        mX_quotationItem.push({
          ItemName: element.itemName,
          ItemDetail: element.itemDetails,
          AssetId: element.assetId,
          UnitPrice: element.rate,
          UnitTotalPrice: Number(element.amount),
          Qty: element.counterValue,
          UOM: element.unoSeleted,
        });
      });

      let payload: any = {
        mX_Quotation: {
          TicketId: this.ticketInfo.ticketId,
          TicketNo: this.ticketInfo.ticketNo,
          QuotTitle: invoiceValue.quotTitle,
          AttentionTo: invoiceValue.attenTo,
          CompanyId: this.ticketInfo.companyId,
          CompanyName: this.ticketInfo.companyName,
          ClientId: this.ticketInfo.clientId,
          ClientName: this.ticketInfo.clientName,
          ProjectId: this.ticketInfo.projectId,
          ProjectName: this.ticketInfo.projectName,
          TotalPrice: invoiceValue.totalPrice,
          GSTPrice: invoiceValue.gSTPrice,
          // TaxPrice: invoiceValue.taxPrice,
          DiscountPrice: invoiceValue.discountPrice,
          DiscountRate: invoiceValue.discount,
          SubTotal: invoiceValue.subTotal,
          Remark: invoiceValue.remarkControl,
          ServiceTaxType: this.clientDetailsObject.serviceTaxType,
        },
        mX_quotationItem: mX_quotationItem,
      };
      //console.log("payload", payload);
      this.quotationService
        .genererateV2_QuotationResubmit(payload)
        .subscribe((res) => {
          this.loadingForSubmitBtn = false;
          this.reSubmitedsubmitQuotation.emit(res);
        });
    } else {
      let invoiceValue = this.InvoicesForm.getRawValue();
      //console.log("invoiceValue", invoiceValue);
      let mX_quotationItem = [];
      this.InvoicesForm.value.items.forEach((element) => {
        mX_quotationItem.push({
          ItemName: element.itemName,
          ItemDetail: element.itemDetails,
          AssetId: element.assetId,
          UnitPrice: element.rate,
          UnitTotalPrice: Number(element.amount),
          Qty: element.counterValue,
          UOM: element.unoSeleted,
        });
      });

      let payload: any = {
        mX_Quotation: {
          TicketId: this.ticketInfo.ticketId,
          TicketNo: this.ticketInfo.ticketNo,
          QuotTitle: invoiceValue.quotTitle,
          AttentionTo: invoiceValue.attenTo,
          CompanyId: this.ticketInfo.companyId,
          CompanyName: this.ticketInfo.companyName,
          ClientId: this.ticketInfo.clientId,
          ClientName: this.ticketInfo.clientName,
          ProjectId: this.ticketInfo.projectId,
          ProjectName: this.ticketInfo.projectName,
          TotalPrice: invoiceValue.totalPrice,
          GSTPrice: invoiceValue.gSTPrice,
          // TaxPrice: invoiceValue.taxPrice,

          Remark: invoiceValue.remarkControl,
          ServiceTaxType: this.clientDetailsObject.serviceTaxType,
          DiscountPrice: invoiceValue.discountPrice,
          DiscountRate: invoiceValue.discount,
          SubTotal: invoiceValue.subTotal,
        },
        mX_quotationItem: mX_quotationItem,
      };
      this.quotationService.genererateV2_Quotation(payload).subscribe((res) => {
        this.loadingForSubmitBtn = false;
        this.submitAfterQuotation.emit(res);
      });
    }
  }

  get items(): FormArray {
    return this.InvoicesForm.get('items') as FormArray;
  }
}
