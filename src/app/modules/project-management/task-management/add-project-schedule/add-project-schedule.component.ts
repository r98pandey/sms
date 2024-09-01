
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
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

@Component({
  selector: 'app-add-project-schedule',
  templateUrl: './add-project-schedule.component.html',
  styleUrl: './add-project-schedule.component.scss'
})
export class AddProjectScheduleComponent {
  label: any = "Workforce Member";

  breadCrumbItems: any = [
    { label: "Workforce Member Setup" },
    { label: "Workforce Member Add", active: true },
  ];

  imgURl: any = environment.apiUrl;
  @Input() dDetail: any;
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
  byDefaultDetailsCompanyName: any = null;
  byDefaultDetailsClientName: any = null;
  byDefaultDetailsProjectName: any = null;


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
    private location: Location,
    public modal: NgbActiveModal,
    private datePipe: DatePipe,
    private projectScheduleService: ProjectScheduleService,

  ) {
    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {

    this.getfromBinding();

  }

  getfromBinding() {
    this.workforceForm = this.formBuilder.group({
      company: [null, Validators.required],
      client: [null, Validators.required],
      project: [null, Validators.required],
      projectScheduleName: [null, Validators.required],
      plannedCompletionDate: [null, Validators.required],
    });

    if (this.dDetail) {
      this.company.disable();
      this.client.disable();
      this.project.disable();
      this.byDefaultDetailsCompanyName = this.dDetail.companyName
      this.byDefaultDetailsClientName = this.dDetail.clientName
      this.byDefaultDetailsProjectName = this.dDetail.departmentName

    } else {
      this.getDropdownCompanyList();
    }
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
  get projectScheduleName() {
    return this.workforceForm.get("projectScheduleName");
  } get plannedCompletionDate() {
    return this.workforceForm.get("plannedCompletionDate");
  }

  /**
     * Start  For Dropdown Company ,client,project
     */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList_Active_ProjectManagement({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
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

    this.dropdownServices
      .Getv3_MaintenanceClientDropDownList_Active_ProjectManagement(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;

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
    this.dropdownServices
      .Getv3_MaintenanceDepartmentDropDownList_Active_ProjectManagement(payload)
      .subscribe((res: any) => {
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
    if (this.selectedDropDownCompanyIdValue) {
      this.getDropdownClientlist();
    }
  }
  onDropdownClientValueChange($event) {
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.selectedDropDownClientIdValue) {
      this.getDropdownDepartmentList();
    }

  }
  onDropdownDepartmentValueChange($event) {
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;

  }
  /**
   * End  For Dropdown Company ,client,project
   */


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

  close(value) {
    this.modal.close({
      res: '',
      value: 'value'
    });
  }

  addWorkFroce() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to add Task Schedule";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addProjectSucessModal();
        } else {
          //this.onBack();
        }
      }
    });
  }

  addProjectSucessModal() {
    let selectedTech = [];
    let requestData: any = {
      projectScheduleName: this.projectScheduleName.value,
      projectId: this.byDefaultDetailsProjectName ? this.dDetail.departmentId : this.project.value,
      clientId: this.byDefaultDetailsClientName ? this.dDetail.clientId : this.client.value,
      companyId: this.byDefaultDetailsCompanyName ? this.dDetail.companyId : this.company.value,
      clientName: this.byDefaultDetailsClientName ? this.byDefaultDetailsClientName : this.findClientName(this.client.value).clientName,
      projectName: this.byDefaultDetailsProjectName ? this.byDefaultDetailsProjectName : this.findDepartmentName(this.project.value).departmentName,
      companyName: this.byDefaultDetailsCompanyName ? this.byDefaultDetailsCompanyName : this.findCompanyName(this.company.value).companyName,
      plannedCompletionDate: this.datePipe.transform(this.plannedCompletionDate.value, "yyyy-MM-dd ")
    };

    this.projectScheduleService.createV2_MX_ProjectSchedule(requestData)
      .subscribe((res: any) => {
        this.success(res);

        this.modal.close({
          res: res,
          value: 'success',
          requestData: requestData
        });

      });
  }
  clearChangeStartDate() {
    this.plannedCompletionDate.reset();
  }

  findCompanyName(companyId) {
    return this.arrayListDropDownCompany.find((i) => i.companyId === companyId);
  }

  findClientName(clientId) {
    return this.arrayListDropDownClientList.find((i) => i.clientId === clientId);
  }

  findDepartmentName(departmentId) {
    return this.arrayListDropDownProjectOrDeparmentList.find((i) => i.departmentId === departmentId);
  }

}
