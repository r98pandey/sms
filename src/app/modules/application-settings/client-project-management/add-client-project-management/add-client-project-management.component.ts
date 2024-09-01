
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { environment } from "../../../../../environments/environment";
import { ClientService } from "../../../../core/services/client.services";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { DepartmentService } from "src/app/core/services/department.service";

@Component({
  selector: 'app-add-client-project-management',
  templateUrl: './add-client-project-management.component.html',
  styleUrl: './add-client-project-management.component.scss'
})
export class AddClientProjectManagementComponent {
  imageUrl: any;
  addClient!: FormGroup;
  countryList: any;
  addClientDisable: boolean;
  addClientloding: boolean;
  isCompanyPopup: boolean = false;
  companyId: any;
  CompanyListV2: any[] = [];
  clientId: any = null;
  default_clientLogoImg: any;
  clientLogoImg: any;
  label: any = "Client/Prospect";
  servericTypeArray = ["GST", "SST"];
  breadCrumbItems: any = [
    { label: "Client/Prospect" },
    { label: "Add Client/Prospect", active: true },
  ];

  editMode: any = {
    isEdit: false,
  };

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private dropdownService: DropdownService,
    private modalService: NgbModal,
    private service: DepartmentService,
  ) {
    if (!this.clientService.addAccess) {
      this.router.navigate(["/application-settings/pm-client/pm-client-list"]);
    } else {
      this.addClientDisable = true;
      this.addClientloding = false;
      this.imageUrl = environment.apiUrl;

      this.getCountryList();

      this.getV3_GetCompanyListDrobDown_Global();
      // this.getV2_GetCompanyListDrobDown();
    }
  }
  ngOnInit(): void {
  
    if (this.router.url.includes('pm-add-prospect')) {
      console.log("pm-view-prospect",)
      this.label = "Add Prospect ";
      this.breadCrumbItems = [
        { label: "Add Prospect " },
        { label: "Prospect", active: true }
      ];
    } else {
      this.label = "Add Client";
      this.breadCrumbItems = [
        { label: "Client " },
        { label: "Add Client", active: true },
      ];
    }

    this.route.params.subscribe((params) => {
      this.clientId = params["id"];
      if (this.clientId != null) {

        if (this.router.url.includes('pm-edit-prospect')) {
          console.log("pm-view-prospect",)
          this.label = "Edit Prospect";
          this.breadCrumbItems = [
            { label: "Edit Prospect " },
            { label: "Edit Prospect", active: true }
          ];
        } else {
          this.label = "Edit Client";
          this.breadCrumbItems = [
            { label: "Client " },
            { label: "Edit Client", active: true },
          ];
        }

      
        this.editMode.isEdit = true;
        this.getClientDetailById();
      }
    });

    this.getFromBinding();
  }
  getCountryList() {
    this.dropdownService.getCountryList().subscribe((res: any) => {
      this.countryList = res.data;
    });
  }
  getV2_GetCompanyListDrobDown() {
    this.dropdownService
      .Getv3_MaintenanceCompanyDropDownList_Active_ProjectManagement({})
      .subscribe((res: any) => {
        this.CompanyListV2 = res.list;
      });
  }

  //Added by Suresh Rao 22--7-2024
  getV3_GetCompanyListDrobDown_Global() {
    this.dropdownService
      .Getv3_CompanyDropDownList_Global({})
      .subscribe((res: any) => {
        this.CompanyListV2 = res.list;
      });
  }


  get companyName() {
    return this.addClient.get("companyName");
  }
  get code() {
    return this.addClient.get("code");
  }
  get name() {
    return this.addClient.get("name");
  }
  get contactPerson() {
    return this.addClient.get("contactPerson");
  }
  get mobileNo() {
    return this.addClient.get("mobileNo");
  }
  get address1() {
    return this.addClient.get("address1");
  }
  get address2() {
    return this.addClient.get("address2");
  }
  get address3() {
    return this.addClient.get("address3");
  }
  get postalCode() {
    return this.addClient.get("postalCode");
  }
  get country() {
    return this.addClient.get("country");
  }
  get officePhoneNo() {
    return this.addClient.get("officePhoneNo");
  }
  get officeFaxNo() {
    return this.addClient.get("officeFaxNo");
  }
  get serviceTaxType() {
    return this.addClient.get("serviceTaxType");
  }
  get serviceTaxValue() {
    return this.addClient.get("serviceTaxValue");
  }

  onUpperCase(event: any): void {
    const value = event.target.value.toUpperCase();
    this.code.setValue(value, { emitEvent: false });
  }
  addClientDetailsSubmit(e: any) {
    let requestData: any = {
      CompanyId: Number(this.companyName?.value),
      ClientCode: this.code?.value.toUpperCase(),
      ClientName: this.name?.value,
      contactPerson: this.contactPerson?.value,
      mobileNo: this.mobileNo?.value,
      address1: this.address1?.value,
      address2: this.address2?.value,
      address3: this.address3?.value,
      postalCode: this.postalCode?.value,
      country: this.country?.value,
      officePhoneNo: this.officePhoneNo?.value,
      officeFaxNo: this.officeFaxNo?.value,
      ServiceTaxType: this.serviceTaxType.value,
      ServiceTaxValue: this.serviceTaxValue.value,
    };
    let str: any = null;
    if (this.clientId == null) {
      if (
        this.clientLogoImg ===
        "../../../../../assets/images/placeholderimage.png"
      ) {
        str = null;
      } else {
        str = this.clientLogoImg.replace(/^data:image\/[a-z]+;base64,/, "");
      }

      if (str) {
        requestData.ClientImageUrlBase64 = str;
      }
      this.clientService.createClient_Prospect(requestData).subscribe((res: any) => {
        if (res) {
          this.success(res);
          this.addMoreProjectDetails(res.clientId)
        }
      });
    } else {
      requestData.clientId = this.editMode.data.clientId;
      this.clientService.postUpdateClient(requestData).subscribe((res: any) => {
        if (res) {
          this.success(res);
          this.goBack();
        }
      });
    }
  }
  addMoreProjectDetails(currentProjectClientId) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = 'Do you want to add a new project for this client?';

    modalRef.componentInstance.subTitle = "If yes, it will directly navigate to the Add Project page. ";
    modalRef.componentInstance.buttonName = ''
    modalRef.componentInstance.CancelName = "No !";
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.openDirectlyProject(currentProjectClientId);
        } else {
          this.goBack();
        }
      }
    });
  }

  openDirectlyProject(currentProjectClientId) {
    this.service.accessRight = true;
    this.service.currentProjectCompanyId = this.companyName?.value
    this.service.currentProjectClientId = currentProjectClientId
    this.router.navigate(['project-management/project-setup/add-project'])
  }
  addClientDetails(e: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = this.editMode.isEdit ? 'Are you Sure to Update Client' : 'Are you Sure to  Add Client';

    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addClientDetailsSubmit(e);
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

  error(err: any) {
    this.addClientDisable = false;
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  goBack() {
    if (this.router.url.includes('pm-edit-prospect') || this.router.url.includes('pm-add-prospect')) {
      this.router.navigate(["/application-settings/pm-client/pm-prospect-list"]);
    } else {
      this.router.navigate(["/application-settings/pm-client/pm-client-list"]);
    }
  }

  getFromBinding() {
    this.clientLogoImg = this.default_clientLogoImg =
      "../../../../../assets/images/placeholderimage.png";
    this.addClient = this.formBuilder.group({
      companyName: [null, Validators.required],
      code: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(5)],
      ],
      name: ["", Validators.required],
      contactPerson: ["", Validators.required],
      mobileNo: ["", Validators.required],
      address1: ["", Validators.required],
      address2: ["", Validators.required],
      address3: ["", Validators.required],
      postalCode: ["", Validators.required],
      country: [null, Validators.required],
      officePhoneNo: [""],
      officeFaxNo: [""],
      serviceTaxType: [null, Validators.required],
      serviceTaxValue: ["", Validators.required],
    });
  }

  getClientDetailById() {
    this.clientService
      .getClientDetailById(this.clientId)
      .subscribe((res: any) => {
        this.editMode.data = res.data;
        this.addClient.patchValue(res?.data);
        this.addClient.get("code")?.setValue(res?.data.clientCode);
        this.addClient.get("code")?.disable();
        this.addClient.get("name")?.setValue(res?.data.clientName);
        this.addClient.get("companyName")?.setValue(res?.data.companyId);
        this.addClient
          .get("serviceTaxType")
          ?.setValue(res?.data.serviceTaxType);
        this.addClient
          .get("serviceTaxValue")
          ?.setValue(res?.data.serviceTaxValue);

        this.clientLogoImg = res?.data?.clientImageUrl
          ? environment.apiUrl + res?.data?.clientImageUrl
          : "../../../../../assets/images/placeholderimage.png";
      });
  }

  onSelectFile(event: any) {
    if (this.clientId) {
      this.updateImageSelectFile(event);
    } else {
      if (event.target.files && event.target.files[0]) {
        var reader: any = new FileReader();
        reader.onload = (event: any) => {
          this.clientLogoImg = event.target.result;
        };
        reader.onerror = () => {
          this.clientLogoImg = this.default_clientLogoImg;
        };
        let typeOfFile = event.target.files[0].type;
        let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);
        if (con) reader.readAsDataURL(event.target.files[0]);
        else {
          this.clientLogoImg = this.default_clientLogoImg;
        }
      } else {
        this.clientLogoImg = this.default_clientLogoImg;
      }
    }
  }

  updateImageSelectFile(event: any) {
    if (event.target && event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.clientLogoImg = event?.target?.result;
        this.updateImage();
      };
    }
  }
  updateImage() {
    this.clientService
      .UpdateClientLogo({
        ClientId: this.clientId,
        ClientImageUrlBase64: this.clientLogoImg
          ? this.clientLogoImg && this.clientLogoImg.split(",")[1]
          : null,
      })
      .subscribe((res) => {
        this.success(res);
      });
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
        this.clientLogoImg =
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
  onClearImage(event: any) {
    this.clientLogoImg = this.default_clientLogoImg =
      "../../../../../assets/images/placeholderimage.png";

    if (this.clientId) {
      this.updateImage();
    }
  }
}
