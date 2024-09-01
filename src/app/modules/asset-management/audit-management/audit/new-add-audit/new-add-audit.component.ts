import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbModal, NgbNav, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { AuditService } from "src/app/core/services/audit.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { NewAssetListCommonComponent } from "src/app/shared/components/new-asset-list-common/new-asset-list-common.component";
import Swal from "sweetalert2";
import { environment } from "../../../../../../environments/environment.prod";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-new-add-audit",
  templateUrl: "./new-add-audit.component.html",
  styleUrls: ["./new-add-audit.component.scss"],
})
export class NewAddAuditComponent implements OnInit {
  isProject: boolean = false;
  label: any = "Audit Management";
  defaultNavActiveId: any = 1;
  breadCrumbItems: any = [
    { label: "Audit" },
    { label: "Audit List", active: true },
  ];
  addAuditFrom: FormGroup;
  imageUrl = environment.apiUrl;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownAssetStatusIdValue: any;
  selectedAssetList: any = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private auditService: AuditService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private offcanvasService: NgbOffcanvas,
    private maintenanceService: MaintenanceService
  ) {
    if (this.auditService.accessRight == true) {
      let url = this.router.url;
      this.isProject = this.authService.getisProject();
      this.getDropdownCompanyList();
    } else {
      this.goback();
    }
  }

  ngOnInit(): void {
    this.getFromBinding();
  }
  getFromBinding() {
    this.addAuditFrom = this.formBuilder.group({
      company: [null, [Validators.required]],
      client: [null, [Validators.required]],
      project: [null, [Validators.required]],
      title: ["", [Validators.required]],
    });
  }
  get project() {
    return this.addAuditFrom.get("project");
  }
  get title() {
    return this.addAuditFrom.get("title");
  }

  get client() {
    return this.addAuditFrom.get("client");
  }
  get company() {
    return this.addAuditFrom.get("company");
  }

  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList_Active_AssetManagement({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (res.list.length != 0) {
        let data: any = JSON.parse(localStorage.getItem("currentUser"));
        if (data?.role === "Client User") {
          // if (data?.accessGroupName === "Application User") {
          this.selectedDropDownCompanyIdValue =
            this.arrayListDropDownCompany[0].companyId;
          this.getDropdownClientlist();
          // }
        }
      }
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceClientDropDownList_Active_AssetManagement(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceDepartmentDropDownList_Active_AssetManagement(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownProjectOrDeparmentList = res.list;
      });
  }
  onDropdownCompanyValueChange(event) {
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedAssetList = [];
    this.arrayListDropDownClientList=[]
    if(this.selectedDropDownCompanyIdValue){
    this.getDropdownClientlist();}
  }
  onDropdownClientValueChange(event) {
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.getDropdownDepartmentList();
    this.selectedAssetList = [];
  }
  onDropdownDepartmentValueChange(event) {
    this.selectedAssetList = [];
  }
  /**
   * End  For Dropdown Company ,client,project
   */

  onSubmit() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Add Audit";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addAddAuditSucessModal();
        } else {
         // this.onBack();
        }
      }
    });
  }

  addAddAuditSucessModal(): void {
    let finalSeletectedAsset = [];
    if (this.selectedAssetList.length != 0) {
      this.selectedAssetList.forEach((ele) => {
        finalSeletectedAsset.push({
          AssetId: ele.id,
          Email: ele.email,
          EmployeeId: ele.employeeId,
          EmployeeName: ele.employeeName,
          AssetTagId: ele.assetTagId,
        });
      });
    }
    let selectedTech = [];
    if (this.selectedTech.length !== 0) {
      this.selectedTech.forEach((element) => {
        selectedTech.push({
          TechId: element?.userId,
          TechName: element?.fullName,
        });
      });
    }
    let payload = {
      AssetAuditName: this.title.value,
      CompanyId: this.company.value,
      ClientId: this.client.value,
      DepartmentId: this.project.value,
      transactionAssetAudits: finalSeletectedAsset,
      mX_WOTechAssignment: selectedTech ? selectedTech : [],
    };

    //console.log(payload);
    const a = this.commonFunctionService.clean(payload);
    this.saveTicket(a);
  }
  goback() {
    this.router.navigate(["asset-management/audit-management/audit/listaudit"]);
  }
  saveTicket(payload): void {
    this.auditService.postInsertAudit(payload).subscribe((res: any) => {
      this.success(res);
      this.goback();
    });
  }
  refreshRouter() {
    const currentUrl = this.router.url;
    const navigationExtras: NavigationExtras = {
      queryParamsHandling: "preserve",
      preserveFragment: true,
    };

    this.router.navigate([currentUrl], navigationExtras);
  }
  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  waring(message) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  findNameById(
    idToFind: number,
    items,
    objectname,
    objectId
  ): string | undefined {
    const foundItem = items.find((item) => item[objectId] === idToFind);
    return foundItem ? foundItem[objectname] : undefined;
  }

  getAssetList() {
    const modalRef = this.offcanvasService.open(NewAssetListCommonComponent, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas ",
    });
    modalRef.componentInstance.selectedDropDownCompanyIdValue =
      this.company.value;
    modalRef.componentInstance.selectedDropDownClientIdValue =
      this.client.value;
    modalRef.componentInstance.selectedDropDownProjectOrDeparmentIdValue =
      this.project.value;

    modalRef.componentInstance.selectedAsset =
      this.selectedAssetList.length != 0 ? this.selectedAssetList : [];

    modalRef.result
      .then((result) => {
        this.selectedAssetList = result;
      })
      .catch((result) => {
        this.selectedAssetList = result;
      });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  openModalTechnician(content: any) {
    // this.checktheUserAlreadySelected(this.mX_WOTechAssignment);
    this.modalService.open(content, { size: "lg", centered: true });
    this.loadTechnician();
  }
  technicianList: any = [];
  selectedTech: any = [];
  loadTechnician(): void {
    this.maintenanceService.getTechnician(this.project.value).subscribe(
      (response: any) => {
        if (response) {
          this.technicianList = response?.data;
          this.technicianList.forEach((element) => {
            element.checked = false;

            element.disabled = false;          });
          if (this.selectedTech.length > 0) {
            this.technicianList.forEach((ele1) => {
              this.selectedTech.forEach((ele) => {
                if (ele.userId === ele1.userId) {
                  ele1.checked = true;
                  ele1.disabled=true;
                }
              });
            });
          }
          this.filteredTechnicianList = this.technicianList;
        }
      },
      (error) => {
        //console.log("err", error);
      }
    );
  }
  getTechnicianIndex(userId) {
    return this.technicianList.findIndex((i) => i.userId === userId);
  }

  getSelectedTechnicianIndex(userId) {
    return this.selectedTech.findIndex((i) => i.userId === userId);
  }

  selectTechnician(technicianList, i, tech) {
    if(this.filteredTechnicianList[i].disabled){
      return
    }
    const index = this.getTechnicianIndex(tech.userId);
    if (this.technicianList[index].checked) {
      this.technicianList[index].checked = false;
    } else {
      this.technicianList[index].checked = true;
    }
    this.getTodoListChecked(technicianList[i].checked, tech);
  }
  getTodoListChecked(isSelected: any, tech: any) {
    if (isSelected == true) {
      this.selectedTech.push(tech);
    } else {
      this.selectedTech.forEach((value, index) => {
        if (value.userId == tech.userId) {
          this.selectedTech.splice(index, 1);
        }
      });
    }
  }

  unCheckItem(tech) {
    const index = this.getTechnicianIndex(tech.userId);
    this.technicianList[index].checked = false;
    const selectedTechnicianIndex = this.getSelectedTechnicianIndex(
      tech.userId
    );
    this.selectedTech.splice(selectedTechnicianIndex, 1);
  }

  filteredTechnicianList: any[] = [];
  technicianSearchText: string = "";
  filterTechnician(event) {
    //console.log(event, "event");
    this.filteredTechnicianList = this.technicianList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
  }
  clearTeach(event) {
    this.technicianSearchText = "";
    this.filteredTechnicianList = this.technicianList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
    //console.log("this.filteredTechnicianList", this.filteredTechnicianList);
  }
  openModalDeleteConf(techobject) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to delete a Member ?";
    modalRef.componentInstance.subTitle =
      "Deleting your Member will remove for this Member List  ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.unCheckItem(techobject);
        }
      }
    });
  }

  returnCurrentStatusClassesStatus(value: any){
    return this.commonFunctionService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any){
    return this.commonFunctionService.getStatusColorCircle(value);
  }
  
}
