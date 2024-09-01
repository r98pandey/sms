import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CompanyModel,
  ViewCompanyPayloadModel,
} from "src/app/core/models/company.models";
import { CompanyService } from "src/app/core/services/company.service";
import { RegisterService } from "src/app/core/services/register.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

@Component({
  selector: "app-company-form",
  templateUrl: "./company-form.component.html",
  styleUrls: ["./company-form.component.scss"],
})
export class CompanyFormComponent implements OnInit {
  baseUrl: any;
  editMode: any = { isEdit: false, data: {} };
  tags: any;
  addCompany!: UntypedFormGroup;
  submitted = false;
  defaultImageUrl = "../../../../../assets/images/placeholderimage.png"; // Replace with your actual path
  selectedImage: string | ArrayBuffer | null = null;
  default_companyLogoImg: any;
  companyLogoImg: any;
  imageUrl: any;
  countryList: any;
  str: any;
  companyId: any = null;
  payload: CompanyModel = {
    companyId: "",
    companyCode: "",
    companyName: "",
    contactPerson: "",
    mobileNo: "",
    address1: "",
    address2: "",
    address3: "",
    postalCode: "",
    country: "",
    officePhoneNo: "",
    officeFaxNo: "",
    companyHead: "",
    CompanyLogoBase64string: "",
  };

