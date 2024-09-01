
import { Router } from "@angular/router";
import {
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { DepartmentService } from "src/app/core/services/department.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { WorkForceService } from '../../../../core/services/work-force.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";


@Component({
  selector: 'app-setup-workforce-member-list',
  templateUrl: './setup-workforce-member-list.component.html',
  styleUrl: './setup-workforce-member-list.component.scss'
})
export class SetupWorkforceMemberListComponent {
  label: any = "Workforce Member";

  breadCrumbItems: any = [
    { label: "Workforce Member Setup" },
    { label: "Workforce Member List", active: true },
  ];

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
  selectedWorkForceName: string = "";
  filteredList: any = [];

  workforceList = [];

  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchProjectWorkforceName: null,

  };

  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };

  companyListArray: any = [];
  clientListArray: any = [];
  selectedDepartmentId: null | number = null;
  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
  constructor(
    private router: Router,
    private workForceService: WorkForceService,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private departmentService: DepartmentService,
  ) {

  }

  ngOnInit(): void {
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    }

    this.getCompanyList();
  }


  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    this.workForceService
      .getMX_MX_ProjectWorkforceList_ServerPaging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.workforceList = res.list;
        if (this.workforceList.length > 0) {
          this.totalRecords = res.list[0].totalCount;
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
          this.totalRecords = 0;
          this.from = 0;
          this.to = 0;
          this.pageSize = this.payload.displayLength;
        }
      });
  }

  getCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.companyListArray = res.list;
      //this.setObjectBeforeRefeshProject();
    });
    this.loadData();
  }


  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.companyListArray = res.list;
      if (this.currentUserRole === "Client User") {
        this.selectedCompanyId =
          this.companyListArray[0].companyId;
        this.onDropdownCompanyValueChange("");
      }

    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedCompanyId,
    };
    this.departmentService
      .GetClientListProjectDrobDownApi(payload)
      .subscribe((res: any) => {
        this.clientListArray = res.list;
        if (this.currentUserRole === "Client User") {
          this.selectedClientId =
            this.clientListArray[0].clientId;
          this.onDropdownClientValueChange("");
        }

      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedCompanyId,
      SearchClientId: this.selectedClientId,
    };
    this.departmentService
    .GetDepartmentListProjectDrobDownApi(payload)
      .subscribe((res: any) => {
        this.departmentList = res.list;
        if (res.list.length != 0) {
          if (this.currentUserRole === "Client User") {
            if (res.list.length >= 2) {
              this.projectDepartmentFieldDisiabled = false;
            } else {
              this.projectDepartmentFieldDisiabled = true;
              this.selectedDepartmentId =
                this.departmentList[0].departmentId;
              this.onDropdownDepartmentValueChange("");
            }
          }
        }

      });
  }
  onDropdownCompanyValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.selectedClientId = null;
    this.selectedDepartmentId = null;

    this.payload.SearchClientId = this.selectedClientId;
    this.payload.SearchProjectId =
      this.selectedDepartmentId;
    this.departmentList = [];
    if(this.selectedCompanyId){
    this.getDropdownClientlist();}

    this.loadData();
  }
  onDropdownClientValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchClientId = this.selectedClientId;
    this.selectedDepartmentId = null;
    this.payload.SearchProjectId =
      this.selectedDepartmentId;
      if(this.selectedClientId){
    this.getDropdownDepartmentList();}
    this.loadData();
  }
  onDropdownDepartmentValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchProjectId =
      this.selectedDepartmentId;
    this.loadData();
  }
  /**
   * End  For Dropdown Company ,client,project
   */
  getClientdetails() {
    let payload: any = {
      SearchCompanyId: this.selectedCompanyId,
      SearchClientId: this.selectedClientId
    };
    this.dropdownServices
      .GetClientListDrobDown(payload)
      .subscribe((res: any) => {
        this.clientListArray = res.list;
        //this.setObjectBeforeRefeshProject();
      });
    this.loadData();
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
          this.onTypeWorkForceChange();
        })
      )
      .subscribe();
  }

  onTypeWorkForceChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchProjectWorkforceName = this.selectedWorkForceName;
    this.loadData();
  }

  clearAllPayload() {
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchDepartmentId: null,
      SearchProjectWorkforceName: null
    };

    this.selectedDepartmentId = null;
    this.selectedClientId = null;
    this.selectedCompanyId = null;
    this.selectedWorkForceName = null
  }

  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }


  createWorkforcePage() {
    this.workForceService.accessRight = true;
    this.router.navigate(['project-management/setup-workforce-member/setup-workforce-member-add']);
  }

  navigateToView(event: Event, project: any) {
    DepartmentService.editDepartmentId = project.departmentId;
    //this.router.navigate(["/project-management/project-setup/view-project"]);
  }
  navigateToViewAssignUser(event: Event, project: any) {
    DepartmentService.editDepartmentId = project.departmentId;
    // this.router.navigate([
    //   "/application-settings/department/assign-project-user",
    // ]);
  }

  deleteData(id: any) {
    this.deleteId = id;
    // this.service
    //   .postDeleteDepartment({
    //     DepartmentId: this.deleteId,
    //   })
    //   .subscribe((res: any) => {
    //     this.success(res);
    //     this.deleteId = null;
    //     this.page = 1;
    //     this.getDepartmentList();
    //   });




  }
  pageChange(pageNo): void {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

}
