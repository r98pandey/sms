import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DndDropEvent } from 'ngx-drag-drop';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { DropdownService } from 'src/app/shared/Service-common/dropdown.service';
import Swal from 'sweetalert2';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { DecimalPipe, Location } from "@angular/common";
import { NgbModal, NgbNav, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";

import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

@Component({
  selector: 'app-new-add-project',
  templateUrl: './new-add-project.component.html',
  styleUrl: './new-add-project.component.scss'
})
export class NewAddProjectComponent implements OnInit {

  label: any = "Project";
  breadCrumbItems: any = [
    { label: "Project" },
    { label: "Add Project ", active: true },
  ];
  defaultNavActiveId: any = 1;
  projectDetailFrom!: FormGroup;
  isProject: any;
  OnSiteDescList = ["Hour", "Day", "Week", "Month", "Year"];

  maxCharsDecision = 300;
  public Editor = ClassicEditor;
  @ViewChild("defaultNav") defaultNav: NgbNav; // Reference to the ngbNav component

  countryAndCurrencyList: any = [];
  selectedCurrency: any = null;
  arrayListDropDownCompany: any = [];
  selectedDropDownCompanyIdValue: any = null;
  arrayListDropDownClientList: any = []
  selectedDropDownClientIdValue: any = null;
  departmentProjectLabel: string = "";
  masterProjectProcessList: any = [];
  selectMasterProjectProcessList: any[];
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private dropdownServices: DropdownService,
    private commonService: CommonFunctionService,
    private authService: AuthAssetService,
    private departmentService: DepartmentService,
    public location: Location,
    private modalService: NgbModal
  ) {

    if (this.departmentService.accessRight == true) {

    } else {
      this.goBack()
    }
  }
  ngOnInit(): void {
    this.isProject = this.authService.getisProject();
    this.departmentProjectLabel = this.isProject ? "Project" : "Department";
    this.getCountryList();
    this.getV2_MX_MasterProjectProcessList();
    this.getDropdownCompanyList();
    this.getFromBinding();
    this.label = this.isProject ? "Project" : "Department";

  }

  getFromBinding() {
    this.projectDetailFrom = this.formBuilder.group({
      companyId: [null, Validators.required],
      clientId: [null, Validators.required],
      departmentCode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(5)]],
      departmentName: ["", Validators.required],
      departHeadName: [""],
      currencyCode: [null, [Validators.required]],
      contactDesignation1: [""],
      contactPerson1: [""],
      contactMobileNo1: ["",[Validators.minLength(6), Validators.maxLength(15)]],
      contactPhoneNo1: ["",[Validators.minLength(6), Validators.maxLength(15)]],
      contactFaxNo1: [""],
      contactEMail1: [""],
      frmdescription: [""],
      RespondSLA: [""],
      RespondSLADurationDesc: [null],
      OnSiteSLADurationDesc: [null],
      OnSiteSLA: [""],
      exepectedComplitionSLA: [""],
      exepectedComplitionSLADurationDesc: [null],
    });

  }
  getCountryList() {
    this.dropdownServices.getCountryListDrobDown().subscribe((res: any) => {
      this.countryAndCurrencyList = res.list;
    });
  }
  getDropdownCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (res.list.length != 0) {
        let data: any = JSON.parse(localStorage.getItem("currentUser"));
        if (data?.role === "Client User") {
          this.selectedDropDownCompanyIdValue =
            this.arrayListDropDownCompany[0].companyId;
          this.getDropdownClientlist();

        }
        if (this.departmentService.currentProjectCompanyId != 0) {
          this.companyId.setValue(this.departmentService.currentProjectCompanyId)
          this.onDropdownCompanyValueChange()
          this.companyId.disable()
        }
      }
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.companyId.value,
    };
    this.departmentService
      .GetV3_ClientDrobDown_Global_Active(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        if (res.list.length != 0) {
          let data: any = JSON.parse(localStorage.getItem("currentUser"));
          if (data?.role === "Client User") {
            this.selectedDropDownClientIdValue =
              this.arrayListDropDownClientList[0].clientId;
          }
          if (this.departmentService.currentProjectClientId != 0) {
            this.clientId.setValue(this.departmentService.currentProjectClientId);
            this.clientId.disable()
          }
        }
      });
  }

  //ADded By Suresh 22072024
  getDropdownClientlist_V3_Global() {
    let payload: any = {
      SearchCompanyId: this.companyId.value,
    };
    this.departmentService
      .GetV3_ClientDrobDown_Global_Active(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        if (res.list.length != 0) {
          let data: any = JSON.parse(localStorage.getItem("currentUser"));
          if (data?.role === "Client User") {
            this.selectedDropDownClientIdValue =
              this.arrayListDropDownClientList[0].clientId;
          }
          if (this.departmentService.currentProjectClientId != 0) {
            this.clientId.setValue(this.departmentService.currentProjectClientId);
            this.clientId.disable()
          }
        }
      });
  }
  //end
  onDropdownCompanyValueChange() {
    this.arrayListDropDownClientList = [];
    this.clientId.reset();
    if (this.companyId.value) {
      this.getDropdownClientlist();
    } else {
      this.arrayListDropDownClientList = [];
    }
  }
  onDropdownClientValueChange(event) {
  }
  getV2_MX_MasterProjectProcessList() {
    this.departmentService.getV2_MX_MasterProjectProcessList().subscribe((res: any) => {
      this.masterProjectProcessList = res.list;
      this.selectMasterProjectProcessList = []
      this.masterProjectProcessList.forEach(element => {
        element.checked = false;
        element.partiallySqe = 0
      });
    }, (err) => {
    })
  }

  exepectedComplitionSLADurationDescValue(event) {
    this.exepectedComplitionSLADurationDesc.reset();
    if (this.RespondSLA.value) {
      this.projectDetailFrom.get('exepectedComplitionSLADurationDesc').setValidators(Validators.required);
    } else {
      this.projectDetailFrom.get('exepectedComplitionSLADurationDesc').clearValidators();
    }
    this.projectDetailFrom.get('exepectedComplitionSLADurationDesc').updateValueAndValidity();

  }

  onRespondSLAValue(event) {
    this.RespondSLADurationDesc.reset();
    if (this.RespondSLA.value) {
      this.projectDetailFrom.get('RespondSLADurationDesc').setValidators(Validators.required);
    } else {
      this.projectDetailFrom.get('RespondSLADurationDesc').clearValidators();
    }
    this.projectDetailFrom.get('RespondSLADurationDesc').updateValueAndValidity();
  }
  onSiteSLAValue(event) {
    this.OnSiteSLADurationDesc.reset();

    if (this.RespondSLA.value) {
      this.projectDetailFrom.get('OnSiteSLADurationDesc').setValidators(Validators.required);
    } else {
      this.projectDetailFrom.get('OnSiteSLADurationDesc').clearValidators();
    }
    this.projectDetailFrom.get('OnSiteSLADurationDesc').updateValueAndValidity();

  }


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
  get form() {
    return this.projectDetailFrom.controls;
  }

  get contactPerson1() {
    return this.projectDetailFrom.get("contactPerson1");
  }
  get contactMobileNo1() {
    return this.projectDetailFrom.get("contactMobileNo1");
  }
  get contactDesignation1() {
    return this.projectDetailFrom.get("contactDesignation1");
  }
  get contactPhoneNo1() {
    return this.projectDetailFrom.get("contactPhoneNo1");
  }
  get contactFaxNo1() {
    return this.projectDetailFrom.get("contactFaxNo1");
  }
  get contactEMail1() {
    return this.projectDetailFrom.get("contactEMail1");
  }
  get frmdescription() {
    return this.projectDetailFrom.get("frmdescription");
  }
  get RespondSLA() {
    return this.projectDetailFrom.get("RespondSLA");
  }
  get OnSiteSLADurationDesc() {
    return this.projectDetailFrom.get("OnSiteSLADurationDesc");
  }
  get RespondSLADurationDesc() {
    return this.projectDetailFrom.get("RespondSLADurationDesc");
  }

  get OnSiteSLA() {
    return this.projectDetailFrom.get("OnSiteSLA");
  }
  get exepectedComplitionSLA() {
    return this.projectDetailFrom.get("exepectedComplitionSLA");
  }
  get exepectedComplitionSLADurationDesc() {
    return this.projectDetailFrom.get("exepectedComplitionSLADurationDesc");
  }








  // todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  submitprojectDetailFromDetails() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Add Project";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addAddProjectSucessModal();
        }
      }
    });
  }




  addAddProjectSucessModal() {
    console.log("")
    let requestData: any = {
      companyId: this.companyId.value,
      clientId: this.clientId.value,
      departmentCode: this.projectDetailFrom.value.departmentCode.toUpperCase(),
      departmentName: this.projectDetailFrom.value.departmentName,
      departHeadName: this.projectDetailFrom.value.departHeadName,
      clientName: this.getClientName(this.clientId.value),
      companyName: this.getCompanyName(this.companyId.value),
      clientCode: this.getClientCode(this.clientId.value),
      currencyCode: this.selectedCurrency,
      contactDesignation1: this.projectDetailFrom.value.contactDesignation1,
      contactPerson1: this.projectDetailFrom.value.contactPerson1,
      contactMobileNo1: this.projectDetailFrom.value.contactMobileNo1
        ? String(this.projectDetailFrom.value.contactMobileNo1)
        : "",
      contactPhoneNo1: this.projectDetailFrom.value.contactPhoneNo1
        ? String(this.projectDetailFrom.value.contactPhoneNo1)
        : "",
      contactFaxNo1: this.projectDetailFrom.value.contactFaxNo1
        ? String(this.projectDetailFrom.value.contactFaxNo1)
        : "",
      contactEMail1: this.projectDetailFrom.value.contactEMail1,
      frmdescription: this.formatDescription(this.projectDetailFrom.value.frmdescription),
      RespondSLA: this.projectDetailFrom.value.RespondSLA,
      RespondSLADurationDesc:
        this.projectDetailFrom.value.RespondSLADurationDesc,
      OnSiteSLADurationDesc: this.projectDetailFrom.value.OnSiteSLADurationDesc,
      OnSiteSLA: this.projectDetailFrom.value.OnSiteSLA,
      exepectedComplitionSLA:
        this.projectDetailFrom.value.exepectedComplitionSLA,
      exepectedComplitionSLADurationDesc:
        this.projectDetailFrom.value.exepectedComplitionSLADurationDesc,
    };
    let mX_ProjectProcessHeader = [];

    this.selectMasterProjectProcessList.forEach((element, index) => {
      mX_ProjectProcessHeader.push({
        ProjectProcessId: element.projectProcessId,
        ProjectProcessName: element.projectProcessName,
        Seq: index + 1,
      })


    });
    requestData.mX_ProjectProcessHeader = mX_ProjectProcessHeader ? mX_ProjectProcessHeader : []
    requestData = this.commonService.clean(requestData);
    this.departmentService.createDepartmentForPM(requestData).subscribe(
      (res: any) => {
        this.success(res)

        //modal open


        this.goBack()
      },
      (err) => {
        this.error(err);
      }
    );

  }

  formatDescription(description) {
    if (!description) return null;
    description = description.replace(/(?<!=")(https?:\/\/[^\s<]+)/gi, '<a href="$1" target="_blank">$1</a>');
    return description;
  }

  goBack() {
    if (this.departmentService.currentProjectCompanyId != 0 && this.departmentService.currentProjectClientId != 0) {
      this.router.navigate(['/application-settings/pm-client/pm-prospect-list'])
    } else {
      this.router.navigate(['/project-management/project-setup/list-project'])
    }

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

  onUpperCase(event: any): void {
    const value = event.target.value.toUpperCase();
    this.departmentCode.setValue(value, { emitEvent: false });
  }

}
