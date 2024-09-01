import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SpareService } from "src/app/core/services/spare.service";
import Swal from "sweetalert2";
import { DropdownService } from "../../../../shared/Service-common/dropdown.service";
import { environment } from "../../../../../environments/environment.prod";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-form-spare",
  templateUrl: "./form-spare.component.html",
  styleUrls: ["./form-spare.component.scss"],
})
export class FormSpareComponent implements OnInit, OnChanges {
  @Output() loadList = new EventEmitter();
  @Input() AddEditShowHide: boolean = false;
  @Input() editSparepartObject: any;
  editSpareLoading:boolean=false;
  addSpareLoading:boolean=false;
  backgroud_img: string;
  addEditSpareForm: FormGroup;
  addEditSpareFormloding: boolean;
  arrayListDropDownCompany: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownCategoryIdValue: any;
  subCategoryList: any;
  categoryList: any;
  isFirstImageVisible: boolean = false;
  selectedDropDownSubCategoryIdValue: any;
  arrayListDropDownSubCategoryList: any[] = [];
  arrayListDropDownCategoryList: any[];
  isSecondImageVisible: boolean = false;
  imageUrl = environment.apiUrl;
  backgroud_img1: any;
  constructor(
    private formBuilder: FormBuilder,
    private spareService: SpareService,
    private router: Router,
    private modal: NgbModal,
    private dropdownServices: DropdownService,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.getAddFromBinding();
    this.getDropdownCompanyList();
    if (this.editSparepartObject) {
      this.getPatchFromBindig(this.editSparepartObject);
    }
  }

