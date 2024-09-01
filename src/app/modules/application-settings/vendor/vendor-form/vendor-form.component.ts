import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/core/services/register.service';
import { VendorService } from 'src/app/core/services/vendor.service';
import { DropdownService } from 'src/app/shared/Service-common/dropdown.service';
import Swal from 'sweetalert2';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-vendor-form",
  templateUrl: "./vendor-form.component.html",
  styleUrls: ["./vendor-form.component.scss"],
})
export class VendorFormComponent {
  label: any = "Add Vendor";
  breadCrumbItems: any = [
    { label: "Vendor" },
    { label: "Add Vendor", active: true },
  ];
  maxCharsDecision = 300;
  vendorForm: FormGroup;
  countryData: any[] = [];
  companyData: any[] = [];

  editMode: any = {
    isEdit: false,
    data: {},
  };

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private dropdownServices: DropdownService,
    private vendorService: VendorService,
    private router: Router,
    private modalService: NgbModal
  ) {
    if (this.vendorService.accessRight) {
      if (VendorService.selectedVendorId) {
        this.editMode.isEdit = true;
        this.getVendorDetails(VendorService.selectedVendorId);
        this.label = "Edit Vendor";
        this.breadCrumbItems = [
          { label: "Edit" },
          { label: "Edit Vendor", active: true },
        ];
      }
    } else {
      this.goBack();
    }
  }

  ngOnInit() {
    this.buildForm();
    this.getCountryList();
    this.getCompanyList();
  }

  getVendorDetails(id) {
    this.vendorService.getVendorByVendorId(id).subscribe({
      next: (res: any) => {
        this.vendorForm.patchValue({
          ...res.data,
        });
        this.editMode.data = res.data;
        this.vendorForm.controls["companyId"].disable();
      },
    });
  }

  buildForm() {
    this.vendorForm = this.formBuilder.group({
      companyId: [null, Validators.required],
      vendorName: ["", Validators.required],
      contactPersonName: [""],
      contactMobileNo: [""],
      contactEmailId: [""],
      address1: ["", Validators.required],
      address2: ["", Validators.required],
      address3: ["", Validators.required],
      country: [null, Validators.required],
      postalCode: [null, Validators.required],
      officePhoneNo: [""],
      officeFaxNo: [""],
      remark: [""],
    });
  }

  get form() {
    return this.vendorForm.controls;
  }

  getCountryList() {
    //to get the country data
    this.registerService.getCountryList().subscribe(
      (res: any) => {
        this.countryData = res.data;
      },
      (err) => {}
    );
  }

  getCompanyName(companyId) {
    return this.companyData.find((i) => companyId === i.companyId);
  }

  saveVendor() {
    const payload = {
      ...this.vendorForm.getRawValue(),
      companyName: this.getCompanyName(this.vendorForm.getRawValue().companyId)
        .companyName,
      postalCode: String(this.vendorForm.getRawValue().postalCode),
      officePhoneNo: String(this.vendorForm.getRawValue().officePhoneNo),
      officeFaxNo: String(this.vendorForm.getRawValue().officeFaxNo),
      contactMobileNo: String(this.vendorForm.getRawValue().contactMobileNo),
    };

    if (this.editMode.isEdit) {
      payload.vendorId = this.editMode.data.vendorId;
      this.vendorService.postUpdateVendor(payload).subscribe({
        next: (res) => {
          this.success(res);
          this.router.navigate(["/application-settings/vendor/vendor-list"]);
        },
      });
    } else {
      this.vendorService.postVendor(payload).subscribe({
        next: (res) => {
          this.success(res);
          this.router.navigate(["/application-settings/vendor/vendor-list"]);
        },
      });
    }
    //console.log(payload);
  }

  openModalCreateVendor() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = this.editMode.isEdit ? "Are you Sure to update vendor" : "Are you Sure to add vendor" ;
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.saveVendor();
        } 
      }
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

  getCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.companyData = res.list;
    });
  }

  goBack() {
    this.router.navigate(["/application-settings/vendor/vendor-list"]);
  }
}


// {
//   "companyId": 1,
//   "vendorName": "Vendor Name",
//   "contactPersonName": "99928882",
//   "contactMobileNo": "7327837832",
//   "contactEmailId": "praispranav@gmail.com",
//   "address1": "Rampur Parrori",
//   "address2": "Sitamarhi",
//   "address3": "Bihar",
//   "postalCode": "84330",
//   "country": "India",
//   "officePhoneNo": "993478328778",
//   "officeFaxNo": "827384782",
//   "remark": "Remark"
// }