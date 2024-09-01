
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { ClientService } from "../../../../core/services/client.services";
import { environment } from "src/environments/environment";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { debounceTime, distinctUntilChanged, filter, fromEvent, switchMap, tap } from "rxjs";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { UpdateStatusComponent } from "src/app/shared/components/update-status/update-status.component";
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { DropdownService } from '../../../../shared/Service-common/dropdown.service';

@Component({
  selector: 'app-list-client-project-management',
  templateUrl: './list-client-project-management.component.html',
  styleUrl: './list-client-project-management.component.scss'
})
export class ListClientProjectManagementComponent implements OnInit {
  clientList: any = {};
  rows: any = [];
  loadingIndicator = true;
  reorderable = true;
  _clientId: any;
  loadingTableData: boolean;
  cName: any;
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  clientData: any;
  totalRecords: number = 0;
  flag: boolean = false;
  isTableView: boolean;

  CompanyId: any;
  ClientName: any;
  CompanyListV2: any;
  servicepage: any;
  pageSize1: any;
  searchTerm: any;
  total: any;
  startIndex: number = 0;
  endIndex: number = 3;
  paginationDatas: any;
  filteredList: any = [];
  selectedCompanyId: any = null;
  searchTermarray: any;

  label: any = "Client";
  breadCrumbItems: any = [
    { label: "Client List" },
    { label: "Client", active: true },
  ];
  baseUrl = environment.apiUrl;
  payload: any = {
    SearchCompanyId: null,
    SearchClientName: null,
    searchTermCompany: null,
    SearchClientStatusId: null
  };
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  arrayListDropDownProjectManagementClientStatus: any[] = [];
  selectedDropDownClientStatusIdValue: any;
  constructor(
    private clientService: ClientService,
    private router: Router,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
    private dropdownService: DropdownService,
    private menuService: MenuServiceService,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
    this.loadingTableData = false;
    this.isTableView = true;
  }

  ngOnInit(): void {
    this.from = this.page;
    this.to = this.pageSize;
  
    //added by Suresh Rao 24/07/2024
  this.getV3_GetCompanyListDrobDown_Global();
    //  this.getV2_GetCompanyListDrobDown();
  
    this.getClientStatus()
    //this.getClientdetails();
    if (localStorage.getItem("objectSerachForClientPMList")) {
      this.getObjectAfterRefresh();
    } else {
      this.getClientdetails();
      //this.getV2_GetCompanyListDrobDown();
    }
  
  }
  /**
  * for Set object to refesh
  */

  setObjectBeforeRefesh() {
    let objectSerachForClientPMList: any = {};
    //Company
    if (this.selectedCompanyId)
      objectSerachForClientPMList.SearchCompanyId =
        this.selectedCompanyId;

    if (this.CompanyListV2) {
      objectSerachForClientPMList.CompanyListV2 =
        this.CompanyListV2;
    }
    if (this.searchTerm)
      objectSerachForClientPMList.SearchClientName = this.searchTerm;
    if (this.selectedDropDownClientStatusIdValue) {
      objectSerachForClientPMList.SearchClientStatusId = this.selectedDropDownClientStatusIdValue;

    }
    if (this.searchTerm)
      objectSerachForClientPMList.searchTerm = this.searchTerm;

    if (this.page) {
      objectSerachForClientPMList.page = this.page;
      objectSerachForClientPMList.displayStart = this.pageSize * (this.page - 1);

    }
    localStorage.setItem(
      "objectSerachForClientPMList",
      JSON.stringify(objectSerachForClientPMList)
    );
  }

  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForClientPMList: any = JSON.parse(
      localStorage.getItem("objectSerachForClientPMList")
    );
    this.CompanyListV2 =
      objectSerachForClientPMList.CompanyListV2
        ? objectSerachForClientPMList.CompanyListV2
        : [];

    this.searchTerm =
      objectSerachForClientPMList.searchTerm
        ? objectSerachForClientPMList.searchTerm
        : [];

    //Company Value
    this.selectedCompanyId = objectSerachForClientPMList.SearchCompanyId
      ? objectSerachForClientPMList.SearchCompanyId
      : null;

    this.searchTerm = objectSerachForClientPMList.SearchClientName
      ? objectSerachForClientPMList.SearchClientName
      : null;
    this.selectedDropDownClientStatusIdValue = objectSerachForClientPMList.SearchClientStatusId
      ? objectSerachForClientPMList.SearchClientStatusId
      : null;
    //Payload
    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.payload.SearchClientName = this.searchTerm;
    this.payload.SearchClientStatusId = this.selectedDropDownClientStatusIdValue;