  ngOnInit(): void {
    this.getAddFromBinding();
    this.getDropdownCompanyList();
    if (this.editSparepartObject) {
      this.getPatchFromBindig(this.editSparepartObject);
    }
  }
  getPatchFromBindig(data: any) {
    if (data.sparePartImageURL) {
      this.isSecondImageVisible = true;
      this.backgroud_img1 = this.imageUrl + data.sparePartImageURL;
    } else {
      this.isSecondImageVisible = false;
      this.backgroud_img1 = "../../../../../assets/images/placeholderimage.png";
    }
    this.selectedDropDownCompanyIdValue = data.companyId;
    this.selectedDropDownCategoryIdValue = data.categoryID;
    this.selectedDropDownSubCategoryIdValue = data.subCategoryID;
    this.getDropdownCategoryList();
    this.getDropdownSubCategoryList();
    // const dateString = data.warrentyExpDate;
    // const parts = dateString.split("-");
    // const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const dateParts = data?.warrentyExpDate.split("-");

    if (dateParts.length === 3) {
      // Assuming the format is DD-MM-YYYY
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-based (0 = January, 1 = February, etc.)
      const year = parseInt(dateParts[2], 10);

      const warrentyExp = new Date(year, month, day);

      //console.log("fsart", data, new Date(data?.warrentyExpDate));
      // Set the parsed date to the form control

      this.addEditSpareForm.patchValue({
        SparePartName: data.sparePartName,
        PartNumber: data.partNumber ? data.partNumber : "NA",
        Modal: data.modal ? data.modal : "NA",
        Specification: data.specification,
        WarrentyDuration: data.warrentyDuration ? data.warrentyDuration : "12",
        WarrentyExpDate: warrentyExp,
        companyId: data.companyId,
        Category: data.categoryID,
        subCategory: data.subCategoryID,
      });
    }
  }
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList_Active_AssetManagement({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
    });
  }
  onDropdownCompanyValueChange($event) {
    this.selectedDropDownCategoryIdValue = null;
    this.selectedDropDownSubCategoryIdValue = null;
    this.arrayListDropDownSubCategoryList = [];
    this.arrayListDropDownCategoryList = [];
    if(this.selectedDropDownCompanyIdValue){
      this.getDropdownCategoryList();
    }
    this.getDropdownCategoryList();
  }
  onDropdownCategoryValueChange($event) {
    this.selectedDropDownSubCategoryIdValue = null;
    this.getDropdownSubCategoryList();
  }
  onDropdownSubCategoryValueChange($event) {}

  getDropdownCategoryList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .GetCategoryListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownCategoryList = res.list;
      });
  }
  getDropdownSubCategoryList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchCategoryId: this.selectedDropDownCategoryIdValue,
    };
    this.dropdownServices
      .GetSubCategoryListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownSubCategoryList = res.list;
      });
  }
  getAddFromBinding() {
    this.backgroud_img = "../../../../../assets/images/placeholderimage.png";
    this.addEditSpareForm = this.formBuilder.group({
      companyId: [null, [Validators.required]],
      Category: [null, [Validators.required]],
      subCategory: [null, [Validators.required]],
      SparePartName: ["", [Validators.required]],
      PartNumber: ["NA", Validators.required],
      Modal: ["NA", Validators.required],
      Specification: ["NA", Validators.required],
      WarrentyDuration: ["12", Validators.required],
      WarrentyExpDate: ["", Validators.required],
      SparePartImageBase64: [""],
    });
  }
  get SparePartName() {
    return this.addEditSpareForm.get("SparePartName");
  }
  get companyId() {
    return this.addEditSpareForm.get("companyId");
  }
  get PartNumber() {
    return this.addEditSpareForm.get("PartNumber");
  }
  get Modal() {
    return this.addEditSpareForm.get("Modal");
  }
  get Specification() {
    return this.addEditSpareForm.get("Specification");
  }
  get WarrentyDuration() {
    return this.addEditSpareForm.get("WarrentyDuration");
  }
  get WarrentyExpDate() {
    return this.addEditSpareForm.get("WarrentyExpDate");
  }
  get SparePartImageBase64() {
    return this.addEditSpareForm.get("SparePartImageBase64");
  }
  get Category() {
    return this.addEditSpareForm.get("Category");
  }
  get subCategory() {
    return this.addEditSpareForm.get("subCategory");
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        this.backgroud_img = event.target.result;
        this.isFirstImageVisible = true;
      };
      reader.onerror = () => {
        this.backgroud_img =
          "../../../../../assets/images/placeholderimage.png";
        this.SparePartImageBase64.setValue("");
        this.isFirstImageVisible = false;
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con) {
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        this.isFirstImageVisible = true;
      } else {
        this.backgroud_img =
          "../../../../../assets/images/placeholderimage.png";
        this.SparePartImageBase64.setValue("");
        this.isFirstImageVisible = false;
      }
    } else {
      this.backgroud_img = "../../../../../assets/images/placeholderimage.png";
      this.SparePartImageBase64.setValue("");
      this.isFirstImageVisible = false;
    }
  }

  addSparePart() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Spare Part";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addSparePartSuccessModal();
        } else {
          //this.onBack();
        }
      }
    });
  }

  addSparePartSuccessModal() {
    if (!this.addEditSpareForm.valid) {
      this.Error("Please fill the mandatory fields");
      return;
    } else {
      this.addSpareLoading=true
      let formData = this.addEditSpareForm.value;
      let newStr: any;
      if (
        this.backgroud_img ==
        "../../../../../assets/images/placeholderimage.png"
      ) {
        newStr = null;
      } else {
        newStr = this.backgroud_img.replace(/^data:image\/[a-z]+;base64,/, "");
      }
      let requestData = {
        SparePartName: formData?.SparePartName,
        PartNumber: formData?.PartNumber,
        Modal: formData?.Modal,
        Specification: formData?.Specification,
        WarrentyDuration: formData?.WarrentyDuration,
        WarrentyExpDate: this.dateFormatter(formData?.WarrentyExpDate),
        CategoryID: formData?.Category,
        SubCategoryID: formData?.subCategory,
        SparePartImageBase64: newStr,
        CompanyId: formData.companyId,
      };
      this.saveSpare(requestData);
    }
  }

  editSparePartModal() { 
    if (!this.addEditSpareForm.valid) {
      this.Error("Please fill the mandatory fields");
      return;
    } else {
      let formData = this.addEditSpareForm.value;
      let requestData = {
        SparePartName: formData?.SparePartName,
        PartNumber: formData?.PartNumber,
        Modal: formData?.Modal,
        Specification: formData?.Specification,
        WarrentyDuration: formData?.WarrentyDuration,
        WarrentyExpDate: this.dateFormatter(formData?.WarrentyExpDate),
        CategoryID: formData?.Category,
        SubCategoryID: formData?.subCategory,
        CompanyId: formData.companyId,
        AssetSparePartId: this.editSparepartObject.assetSparePartId,
      };
      this.editSpareLoading=true;
      this.updateSpare(requestData);
    }
  }

  editSparePart() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Update Spare Part?";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.editSparePartModal();
        } else {
          //this.onBack();
        }
      }
    });
  }

  saveSpare(requestData) {
    this.addSpareLoading=true
    
    this.spareService.addSpare(requestData).subscribe(
      (res: any) => {
        this.addSpareLoading=false
    
        this.addEditSpareFormloding = false;
        this.Success(res);
        this.addEditSpareForm.reset();
        this.loadList.emit({ status: "spareAdd" });
        this.modal.dismissAll();
        location.reload();
      },
      (err) => {
        this.addEditSpareFormloding = false;
        this.addSpareLoading=false
        this.Error(err);
      }
    );
  }
  updateSpare(requestData) {
    this.editSpareLoading = true;
    this.spareService.postUpdatespare(requestData).subscribe(
      (res: any) => {
        this.editSpareLoading = false;
        this.Success(res);
        this.addEditSpareForm.reset();
        this.editSparepartObject = null;
        this.loadList.emit({ status: "spareAdd" });
        this.modal.dismissAll();
      },
      (err) => {
        this.editSpareLoading = false;
        this.Error(err);
      }
    );
  }

  Success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  Error(err) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 2000,
    });
  }
  close() {
    this.editSparepartObject = null;
    this.modal.dismissAll();
  }
  closeEdit() {
    this.loadList.emit({ status: "spareAdd" });
    this.addEditSpareForm.reset();
    this.modal.dismissAll();
  }
  crossFirstImage(url) {
    if (url) {
      this.backgroud_img = "../../../../../assets/images/placeholderimage.png";
      this.isFirstImageVisible = false;
      this.resetFileInput("company-logo-input");
    }
  }
  crossSecondImage(url) {
    if (url) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        //confirmButtonColor: '#727CF5',
        cancelButtonColor: "#FF3366",
        confirmButtonText:
          "<span class='swal2-confirm '> Yes, remove it!</span>",
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveImage("delete");
          this.backgroud_img1 =
            "../../../../../../assets/images/placeholderimage.png";
          this.isSecondImageVisible = false;
          this.resetFileInput("company-logo-input");
        }
      });
    }
  }
  onSelectFileEdit(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.backgroud_img1 = event.target.result;
        this.saveImage("update");
      };
    }
  }
  saveImage(type: any) {
    this.spareService
      .UpdateSparePartImageProfile({
        assetSparePartId: this.editSparepartObject.assetSparePartId,
        SparePartImageBase64:
          this.backgroud_img1 !==
          "../../../../../assets/images/placeholderimage.png"
            ? this.backgroud_img1.split(",")[1]
            : null,
      })
      .subscribe(
        (res): void => {
          this.Success(res);
          if (type == "update") this.isSecondImageVisible = true;
          else this.isSecondImageVisible = false;
        },
        (err) => {
          //console.log("error", err);
          this.Error(err);
        }
      );
  }

  dateFormatter(date) {
    const newDate = moment(date).format("YYYY-MM-DD");
    if (newDate === "1970-01-01") return null;
    else return newDate;
  }
  resetFileInput(id) {
    const fileInput: any = document.getElementById(id);
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }
}
