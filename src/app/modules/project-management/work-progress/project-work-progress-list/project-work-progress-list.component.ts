

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";
import Swal from "sweetalert2";
import { ProjectScheduleService } from "src/app/core/services/project-schedule.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { AddProjectWorkProgressComponent } from "../add-project-work-progress/add-project-work-progress.component";


@Component({
  selector: 'app-project-work-progress-list',
  templateUrl: './project-work-progress-list.component.html',
  styleUrl: './project-work-progress-list.component.scss'
})
export class ProjectWorkProgressListComponent implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Project Management";
  breadCrumbItems: any = [
    { label: "Project Management" },
    { label: "Work Programme List", active: true },
  ];
  payload: any = {
    displayLength: 12,
    displayStart: 0,
    companyId: null,
    SearchCompanyId: null, 
    SearchClientId: null,
    SearchProjectId: null,
    SearchProjectScheduleName: null,
    SearchProjectScheduleStatusId: null,

  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  projectScheduleList = [];
  page = 1;
  collectionSize = 0;

  imageUrl: any = environment.apiUrl;
  viewImageValue: any;
  projectScheduleQrData: any;
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  arrayListDropDownClientList: any = [];
  arrayListDropDownCompany: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  typeprojectScheduleNameValue: any;

  selectedDropDownProjectOrDeparmentIdValue: any;
  submitted: boolean;
  currentUserRole: any
  projectDepartmentFieldDisiabled: boolean = false
  deleteId: any;
  selectedCompanyId: any;
  selectedClientId: any;
  companyListArray: any = [];
  clientListArray: any = [];
  selectedDepartmentName: string = "";
  projectScheduleStatusList: any;
  selectedDropDownScheduleStatusIdValue: any = null
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private projectScheduleService: ProjectScheduleService,
    private authService: AuthAssetService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private menuService: MenuServiceService,
    private commonHttpServiceCallerService: CommonHttpServiceCallerService

  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;

    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Work Programme" },
      { label: "Work Programme List", active: true },
    ];
    this.getDropdownCompanyList();
    this.getProjectStatus();
    if (localStorage.getItem("objectSerachForProjectScheduleWorkProgramme")) {
      this.getObjectAfterRefreshProject();
    } else {
      this.loadData();
    }
  }

  /**
 * for Set object to refesh
 */
  setObjectBeforeRefeshProject() {
    let objectSerachForProjectScheduleWorkProgramme: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForProjectScheduleWorkProgramme.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachForProjectScheduleWorkProgramme.SearchClientId =
        this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForProjectScheduleWorkProgramme.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;

    if (this.arrayListDropDownClientList) {
      objectSerachForProjectScheduleWorkProgramme.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.selectedDropDownScheduleStatusIdValue) {
      objectSerachForProjectScheduleWorkProgramme.selectedDropDownScheduleStatusIdValue =
        this.selectedDropDownScheduleStatusIdValue;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForProjectScheduleWorkProgramme.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList
    }
    if (this.typeprojectScheduleNameValue)
      objectSerachForProjectScheduleWorkProgramme.SearchProjectScheduleName =
        this.typeprojectScheduleNameValue;


    if (this.page) {
      objectSerachForProjectScheduleWorkProgramme.displayStart = this.pageSize * (this.page - 1);
      objectSerachForProjectScheduleWorkProgramme.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForProjectScheduleWorkProgramme",
      JSON.stringify(objectSerachForProjectScheduleWorkProgramme)
    );
  }

  /**
 * for get object for refesh
 */
  getObjectAfterRefreshProject() {
    let objectSerachForProjectScheduleWorkProgramme: any = JSON.parse(
      localStorage.getItem("objectSerachForProjectScheduleWorkProgramme")
    );

    this.arrayListDropDownClientList =
      objectSerachForProjectScheduleWorkProgramme.arrayListDropDownClientList
        ? objectSerachForProjectScheduleWorkProgramme.arrayListDropDownClientList
        : [];

    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForProjectScheduleWorkProgramme.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForProjectScheduleWorkProgramme.arrayListDropDownProjectOrDeparmentList
        : [];

    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForProjectScheduleWorkProgramme.selectedDropDownProjectOrDeparmentIdValue
        ? objectSerachForProjectScheduleWorkProgramme.selectedDropDownProjectOrDeparmentIdValue
        : [];

    this.selectedDropDownClientIdValue =
      objectSerachForProjectScheduleWorkProgramme.selectedDropDownClientIdValue
        ? objectSerachForProjectScheduleWorkProgramme.selectedDropDownClientIdValue
        : [];

    this.selectedDropDownScheduleStatusIdValue =
      objectSerachForProjectScheduleWorkProgramme.selectedDropDownScheduleStatusIdValue
        ? objectSerachForProjectScheduleWorkProgramme.selectedDropDownScheduleStatusIdValue
        : null;




    this.selectedDropDownCompanyIdValue = objectSerachForProjectScheduleWorkProgramme.SearchCompanyId
      ? objectSerachForProjectScheduleWorkProgramme.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForProjectScheduleWorkProgramme.SearchClientId
      ? objectSerachForProjectScheduleWorkProgramme.SearchClientId
      : null;
    this.arrayListDropDownProjectOrDeparmentList = objectSerachForProjectScheduleWorkProgramme.SearchProjectId
      ? objectSerachForProjectScheduleWorkProgramme.arrayListDropDownProjectOrDeparmentList
      : null;

    this.selectedDropDownProjectOrDeparmentIdValue = objectSerachForProjectScheduleWorkProgramme.SearchProjectId
      ? objectSerachForProjectScheduleWorkProgramme.SearchProjectId
      : null;

    this.typeprojectScheduleNameValue = objectSerachForProjectScheduleWorkProgramme.SearchProjectScheduleName
      ? objectSerachForProjectScheduleWorkProgramme.SearchProjectScheduleName
      : null;

    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectScheduleStatusId = this.selectedDropDownScheduleStatusIdValue;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchProjectScheduleName = this.typeprojectScheduleNameValue;
    if (objectSerachForProjectScheduleWorkProgramme.displayStart) {
      this.payload.displayStart = objectSerachForProjectScheduleWorkProgramme.displayStart;
      this.page = objectSerachForProjectScheduleWorkProgramme.page;
    }

    this.loadData();
    this.getDropdownDepartmentList();
    this.getDropdownClientlist();

  }




  openModalAddprojectSchedule(addprojectSchedule: any) {
    this.modalService.open(addprojectSchedule, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,

      scrollable: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    let url='api/ProjectManagement/GetV2_MX_ProjectScheduleList_ServerPaging_WorkPrograme'
    this.commonHttpServiceCallerService
      .postWithJsonDataMethod(url,
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.projectScheduleList = res.list;
        this.setObjectBeforeRefeshProject();
        if (this.projectScheduleList.length > 0) {
          this.totalRecordsFromApi = res.list[0].totalCount;
          this.from = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.to = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.pageSize = this.payload.displayLength;
        } else {
          this.totalRecordsFromApi = 0;
          this.from = 0;
          this.to = 0;
          this.pageSize = this.payload.displayLength;
        }
      });
  }

  viewHandler() {
    this.router.navigate(['project-management/work-progress/work-progress-view'])

  }

  editHandler(projectSchedule: any, content) {
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      scrollable: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  onTypeprojectScheduleNameChange(isDebounce) {
    if (this.typeprojectScheduleNameValue.length === 0 || isDebounce) {
      this.page = 1;
      this.payload.displayStart = this.pageSize * (this.page - 1);
      this.payload.SearchProjectScheduleName = this.typeprojectScheduleNameValue;
      this.loadData();
    }
  }


  
  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.typeprojectScheduleNameValue = null;
    this.selectedDropDownScheduleStatusIdValue=null
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      companyId: null,
      SearchCatergoryId: null,
      SearchProjectScheduleName: null,
      SearchprojectScheduleStatusId: null,
      SearchSubCategoryId: null,
      SearchprojectSchedulePartStatusId: null,
    };
    this.page = 1;
    this.loadData();
  }
  onDropdownScheduleStatusValueChange(value) {
    this.payload.SearchProjectScheduleStatusId = this.selectedDropDownScheduleStatusIdValue ? this.selectedDropDownScheduleStatusIdValue : null
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.loadData();
  }
  /**
 * Start  For Dropdown Company ,client,project
 */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_CompanyDropDownList_ProjectManagement_WorkPrograme({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (this.currentUserRole === "Client User") {
        this.selectedDropDownCompanyIdValue =
          this.arrayListDropDownCompany[0].companyId;
        this.onDropdownCompanyValueChange("");
      }
      this.setObjectBeforeRefeshProject();
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .Getv3_ClientDropDownList_ProjectManagement_WorkPrograme(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        if (this.currentUserRole === "Client User") {
          this.selectedDropDownClientIdValue =
            this.arrayListDropDownClientList[0].clientId;
          this.onDropdownClientValueChange("");
        }
        this.setObjectBeforeRefeshProject();
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .Getv3_DepartmentDropDownList_ProjectManagement_WorkPrograme(payload)
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
        this.setObjectBeforeRefeshProject();
      });
  }
  onDropdownCompanyValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;

    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.arrayListDropDownProjectOrDeparmentList = [];
    if (this.selectedDropDownCompanyIdValue) {
      this.getDropdownClientlist();
    }

    this.loadData();
  }
  onDropdownClientValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.selectedDropDownClientIdValue) {
      this.getDropdownDepartmentList();
    }
    this.loadData();
  }
  onDropdownDepartmentValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);

    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.loadData();
  }
  /**
   * End  For Dropdown Company ,client,project
   */






  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: "md", centered: true });
  }




  @ViewChild("inputer", { static: true }) input: ElementRef;
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeprojectScheduleNameChange(true);
        })
      )
      .subscribe();
  }



  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }




  openModalDeleteProjectSchedule(projectScheduleObject: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to delete the Work Programme?";
    modalRef.componentInstance.subTitle =
      "Deleting your Work Programme will remove it from the database";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteV2_ProjectScheduleTaskList(projectScheduleObject.projectScheduleId)
        }
      }
    });
  }
  deleteV2_ProjectScheduleTaskList(id) {
    this.projectScheduleService.deleteV2_ProjectScheduleTaskList({ projectScheduleId: id }).subscribe({
      next: (res) => {
        this.loadData();
        this.success(res)
      },
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

  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
  }




  openModalCreateProjectSchedule() {
    const modalRef = this.modalService.open(AddProjectWorkProgressComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });


    modalRef.result.then((result) => {
      if (result) {
        if (result.value == "success") {
          this.loadData();
          console.log(result, "hgvghg")
          this.openSuccessModal(result.res.projectScheduleId, result.requestData)
        } else {
        }
      }
    });
  }

  openSuccessModal(projectScheduleId, projectSchedule) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Work Programme generate successfully and now able to create Task setup?";
    modalRef.componentInstance.buttonName = "Generate It";
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.openTaskCreated(projectScheduleId, projectSchedule);
        }
      }
    });
  }

  openTaskCreated(projectScheduleId, projectSchedule) {
    this.projectScheduleService.sendProjectScheduleId = projectScheduleId
    this.projectScheduleService.projectScheduleObject = { ...projectSchedule }
    this.router.navigate(['project-management/work-progress/work-progress-view'])
  }

  getTaskStatus(totalTask: number, totalTaskCompleted: number) {
    // if (totalTask == 0 && totalTaskCompleted == 0) {
    //   return 0
    // }
    // const pendingTasks = totalTask - totalTaskCompleted;
    // const pendingPercentage = (pendingTasks / totalTask) * 100;
    // const completedPercentage = 100 - pendingPercentage;
    // return completedPercentage;

    if (totalTask === 0 && totalTaskCompleted === 0) {
      return '0%';
    }
    const completedPercentage = Math.round((totalTaskCompleted / totalTask) * 100);
    return completedPercentage.toString() + '%';

  }
  getTaskStatusColor(totalTask: number, totalTaskCompleted: number) {
    if (totalTask == 0 && totalTaskCompleted == 0) {
      return 0
    }
    const pendingTasks = totalTask - totalTaskCompleted;
    const pendingPercentage = (pendingTasks / totalTask) * 100;
    const completedPercentage = 100 - pendingPercentage;
    return completedPercentage;

  }

  showinString(str: string) {
    if (str) {
      if (str.length >= 45) {
        return str.slice(0, 45) + "...";
      } else {
        return str;
      }
    }
    else {
      return str;
    }
  }

  getProjectStatus() {
    let url = 'api/ProjectManagement/GetProjectStatus/ProjectScheduleStatus'
    this.commonHttpServiceCallerService.getWithoutParmaMethod(url).subscribe((res: any) => {
      this.projectScheduleStatusList = res;
    })
  }
}
