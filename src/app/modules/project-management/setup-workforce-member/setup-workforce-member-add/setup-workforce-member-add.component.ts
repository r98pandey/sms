import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormBuilder, UntypedFormGroup, UntypedFormArray, Validators, UntypedFormControl } from '@angular/forms';
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { UserProfileService } from "src/app/core/services/user.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import { environment } from "src/environments/environment";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { WorkForceService } from 'src/app/core/services/work-force.service';
import { Location } from '@angular/common';
import { TechnicianListModalComponent } from 'src/app/shared/components/technician-list-modal/technician-list-modal.component';
import { NewGetV2UserListApplicationComponent } from 'src/app/shared/components/new-get-v2-user-list-application/new-get-v2-user-list-application.component';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: 'app-setup-workforce-member-add',
  templateUrl: './setup-workforce-member-add.component.html',
  styleUrl: './setup-workforce-member-add.component.scss'
})
export class SetupWorkforceMemberAddComponent {
  label: any = "Workforce Member";

  breadCrumbItems: any = [
    { label: "Workforce Member Setup" },
    { label: "Workforce Member Add", active: true },
  ];

  imgURl: any = environment.apiUrl;

  workforceForm: FormGroup;
  isProject: boolean = false;
  option = {
    //startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  ticketList = [];
  page = 1;
  collectionSize = 0;
  currentUserRole: any;
  typeWorkforceValue: any;

  selectedMemeber: any[] = [];
  selectedMemeberAccessLevelArray: any = [];

  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownTicketStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  projectDepartmentFieldDisiabled: boolean = false;
  disabledWithAceessGroup: boolean = false;

  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchLocationId: null,
    SearchTicketStatusId: null,
    SearchCategoryId: null,
    SearchSubCategoryId: null,
    SearchTicketTitle: null,
    SearchTicketNo: null,
    SearchRequesterName: null,
    SearchRequesterEmail: null,
    SearchCreatedDateFrom: null,
    SearchCreatedDateTo: null,
    SearchTicketType: null,
    SearchPriority: null,
    SearchIsGlobal: null,
    SearchIsBillable: null,
    SearchTicketTypeId: null,
    SearchOperationType: null,
  };

  addMember: any = ['Nancy Martino', 'Henry Baird'];


  constructor(

    private formBuilder: UntypedFormBuilder,
    private userService: UserProfileService,
    private router: Router,
    private modalService: NgbModal,
    private dropdownServices: DropdownService,
    private departmentService: DepartmentService,
    private commonFunctionService: CommonFunctionService,
    private authService: AuthAssetService,
    private workForceService: WorkForceService,
    private location: Location


  ) {
    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {
    this.getDropdownCompanyList();
    this.getfromBinding();
  }

  getfromBinding() {
    this.workforceForm = this.formBuilder.group({
      company: [null, Validators.required],
      client: [null, Validators.required],
      project: [null, Validators.required],
      WorkforceName: [null, Validators.required],
    });
  }

  get client() {
    return this.workforceForm.get("client");
  }
  get company() {
    return this.workforceForm.get("company");
  }
  get project() {
    return this.workforceForm.get("project");
  }
  get WorkforceName() {
    return this.workforceForm.get("WorkforceName");
  }

  /**
     * Start  For Dropdown Company ,client,project
     */
  getDropdownCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      this.selectedTech = [];
     
      
      if (this.currentUserRole === "Client User") {
        this.selectedDropDownCompanyIdValue =
          this.arrayListDropDownCompany[0].companyId;
        this.onDropdownCompanyValueChange("");
      }

    });
  }
  getDropdownClientlist() {
  
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    }; 
   
    this.departmentService
      .GetClientListProjectDrobDownApi(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        this.selectedTech = [];
        if (this.currentUserRole === "Client User") {
          this.selectedDropDownClientIdValue =
            this.arrayListDropDownClientList[0].clientId;
          this.onDropdownClientValueChange("");
        }
        //this.setObjectBeforeRefesh();
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    }; 
    this.departmentService
      .GetDepartmentListProjectDrobDownApi(payload)
      .subscribe((res: any) => {
        this.selectedTech = [];
       
        
        this.arrayListDropDownProjectOrDeparmentList = res.list;
        if (res.list.length != 0) {
          if (this.currentUserRole === "Client User") {
            if (res.list.length >= 2) {
              this.projectDepartmentFieldDisiabled = false;
            } else {
              this.projectDepartmentFieldDisiabled = true;
              this.selectedDropDownProjectOrDeparmentIdValue =
                this.arrayListDropDownProjectOrDeparmentList[0].departmentId;
              this.onDropdownDepartmentValueChange("");
            }
          }
        }
        // this.setObjectBeforeRefesh();
      });
  }
  onDropdownCompanyValueChange($event) {
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    this.arrayListDropDownProjectOrDeparmentList = [];
    if(this.selectedDropDownCompanyIdValue){
    this.getDropdownClientlist();}
  }
  onDropdownClientValueChange($event) {
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    if(this.selectedDropDownClientIdValue){
    this.getDropdownDepartmentList();
  }

  }
  onDropdownDepartmentValueChange($event) {
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;

  }
  /**
   * End  For Dropdown Company ,client,project
   */
  selectedTech:any=[]
  openModalMember() {
    this.selectedTech = [];
    const modalRef = this.modalService.open(NewGetV2UserListApplicationComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.nameTitle = "Member";
    modalRef.componentInstance.followUpMemberList = this.selectedTech.length != 0 ? this.selectedTech : [];

    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {
          console.log(result.selectedTech)
          if (result.selectedTech) {
            this.selectedTech = result.selectedTech ? result.selectedTech : [];
            
          }
        }
      }
    });
  }
 
  

  openModalDeleteConf(techobject,index) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.projectId=this.project.value
    modalRef.componentInstance.title = "You are about to delete a Member ?";
    modalRef.componentInstance.subTitle =
      "Deleting your Member will remove for this Member List  ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.unCheckItem(index);
        }
      }
    });
  }


  unCheckItem(index) {
    this.selectedTech.splice(index, 1);
  }


  addWorkFroce() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to add Workforce";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addAddWorkForceSucessModal();
        } else {
         // this.onBack();
        }
      }
    });
  }

  addAddWorkForceSucessModal() {
    let selectedTech = [];
    if (this.selectedTech.length !== 0) {
      this.selectedTech.forEach((element) => { 
        selectedTech.push({
          UserId: element?.id,

        });
      });
    }
   
    let requestData: any = {
      ProjectWorkforceName: this.WorkforceName.value,
      ProjectId: this.project.value,
      ClientId: this.client.value,
      CompanyId: this.company.value,
      mX_ProjectWorkforceMember: selectedTech ? selectedTech : [],
    };

    this.workForceService.CreateV2_MX_ProjectWorkforce(requestData)
      .subscribe((res: any) => {
        this.success(res);
        this.location.back()
      });
  }

  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
}