  label: any = "Company";
  breadCrumbItems: any = [
    { label: "Company" },
    { label: "Company Add", active: true },
  ];
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private actvatedroute: ActivatedRoute,
    public dropdownService: DropdownService,
    private modalService: NgbModal
  ) {
    if (!this.companyService.addCompanyAccess) {
      this.router.navigate(["/application-settings/company/company-list"]);
    } else {
      this.imageUrl = environment.apiUrl;
      this.getCountryList();
      this.createForm();
    }
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Company" },
      { label: "Add Company ", active: true },
    ];
    this.actvatedroute.params.subscribe((params) => {
      this.companyId = params["id"];

      if (this.companyId != null) {
        this.editMode.isEdit = true;
        this.breadCrumbItems = [
          { label: "Company" },
          { label: "Edit Company ", active: true },
        ];
        this.getEditData();
      }
    });
  }

  createForm() {
    this.companyLogoImg = this.default_companyLogoImg =
      "../../../../../assets/images/placeholderimage.png";
    this.addCompany = this.formBuilder.group({
      code: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(5)],
      ],
      name: ["", Validators.required],
      contactPersonName: ["", Validators.required],
      contactPersonMobileNo: ["", Validators.required],
      address1: ["", Validators.required],
      address2: ["", Validators.required],
      address3: ["", Validators.required],
      postalCode: ["", Validators.required],
      country: [null, Validators.required],
      mobileNumber: ["", Validators.required],
      faxNumber: [""],
      companyHead: ["", Validators.required],
    });
  }

  get code() {
    return this.addCompany.get("code");
  }
  get name() {
    return this.addCompany.get("name");
  }
  get contactPersonName() {
    return this.addCompany.get("contactPersonName");
  }
  get contactPersonMobileNo() {
    return this.addCompany.get("contactPersonMobileNo");
  }
  get address1() {
    return this.addCompany.get("address1");
  }
  get address2() {
    return this.addCompany.get("address2");
  }
  get address3() {
    return this.addCompany.get("address3");
  }
  get postalCode() {
    return this.addCompany.get("postalCode");
  }
  get country() {
    return this.addCompany.get("country");
  }
  get mobileNumber() {
    return this.addCompany.get("mobileNumber");
  }
  get faxNumber() {
    return this.addCompany.get("faxNumber");
  }
  get companyHead() {
    return this.addCompany.get("companyHead");
  }

  getCountryList() {
    this.dropdownService.getCountryList().subscribe((res: any) => {
      this.countryList = res.data;
    });
  }
  onUpperCase(event: any): void {
    const value = event.target.value.toUpperCase();
    this.code.setValue(value, { emitEvent: false });
  }
  saveForm() {
    if (
      this.companyLogoImg ===
      "../../../../../assets/images/placeholderimage.png"
    ) {
      this.str = null;
    } else {
      this.str = this.companyLogoImg.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    //console.log(" this.str", this.str);

    if (this.str) {
      this.payload.CompanyLogoBase64string = this.str;
    }
    this.payload.companyCode = this.code?.value;
    this.payload.companyName = this.name?.value;
    this.payload.contactPerson = this.contactPersonName?.value;
    this.payload.mobileNo = this.contactPersonMobileNo?.value;
    this.payload.address1 = this.address1?.value;
    this.payload.address2 = this.address2?.value;
    this.payload.address3 = this.address3?.value;
    this.payload.postalCode = this.postalCode?.value;
    this.payload.country = this.country?.value;
    this.payload.officePhoneNo = this.mobileNumber?.value;
    this.payload.officeFaxNo = this.faxNumber?.value;
    this.payload.companyHead = this.companyHead?.value;

    if (this.companyId) {
      this.payload.companyId = this.companyId;
      delete this.payload.CompanyLogoBase64string;
      this.companyService
        .updateCompany(this.clean(this.payload))
        .subscribe((res: any) => {
          if (res) {
            this.success(res);
            this.goBack();
          }
        });
    } else {
      this.companyService
        .postCompany(this.clean(this.payload))
        .subscribe((res: any) => {
          if (res) {
            this.success(res);
            this.goBack();
          }
        });
    }
  }

  openModalCreateMyCompany() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =  this.editMode.isEdit ? 'Are you Sure to Update Company' : 'Are you Sure to  Add Company';
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.saveForm();
        } else {
          this.goBack();
        }
      }
    });
  }

  goBack() {
    this.router.navigate(["/application-settings/company/company-list"]);
  }
  onSelectFile(event: any) {
    if (this.companyId) {
      this.updateImageSelectFile(event);
    } else {
      if (event.target.files && event.target.files[0]) {
        var reader: any = new FileReader();
        reader.onload = (event: any) => {
          this.companyLogoImg = event.target.result;
        };
        reader.onerror = () => {
          this.companyLogoImg = this.default_companyLogoImg;
        };
        let typeOfFile = event.target.files[0].type;
        let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);
        if (con) reader.readAsDataURL(event.target.files[0]);
        else {
          this.companyLogoImg = this.default_companyLogoImg;
        }
      } else {
        this.companyLogoImg = this.default_companyLogoImg;
      }
    }
  }

  onClearImage(event: any) {
    this.companyLogoImg = this.default_companyLogoImg =
      "../../../../../assets/images/placeholderimage.png";

    if (this.companyId) {
      this.updateImage();
    }
  }
  getBackgroundImage() {
    return this.selectedImage
      ? `url(${this.selectedImage})`
      : `url(${this.defaultImageUrl})`;
  }

  getEditData() {
    let payload: any = {};
    payload.companyId = Number(this.companyId);
    this.companyService.getCompanyDetail(payload).subscribe((res: any) => {
      this.code?.setValue(res?.data?.companyCode);
      this.name?.setValue(res?.data?.companyName);
      this.contactPersonName?.setValue(res?.data?.contactPerson);
      this.contactPersonMobileNo?.setValue(res?.data?.mobileNo);
      this.contactPersonMobileNo?.setValue(res?.data?.mobileNo);
      this.address1?.setValue(res?.data?.address1);
      this.address2?.setValue(res?.data?.address2);
      this.address3?.setValue(res?.data?.address3);
      this.postalCode?.setValue(res?.data?.postalCode);
      this.country?.setValue(res?.data?.country);
      this.mobileNumber?.setValue(res?.data?.mobileNo);
      this.faxNumber?.setValue(res?.data?.officeFaxNo);
      this.companyHead?.setValue(res?.data?.companyHead);
      this.companyLogoImg = res?.data?.companyLogoURL
        ? environment.apiUrl + res?.data?.companyLogoURL
        : "../../../../../assets/images/placeholderimage.png";
      this.code.disable();
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
  error(err: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  updateImageSelectFile(event: any) {
    if (event.target && event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.companyLogoImg = event?.target?.result;
        this.updateImage();
      };
    }
  }
  updateImage() {
    this.companyService
      .updateCompanyLogo({
        companyId: this.companyId,
        companyLogoBase64string: this.companyLogoImg
          ? this.companyLogoImg && this.companyLogoImg.split(",")[1]
          : null,
      })
      .subscribe((res) => {
        this.success(res);
      });
  }

  clean(obj: any) {
    for (var propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === ""
      ) {
        delete obj[propName];
      }
    }
    return obj;
  }

  openModalDeleteConf(urk) {
    if (this.editMode.isEdit) {
      const modalRef = this.modalService.open(DeleteModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title =
        "You are about to delete a Profile Image?";
      modalRef.componentInstance.subTitle =
        "Deleting your Profile Image will remove for the database";

      modalRef.result.then((result) => {
        if (result) {
          if (result == "delete") {
            this.onClearImage(urk);
          }
        }
      });
    } else {
      if (urk) {
        this.resetFileInput();
        this.companyLogoImg =
          "../../../../../assets/images/placeholderimage.png";
      }
    }
  }

  resetFileInput() {
    const fileInput: any = document.getElementById("profile-img-file-input");
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }
}
