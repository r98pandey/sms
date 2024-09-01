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
  tap,
} from "rxjs";
import { DatePipe } from "@angular/common";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { PreventiveService } from "../../../../../core/services/preventive.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-configuration-list",
  templateUrl: "./configuration-list.component.html",
  styleUrls: ["./configuration-list.component.scss"],
})
export class ConfigurationListComponent implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Preventive Management";
  breadCrumbItems: any = [
    { label: "Configuration" },
    { label: "Configuration List", active: true },
  ];
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchFrequency: null,
    SearchConfigPreventivePDescription: null,
    SearchPMScheduleStatusId: null,
  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  preventiveConfigList: any = [];
  page = 1;
  collectionSize = 0;
  frequencyList: any = ["Monthly", "Hourly", "Yearly", "Quarterly"];

  imageUrl: any = environment.apiUrl;
  viewImageValue: any;
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };

  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;

  selectedRequesterName: any;
  selectedRequesterEmail: any;

  typeRequesterNameValue: any;
  typeFrequencyValue: any;
  operationList = [
    { name: "Service", operationTypeId: 1 },
    { name: "Incident Report", operationTypeId: 2 },
  ];
  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
  scheduleStatusIdValue: any;
  preventiveStatusList: any;

  constructor(
    private dropdownService: DropdownService,
    private router: Router,
    private modalService: NgbModal,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private datePipe: DatePipe,
    private helpDeskService: HelpDeskService,
    private preventiveService: PreventiveService,
    private menuService: MenuServiceService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {
    this.getDropdownCompanyList();
    this.getPreventiveStatusList();
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    }
    if (localStorage.getItem("objectSerachForConfigurationList")) {
      this.getObjectAfterRefresh();
    } else {
      this.loadData();

    }

  }



  navigateToAdd() {
    this.preventiveService.accessRight = true;
    this.router.navigate([
      "/maintenance-management/preventive/configuration/add-configuration",
    ]);
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    this.preventiveService
      .getV2_MX_Config_PreventiveList_ServerPaging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.preventiveConfigList = res.list;
        this.setObjectBeforeRefesh();
        if (this.preventiveConfigList.length > 0) {
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

  /**
 * for Set object to refesh
 */
  setObjectBeforeRefesh() {
    let objectSerachForConfigurationList: any = {};
    if (this.selectedDropDownCompanyIdValue)
      objectSerachForConfigurationList.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
      objectSerachForConfigurationList.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForConfigurationList.SearchProjectId =
        this.selectedDropDownProjectOrDeparmentIdValue;

    if (this.typeFrequencyValue)
      objectSerachForConfigurationList.SearchFrequency = this.typeFrequencyValue;

    if (this.scheduleStatusIdValue)
      objectSerachForConfigurationList.SearchPMScheduleStatusId = this.scheduleStatusIdValue;


    if (this.typeRequesterNameValue)
      objectSerachForConfigurationList.SearchConfigPreventivePDescription = this.typeRequesterNameValue;

    if (this.arrayListDropDownClientList) {
      objectSerachForConfigurationList.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForConfigurationList.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }

    if (this.page) {
      objectSerachForConfigurationList.displayStart = this.pageSize * (this.page - 1);
      objectSerachForConfigurationList.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForConfigurationList",
      JSON.stringify(objectSerachForConfigurationList)
    );
  }

  /**
  * for get object for refesh
  */
  getObjectAfterRefresh() {
    let objectSerachForConfigurationList: any = JSON.parse(
      localStorage.getItem("objectSerachForConfigurationList")
    );
    this.arrayListDropDownClientList =
      objectSerachForConfigurationList.arrayListDropDownClientList
        ? objectSerachForConfigurationList.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
      objectSerachForConfigurationList.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForConfigurationList.arrayListDropDownProjectOrDeparmentList
        : [];

    this.selectedDropDownCompanyIdValue = objectSerachForConfigurationList.SearchCompanyId
      ? objectSerachForConfigurationList.SearchCompanyId
      : null;
    this.selectedDropDownClientIdValue = objectSerachForConfigurationList.SearchClientId
      ? objectSerachForConfigurationList.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
      objectSerachForConfigurationList.SearchProjectId
        ? objectSerachForConfigurationList.SearchProjectId
        : null;


    this.typeFrequencyValue =
      objectSerachForConfigurationList.SearchFrequency
        ? objectSerachForConfigurationList.SearchFrequency
        : null;

    this.scheduleStatusIdValue =
      objectSerachForConfigurationList.SearchPMScheduleStatusId
        ? objectSerachForConfigurationList.SearchPMScheduleStatusId
        : null;

    this.typeRequesterNameValue =
      objectSerachForConfigurationList.SearchConfigPreventivePDescription
        ? objectSerachForConfigurationList.SearchConfigPreventivePDescription
        : null;

    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchFrequency = this.typeFrequencyValue;
    this.payload.SearchPMScheduleStatusId = this.scheduleStatusIdValue;
    this.payload.SearchConfigPreventivePDescription = this.typeRequesterNameValue;

    if (objectSerachForConfigurationList.displayStart) {
      this.payload.displayStart = objectSerachForConfigurationList.displayStart;
      this.page = objectSerachForConfigurationList.page;
    }
    this.loadData();
  }

  getPreventiveStatusList() {
    this.preventiveService.getPreventiveStatusList().subscribe((res) => {
      this.preventiveStatusList = res
      this.setObjectBeforeRefesh();
    })
  }

  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.typeFrequencyValue = null;
    this.typeRequesterNameValue = null;
    this.selectedRequesterEmail = null;
    this.scheduleStatusIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchFrequency: null,
      SearchConfigPreventivePDescription: null,
      SearchRequesterEmail: null,
      SearchPMScheduleStatusId: null,
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
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList({}).subscribe((res: any) => {
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
      .Getv3_MaintenanceClientDropDownList(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        if (this.currentUserRole === "Client User") {
          this.selectedDropDownClientIdValue =
            this.arrayListDropDownClientList[0].clientId;
          this.onDropdownClientValueChange("");
        } this.setObjectBeforeRefesh();
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceDepartmentDropDownList(payload)
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
    if(this.selectedDropDownCompanyIdValue){  this.getDropdownClientlist();}

    this.loadData();
  }
  onDropdownClientValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
      if(this.selectedDropDownClientIdValue){this.getDropdownDepartmentList();}
    this.setObjectBeforeRefesh();
    this.loadData();
  }
  onDropdownDepartmentValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);

    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.setObjectBeforeRefesh();
    this.loadData();
  }
  /**
   * End  For Dropdown Company ,client,project
   */

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  @ViewChild("inputerRequesterName", { static: true })
  inputerRequesterName: ElementRef;

  @ViewChild("inputerCreatedDate", { static: true })
  inputerCreatedDate: ElementRef;

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.inputerRequesterName.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeRequesterNameChange();
        })
      )
      .subscribe();
  }
  onTypeRequesterNameChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchConfigPreventivePDescription =
      this.typeRequesterNameValue;
    this.loadData();
  }
  onChangeFrequencyValueChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchFrequency = this.typeFrequencyValue;
    this.loadData();
  }
  onChangePMScheduleStatusIValueChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchPMScheduleStatusId = this.scheduleStatusIdValue;
    this.loadData();
  }

  submitFilterData() {
    this.payload.SearchConfigPreventivePDescription =
      this.selectedRequesterName;
    this.payload.SearchRequesterEmail = this.selectedRequesterEmail;
    this.loadData();
  }
  openFilter(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.submitFilterData();
        },
        (reason) => {
          this.submitFilterData();
        }
      );
  }

  viewHandler(configPreventiveId: any, preventiveCategoryId: any) {
    this.preventiveService.configPreventiveId = configPreventiveId;
    this.preventiveService.preventiveCategoryId = preventiveCategoryId;

    this.router.navigate([
      "maintenance-management/preventive/configuration/view-configuration",
    ]);
  }

  openModalActiveDeactive(value: any, status: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Do you want to " + status + " this  Schedule ";
    modalRef.componentInstance.subTitle = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = status + " It";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          this.updateUserActiveInActive(value, status);
        }
      }
    });
  }

  updateUserActiveInActive(configPreventiveId: any, ProfileStatus: any) {
    let paylyoad = {
      ConfigPreventiveId: configPreventiveId,
    };
    this.preventiveService
      .DeactivteConfigSchedule(paylyoad)
      .subscribe((res) => {
        this.loadData();
        this.success(res);
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
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }



}
