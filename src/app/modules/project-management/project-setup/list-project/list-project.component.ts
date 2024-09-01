
import { Router } from "@angular/router";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { DepartmentService } from "src/app/core/services/department.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonHttpServiceCallerService } from "src/app/core/services/common-http-service-caller.service";


@Component({
  selector: 'app-list-project',
  templateUrl: './list-project.component.html',
  styleUrl: './list-project.component.scss'
})
export class ListProjectComponent implements OnInit, AfterViewInit {
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  departmentList: any = [];
  isProject: boolean = true;
  selectedCompanyId: any;
  selectedClientId: any;
  selectedDepartmentName: string = "";
  filteredList: any = [];

  payload: any = {
    SearchCompanyId: null,
    SearchClientId: null,
    SearchDepartName: null,
    SearchDepartmentStatusId: null,
    SearchCurrentProcessId: null,
    SearchMaintenanceStatusId: null,
    SearchWarrentyStatusId: null,
    SearchProjectManagementStatusId: null
  };
  companyListArray: any = [];
  clientListArray: any = [];
  label: any = "Department";
  breadCrumbItems: any = [
    { label: "Department" },
    { label: "Department List", active: true },
  ];
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  projectStatusList: any = [];
  selectedDropDownProjectStatusIdValue: any;
  selectedDropDownDocumentSubmitionStatusIdValue: any;
  selectedDropDownAdHocProjectManagemenIdValue: any;
  selectedDropDownWarrentyStatusIdValue: any;
  selectedDropDownMaintenanceManagementIdValue: any;

  DocumentSubmitionStatusList: any[] = [];
  AdHocProjectManagementList: any[] = [];
  MaintenanceManagementStatusList: any[] = [];
  WarrentyStatusList: any[] = [];
  constructor(
    private router: Router,
    private service: DepartmentService,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private authAssetService: AuthAssetService,
    private menuService: MenuServiceService,
    private departmentService: DepartmentService,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);

    console.log("this.returnValueMenu ", this.returnValueMenu)
    this.isProject = this.authAssetService.getisProject();

