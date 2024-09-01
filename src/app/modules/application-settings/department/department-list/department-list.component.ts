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
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

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
  selector: "app-department-list",
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.scss"],
})
export class DepartmentListComponent implements OnInit, AfterViewInit {
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
    SearchCompanyId: "",
    SearchClientId: "",
    SearchDepartName: "",
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
  selectedDropDownProjectStatusIdValue: any = null;

  constructor(
    private router: Router,
    private service: DepartmentService,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private authAssetService: AuthAssetService,
    private menuService: MenuServiceService,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);

    this.isProject = this.authAssetService.getisProject();

    if (this.isProject) {
      this.label = "Projects";
      this.breadCrumbItems = [
        { label: "Project" },
        { label: "Project List", active: true },
      ];
    } else {
      this.label = "Departments";
      this.breadCrumbItems = [
        { label: "Department" },
        { label: "Department List", active: true },
      ];
    }
  }

  ngOnInit(): void {
    this.service.currentProjectClientId = 0;
    this.service.currentProjectCompanyId = 0;
    this.getProjectStatus();
    this.getCompanyList();
    this.getDepartmentList();
  }

  getProjectStatus() {
    let url = 'api/ProjectManagement/GetProjectStatus/ProjectStatus'
    this.CommonHttpServiceCallerService.getWithoutParmaMethod(url).subscribe((res: any) => {
      this.projectStatusList = res
    });
  }

  onDropdownProjectStatusValueChange() {
    this.payload.SearchDepartmentStatusId = this.selectedDropDownProjectStatusIdValue;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.getDepartmentList();
  }



  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }


  getClientdetails() {
    let payload: any = {
      SearchCompanyId: this.selectedCompanyId,
      SearchClientId: this.selectedClientId
    };
    this.service
      .getClientForApplicationSettingDrobDown(payload)
      .subscribe((res: any) => {
        this.clientListArray = res.list;
      
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
          this.filteredList = this.departmentList;
          this.collectionSize = this.filteredList.length;
          this.getdepartmentPagination();
        
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

  goToAddPage() {
    this.service.accessRight = true;
    DepartmentService.editDepartmentId = 0;
    this.router.navigate(["/application-settings/department/add-project"]);
  }

  getCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.companyListArray = res.list;
    
    });
  }

  onCompanyValueChange($event) {
    this.page = 1;
    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.selectedClientId = null;
    this.payload.SearchClientId = this.selectedClientId;
    this.payload.SearchDepartName = this.selectedDepartmentName;
    this.getClientdetails();
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
    this.router.navigate(["/application-settings/department/edit-project"]);
  }

  navigateToView(event: Event, project: any) {
    DepartmentService.editDepartmentId = project.departmentId;
    this.router.navigate(["/application-settings/department/view-project"]);
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
    this.payload = {
      SearchCompanyId: null,
      SearchClientId: null,
      SearchDepartName: null,
      SearchDepartmentStatusId: null
    };
    this.page = 1;
    this.clientListArray = [];
    this.getDepartmentList();
  }
  deleteId: any;
  confirmDelete(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  confirm(content: any, id: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Delete Project";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.confirmDelete(content, id);
        } else {
          // this.onBack();
        }
      }
    });
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
}
