import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { TicketService } from "src/app/core/services/ticket.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  tap,
} from "rxjs";
import { AuditService } from "src/app/core/services/audit.service";
import { AssetService } from "src/app/core/services/asset.service";
import { event } from "jquery";

@Component({
  selector: "app-listaudit",
  templateUrl: "./listaudit.component.html",
  styleUrls: ["./listaudit.component.scss"],
})
export class ListauditComponent implements OnInit, AfterViewInit, OnDestroy {
  isProject: boolean = false;
  label: any = "Audit";
  breadCrumbItems: any = [
    { label: "Audit" },
    { label: "New Audit List", active: true },
  ];
  payload: any = {
    SelfAudit: 0,
    SearchYear: new Date().getFullYear(),
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    displayLength: 10,
    displayStart: 0,
    SearchAssetAuditName: null,
  };
  // SearchAuditStatusId: null,
  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  auditList = [];
  page = 1;
  collectionSize = 0;

  imageUrl: any = environment.apiUrl;
  viewImageValue: any;
  returnValueMenu: any;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownTicketStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownAuditStatusIdValue: any;

  typeAuditNameValue: any;
  storeAuditStatusId: any;

  selectedDateValue: any = new Date().getFullYear();
  yearsList: any = [];

  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;

  constructor(
    private dropdownService: DropdownService,
    private router: Router,
    private modalService: NgbModal,
    private auditService: AuditService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private assetService: AssetService
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2000; year--) {
      this.yearsList.push(year);
    }
  }

  ngOnInit(): void {
    this.getAssetStatusList("AssetAuditList");

    this.getDropdownCompanyList();
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    }
    if (localStorage.getItem("objectSerachForListAudit")) {
      this.getObjectAfterRefresh();
    } else {
      this.loadData();
    }

  }

  /**
  * for Set object to refesh
  */
  setObjectBeforeRefesh() {
    let objectSerachForListAudit: any = {};
    if (this.arrayListDropDownCompany)
      objectSerachForListAudit.arrayListDropDownCompany = this.arrayListDropDownCompany;
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForListAudit.SearchCompanyId = this.selectedDropDownCompanyIdValue;

    if (this.arrayListDropDownClientList) {
      objectSerachForListAudit.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForListAudit.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }
    if (this.selectedDropDownClientIdValue)
      objectSerachForListAudit.SearchClientId = this.selectedDropDownClientIdValue;

    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForListAudit.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;

    if (this.arrayListDropDownTicketStatus)
      objectSerachForListAudit.arrayListDropDownTicketStatus = this.arrayListDropDownTicketStatus;
    if (this.selectedDropDownAuditStatusIdValue)
      objectSerachForListAudit.SearchAuditStatusId = this.selectedDropDownAuditStatusIdValue;

    if (this.typeAuditNameValue)
      objectSerachForListAudit.SearchAssetAuditName = this.typeAuditNameValue;

    if (this.page) {
      objectSerachForListAudit.displayStart = this.pageSize * (this.page - 1);
      objectSerachForListAudit.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForListAudit",
      JSON.stringify(objectSerachForListAudit)
    );
  }

  /**
* for get object for refesh
*/
  getObjectAfterRefresh() {
    let objectSerachForListAudit: any = JSON.parse(
      localStorage.getItem("objectSerachForListAudit")
    );
    this.selectedDropDownCompanyIdValue =
      objectSerachForListAudit.selectedDropDownCompanyIdValue
        ? objectSerachForListAudit.selectedDropDownCompanyIdValue
        : [];
    this.selectedDropDownCompanyIdValue = objectSerachForListAudit.SearchCompanyId
      ? objectSerachForListAudit.SearchCompanyId
      : null;

    this.arrayListDropDownCompany =
      objectSerachForListAudit.arrayListDropDownCompany
        ? objectSerachForListAudit.arrayListDropDownCompany
        : [];
    this.arrayListDropDownClientList =
      objectSerachForListAudit.arrayListDropDownClientList
        ? objectSerachForListAudit.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForListAudit.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForListAudit.arrayListDropDownProjectOrDeparmentList
        : [];

    this.typeAuditNameValue =
      objectSerachForListAudit.typeAuditNameValue
        ? objectSerachForListAudit.typeAuditNameValue
        : [];

    this.selectedDropDownAuditStatusIdValue =
      objectSerachForListAudit.selectedDropDownAuditStatusIdValue
        ? objectSerachForListAudit.selectedDropDownAuditStatusIdValue
        : [];

    this.selectedDropDownAuditStatusIdValue = objectSerachForListAudit.SearchAuditStatusId
      ? objectSerachForListAudit.SearchAuditStatusId
      : null;
    this.typeAuditNameValue = objectSerachForListAudit.SearchAssetAuditName
      ? objectSerachForListAudit.SearchAssetAuditName
      : null;

    this.selectedDropDownClientIdValue = objectSerachForListAudit.SearchClientId
      ? objectSerachForListAudit.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForListAudit.SearchProjectId
        ? objectSerachForListAudit.SearchProjectId
        : null;

    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchAuditStatusId = this.selectedDropDownAuditStatusIdValue;
    this.payload.SearchAssetAuditName = this.typeAuditNameValue;
    this.loadData();

  }

  getAssetStatusList(id: any) {
    this.assetService.getAssetStatusList(id).subscribe(
      (res: any) => {
        this.arrayListDropDownTicketStatus = res;
        this.setObjectBeforeRefesh();
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    // this.payload.SearchAuditStatusId = this.storeAuditStatusId;

    this.auditService
      .getMasterAssetAudit_Paging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.auditList = res.list;
        this.setObjectBeforeRefesh();
        if (this.auditList.length > 0) {
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

  viewHandler(auditId: any) {
    this.auditService.auditId = auditId;
    this.router.navigate(["asset-management/audit-management/audit/viewaudit"]);
  }

  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDateValue = new Date().getFullYear();
    this.typeAuditNameValue = null;
    this.selectedDropDownAuditStatusIdValue = null;
    this.payload = {
      SelfAudit: 0,
      SearchYear: new Date().getFullYear(),
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchAssetAuditName: null,
      displayLength: 10,
      displayStart: 0,
      SearchAuditStatusId: null,
    };
    if (this.currentUserRole === "Client User") {
      this.resetAfterClientUser();
    } else {
      this.page = 1;
      this.loadData();
    }
  }
  resetAfterClientUser() {
    this.selectedDropDownCompanyIdValue =
      this.arrayListDropDownCompany[0].companyId;
    this.onDropdownCompanyValueChange("");
    if (this.arrayListDropDownClientList.length != 0) {
      this.selectedDropDownClientIdValue =
        this.arrayListDropDownClientList[0].clientId;
      this.onDropdownClientValueChange("");
    }
    if (this.arrayListDropDownProjectOrDeparmentList.length != 0) {
      if (this.currentUserRole === "Client User") {
        if (this.arrayListDropDownProjectOrDeparmentList.list.length >= 2) {
          this.projectDepartmentFieldDisiabled = false;
        } else {
          this.projectDepartmentFieldDisiabled = true;
          this.selectedDropDownProjectOrDeparmentIdValue =
            this.arrayListDropDownProjectOrDeparmentList[0].departmentId;
          this.onDropdownDepartmentValueChange("");
        }
      }
    }
  }
  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_CompanyDropDownList_AssetManagement({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (this.currentUserRole === "Client User") {
        this.selectedDropDownCompanyIdValue =
          this.arrayListDropDownCompany[0].companyId;
        this.onDropdownCompanyValueChange("");
      }
      this.setObjectBeforeRefesh();
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .Getv3_ClientDropDownList_AssetManagement(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        if (this.currentUserRole === "Client User") {
          this.selectedDropDownClientIdValue =
            this.arrayListDropDownClientList[0].clientId;
          this.onDropdownClientValueChange("");
        }
        this.setObjectBeforeRefesh();
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .Getv3_DepartmentDropDownList_AssetManagement(payload)
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
        this.setObjectBeforeRefesh();
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
      if(this.selectedDropDownClientIdValue){
    this.getDropdownDepartmentList();}
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
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  @ViewChild("inputerTicketNumber", { static: true })
  inputerTicketNumber: ElementRef;

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.inputerTicketNumber.nativeElement, "input")
      .pipe(
        debounceTime(1000),
        map((event: any) => event.target.value), // Extract the input value
        distinctUntilChanged((prev, curr) => prev === curr || (!prev && !curr)), // Add custom equality check to handle empty values
        tap((searchValue) => {
          //console.log("searchValue", searchValue);
          this.onTypeTicketNameChange();
        })
      )
      .subscribe();
  }
  onTypeTicketNameChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchAssetAuditName = this.typeAuditNameValue;
    this.loadData();
  }

  onDropdownYearValueChange(event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchYear = this.selectedDateValue;
    this.loadData();
  }

  onDropdownTicketStatusValueChange(event: any) {
    this.page = 1;
    this.selectedDropDownAuditStatusIdValue = event?.assetStatusId
      ? event?.assetStatusId
      : null;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchAuditStatusId = this.selectedDropDownAuditStatusIdValue;
    this.loadData();
  }
  navigateToAdd() {
    //console.log("navigate to add");
    this.auditService.accessRight = true;
    this.router.navigate([
      "asset-management/audit-management/audit/createaudit",
    ]);
  }
  ngOnDestroy() {
    // this.helpDeskService.ticketStatusId = 0;
  }

  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }
}
