
import { CdkStep, CdkStepper } from "@angular/cdk/stepper";
import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
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
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss'
})
export class AddProjectComponent implements OnInit {

  @Output() loadListDepartment = new EventEmitter();

  isProject: any;
  OnSiteDescList = ["Hour", "Day", "Week", "Month", "Year"];
  label = "Department";
  @ViewChild('cdkStepper') wizardForm: CdkStepper;

  successMessageVisible;
  countryAndCurrencyList: any = [];
  selectedCurrency: any = null;

  arrayListDropDownCompany: any = [];
  selectedDropDownCompanyIdValue: any = null;
  arrayListDropDownClientList: any = []
  selectedDropDownClientIdValue: any = null;
  departmentProjectLabel: string = "";

  counter = [];

  projectDetailFrom!: FormGroup;
  contactDetailFrom!: FormGroup;
  slaDetailFrom!: FormGroup;
  masterProjectProcessList: any = [];
  @ViewChild('step1') step1: CdkStep;
  @ViewChild('step2') step2: CdkStep;
  @ViewChild('step2') step3: CdkStep;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private dropdownServices: DropdownService,
    private commonService: CommonFunctionService,
    private authService: AuthAssetService,
    private departmentService: DepartmentService,
    private modalService: NgbModal

  ) {
  }

  ngOnInit(): void {
    this.isProject = this.authService.getisProject();
    this.departmentProjectLabel = this.isProject ? "Project" : "Department";
    this.getCountryList();
    this.getV2_MX_MasterProjectProcessList();
    this.getDropdownCompanyList();
    this.getfromBinding();
    this.label = this.isProject ? "Project" : "Department";

  }


  getfromBinding() {
    this.projectDetailFrom = this.formBuilder.group({
      companyId: [null, Validators.required],
      clientId: [null, Validators.required],
      departmentCode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(5)]],
      departmentName: ["", Validators.required],
      departHeadName: [""],
      currencyCode: [null, [Validators.required]],
    });
    this.contactDetailFrom = this.formBuilder.group({
      contactDesignation1: [""],
      contactPerson1: [""],
      contactMobileNo1: [""],
      contactPhoneNo1: [""],
      contactFaxNo1: [""],
      contactEMail1: [""],
    });
    this.slaDetailFrom = this.formBuilder.group({
      RespondSLA: [""],
      RespondSLADurationDesc: [null],
      OnSiteSLADurationDesc: [null],
      OnSiteSLA: [""],
      exepectedComplitionSLA: [""],
      exepectedComplitionSLADurationDesc: [null],
    });
  }
  getV2_MX_MasterProjectProcessList() {
    this.departmentService.getV2_MX_MasterProjectProcessList().subscribe((res: any) => {
      this.masterProjectProcessList = res.list;
      this.masterProjectProcessList.forEach(element => {
        element.checked = false;
        element.partiallySqe = 0
      });
    }, (err) => {
    })
  }

  getCountryList() {
    this.dropdownServices.getCountryListDrobDown().subscribe((res: any) => {
      this.countryAndCurrencyList = res.list;
    });
  }
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList_Active_ProjectManagement({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (res.list.length != 0) {
        let data: any = JSON.parse(localStorage.getItem("currentUser"));
        if (data?.role === "Client User") {
          this.selectedDropDownCompanyIdValue =
            this.arrayListDropDownCompany[0].companyId;
          this.getDropdownClientlist();

        }
      }
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.companyId.value,
    };
    this.dropdownServices
      .Getv3_MaintenanceClientDropDownList_Active_ProjectManagement(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        if (res.list.length != 0) {
          let data: any = JSON.parse(localStorage.getItem("currentUser"));
          if (data?.role === "Client User") {
            this.selectedDropDownClientIdValue =
              this.arrayListDropDownClientList[0].clientId;
          }
        }
      });
  }
  onDropdownCompanyValueChange(event) {
    this.arrayListDropDownClientList=[];
    this.clientId.reset();
    if (this.companyId.value) {
      this.getDropdownClientlist();
    }else{
      this.arrayListDropDownClientList=[];
    }
  }
  onDropdownClientValueChange(event) {
  }

  goBack() {
    this.router.navigate(["/project-management/project-setup/list-project"]);
    this.successMessageVisible = false;
  }
  get form() {
    return this.projectDetailFrom.controls;
  }
  // projectDetailFrom

  get departmentCode() {
    return this.projectDetailFrom.get("departmentCode");
  }
  get companyId() {
    return this.projectDetailFrom.get("companyId");
  }
  get clientId() {
    return this.projectDetailFrom.get("clientId");
  }
  get departmentName() {
    return this.projectDetailFrom.get("departmentName");
  }
  get departHeadName() {
    return this.projectDetailFrom.get("departHeadName");
  }
  get currencyCode() {
    return this.projectDetailFrom.get("currencyCode");
  }

  // end projectDetailFrom




  get contactPerson1() {
    return this.contactDetailFrom.get("contactPerson1");
  }
  get contactMobileNo1() {
    return this.contactDetailFrom.get("contactMobileNo1");
  }
  get contactDesignation1() {
    return this.contactDetailFrom.get("contactDesignation1");
  }
  get contactPhoneNo1() {
    return this.contactDetailFrom.get("contactPhoneNo1");
  }

  get contactFaxNo1() {
    return this.contactDetailFrom.get("contactFaxNo1");
  }
  get contactEMail1() {
    return this.contactDetailFrom.get("contactEMail1");
  }



  get RespondSLA() {
    return this.slaDetailFrom.get("RespondSLA");
  }
  get OnSiteSLADurationDesc() {
    return this.slaDetailFrom.get("OnSiteSLADurationDesc");
  }
  get RespondSLADurationDesc() {
    return this.slaDetailFrom.get("RespondSLADurationDesc");
  }

  get OnSiteSLA() {
    return this.slaDetailFrom.get("OnSiteSLA");
  }
  get exepectedComplitionSLA() {
    return this.slaDetailFrom.get("exepectedComplitionSLA");
  }
  get exepectedComplitionSLADurationDesc() {
    return this.slaDetailFrom.get("exepectedComplitionSLADurationDesc");
  }
  exepectedComplitionSLADurationDescValue(event) {
    this.exepectedComplitionSLADurationDesc.reset();
    if (this.RespondSLA.value) {
      this.slaDetailFrom.get('exepectedComplitionSLADurationDesc').setValidators(Validators.required);
    } else {
      this.slaDetailFrom.get('exepectedComplitionSLADurationDesc').clearValidators();
    }
    this.slaDetailFrom.get('exepectedComplitionSLADurationDesc').updateValueAndValidity();

  }

  onRespondSLAValue(event) {
    this.RespondSLADurationDesc.reset();
    if (this.RespondSLA.value) {
      this.slaDetailFrom.get('RespondSLADurationDesc').setValidators(Validators.required);
    } else {
      this.slaDetailFrom.get('RespondSLADurationDesc').clearValidators();
    }
    this.slaDetailFrom.get('RespondSLADurationDesc').updateValueAndValidity();
  }
  onSiteSLAValue(event) {
    this.OnSiteSLADurationDesc.reset();

    if (this.RespondSLA.value) {
      this.slaDetailFrom.get('OnSiteSLADurationDesc').setValidators(Validators.required);
    } else {
      this.slaDetailFrom.get('OnSiteSLADurationDesc').clearValidators();
    }
    this.slaDetailFrom.get('OnSiteSLADurationDesc').updateValueAndValidity();

  }

  submitprojectDetailFromDetails() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to add Project";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addAddProjectSucessModal();
        } else {
         // this.onBack();
        }
      }
    });
  }
  



  addAddProjectSucessModal() {

    let requestData: any = {
      companyId: this.projectDetailFrom.value.companyId,
      clientId: this.projectDetailFrom.value.clientId,
      departmentCode: this.projectDetailFrom.value.departmentCode,
      departmentName: this.projectDetailFrom.value.departmentName,
      departHeadName: this.projectDetailFrom.value.departHeadName,
      clientName: this.getClientName(this.projectDetailFrom.value.clientId),
      companyName: this.getCompanyName(this.projectDetailFrom.value.companyId),
      clientCode: this.getClientCode(this.projectDetailFrom.value.clientId),
      currencyCode: this.selectedCurrency,
      contactDesignation1: this.contactDetailFrom.value.contactDesignation1,
      contactPerson1: this.contactDetailFrom.value.contactPerson1,
      contactMobileNo1: this.contactDetailFrom.value.contactMobileNo1
        ? String(this.contactDetailFrom.value.contactMobileNo1)
        : "",
      contactPhoneNo1: this.contactDetailFrom.value.contactPhoneNo1
        ? String(this.contactDetailFrom.value.contactPhoneNo1)
        : "",
      contactFaxNo1: this.contactDetailFrom.value.contactFaxNo1
        ? String(this.contactDetailFrom.value.contactFaxNo1)
        : "",
      contactEMail1: this.contactDetailFrom.value.contactEMail1,
      RespondSLA: this.slaDetailFrom.value.RespondSLA,
      RespondSLADurationDesc:
        this.slaDetailFrom.value.RespondSLADurationDesc,
      OnSiteSLADurationDesc: this.slaDetailFrom.value.OnSiteSLADurationDesc,
      OnSiteSLA: this.slaDetailFrom.value.OnSiteSLA,
      exepectedComplitionSLA:
        this.slaDetailFrom.value.exepectedComplitionSLA,
      exepectedComplitionSLADurationDesc:
        this.slaDetailFrom.value.exepectedComplitionSLADurationDesc,
    };
    let mX_ProjectProcessHeader = [];

    this.masterProjectProcessList.forEach(element => {
      if (element.checked) {
        mX_ProjectProcessHeader.push({
          ProjectProcessId: element.projectProcessId,
          ProjectProcessName: element.projectProcessName,
          Seq: element.seq,
        })
      }

    });
    requestData.mX_ProjectProcessHeader = mX_ProjectProcessHeader ? mX_ProjectProcessHeader : []
    requestData = this.commonService.clean(requestData);
    this.departmentService.createDepartmentForPM(requestData).subscribe(
      (res: any) => {
        this.success(res)
        this.loadListDepartment.emit(res);
      },
      (err) => {
        this.error(err);
      }
    );

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

  getClientName(clientId: number) {
    return this.arrayListDropDownClientList.find((i) => i.clientId == clientId)?.clientName;
  }
  getClientCode(clientId: number) {
    return this.arrayListDropDownClientList.find((i) => i.clientId == clientId)?.clientCode;
  }
  getCompanyName(companyId: number) {
    return this.arrayListDropDownCompany.find((i) => i.companyId == companyId)?.companyName;
  }


  error(err: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err,
      showConfirmButton: false,
      timer: 1000,
    });
  }

  onChangeGetArray() {
    console.log(this.masterProjectProcessList, "masterProjectProcessList")
  }

  increment(index: number) {
    this.masterProjectProcessList[index].seq++;
  }


  decrement(index: number) {
    if (this.masterProjectProcessList[index].seq > 0) {
      this.masterProjectProcessList[index].seq--;
    }
  }


}
