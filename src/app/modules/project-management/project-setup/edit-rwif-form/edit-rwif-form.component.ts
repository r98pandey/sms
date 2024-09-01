
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
@Component({
  selector: 'app-edit-rwif-form',
  templateUrl: './edit-rwif-form.component.html',
  styleUrl: './edit-rwif-form.component.scss'
})
export class EditRwifFormComponent implements OnInit, OnChanges {

  @Input() dDetail: any;
  @Output() submitAfterQuotation = new EventEmitter();
  @Output() reSubmitedsubmitQuotation = new EventEmitter();
  @Input() reCreatedQuotation: boolean = false;
  @Input() quotationObject: any = {};
  @Input() mX_quotationItem: any = [];
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
  pasteImageAll: any[] = [];
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
  ) {
    this.isProject = this.authAssetService.getisProject();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.todayDate = new Date();
    console.log("this.dDetail",this.dDetail)
    this.getCompanyDetailsById(this.dDetail.companyId);
    this.getClientDetailsById(this.dDetail.clientId);
    this.getDepartmentDetail(this.dDetail.projectId)

  }

  ngOnInit(): void {
   
   

    this.InvoicesForm = this.formBuilder.group({
      quotTitle: ["", [Validators.required]],
      items: this.formBuilder.array([]),
      remarkControl: ["", [Validators.required]],
      
    });

   
  
  }
  initRows(value: any = null, itemDetails: any = null, assetId: any = null) {
    return this.formBuilder.group({
      itemName: [value, [Validators.required]],
      itemDetails: [itemDetails],
      Yesremark: ['', [Validators.required]],
      Noremark: ['', [Validators.required]],
      remark: ['', [Validators.required]],
     });
  }
  get discountControl() {
    return this.InvoicesForm.get("discount");
  }
  get quotTitle() {
    return this.InvoicesForm.get("quotTitle");
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
          TicketId: this.dDetail.ticketId,
          TicketNo: this.dDetail.ticketNo,
          QuotTitle: invoiceValue.quotTitle,
          AttentionTo: invoiceValue.attenTo,
          CompanyId: this.dDetail.companyId,
          CompanyName: this.dDetail.companyName,
          ClientId: this.dDetail.clientId,
          ClientName: this.dDetail.clientName,
          ProjectId: this.dDetail.projectId,
          ProjectName: this.dDetail.projectName,
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
          TicketId: this.dDetail.ticketId,
          TicketNo: this.dDetail.ticketNo,
          QuotTitle: invoiceValue.quotTitle,
          AttentionTo: invoiceValue.attenTo,
          CompanyId: this.dDetail.companyId,
          CompanyName: this.dDetail.companyName,
          ClientId: this.dDetail.clientId,
          ClientName: this.dDetail.clientName,
          ProjectId: this.dDetail.projectId,
          ProjectName: this.dDetail.projectName,
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


  file: File[] = [];

  onSelect(event: any) {
    // Add the newly selected files without removing existing ones
    this.file.push(...event.addedFiles);

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

  getObjectURL(file: File): any {
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  onRemove(event: any) {
    // Remove the selected file
    let insex: any = this.file.indexOf(event);
    this.file.splice(insex, 1);
    this.base64Strings.splice(insex, 1);

  }

  getImage(event) {
    this.pasteImageAll = [];
    this.pasteImageAll = event
  }

  multplyImageFileTab: any = 1;
  multiplyFileUpdload: File[] = [];
  onSelectFilleMultiply(event) {
    this.multiplyFileUpdload.push(...event.addedFiles);
    console.log("event.addedFiles.", event.addedFiles, this.multiplyFileUpdload[0]);

  }
  onRemoveFilleMultiply(event: any) {
    this.multiplyFileUpdload.splice(event, 1);
  }
  truncateFileName(name: string, getValue: any, startChars: number = 22, endChars: number = 7): string {
    if (!name) return '';

    const totalChars = startChars + endChars;

    if (name.length <= totalChars) {
      // No need to truncate if the total length is less than or equal to the sum of startChars and endChars
      return name;
    }

    const truncatedText =
      name.substring(0, startChars) + '...' + name.substring(name.length - endChars);

    return truncatedText;
  }



}

