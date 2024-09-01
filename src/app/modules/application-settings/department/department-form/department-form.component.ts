import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { CompanyService } from "src/app/core/services/company.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import Swal from "sweetalert2";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-department-form",
  templateUrl: "./department-form.component.html",
  styleUrls: ["./department-form.component.scss"],
})
export class DeparmentFormComponent implements OnInit {
  departmentProjectLabel: string = "";

  editMode: any = {
    isEdit: false,
    selectedId: 0,
  };

  addDepartmentForm!: FormGroup;
  addDepartmentFormDisable!: boolean;
  addDepartmentFormloding!: boolean;
  isProject: any;

  companyList: any = {};
  companyData: [] = [];

  loading: any = {
    company: false,
    client: false,
  };

  _globalCompanyId: any;
  clientData: any[] = [];
  clientObj: any;
  OnSiteDescList = ["Hour", "Day", "Week", "Month", "Year"];
  departmentId: any;
  submitted!: boolean;
  active = 1;

  label = "Department";

  breadCrumbItems = [
    { label: "Department" },
    { label: `Add Department`, active: true },
  ];
  successMessageVisible;
  countryAndCurrencyList: any = [];
  selectedCurrency: any = null;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private departmentService: DepartmentService,
    private dropdownService: DropdownService,
    private commonService: CommonFunctionService,
    private actvatedroute: ActivatedRoute,
    private authService: AuthAssetService,
    private modalService: NgbModal,  
  ) {
    this.addDepartmentFormDisable = true;
    this.addDepartmentFormloding = false;
    if (this.departmentService.accessRight == true) {
      if (DepartmentService.editDepartmentId > 0) {
        this.editMode.isEdit = true;
        this.editMode.selectedId = DepartmentService.editDepartmentId;
        this.getDepartmentData(this.editMode.selectedId);
      }
      
    } else {
      this.goBack();
    }
  }

  ngOnInit(): void {
    this.isProject = this.authService.getisProject();
    this.departmentProjectLabel = this.isProject ? "Project" : "Department";
    this.getCountryList();
    this.getCompanydetails();
    this.getfromBinding();

    this.label = this.isProject ? "Project" : "Department";

    this.breadCrumbItems = [
      { label: this.isProject ? "Project" : "Department" },
      {
        label: `${this.editMode.isEdit ? "Edit" : "Add"} ${
          this.isProject ? "Project" : "Department"
        }`,
        active: true,
      },
    ];
    // if (this.isProject) {
    //   this.getClient();
    // }
    // this.actvatedroute.params.subscribe((params) => {
    //   this.departmentId = params["id"];
    //   if (this.departmentId != null) {

    //   }
    // });
  }

  getDepartmentData(departmentId: number) {
    this.departmentService
      .getDepartmentDetail(departmentId)
      .subscribe((res: any) => {
        const data = res.data;
        this.addDepartmentForm.patchValue(data);

        if (this.editMode.isEdit) {
          this.getClient(data.companyId);
        }
        this.selectedCurrency = data.currencyCode;
        this.addDepartmentForm.get("RespondSLA")?.setValue(data.respondSLA);
        this.addDepartmentForm
          .get("RespondSLADurationDesc")
          ?.setValue(data.respondSLADurationDesc);

        this.addDepartmentForm.get("OnSiteSLA")?.setValue(data.onSiteSLA);
        this.addDepartmentForm
          .get("OnSiteSLADurationDesc")
          ?.setValue(data.onSiteSLADurationDesc);

        this.addDepartmentForm
          .get("exepectedComplitionSLADurationDesc")
          ?.setValue(data.exepectedComplitionSLADurationDesc);
        this.addDepartmentForm
          .get("exepectedComplitionSLA")
          ?.setValue(data.exepectedComplitionSLA);
        this.addDepartmentForm.get("currencyCode")?.setValue(data.currencyCode);
        this.addDepartmentForm.get("companyId").disable();
        this.addDepartmentForm.get("clientId").disable();
        this.selectedCurrency = data.currencyCode;
        this.addDepartmentForm.get("currencyCode").disable();
        this.addDepartmentForm.get("departmentCode").disable();
      });
  }

  getClient(companyId) {
    this.loading.client = true;
    let payload: any = {
      SearchCompanyId: companyId,
    };
    this.departmentService
      .getClientForApplicationSettingDrobDown(payload)
      .subscribe(
        (res: any) => {
          this.clientData = Array.isArray(res.list) ? res.list : [];
          this.loading.client = false;
          if(this.departmentService.currentProjectClientId){
            this.clientId.setValue(this.departmentService.currentProjectClientId);
            this.clientId.disable()
          }
        },
        (err) => {
          this.loading.client = false;
        }
      );
  }

  /**
   * @description  for getting  company list
   */
  getCompanydetails() {
    this.dropdownService.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.companyList = res.list;
      this.companyData = this.companyList;
      if(this.departmentService.currentProjectCompanyId ){
        this.companyId.setValue(this.departmentService.currentProjectCompanyId )
        this.onCompanyValueChange(this.companyId.value)
        this.companyId.disable()
      }
    });
  }

  get form() {
    return this.addDepartmentForm.controls;
  }

  get departmentCode() {
    return this.addDepartmentForm.get("departmentCode");
  }
  get companyId() {
    return this.addDepartmentForm.get("companyId");
  }
  get clientId() {
    return this.addDepartmentForm.get("clientId");
  }
  get departmentName() {
    return this.addDepartmentForm.get("departmentName");
  }
  get departHeadName() {
    return this.addDepartmentForm.get("departHeadName");
  }
  get currencyCode() {
    return this.addDepartmentForm.get("currencyCode");
  }
  get contactPerson1() {
    return this.addDepartmentForm.get("contactPerson1");
  }
  get contactMobileNo1() {
    return this.addDepartmentForm.get("contactMobileNo1");
  }
  get contactDesignation1() {
    return this.addDepartmentForm.get("contactDesignation1");
  }
  get contactPhoneNo1() {
    return this.addDepartmentForm.get("contactPhoneNo1");
  }

  get contactFaxNo1() {
    return this.addDepartmentForm.get("contactFaxNo1");
  }
  get contactEMail1() {
    return this.addDepartmentForm.get("contactEMail1");
  }
  get RespondSLA() {
    return this.addDepartmentForm.get("RespondSLA");
  }
  get OnSiteSLADurationDesc() {
    return this.addDepartmentForm.get("OnSiteSLADurationDesc");
  }
  get RespondSLADurationDesc() {
    return this.addDepartmentForm.get("RespondSLADurationDesc");
  }

  get OnSiteSLA() {
    return this.addDepartmentForm.get("OnSiteSLA");
  }
  get exepectedComplitionSLA() {
    return this.addDepartmentForm.get("exepectedComplitionSLA");
  }
  get exepectedComplitionSLADurationDesc() {
    return this.addDepartmentForm.get("exepectedComplitionSLADurationDesc");
  }

  getClientName(clientId: number) {
    return this.clientData.find((i) => i.clientId == clientId)?.clientName;
  }
  getClientCode(clientId: number) {
    return this.clientData.find((i) => i.clientId == clientId)?.clientCode;
  }

  getCompanyName(companyId: number) {
    return this.companyList.find((i) => i.companyId == companyId)?.companyName;
  }

  openModalCreateMyProject(e: any) {
    this.submitted = true;

    if (this.addDepartmentForm.invalid) {
      return;
    }

    this.addDepartmentFormDisable = false;
    this.addDepartmentFormloding = true;

    let requestData: any = {
      departmentId: this.editMode ? this.editMode.selectedId : "",
      companyId: this.addDepartmentForm.value.companyId,
      clientId: this.addDepartmentForm.value.clientId,
      departmentCode: this.addDepartmentForm.value.departmentCode,
      departmentName: this.addDepartmentForm.value.departmentName,
      departHeadName: this.addDepartmentForm.value.departHeadName,
      contactDesignation1: this.addDepartmentForm.value.contactDesignation1,
      contactPerson1: this.addDepartmentForm.value.contactPerson1,
      contactMobileNo1: this.addDepartmentForm.value.contactMobileNo1
        ? String(this.addDepartmentForm.value.contactMobileNo1)
        : "",
      contactPhoneNo1: this.addDepartmentForm.value.contactPhoneNo1
        ? String(this.addDepartmentForm.value.contactPhoneNo1)
        : "",
      contactFaxNo1: this.addDepartmentForm.value.contactFaxNo1
        ? String(this.addDepartmentForm.value.contactFaxNo1)
        : "",
      contactEMail1: this.addDepartmentForm.value.contactEMail1,
      RespondSLA: this.addDepartmentForm.value.RespondSLA,
      RespondSLADurationDesc:
        this.addDepartmentForm.value.RespondSLADurationDesc,
      OnSiteSLADurationDesc: this.addDepartmentForm.value.OnSiteSLADurationDesc,
      OnSiteSLA: this.addDepartmentForm.value.OnSiteSLA,
      exepectedComplitionSLA:
        this.addDepartmentForm.value.exepectedComplitionSLA,
      exepectedComplitionSLADurationDesc:
        this.addDepartmentForm.value.exepectedComplitionSLADurationDesc,
      clientName: this.getClientName(this.addDepartmentForm.value.clientId),
      companyName: this.getCompanyName(this.addDepartmentForm.value.companyId),
      clientCode: this.getClientCode(this.addDepartmentForm.value.clientId),
      currencyCode: this.selectedCurrency,
    };
    requestData = this.commonService.clean(requestData);

    if (this.editMode.isEdit) {
      this.departmentService.postUpdateDepartment(requestData).subscribe(
        (res: any) => {
          this.addDepartmentFormloding = false;
          this.addDepartmentFormDisable = false;
          this.goBack();
          this.success(res);
        },
        (err: any) => {
          //console.log("jhgfgyhg", err);
          this.addDepartmentFormloding = false;

          this.error(err);
        }
      );
    } else {
      this.departmentService.postDepartment(requestData).subscribe(
        (res: any) => {
          this.addDepartmentFormDisable = false;
          this.addDepartmentFormloding = false;
          this.getAddMoreData(res.message);
        },
        (err) => {
          //console.log("jhgfgyhg", err);

          this.addDepartmentFormloding = false;
          this.error(err);
        }
      );
    }
  }

  addDepartmentFormDetails(e: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =  this.editMode.isEdit ? 'Are you Sure to Update Project' : 'Are you Sure to  Add Project';
  
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.openModalCreateMyProject(e);
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

  /**
   *
   * @param err
   * @description for error message
   */
  error(err: any) {
    this.addDepartmentFormDisable = false;
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err,
      showConfirmButton: false,
      timer: 1000,
    });
  }
  /**
   * @description to get back
   */
  goBack() {
    this.router.navigate(["/application-settings/department/project-list"]);
    this.successMessageVisible = false;
  }

  goback = this.goBack;
  /**
   *
   * @param message
   * @description Get add more data
   */
  getAddMoreData(message: string) {
    this.successMessageVisible = true;
  }
  /**
   * @description for  the form reset
   */
  getFormRest() {
    this.addDepartmentFormloding = false;
    this.addDepartmentForm.reset();
    this.addDepartmentForm.markAsUntouched();
    this.successMessageVisible = false;

    
  }

  getfromBinding() {
    this.addDepartmentForm = this.formBuilder.group({
      companyId: [null, Validators.required],
      clientId: [null, Validators.required],
      departmentCode: [
        null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(5)],
      ],
      //  companyId: [null, Validators.required],
      departmentName: ["", Validators.required],
      departHeadName: [""],
      contactDesignation1: [""],

      contactPerson1: [""],
      contactMobileNo1: [""],
      contactPhoneNo1: [""],

      contactFaxNo1: [""],

      contactEMail1: [""],
      RespondSLA: [""],
      RespondSLADurationDesc: [null],

      OnSiteSLADurationDesc: [null],
      OnSiteSLA: [""],

      exepectedComplitionSLA: [""],
      exepectedComplitionSLADurationDesc: [null],
      currencyCode: [null, [Validators.required]],
    });
  }

  clientHandler(event: any): void {
    this.clientObj = event;
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    //console.log(changeEvent);
    if (changeEvent.nextId === 1) {
    }
  }

  onCompanyValueChange(event: any): void {
    
    this.clientId.reset();
    this.getClient(event);
  }

  onRespondSLAValue(event) {
    this.RespondSLADurationDesc.reset();
  }
  onSiteSLAValue(event) {
    this.OnSiteSLADurationDesc.reset();
  }
  exepectedComplitionSLADurationDescValue(event) {
    this.exepectedComplitionSLADurationDesc.reset();
  }

  getCountryList() {
    this.dropdownService.getCountryListDrobDown().subscribe((res: any) => {
      this.countryAndCurrencyList = res.list;
    });
  }
}