    if (this.isProject) {
      this.label = "Projects";
      this.breadCrumbItems = [
        { label: "Project" },
        { label: "My Project", active: true },
      ];
    } else {
      this.label = "Departments";
      this.breadCrumbItems = [
        { label: "Department" },
        { label: "My Department", active: true },
      ];
    }
  }

  ngOnInit(): void {

    this.getv3_CompanyDropDownList_Global();
    this.getProjectStatus();
    if (localStorage.getItem("objectSerachForProjectManagementProjectList")) {
      this.getObjectAfterRefreshProject();
    } else {
      this.getDepartmentList();
    }


  }

  getProjectStatus() {
    let url = 'api/ProjectManagement/GetProjectStatus/ProjectStatus'
    this.CommonHttpServiceCallerService.getWithoutParmaMethod(url).subscribe((res: any) => {
      this.projectStatusList = res
    });

    let urlDocumentSubmitionStatus = 'api/ProjectManagement/GetProjectManagementStatus/DocumentSubmitionStatus'
    this.CommonHttpServiceCallerService.getWithoutParmaMethod(urlDocumentSubmitionStatus).subscribe((res: any) => {
      this.DocumentSubmitionStatusList = res
    });

    let urlAdHocProjectManagement = 'api/ProjectManagement/GetProjectManagementStatus/AdHocProjectManagement'
    this.CommonHttpServiceCallerService.getWithoutParmaMethod(urlAdHocProjectManagement).subscribe((res: any) => {
      this.AdHocProjectManagementList = res
    });

    let urlMaintenanceManagementStatus = 'api/ProjectManagement/GetProjectManagementStatus/MaintenanceManagementStatus'
    this.CommonHttpServiceCallerService.getWithoutParmaMethod(urlMaintenanceManagementStatus).subscribe((res: any) => {
      this.MaintenanceManagementStatusList = res
    });

    let urlWarrentyStatus = 'api/ProjectManagement/GetProjectManagementStatus/WarrentyStatus'
    this.CommonHttpServiceCallerService.getWithoutParmaMethod(urlWarrentyStatus).subscribe((res: any) => {
      this.WarrentyStatusList = res
    });


  }


  onDropdownProjectStatusValueChange() {
    this.payload.SearchDepartmentStatusId = this.selectedDropDownProjectStatusIdValue;
    this.payload.SearchCurrentProcessId = this.selectedDropDownDocumentSubmitionStatusIdValue;
    this.payload.SearchMaintenanceStatusId = this.selectedDropDownMaintenanceManagementIdValue;
    this.payload.SearchWarrentyStatusId = this.selectedDropDownWarrentyStatusIdValue;
    this.payload.SearchProjectManagementStatusId = this.selectedDropDownAdHocProjectManagemenIdValue;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.getDepartmentList();
  }





  /**
  * for Set object to refesh
  */
  setObjectBeforeRefeshProject() {
    let objectSerachForProjectManagementProjectList: any = {};
    if (this.selectedCompanyId)
      objectSerachForProjectManagementProjectList.SearchCompanyId =
        this.selectedCompanyId;

    if (this.selectedClientId)
      objectSerachForProjectManagementProjectList.SearchClientId =
        this.selectedClientId;

    if (this.selectedDropDownProjectStatusIdValue) {
      objectSerachForProjectManagementProjectList.SearchDepartmentStatusId =
        this.selectedDropDownProjectStatusIdValue;
    }

    if (this.selectedDropDownDocumentSubmitionStatusIdValue) {
      objectSerachForProjectManagementProjectList.SearchCurrentProcessId =
        this.selectedDropDownDocumentSubmitionStatusIdValue;
    }

    if (this.selectedDropDownMaintenanceManagementIdValue) {
      objectSerachForProjectManagementProjectList.SearchMaintenanceStatusId =
        this.selectedDropDownMaintenanceManagementIdValue;
    }

    if (this.selectedDropDownWarrentyStatusIdValue) {
      objectSerachForProjectManagementProjectList.SearchWarrentyStatusId =
        this.selectedDropDownWarrentyStatusIdValue;
    }

    if (this.selectedDropDownAdHocProjectManagemenIdValue) {
      objectSerachForProjectManagementProjectList.SearchProjectManagementStatusId =
        this.selectedDropDownAdHocProjectManagemenIdValue;
    }



    if (this.clientListArray) {
      objectSerachForProjectManagementProjectList.clientListArray =
        this.clientListArray;
    }
    if (this.selectedDepartmentName) {
      objectSerachForProjectManagementProjectList.SearchDepartName = this.selectedDepartmentName
    }
    if (this.page) {
      objectSerachForProjectManagementProjectList.displayStart = this.pageSize * (this.page - 1);
      objectSerachForProjectManagementProjectList.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForProjectManagementProjectList",
      JSON.stringify(objectSerachForProjectManagementProjectList)
    );
  }

  /**
  * for get object for refesh
  */
  getObjectAfterRefreshProject() {
    let objectSerachForProjectManagementProjectList: any = JSON.parse(
      localStorage.getItem("objectSerachForProjectManagementProjectList")
    );

    this.clientListArray =
      objectSerachForProjectManagementProjectList.clientListArray
        ? objectSerachForProjectManagementProjectList.clientListArray
        : [];

    this.selectedClientId =
      objectSerachForProjectManagementProjectList.selectedClientId
        ? objectSerachForProjectManagementProjectList.selectedClientId
        : [];

    this.selectedCompanyId = objectSerachForProjectManagementProjectList.SearchCompanyId
      ? objectSerachForProjectManagementProjectList.SearchCompanyId
      : null;

    this.selectedDropDownProjectStatusIdValue =
      objectSerachForProjectManagementProjectList.SearchDepartmentStatusId ? objectSerachForProjectManagementProjectList.SearchDepartmentStatusId
        : null
    this.selectedDropDownDocumentSubmitionStatusIdValue =
      objectSerachForProjectManagementProjectList.SearchCurrentProcessId ? objectSerachForProjectManagementProjectList.SearchCurrentProcessId
        : null
    this.selectedDropDownMaintenanceManagementIdValue =
      objectSerachForProjectManagementProjectList.SearchMaintenanceStatusId ? objectSerachForProjectManagementProjectList.SearchMaintenanceStatusId
        : null
    this.selectedDropDownWarrentyStatusIdValue =
      objectSerachForProjectManagementProjectList.SearchWarrentyStatusId ? objectSerachForProjectManagementProjectList.SearchWarrentyStatusId
        : null
    this.selectedDropDownAdHocProjectManagemenIdValue =
      objectSerachForProjectManagementProjectList.SearchProjectManagementStatusId ? objectSerachForProjectManagementProjectList.SearchProjectManagementStatusId
        : null


    this.selectedClientId = objectSerachForProjectManagementProjectList.SearchClientId
      ? objectSerachForProjectManagementProjectList.SearchClientId
      : null;

    this.selectedDepartmentName = objectSerachForProjectManagementProjectList.SearchDepartName
      ? objectSerachForProjectManagementProjectList.SearchDepartName
      : null;

    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.payload.SearchClientId = this.selectedClientId;
    this.payload.SearchDepartName = this.selectedDepartmentName;
    this.payload.SearchDepartmentStatusId = this.selectedDropDownProjectStatusIdValue;
    this.payload.SearchCurrentProcessId = this.selectedDropDownDocumentSubmitionStatusIdValue;
    this.payload.SearchMaintenanceStatusId = this.selectedDropDownMaintenanceManagementIdValue;
    this.payload.SearchWarrentyStatusId = this.selectedDropDownWarrentyStatusIdValue;
    this.payload.SearchProjectManagementStatusId = this.selectedDropDownAdHocProjectManagemenIdValue;

    if (objectSerachForProjectManagementProjectList.displayStart) {
      this.payload.displayStart = objectSerachForProjectManagementProjectList.displayStart;
      this.page = objectSerachForProjectManagementProjectList.page;
    }

    this.getDepartmentList();


  }

  getClientdetails() {
    this.clientListArray = [];
    let payload: any = {
      SearchCompanyId: this.selectedCompanyId,
      SearchClientId: this.selectedClientId
    };
    this.dropdownServices
      .getClientTableList_LocalPagination(this.commonFunctionService.clean(payload))
      .subscribe((res: any) => {
        this.clientListArray = res.list;
        this.setObjectBeforeRefeshProject();
      });

  }

  getDepartmentList() {
    this.service
      .getDepartmentTableList_LocalPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        if (res?.code == "200") {
          this.departmentList = res?.list;

          this.totalRecords = res?.list.length;
          this.filteredList = this.departmentList;;
          this.collectionSize = this.filteredList.length;
          this.getdepartmentPagination();
          this.setObjectBeforeRefeshProject();
        }
      });

  }

  getdepartmentPagination() {
    this.filteredList = this.departmentList.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.to =
      this.page * this.pageSize > this.departmentList.length
        ? this.departmentList.length
        : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.departmentList.length == 0 ? 0 : this.from;
  }

  // goToAddPage() {
  //   this.service.accessRight = true;
  //   DepartmentService.editDepartmentId = 0;
  //   this.router.navigate(["/application-settings/department/add-project"]);
  // }

  goToAddPage() {
    this.service.accessRight = true;
    this.departmentService.currentProjectCompanyId = 0
    this.departmentService.currentProjectClientId = 0
    this.router.navigate(['project-management/project-setup/add-project']);

  }



  getCompanyList() {
    this.dropdownServices.Getv3_CompanyDropDownList_ProjectManagement({}).subscribe((res: any) => {
      this.companyListArray = res.list;
      this.setObjectBeforeRefeshProject();
    });
  }

  getv3_CompanyDropDownList_Global() {
    this.dropdownServices.Getv3_CompanyDropDownList_Global({}).subscribe((res: any) => {
      this.companyListArray = res.list;
      this.setObjectBeforeRefeshProject();
    });
  }



  onCompanyValueChange($event) {
    this.page = 1;
    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.selectedClientId = null;
    this.payload.SearchClientId = this.selectedClientId;
    this.payload.SearchDepartName = this.selectedDepartmentName;
    this.clientListArray = [];
    if (this.selectedCompanyId) {
      this.getClientdetails();
    }
    this.getDepartmentList();
  }
  onClientValueChange($event) {
    this.page = 1;
    this.payload.SearchClientId = this.selectedClientId;
    this.payload.SearchDepartName = this.selectedDepartmentName;
    this.getDepartmentList();
  }

  // searchFilter(event) {
  //   this.page = 1;
  //   if (this.selectedDepartmentName) {
  //     const value = this.selectedDepartmentName
  //     this.payload.SearchDepartName = value
  //     this.filteredList = this.departmentList.filter((i) => i.departmentName?.toLowerCase().includes(value?.toLowerCase() || ''));
  //     this.collectionSize = this.filteredList.length;
  //     this.totalRecords = this.filteredList.length;
  //     this.to = this.page * this.pageSize > this.filteredList.length ? this.filteredList.length : this.page * this.pageSize;
  //     let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
  //     this.from = fromvalue < 1 ? 1 : fromvalue;
  //     this.from = this.filteredList.length == 0 ? 0 : this.from;
  //   } else {
  //     const value = this.selectedDepartmentName
  //     this.payload.SearchDepartName = value
  //     this.getDepartmentList();
  //   }
  // }

  editHandler(event: Event, project: any) {
    this.service.accessRight = true;
    DepartmentService.editDepartmentId = project.departmentId;
    this.router.navigate(["project-management/project-setup/add-project"]);
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  navigateToView(event: Event, project: any) {
    sessionStorage.removeItem('pm-project-ActiveTab')
    DepartmentService.editDepartmentId = project.departmentId;
    this.router.navigate(["/project-management/project-setup/view-project"]);
  }
  navigateToViewAssignUser(event: Event, project: any) {
    DepartmentService.editDepartmentId = project.departmentId;
    this.router.navigate([
      "/application-settings/department/assign-project-user",
    ]);
  }

  viewHandler(event: Event, project: any) { }

  clearAllPayload() {
    this.selectedCompanyId = null;
    this.selectedClientId = null;
    this.selectedDepartmentName = null;
    this.selectedDropDownProjectStatusIdValue = null;
    this.selectedDropDownDocumentSubmitionStatusIdValue = null;
    this.selectedDropDownMaintenanceManagementIdValue = null;
    this.selectedDropDownWarrentyStatusIdValue = null;
    this.selectedDropDownAdHocProjectManagemenIdValue = null;

    this.payload = {
      SearchCompanyId: null,
      SearchClientId: null,
      SearchDepartName: null,
      SearchDepartmentStatusId: null,
      SearchCurrentProcessId: null,
      SearchMaintenanceStatusId: null,
      SearchWarrentyStatusId: null,
      SearchProjectManagementStatusId: null
    };
    this.page = 1;
    this.clientListArray = [];
    this.getDepartmentList();
  }
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  deleteData(id: any) {
    this.deleteId = id;
    this.service
      .postDeleteDepartment({
        DepartmentId: this.deleteId,
      })
      .subscribe((res: any) => {
        this.success(res);
        this.deleteId = null;
        this.page = 1;
        this.getDepartmentList();
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

  @ViewChild("inputer", { static: true }) input: ElementRef;
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(300),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.searchFilter();
        })
      )
      .subscribe();
  }

  searchFilter() {
    this.page = 1;
    if (this.selectedDepartmentName) {
      this.payload.SearchDepartName = this.selectedDepartmentName;
      this.getDepartmentList();
    } else {
      this.payload.SearchDepartName = null;
      this.getDepartmentList();
    }
  }

  getDepartmentLoad(event) {
    console.log(event);
    this.page = 1;
    this.getDepartmentList();
    this.modalService.dismissAll();
  }
}
