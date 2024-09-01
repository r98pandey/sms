
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
import { AddProjectScheduleComponent } from "../add-project-schedule/add-project-schedule.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';


@Component({
  selector: 'app-project-schedule-list',
  templateUrl: './project-schedule-list.component.html',
  styleUrl: './project-schedule-list.component.scss'
})
export class ProjectScheduleListComponent implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Task Schedule Management";
  breadCrumbItems: any = [
    { label: "Task Schedule" },
    { label: "Task Schedule List", active: true },
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
      { label: "Task Schedule" },
      { label: "Task Schedule List", active: true },
    ];
    this.getDropdownCompanyList();
    this.getProjectStatus();
    if (localStorage.getItem("objectSerachForProjectSchedule")) {
      this.getObjectAfterRefreshProject();
    } else {
      this.loadData();
    }
  }

  /**
 * for Set object to refesh
 */
  setObjectBeforeRefeshProject() {
    let objectSerachForProjectSchedule: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForProjectSchedule.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachForProjectSchedule.SearchClientId =
        this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForProjectSchedule.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;

    if (this.arrayListDropDownClientList) {
      objectSerachForProjectSchedule.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.selectedDropDownScheduleStatusIdValue) {
      objectSerachForProjectSchedule.selectedDropDownScheduleStatusIdValue =
        this.selectedDropDownScheduleStatusIdValue;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForProjectSchedule.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList
    }
    if (this.typeprojectScheduleNameValue)
      objectSerachForProjectSchedule.SearchProjectScheduleName =
        this.typeprojectScheduleNameValue;


    if (this.page) {
      objectSerachForProjectSchedule.displayStart = this.pageSize * (this.page - 1);
      objectSerachForProjectSchedule.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForProjectSchedule",
      JSON.stringify(objectSerachForProjectSchedule)
    );
  }

  /**
 * for get object for refesh
 */
  getObjectAfterRefreshProject() {
    let objectSerachForProjectSchedule: any = JSON.parse(
      localStorage.getItem("objectSerachForProjectSchedule")
    );

    this.arrayListDropDownClientList =
      objectSerachForProjectSchedule.arrayListDropDownClientList
        ? objectSerachForProjectSchedule.arrayListDropDownClientList
        : [];

    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForProjectSchedule.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForProjectSchedule.arrayListDropDownProjectOrDeparmentList
        : [];

    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForProjectSchedule.selectedDropDownProjectOrDeparmentIdValue
        ? objectSerachForProjectSchedule.selectedDropDownProjectOrDeparmentIdValue
        : [];

    this.selectedDropDownClientIdValue =
      objectSerachForProjectSchedule.selectedDropDownClientIdValue
        ? objectSerachForProjectSchedule.selectedDropDownClientIdValue
        : [];

    this.selectedDropDownScheduleStatusIdValue =
      objectSerachForProjectSchedule.selectedDropDownScheduleStatusIdValue
        ? objectSerachForProjectSchedule.selectedDropDownScheduleStatusIdValue
        : null;




    this.selectedDropDownCompanyIdValue = objectSerachForProjectSchedule.SearchCompanyId
      ? objectSerachForProjectSchedule.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForProjectSchedule.SearchClientId
      ? objectSerachForProjectSchedule.SearchClientId
      : null;
    this.arrayListDropDownProjectOrDeparmentList = objectSerachForProjectSchedule.SearchProjectId
      ? objectSerachForProjectSchedule.arrayListDropDownProjectOrDeparmentList
      : null;

    this.selectedDropDownProjectOrDeparmentIdValue = objectSerachForProjectSchedule.SearchProjectId
      ? objectSerachForProjectSchedule.SearchProjectId
      : null;

    this.typeprojectScheduleNameValue = objectSerachForProjectSchedule.SearchProjectScheduleName
      ? objectSerachForProjectSchedule.SearchProjectScheduleName
      : null;

    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectScheduleStatusId = this.selectedDropDownScheduleStatusIdValue;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchProjectScheduleName = this.typeprojectScheduleNameValue;
    if (objectSerachForProjectSchedule.displayStart) {
      this.payload.displayStart = objectSerachForProjectSchedule.displayStart;
      this.page = objectSerachForProjectSchedule.page;
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
    this.projectScheduleService
      .getV2_MX_ProjectScheduleList_ServerPaging(
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
    this.router.navigate(['project-management/task-setup/project-schedule-view'])

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
    this.dropdownServices.Getv3_CompanyDropDownList_ProjectManagement({}).subscribe((res: any) => {
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
      .Getv3_ClientDropDownList_ProjectManagement(payload)
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
      .Getv3_DepartmentDropDownList_ProjectManagement(payload)
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
      "Are you sure you want to delete the Task Schedule?";
    modalRef.componentInstance.subTitle =
      "Deleting your Task Schedule will remove it from the database";

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
    const modalRef = this.modalService.open(AddProjectScheduleComponent, {
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
      "Task Schedule generate successfully and now able to create Task setup?";
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
    this.router.navigate(['project-management/task-setup/project-schedule-view'])
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
