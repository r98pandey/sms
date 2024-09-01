
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
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
  selector: 'app-pm-project-schedule',
  templateUrl: './pm-project-schedule.component.html',
  styleUrl: './pm-project-schedule.component.scss'
})
export class PmProjectScheduleComponent implements OnInit, AfterViewInit,OnChanges {
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
  @Input() SearchProjectId: any
  @Input() dDetail:any;

  @Input() projectSchedule_Add:boolean        
  @Input() projectSchedule_Delete:boolean
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
  selectedDropDownScheduleStatusIdValue: any = null;
  typeprojectScheduleNameValue: any = ''
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
  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Task Schedule" },
      { label: "Task Schedule List", active: true },
    ];
    this.getProjectStatus();

    
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
    this.payload.SearchProjectId =this.SearchProjectId
      this.projectScheduleService
        .getV2_MX_ProjectScheduleList_ServerPaging(
          this.commonFunctionService.clean(this.payload)
        )
        .subscribe((res: any) => {
          this.projectScheduleList = res.list;    
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
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.typeprojectScheduleNameValue = null;
    this.selectedDropDownScheduleStatusIdValue = null
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

    modalRef.componentInstance.dDetail=this.dDetail


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
