import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { environment } from "src/environments/environment";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import Swal from "sweetalert2";
import { DeliveryService } from "src/app/core/services/delivery.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { DeliveryNoteAddComponent } from "../delivery-note-add/delivery-note-add.component";
import * as moment from "moment";

@Component({
  selector: "app-delivery-note-list",
  templateUrl: "./delivery-note-list.component.html",
  styleUrls: ["./delivery-note-list.component.scss"],
})
export class DeliveryNoteListComponent implements OnInit, AfterViewInit {
  isProject: boolean = false;
  label: any = "Delivery Note";
  breadCrumbItems: any = [
    { label: "Delivery" },
    { label: "Delivery List", active: true },
  ];
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
    SearchDeliveryNoteNo: null,
    SearchDeliveryNoteTitle: null,
    SearchDeliveryNoteStatusId: null,
  };

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  DeliveryList = [];
  page = 1;
  collectionSize = 0;

  imageUrl: any = environment.apiUrl;
  viewImageValue: any;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownDeliveryStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownDeliveryStatusIdValue: any;
  selectedDeliveryNumber: any;
  typeDeliveryNoteTitleValue: any;

  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };

  maintenanceWorkflowAuditList: any;
  currentUserRole: any;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;

  constructor(
    private router: Router,
    private DeliveryService: DeliveryService,
    private authService: AuthAssetService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private helpDeskService: HelpDeskService,
    private menuService: MenuServiceService,
    private modalService: NgbModal
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {
    this.getDropdownCompanyList();
    this.getDeliveryNoteStatus("DeliveredStatus");
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    if (this.currentUserRole === "Client User") {
      this.disabledWithAceessGroup = true;
    } 
      if (localStorage.getItem("objectSerachForDeliveryList")) {
        this.getObjectAfterRefresh();
      } else {
        this.loadData();
      
    }
  }

  navigateToAdd() {
    this.DeliveryService.accessRight = true;
    this.router.navigate(["asset-management/delivery-note/add-delivery"]);
  }

    /**
  * for Set object to refesh
  */
    setObjectBeforeRefesh() {
      let objectSerachForDeliveryList: any = {};
      if (this.arrayListDropDownCompany)
      objectSerachForDeliveryList.arrayListDropDownCompany = this.arrayListDropDownCompany;
      if (this.selectedDropDownCompanyIdValue)
      objectSerachForDeliveryList.SearchCompanyId = this.selectedDropDownCompanyIdValue;
  
      if (this.arrayListDropDownClientList) {
        objectSerachForDeliveryList.arrayListDropDownClientList =
          this.arrayListDropDownClientList;
      }
      if (this.arrayListDropDownProjectOrDeparmentList) {
        objectSerachForDeliveryList.arrayListDropDownProjectOrDeparmentList =
          this.arrayListDropDownProjectOrDeparmentList;
      }
      if (this.selectedDropDownClientIdValue)
      objectSerachForDeliveryList.SearchClientId = this.selectedDropDownClientIdValue;
  
      if (this.selectedDropDownProjectOrDeparmentIdValue)
      objectSerachForDeliveryList.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
  
      if (this.typeDeliveryNoteTitleValue)
      objectSerachForDeliveryList.SearchAssetAuditName = this.typeDeliveryNoteTitleValue; 
  
      if (this.arrayListDropDownDeliveryStatus)
      objectSerachForDeliveryList.arrayListDropDownDeliveryStatus = this.arrayListDropDownDeliveryStatus;  

      if (this.selectedDropDownDeliveryStatusIdValue)
      objectSerachForDeliveryList.SearchDeliveryNoteStatusId = this.selectedDropDownDeliveryStatusIdValue;  

      if (this.selectedDeliveryNumber)
      objectSerachForDeliveryList.SearchDeliveryNoteNo = this.selectedDeliveryNumber; 

      if (this.typeDeliveryNoteTitleValue)
      objectSerachForDeliveryList.SearchDeliveryNoteTitle = this.typeDeliveryNoteTitleValue; 
  
      if (this.page) {
        objectSerachForDeliveryList.displayStart = this.pageSize * (this.page - 1);
        objectSerachForDeliveryList.page = this.page;
      }
      localStorage.setItem(
        "objectSerachForDeliveryList",
        JSON.stringify(objectSerachForDeliveryList)
      );
    }
  
      /**
* for get object for refesh
*/
  getObjectAfterRefresh() {
    let objectSerachForDeliveryList: any = JSON.parse(
      localStorage.getItem("objectSerachForDeliveryList")
    );
    this.selectedDropDownCompanyIdValue =
    objectSerachForDeliveryList.selectedDropDownCompanyIdValue
        ? objectSerachForDeliveryList.selectedDropDownCompanyIdValue
        : [];
    this.selectedDropDownCompanyIdValue = objectSerachForDeliveryList.SearchCompanyId
      ? objectSerachForDeliveryList.SearchCompanyId
      : null;

    this.arrayListDropDownCompany =
    objectSerachForDeliveryList.arrayListDropDownCompany
        ? objectSerachForDeliveryList.arrayListDropDownCompany
        : [];
    this.arrayListDropDownClientList =
    objectSerachForDeliveryList.arrayListDropDownClientList
        ? objectSerachForDeliveryList.arrayListDropDownClientList
        : [];
    this.arrayListDropDownProjectOrDeparmentList =
    objectSerachForDeliveryList.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForDeliveryList.arrayListDropDownProjectOrDeparmentList
        : [];

    this.typeDeliveryNoteTitleValue =
    objectSerachForDeliveryList.typeDeliveryNoteTitleValue
        ? objectSerachForDeliveryList.typeDeliveryNoteTitleValue
        : [];

    this.arrayListDropDownDeliveryStatus =
    objectSerachForDeliveryList.arrayListDropDownDeliveryStatus
        ? objectSerachForDeliveryList.arrayListDropDownDeliveryStatus
        : [];    

    this.selectedDropDownDeliveryStatusIdValue = objectSerachForDeliveryList.SearchDeliveryNoteStatusId
      ? objectSerachForDeliveryList.SearchDeliveryNoteStatusId
      : null;

    this.typeDeliveryNoteTitleValue = objectSerachForDeliveryList.SearchAssetAuditName
      ? objectSerachForDeliveryList.SearchAssetAuditName
      : null;  

    this.selectedDeliveryNumber = objectSerachForDeliveryList.SearchDeliveryNoteNo
      ? objectSerachForDeliveryList.SearchDeliveryNoteNo
      : null;

    this.typeDeliveryNoteTitleValue = objectSerachForDeliveryList.SearchDeliveryNoteTitle
      ? objectSerachForDeliveryList.SearchDeliveryNoteTitle
      : null;
    this.selectedDropDownClientIdValue = objectSerachForDeliveryList.SearchClientId
      ? objectSerachForDeliveryList.SearchClientId
      : null;
    this.selectedDropDownProjectOrDeparmentIdValue =
    objectSerachForDeliveryList.SearchProjectId
        ? objectSerachForDeliveryList.SearchProjectId
        : null;
 
    this.payload.SearchDeliveryNoteStatusId = this.selectedDropDownDeliveryStatusIdValue;
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId = this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchAssetAuditName = this.typeDeliveryNoteTitleValue;
    this.payload.SearchDeliveryNoteNo = this.selectedDeliveryNumber;
    this.payload.SearchDeliveryNoteTitle = this.typeDeliveryNoteTitleValue;
    this.loadData();

  }


  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.loadData();
    }
  }

  loadData() {
    this.DeliveryService.getV2_DeliveryingtList_ByPagination(
      this.commonFunctionService.clean(this.payload)
    ).subscribe((res: any) => {
      this.DeliveryList = res.data;
      this.setObjectBeforeRefesh();
      if (this.DeliveryList.length > 0) {
        this.totalRecordsFromApi = res.data[0].totalCount;
        this.from = res.data.reduce(
          (min, p) => (p.rowNum < min ? p.rowNum : min),
          res.data[0].rowNum
        );
        this.to = res.data.reduce(
          (max, p) => (p.rowNum > max ? p.rowNum : max),
          res.data[0].rowNum
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

  viewHandler(DeliveryId: any) {
    this.DeliveryService.sendDeliveryId = DeliveryId;
    this.router.navigate(["asset-management/delivery-note/view-delivery"]);
  }

  resetSerachVariable() {
    this.arrayListDropDownClientList = [];
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownCompanyIdValue = null;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownDeliveryStatusIdValue = null;
    this.selectedDeliveryNumber = null;
    this.typeDeliveryNoteTitleValue = null;
    this.payload = {
      displayLength: 10,
      displayStart: 0,
      SearchCompanyId: null,
      SearchClientId: null,
      SearchProjectId: null,
      SearchDeliveryNoteNo: null,
      SearchDeliveryNoteTitle: null,
      SearchDeliveryNoteStatusId: null,
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
    this.arrayListDropDownClientList =[]
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

  getDeliveryNoteStatus(pageName: any) {
    this.DeliveryService.GetAssetStatusList(pageName).subscribe((res: any) => {
      this.arrayListDropDownDeliveryStatus = res;
    });
  }

  onDropdownDeliveryStatusValueChange($event) {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchDeliveryNoteStatusId =
      this.selectedDropDownDeliveryStatusIdValue;
    this.loadData();
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  @ViewChild("inputerDeliveryName", { static: true })
  inputerDeliveryName: ElementRef;
  @ViewChild("inputerDeliveryNumber", { static: true })
  inputerDeliveryNumber: ElementRef;

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.inputerDeliveryName.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeDeliveryNameChange();
        })
      )
      .subscribe();

    fromEvent(this.inputerDeliveryNumber.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.onTypeDeliveryNumberChange();
        })
      )
      .subscribe();
  }
  onTypeDeliveryNameChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchDeliveryNoteTitle = this.typeDeliveryNoteTitleValue;
    this.loadData();
  }
  onTypeDeliveryNumberChange() {
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.payload.SearchDeliveryNoteNo = this.selectedDeliveryNumber;
    this.loadData();
  }
  warning(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: res,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  updateDeliveryNoteFrom: FormGroup;
  maxCharsDecision: number = 300;
  getFromBinding() {
    this.updateDeliveryNoteFrom = this.formBuilder.group({
      deliveryDate: ["", [Validators.required]],
      deliveryNoteRemark: ["", [Validators.required]],
    });
  }
  get deliveryDate() {
    return this.updateDeliveryNoteFrom.get("deliveryDate");
  }
  get deliveryNoteRemark() {
    return this.updateDeliveryNoteFrom.get("deliveryNoteRemark");
  }

  openUpdateFormModal(content: any, delivery: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Update Delivery Note";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addDeliveryUpdateSucessModal(content, delivery);
        } else {
          //this.onBack();
        }
      }
    });
  }

  addDeliveryUpdateSucessModal(content: any, delivery: any) {
    this.getFromBinding();
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.openModalSuccess(delivery);
        },
        (reason) => {
          this.updateDeliveryNoteFrom.reset();
        }
      );
  }

  updateDeliveryNoteToClient(delivery: any) {
    let payload: any = {
      DeliveryNoteId: delivery.deliveryNoteId,
      DeliveryNoteRemark: this.deliveryNoteRemark.value,
      DeliveryDate: this.deliveryDate.value
        ? this.dateFormatter(this.deliveryDate.value)
        : null,
    };

    this.DeliveryService.updateDeliveryNoteToClient(payload).subscribe(
      (res) => {
        this.success(res);
        this.loadData();
      }
    );
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
  openModalSuccess(delivery) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Update Delivery Date!";
    modalRef.componentInstance.subTitle = "You won't be able to revert this!";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          this.updateDeliveryNoteToClient(delivery);
        }
      }
    });
  }

  dateFormatter(date) {
    const newDate = moment(date).format("YYYY-MM-DD");
    if (newDate === "1970-01-01") return null;
    else return newDate;
  }

  expandTitle(ticketId) {
    const titleElement = document.getElementById(ticketId);
    ////console.log(titleElement);
    //titleElement.classList.toggle("expanded");
  }
}
