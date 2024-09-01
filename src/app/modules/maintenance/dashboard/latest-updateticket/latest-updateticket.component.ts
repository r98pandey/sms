
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
import { HelpDeskService } from "../../../../core/services/help-desk.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  tap,
} from "rxjs";

@Component({
  selector: 'app-latest-updateticket',
  templateUrl: './latest-updateticket.component.html',
  styleUrl: './latest-updateticket.component.scss'
})
export class LatestUpdateticketComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isProject: boolean = false;
  label: any = "Help-Desk";
  breadCrumbItems: any = [
    { label: "Ticket" },
    { label: "New Ticket List", active: true },
  ];
  payload: any = {
    displayLength: 15,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchLocationId: null,
    SearchCategoryId: null,
    SearchSubCategoryId: null,
    SearchTicketTitle: null,
    SearchTicketNo: null,
  };

  to = 0;
  from = 0;
  pageSize = 15;
  totalRecordsFromApi: number = 0;
  ticketList = [];
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
  selectedDropDownTicketStatusIdValue: any;

  typeTicketNameValue: any;
  storeTicketStatusId: any;
  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
  constructor(
    private dropdownService: DropdownService,
    private router: Router,
    private modalService: NgbModal,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private helpDeskService: HelpDeskService
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();

    this.currentUserRole = JSON.parse(
      localStorage.getItem("currentUser")
    ).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    }

  }

  ngOnInit(): void {
    this.getDropdownCompanyList();
    this.loadData();

  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    this.ticketService
      .getV2_MaintenanceTaskList_Paging(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        this.ticketList = res.list;
        if (this.ticketList.length > 0) {
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




  // viewHandler(ticketId: any) {
  //   this.ticketService.sendTicketId = ticketId;
  //   if (this.helpDeskService.pageAction === "Waiting Client to Close Ticket") {
  //     this.ticketService.ticketPageAction = "Waiting Client to Close Ticket";
  //     this.ticketService.lastStoreTicketRouterName =
  //       "/maintenance-management/dashboard/new-ticket-list";
  //     localStorage.setItem(
  //       "lastStoreTicketRouterName",
  //       this.ticketService.lastStoreTicketRouterName
  //     );
  //     this.router.navigate([
  //       "/maintenance-management/corrective/ticket/ticket-view",
  //     ]);
  //   }
  //   if (this.helpDeskService.pageAction === "Total Ticket Quotation Rejected") {
  //     this.ticketService.ticketPageAction = "Total Ticket Quotation Rejected";
  //     this.ticketService.lastStoreTicketRouterName =
  //       "/maintenance-management/dashboard/new-ticket-list";
  //     localStorage.setItem(
  //       "lastStoreTicketRouterName",
  //       this.ticketService.lastStoreTicketRouterName
  //     );
  //     this.router.navigate([
  //       "/maintenance-management/corrective/ticket/ticket-view",
  //     ]);
  //   } else {
  //     this.ticketService.lastStoreRouterDashboardName =
  //       "/maintenance-management/dashboard/new-ticket-list";
  //     this.router.navigate([
  //       "maintenance-management/dashboard/view-new-ticket-list",
  //     ]);
  //   }
  // }

  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.arrayListDropDownTicketStatus = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownTicketStatusIdValue = null;
    this.typeTicketNameValue = null;
    this.payload = {
      displayLength: 15,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchLocationId: null,
      SearchCategoryId: null,
      SearchSubCategoryId: null,
      SearchTicketTitle: null,
      SearchTicketNo: null,
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
    this.typeTicketNameValue = null;

  }
  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
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
      .GetClientListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;

        if (this.currentUserRole === "Client User") {
          this.selectedDropDownClientIdValue =
            this.arrayListDropDownClientList[0].clientId;
          this.onDropdownClientValueChange("");
        }

      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .GetDepartmentListDrobDown(payload)
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
    if(this.selectedDropDownCompanyIdValue){
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
  returnAssetStatusBorderAndBadgeClasses(id: any) {
    return 'bg-'+this.commonFunctionService.returnAssetStatusBorderAndBadgeClasses(id)+'-subtle';
  }
  returnAssetStatusBorderAndBadgeClasses_text(id: any) {
    return 'text-'+this.commonFunctionService.returnAssetStatusBorderAndBadgeClasses(id);
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
    this.payload.SearchTicketTitle = this.typeTicketNameValue;
    this.loadData();
  }
  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
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
  viewHandler(ticketId: any) {
    this.ticketService.sendTicketId = ticketId;
    this.helpDeskService.pageAction = "";
    this.ticketService.ticketPageAction = "Basic Service Page";
    this.ticketService.lastStoreTicketRouterName =
      "/maintenance-management/dashboard/help-desk-dashboard";
    localStorage.setItem(
      "lastStoreTicketRouterName",
      this.ticketService.lastStoreTicketRouterName
    );

    this.router.navigate([
      "/maintenance-management/corrective/ticket/ticket-view",
    ]);
  }
  ngOnDestroy() {
    // this.helpDeskService.ticketStatusId = 0;
  }
}