    if (objectSerachForClientPMList.displayStart) {
      this.payload.displayStart = objectSerachForClientPMList.displayStart;
      this.page = objectSerachForClientPMList.page;
    }
    this.getClientdetails();
    //this.getV2_GetCompanyListDrobDown();
  }

  onDropdownClientStatusValueChange($event) {
    this.payload.SearchClientStatusId = this.selectedDropDownClientStatusIdValue;
    this.page = 1;
    this.payload.displayStart = this.pageSize * (this.page - 1);
    this.getClientdetails();

  }
  goToAddPage() {
    this.clientService.addAccess = true;
    this.router.navigate(["/application-settings/pm-client/pm-add-client"]);
  }
  editHandle(client) {
    this.clientService.addAccess = true;
    this.router.navigate([
      "/application-settings/pm-client/pm-edit-client/" + client.clientId,
    ]);
  }
  getV2_GetCompanyListDrobDown() {
    this.dropdownService
      .Getv3_CompanyDropDownList_ProjectManagement({})
      .subscribe((res: any) => {
        this.CompanyListV2 = res.list;
        this.setObjectBeforeRefesh();
      });
  }

  getV3_GetCompanyListDrobDown_Global() {
    this.dropdownService
      .Getv3_CompanyDropDownList_Global({})
      .subscribe((res: any) => {
        this.CompanyListV2 = res.list;
        this.setObjectBeforeRefesh();
      });
  }

  getClientdetails() {
    this.payload.SearchCompanyId = this.selectedCompanyId;
    this.payload.searchTermCompany = this.searchTerm;
    this.clientService
      .getClientTableList_LocalPagination(
        this.commonFunctionService.clean(this.payload)
      )
      .subscribe((res: any) => {
        if (res?.code == "200") {
          this.clientList = res?.list;
          this.totalRecords = res?.list.length;
          this.filteredList = this.clientList;
          this.collectionSize = this.filteredList.length;
          this.getLocalPagination();

        }
        this.setObjectBeforeRefesh();
      });
  }
  clear() {
    this.ClientName = null;
    this.CompanyId = null;
    this.getClientdetails();
  }



  deleteId: any;
  addConfirmDeleteSucessModal(content: any, id: any) {
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
    modalRef.componentInstance.title = "Are you Sure you want to Delete Client";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addConfirmDeleteSucessModal(content, id);
        } else {
          // this.onBack();
        }
      }
    });
  }

  // Delete Data
  deleteData(id: any) {
    this.clientService
      .postDeleteClient({
        clientId: id,
      })
      .subscribe((res: any) => {
        if (res?.code == "200") {
          this.success(res);
          this.getClientdetails();
        }
      });
  }

  toUpperCaseword(data: string) {
    return data.toUpperCase();
  }
  getLocalPagination() {
    this.filteredList = this.clientList.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.to =
      this.page * this.pageSize > this.clientList.length
        ? this.clientList.length
        : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.clientList.length == 0 ? 0 : this.from;
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

  clearAllPayload() {
    this.searchTerm = null;
    this.selectedCompanyId = null;
    this.selectedDropDownClientStatusIdValue = null;
    this.payload = {
      SearchCompanyId: null,
      SearchClientName: null,
      SearchClientStatusId: null

    };
    this.getClientdetails();
  }

  searchFilter() {
    this.page = 1;
    if (this.searchTerm) {
      const value = this.searchTerm;
      this.payload.SearchClientName = value;
      this.filteredList = this.clientList.filter((i) =>
        i.clientName?.toLowerCase().includes(value?.toLowerCase() || "")
      );
      this.collectionSize = this.filteredList.length;
      this.totalRecords = this.filteredList.length;
      this.to =
        this.page * this.pageSize > this.filteredList.length
          ? this.filteredList.length
          : this.page * this.pageSize;
      let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
      this.from = fromvalue < 1 ? 1 : fromvalue;
      this.from = this.filteredList.length == 0 ? 0 : this.from;
    } else {
      const value = this.searchTerm;
      this.payload.SearchClientName = value;
      this.getClientdetails();

    }
  }

  viewHandler(clientId: any) {
    this.router.navigate([
      "/application-settings/pm-client/pm-view-client/" + clientId,
    ]);
  }

  editHandler(clientId: any) { }

  successForDeletespareData(res) {
    //for  Delete spare successfully message
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  getClientStatus() {
    this.clientService.getClientStatus('ProjectManagementClientStatus').subscribe((res: any) => {
      this.arrayListDropDownProjectManagementClientStatus = res;

    });
  }
  //
  currrentClientId: any
  clientStatusList: any = []
  openStatusModal(data) {
    let url = 'api/ProjectManagement/GetClientStatus/ClientUpdateStatus'
    this.CommonHttpServiceCallerService.getWithoutParmaMethod(url).subscribe((res: any) => {
      this.clientStatusList = res

      this.currrentClientId = data.clientId
      const modalRef = this.modalService.open(UpdateStatusComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      const filteredData = this.clientStatusList.filter(item => item.assetStatusId !== data.clientStatusId);


      modalRef.componentInstance.assetListStatus = filteredData;

      modalRef.result.then((result) => {
        if (result) {
          if (result.value == "success") {
            this.updateV2_ClientStatus(result)

          }
        }
      });
    })
  }
  updateV2_ClientStatus(sendObject: any) {
    let paylod = {
      ClientId: this.currrentClientId,
      ClientStatusId: sendObject.statusId,
      ClientStatusName: sendObject.statusName,

    }

    let url = 'api/V2_Master/UpdateV2_ClientStatus'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.success(res);
      this.getClientdetails();
    })
  }
}
