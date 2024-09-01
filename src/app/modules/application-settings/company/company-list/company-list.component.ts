import { Component } from "@angular/core";
import { NgbModal, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { environment } from "src/environments/environment.prod";
import { CompanyService } from "src/app/core/services/company.service";
import { Router } from "@angular/router";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { ToastService } from "src/app/shared/Service-common/toast-service";

@Component({
  selector: "app-company-list",
  templateUrl: "./company-list.component.html",
  styleUrls: ["./company-list.component.scss"],
})
export class CompanyListComponent {
  apiUrl: string = environment.apiUrl;

  companyList: any = [];
  companyId: any = null;
  searchTerm: any = "";
  filteredList: any = [];
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  deleteId: any;
  baseUrl = environment.apiUrl;
  label: any = "Company";
  breadCrumbItems: any = [
    { label: "Company" },
    { label: "Company List", active: true },
  ];
  payload: any = {
    searchTermCompany: null,
  };
  returnValueMenu: any = {
    access: true,
    add: true,
    delete: true,
    edit: true,
    reportPrint: true,
    reportView: true,
  };
  constructor(
    private modalService: NgbModal,
    public companyservice: CompanyService,
    private router: Router,
    private menuService: MenuServiceService,
    private toastService: ToastService
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
  }

  ngOnInit(): void {
    this.getCompanyTableList_LocalPagination();
    if (localStorage.getItem("objectSerachForcompanyList")) {
      this.getObjectAfterRefresh();
     }
  }

  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForcompanyList: any = {};
    //Company
    if (this.searchTerm)
      objectSerachForcompanyList.searchTermCompany =
        this.searchTerm;

        if (this.searchTerm)
          objectSerachForcompanyList.searchTerm =
            this.searchTerm;

    if (this.page) {
      objectSerachForcompanyList.displayStart = this.pageSize * (this.page - 1);
      objectSerachForcompanyList.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForcompanyList",
      JSON.stringify(objectSerachForcompanyList)
    );

  }

  /**
   * for get object for refesh
   */
  getObjectAfterRefresh() {
    let objectSerachForcompanyList: any = JSON.parse(
      localStorage.getItem("objectSerachForcompanyList")
    );

    this.searchTerm =
    objectSerachForcompanyList.searchTerm
        ? objectSerachForcompanyList.searchTerm
        : [];

    //Company Value
    this.searchTerm = objectSerachForcompanyList.searchTermCompany
      ? objectSerachForcompanyList.searchTermCompany
      : null;

      this.payload.searchTermCompany = this.searchTerm;

      if (objectSerachForcompanyList.displayStart) {
        this.payload.displayStart = objectSerachForcompanyList.displayStart;
        this.page = objectSerachForcompanyList.page;
      }
      this.getCompanyTableList_LocalPagination();

  }


  getCompanyTableList_LocalPagination() {
    this.companyservice
      .getCompanyTableList_LocalPagination()
      .subscribe((res: any) => {
        if (res?.code == "200") {
          this.companyList = res?.list;
          this.totalRecords = res?.list.length;
          this.filteredList = this.companyList;
          this.collectionSize = this.filteredList.length;
          this.getLocalPagination();
          //this.setObjectBeforeRefesh();
        }
        this.setObjectBeforeRefesh();
      });
  }
  addHandle() {
    this.companyservice.addCompanyAccess = true;
    this.router.navigate(["/application-settings/company/add-company"]);
  }
  viewHandle(company) {
    this.companyservice.addCompanyAccess = true;
    this.router.navigate([
      "/application-settings/company/company-view/" + company.companyId,
    ]);
  }
  editHandle(company) {
    this.companyservice.addCompanyAccess = true;
    this.router.navigate([
      "/application-settings/company/edit-company/" + company.companyId,
    ]);
  }
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  toUpperCaseword(data: string) {
    if (data) return data.toUpperCase();
    return "";
  }

  deleteData(id: any) {
    this.companyservice
      .deleteCompany({
        CompanyId: id,
      })
      .subscribe((res: any) => {
        this.success(res);
        this.getCompanyTableList_LocalPagination();
      });
  }

  searchFilter() {
    this.page = 1;
    if (this.searchTerm) {
      const value = this.searchTerm;
      this.filteredList = this.companyList.filter((i) =>
        i.companyName?.toLowerCase().includes(value?.toLowerCase() || "")
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
      this.getCompanyTableList_LocalPagination();
    }
  }
  // searchFilter() {
  //   if (!this.searchTerm) {
  //     this.filteredList = this.companyList;
  //   }
  //   this.filteredList = this.companyList.filter((comp: any) => {
  //     return (
  //       comp?.companyName
  //         ?.toLowerCase()
  //         .includes(this.searchTerm.toLowerCase()) ||
  //       comp?.officePhoneNo
  //         ?.toLowerCase()
  //         .includes(this.searchTerm.toLowerCase()) ||
  //       comp?.companyHead?.toLowerCase().includes(this.searchTerm.toLowerCase())
  //     );
  //   });
  // }

  getLocalPagination() {
    this.filteredList = this.companyList.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.to =
      this.page * this.pageSize > this.companyList.length
        ? this.companyList.length
        : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.companyList.length == 0 ? 0 : this.from;
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
}
