import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import { FormBuilder } from "@angular/forms";
import { AuditService } from "src/app/core/services/audit.service";
import { AssetService } from "src/app/core/services/asset.service";
import { DisposableService } from "src/app/core/services/disposable.service";
import Swal from "sweetalert2";
import { NavigationExtras, Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";

@Component({
  selector: 'app-disposable-list',
  templateUrl: './disposable-list.component.html',
  styleUrl: './disposable-list.component.scss'
})
export class DisposableListComponent implements OnInit {

  isProject: boolean = false;
  label: any = "Disposable Management";
  breadCrumbItems: any = [
    { label: "Disposable" },
    { label: "Disposable List", active: true },
  ];

  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownLocationList: any = [];
  arrayListDropDownDisposableStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownLocationIdValue: any;
  selectedDropDownDisposableStatusIdValue: any;
  arrayListDropDownCategoryList: any = [];
  arrayListDropDownSubCategoryList: any = [];
  selectedDropDownCategoryIdValue: any;
  selectedDropDownSubCategoryIdValue: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;

  typeDisposableTagIdValue: any;
  totalRecordsFromApi: number = 0;
  to = 0;
  from = 0;
  pageSize = 10;
  page = 1;
  typeDisposableNameValue: any;
  currentUserRole: any;
  payload: any = {
    displayLength: 10,
    DisplayStart: 0,
    SearchCompanyId:null,
    SearchClientId:null,
    SearchProjectId:null,
    SearchMasterDisposeTransactionStatusId:null,
    SearchBatchName:null,
    SearchBatchNo:null
  };
  currentUserAccessGroup: any;
  disposableList:any = [];

  constructor(
    private dropdownService: DropdownService,
    private router: Router,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private offcanvasService: NgbOffcanvas,
    private menuService: MenuServiceService,
    private auditService: AuditService,
    private disposableService: DisposableService,
    private authService:AuthAssetService
  ) {


  }

  ngOnInit(): void {
    this.isProject = this.authService.getisProject();
    this.loadData();
    this.getDropdownCompanyList();
    this.getAssetStatusList('DisposeAssetStatus');
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    this.currentUserAccessGroup = JSON.parse(
      localStorage.getItem("currentUser")
    ).accessGroupName;
    console.log("this.currentUserAccessGroup =", this.currentUserAccessGroup);
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    } else {
      if (localStorage.getItem("objectSerachForAsset")) {
        //this.getObjectAfterRefresh();
      } else {
        //  this.loadData();
      }
    }
  }

  getAssetStatusList(id: any) {
    console.log("id", id)
    this.disposableService.getAssetStatusList(id).subscribe(
      (res: any) => {
        this.arrayListDropDownDisposableStatus = res;
        console.log("arrayListDropDownDisposableStatus->", this.arrayListDropDownDisposableStatus);
      },
      (err) => {
        console.log(err)
      }
    );
  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
       this.payload.DisplayStart = this.pageSize * (pageNo - 1);
       this.loadData();
    }
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  //disposable list api by paggination

  loadData() {   console.log("load::",this.payload);
    this.disposableService
      .GetV2_DisposableBatchList_ByPagination_list(this.commonFunctionService.clean(this.payload))
      .subscribe((res: any) => {
        this.disposableList = res.list;
       // this.setObjectBeforeRefesh();
        if (this.disposableList.length > 0) {
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




  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };

  viewHandler(disposableId: any) {
    this.disposableService.disposableId = disposableId;
    this.router.navigate(["asset-management/disposable/view-disposable"]);
  }

  resetSerachVariable() {

    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.arrayListDropDownLocationList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownDisposableStatusIdValue = null;
    this.selectedDropDownLocationIdValue = null;
    // this.typeAssetNameValue = null;
    this.typeDisposableTagIdValue = null;
    this.arrayListDropDownCategoryList = [];
    this.arrayListDropDownSubCategoryList = [];
    this.selectedDropDownCategoryIdValue = null;
    this.selectedDropDownSubCategoryIdValue = null;

    this.payload = {
      displayLength: 10,
      DisplayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchDepartmentId: null,
      SearchLocationId: null,
      SearchCategoryId: null,
      SearchSubCategoryId: null
    };
    localStorage.removeItem("objectSerachForAsset");
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

      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
      SearchDepartmentId: this.selectedDropDownProjectOrDeparmentIdValue,
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

      });
  }

  getLocationListDrobDown() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
      SearchDepartmentId: this.selectedDropDownProjectOrDeparmentIdValue,
    };
    this.dropdownServices
      .GetLocationListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownLocationList = res.list;

      });
  }
  onDropdownCompanyValueChange($event) {
    this.page = 1;
    this.payload.DisplayStart = this.pageSize * (this.page - 1);
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;

    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.arrayListDropDownProjectOrDeparmentList = [];

    this.selectedDropDownCategoryIdValue = null;
    this.selectedDropDownSubCategoryIdValue = null;
    this.selectedDropDownLocationIdValue = null;
    this.payload.SearchCatergoryId = this.selectedDropDownCategoryIdValue;
    this.payload.SearchSubCategoryId = this.selectedDropDownSubCategoryIdValue;
    this.payload.SearchLocationId = this.selectedDropDownLocationIdValue;
    this.arrayListDropDownCategoryList = [];
    this.arrayListDropDownSubCategoryList = [];
    this.arrayListDropDownLocationList = [];


    if (this.selectedDropDownCompanyIdValue) {
      this.getDropdownClientlist();
      // this.getDropdownCategoryList();
    }
    this.getDropdownClientlist();
    this.loadData();
  }
  onDropdownClientValueChange($event) {
    this.page = 1;
    this.payload.DisplayStart = this.pageSize * (this.page - 1);
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
      if(this.selectedDropDownClientIdValue){
        this.getDropdownDepartmentList();
      }
  
    this.loadData();
  }
  onDropdownDepartmentValueChange($event) {
    this.page = 1;
    this.payload.DisplayStart = this.page - 1;
    this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.selectedDropDownLocationIdValue = null;
    this.payload.SearchLocationId = this.selectedDropDownLocationIdValue;
    this.arrayListDropDownLocationList = [];
    this.loadData();
    this.getLocationListDrobDown();
  }
  /**
   * End  For Dropdown Company ,client,project
   */

  navigateToAdd() {
    this.auditService.accessRight = true;
    this.router.navigate([
      "/asset-management/disposable/add-disposable",
    ]);

  }

  onTypeDisposableNameChange(isDebounce) {
    // if (this.typeAssetNameValue.length === 0 || isDebounce) {
    //   this.page = 1;
    //   this.payload.displayStart = this.pageSize * (this.page - 1);
    //   this.payload.SearchAssetName = this.typeAssetNameValue;
    //   this.loadData();
    // }
  }


  onDropdownDisposableStatusValueChange($event) {
    this.payload.SearchAssetStatusId = this.selectedDropDownDisposableStatusIdValue;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.loadData();
  }


}
