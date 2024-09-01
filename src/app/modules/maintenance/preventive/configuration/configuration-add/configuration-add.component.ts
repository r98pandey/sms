import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { PreventiveService } from "../../../../../core/services/preventive.service";
import { NgbModal, NgbNav, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { preventiveType } from "../../../../../core/models/ticket.interface";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { NewAssetListCommonComponent } from "src/app/shared/components/new-asset-list-common/new-asset-list-common.component";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DatePipe } from "@angular/common";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import { environment } from "src/environments/environment";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

@Component({
  selector: "app-configuration-add",
  templateUrl: "./configuration-add.component.html",
  styleUrls: ["./configuration-add.component.scss"],
})
export class ConfigurationAddComponent implements OnInit {
  isProject: boolean = false;
  addMasterSchedule: FormGroup;
  defaultNavActiveId: any = 1;
  label: any = "Preventive Management";
  breadCrumbItems: any = [
    { label: "Configuration" },
    { label: "Add Configuration ", active: true },
  ];
  maxCharsDecision = 300;
  public Editor = ClassicEditor;
  @ViewChild("defaultNav") defaultNav: NgbNav; // Reference to the ngbNav component
  imgURl: any = environment.apiUrl;
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownAssetStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  frequencyList: any = ["Monthly", "Hourly", "Yearly", "Quarterly"];
  droupFrequencyData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  supportTypeAarry = ["On-Site", "Remote", "Phone Call"];
  preventiveMaintenanceTypeList: any = [];
  preventiveMaintenanceCategoryList: any = [];
  searchPreventMaintenanceId: any;
  searchPreventCategoryId: any;
  selectedPreventiveMaintenanceTypeArray: any = [];
  selectMonthValue: any[] = [];
  arrayOfMonth: any = [];
  constructor(
    public formBuilder: FormBuilder,
    public dropdownServices: DropdownService,
    private preventiveService: PreventiveService,
    private modalService: NgbModal,
    private router: Router,
    private commonFunctionService: CommonFunctionService,
    private offcanvasService: NgbOffcanvas,
    private datePipe: DatePipe,
    private authService: AuthAssetService,
    private maintenanceService: MaintenanceService
  ) {
    if (this.preventiveService.accessRight) {
      this.isProject = this.authService.getisProject();
      this.getDropdownCompanyList();
    } else {
      this.goback();
    }
  }

  ngOnInit(): void {
    let cur = new Date().getFullYear();
    this.arrayOfMonth = [
      {
        name: 'January',
        id: cur + '-01-01'
      },

      {
        name: 'February',
        id: cur + '-02-01'
      },
      {
        name: 'March',
        id: cur + '-03-01'
      },
      {
        name: 'April',
        id: cur + '-04-01'
      },
      {
        name: 'May',
        id: cur + '-05-01'
      },
      {
        name: 'June',
        id: cur + '-06-01'
      },
      {
        name: 'July',
        id: cur + '-07-01'
      },
      {
        name: 'August',
        id: cur + '-08-01'
      },
      {
        name: 'September',
        id: cur + '-09-01'
      },
      {
        name: 'October',
        id: cur + '-10-01'
      },
      {
        name: 'November',
        id: cur + '-11-01'
      },
      {
        name: 'December',
        id: cur + '-12-01'
      }]

    this.getfromBinding();
  }

  getfromBinding() {
    this.addMasterSchedule = this.formBuilder.group({
      ConfigPreventivePDescription: ["", Validators.required],
      Frequency: [null, Validators.required],
      FrequencyData: [null, Validators.required],
      NextSchduleStart: ["", Validators.required],
      Remark: ["", Validators.required],
      ProjectId: [null, Validators.required],
      ClientId: [null, Validators.required],
      CompanyId: [null, Validators.required],
      SupportType: [null, Validators.required],
      PreventiveCategoryId: [null, Validators.required],
      NextSchduleStarttime: [],
    });
  }
  get ConfigPreventivePDescription() {
    return this.addMasterSchedule.get("ConfigPreventivePDescription");
  }
  get Frequency() {
    return this.addMasterSchedule.get("Frequency");
  }
  get FrequencyData() {
    return this.addMasterSchedule.get("FrequencyData");
  }
  get NextSchduleStart() {
    return this.addMasterSchedule.get("NextSchduleStart");
  }
  get Remark() {
    return this.addMasterSchedule.get("Remark");
  }
  get ProjectId() {
    return this.addMasterSchedule.get("ProjectId");
  }
  get ClientId() {
    return this.addMasterSchedule.get("ClientId");
  }
  get CompanyId() {
    return this.addMasterSchedule.get("CompanyId");
  }
  get SupportType() {
    return this.addMasterSchedule.get("SupportType");
  }
  get PreventiveCategoryId() {
    return this.addMasterSchedule.get("PreventiveCategoryId");
  }

  get NextSchduleStarttime() {
    return this.addMasterSchedule.get("NextSchduleStarttime");
  }

  onchangesFrequency(event) {
    if (event == "Hourly") {
      this.NextSchduleStarttime.setValidators([Validators.required]);
    } else {
      this.NextSchduleStarttime.clearValidators();
    }
    this.NextSchduleStarttime.updateValueAndValidity();
  }
  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList_Active({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      this.selectedTech = [];
      this.technicianList = [];
      this.filteredTechnicianList = [];
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceClientDropDownList_Active(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
        this.selectedTech = [];
        this.technicianList = [];
        this.filteredTechnicianList = [];
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceDepartmentDropDownList_Active(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownProjectOrDeparmentList = res.list;
        this.selectedTech = [];
        this.technicianList = [];
        this.filteredTechnicianList = [];
      });
  }
  onDropdownCompanyValueChange(event) {
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.getDropdownClientlist();
    this.defaultNav.activeId = 1;
    this.searchPreventMaintenanceId = null;
    this.searchPreventCategoryId = null;
    this.preventiveMaintenanceTypeList = [];
    this.preventiveMaintenanceCategoryList = [];
    this.selectedAssetList = [];
    this.GetV2_GetMX_PreventiveMaintenanceCategoryDrobDown(
      this.selectedDropDownCompanyIdValue
    );
  }
  onDropdownClientValueChange(event) {
    this.selectedAssetList = [];
    this.defaultNav.activeId = 1;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.getDropdownDepartmentList();
  }
  onDropdownDepartmentValueChange(event) {
    this.selectedAssetList = [];
    this.defaultNav.activeId = 1;
  }

  onchangePreventiveMaintenanceCategory(event: any) {
    this.searchPreventMaintenanceId = [];
    this.selectedPreventiveMaintenanceTypeArray = [];
    this.searchPreventCategoryId = event.preventiveCategoryId;
    this.GetMX_PreventiveMaintenanceTypeDrobDown(this.searchPreventCategoryId);
  }

  GetV2_GetMX_PreventiveMaintenanceCategoryDrobDown(companyIdValue: any) {
    let paylod = {
      SearchCompanyId: companyIdValue,
    };
    this.preventiveService
      .getV2_GetMX_PreventiveMaintenanceCategoryDrobDown(paylod)
      .subscribe(
        (res: any) => {
          this.preventiveMaintenanceCategoryList = res.list;
          if (res.list.length == 0) {
            this.noMaintenanceeCategoryPopUpOpen();
          }
        },
        (err) => { }
      );
  }

  GetMX_PreventiveMaintenanceTypeDrobDown(SearchPreventCategoryId: any) {
    let paylod = {
      SearchPreventCategoryId: SearchPreventCategoryId,
    };
    //console.log(" paylod", paylod);
    this.preventiveService
      .getMX_PreventiveMaintenanceTypeDrobDown(paylod)
      .subscribe(
        (res: any) => {
          this.preventiveMaintenanceTypeList = res.list;
          if (res.list.length == 0) {
            this.searchPreventCategoryId = null;
            this.noMaintenanceTypePopUpOpen();
          }
        },
        (err) => { }
      );
  }
  returnValue(value) {
    return this.selectedPreventiveMaintenanceTypeArray.includes(value);
  }
  returnaSelectAll() {
    return (
      this.selectedPreventiveMaintenanceTypeArray.length ===
      this.preventiveMaintenanceTypeList.length
    );
  }

  checkSelectedAll(event, index = 0) {
    this.selectedPreventiveMaintenanceTypeArray = [];
    if (event.target.checked) {
      this.preventiveMaintenanceTypeList.map((preventiveType) => {
        this.selectedPreventiveMaintenanceTypeArray.push(
          preventiveType.preventiveTypeId
        );
      });
    } else {
      this.selectedPreventiveMaintenanceTypeArray = [];
    }
  }

  checkPreventiveMaintenance(event, value) {
    if (event.target.checked) {
      this.selectedPreventiveMaintenanceTypeArray.push(value);
    } else {
      this.selectedPreventiveMaintenanceTypeArray.splice(
        this.selectedPreventiveMaintenanceTypeArray.indexOf(value),
        1
      );
    }
  }

  @ViewChild("noMaintenanceTypePopUp", { static: true })
  noMaintenanceTypePopUp: ElementRef;
  @ViewChild("noMaintenanceCategoryPopUp", { static: true })
  noMaintenanceCategoryPopUp: ElementRef;

  noMaintenanceTypePopUpOpen() {
    this.modalService
      .open(this.noMaintenanceTypePopUp, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  noMaintenanceeCategoryPopUpOpen() {
    this.modalService
      .open(this.noMaintenanceTypePopUp, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  addMasterScheduleDetails() {
    let checklist = [];
    this.selectedPreventiveMaintenanceTypeArray.forEach((element) => {
      checklist.push({
        PreventiveCategoryId: this.PreventiveCategoryId.value,
        PreventiveTypeId: element,
      });
    });

    let assertItemlist: any = [];
    this.selectedAssetList.forEach((element) => {
      assertItemlist.push({
        AssetId: element.id,
        Note: element.text,
      });
    });
    let selectedTech = [];
    if (this.selectedTech.length !== 0) {
      this.selectedTech.forEach((element) => {
        selectedTech.push({
          TechId: element?.userId,
          TechName: element?.fullName,
        });
      });
    }
    let requestData: any = {
      ConfigPreventivePDescription: this.ConfigPreventivePDescription.value,
      Frequency: this.Frequency.value,
      FrequencyData: this.FrequencyData.value,
      NextSchduleStart:
        this.Frequency.value == "Hourly"
          ? this.datePipe.transform(
            this.NextSchduleStart.value,
            "yyyy-MM-dd "
          ) +
          " " +
      this.NextSchduleStarttime.value
          : this.datePipe.transform(this.NextSchduleStart.value, "yyyy-MM-dd "),

      Remark: this.Remark.value,
      ProjectId: this.ProjectId.value,
      ClientId: this.ClientId.value,
      CompanyId: this.CompanyId.value,
      SupportType: this.SupportType.value,
      PreventiveCategoryId: this.PreventiveCategoryId.value,
      assertItemlist: assertItemlist,
      checklist: checklist,
      ClientName: this.findNameById(
        this.ClientId.value,
        this.arrayListDropDownClientList,
        "clientName",
        "clientId"
      ),
      CompanyName: this.findNameById(
        this.CompanyId.value,
        this.arrayListDropDownCompany,
        "companyName",
        "companyId"
      ),

      ProjectName: this.findNameById(
        this.ProjectId.value,
        this.arrayListDropDownProjectOrDeparmentList,
        "departmentName",
        "departmentId"
      ),
      mX_WOTechAssignment: selectedTech ? selectedTech : [],

      mX_MaintenanceScheduleSkip: this.selectMonthValue ? this.selectMonthValue.map((i) => ({ SkipFlag: i })) : []

    };

    this.preventiveService
      .CreateMX_Config_Preventive(requestData)
      .subscribe((res: any) => {
        // this.success(res);
        this.openModalView(res);
      });
  }

  clearChangDate(){
    this.NextSchduleStart.reset();
    this.NextSchduleStarttime.reset();
  }
  openModalView(res: any) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      res.message;
    modalRef.componentInstance.subTitle =
      "Do you want to setup Checklist on Schedule Configuration";
    modalRef.componentInstance.subTitle1 =
      "If yes then navigate to View Schedule page.";

    modalRef.componentInstance.buttonName = "Go It";

    modalRef.result.then((result) => {
      //console.log(result);
      if (result) {
        if (result == "success") {
          if (res.configPreventiveId) {
            this.gotoView(res.configPreventiveId, this.PreventiveCategoryId.value);
          } else {
            this.warning("In this schedule the Admin not sending the configPreventiveId Value !! ")
            this.goback();
          }

        } else {
          this.goback();
        }
      }
    });
  }
  gotoView(configPreventiveId: any, preventiveCategoryId: any) {
    this.preventiveService.configPreventiveId = configPreventiveId;
    this.preventiveService.preventiveCategoryId = preventiveCategoryId;
    this.preventiveService.pageAction = "Add Checklist"
    this.router.navigate([
      "maintenance-management/preventive/configuration/view-configuration",
    ]);
  }

  // 
  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  // warning
  warning(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  goback() {
    //to get back
    this.router.navigate([
      "/maintenance-management/preventive/configuration/list-configuration",
    ]);
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

  // " " +
  //         this.convertTo12HourFormat(this.NextSchduleStarttime.value)

  selectedAssetList: any = [];

  getAssetList() {
    const modalRef = this.offcanvasService.open(NewAssetListCommonComponent, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas ",
    });
    modalRef.componentInstance.selectedDropDownCompanyIdValue =
      this.CompanyId.value;
    modalRef.componentInstance.selectedDropDownClientIdValue =
      this.ClientId.value;
    modalRef.componentInstance.selectedDropDownProjectOrDeparmentIdValue =
      this.ProjectId.value;

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
  selectedTime: string = "";

  timeChanged() {
    // Custom logic to check if the selected time is valid
    if (this.selectedTime) {
      this.selectedTime = this.formatTime(this.selectedTime);
    } else {
      this.selectedTime = "";
    }

    //console.log(this.selectedTime, "");
  }

  formatTime(time: string): string {
    // Always set seconds to 00
    return time.split(":")[0] + ":00";
  }

  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }

    return `${hour}:${minutes} ${ampm}`;
  }

  openModalTechnician(content: any) {
    // this.checktheUserAlreadySelected(this.mX_WOTechAssignment);
    this.modalService.open(content, { size: "lg", centered: true });
    this.loadTechnician();
  }
  // checktheUserAlreadySelected(mX_WOTechAssignment) {
  //   if (mX_WOTechAssignment.length > 0) {
  //     this.technicianList.forEach((ele1: any, index) => {
  //       this.mX_WOTechAssignment.forEach((ele) => {
  //         if (ele.techId === ele1.userId) {
  //           this.technicianList.splice(index, 1);
  //         }
  //       });
  //     });
  //   }
  //   //console.log(" this.selectedTech", this.technicianList.length);
  // }

  technicianList: any = [];
  selectedTech: any = [];
  loadTechnician(): void {
    this.maintenanceService.getTechnician(this.ProjectId.value).subscribe(
      (response: any) => {
        if (response) {
          this.technicianList = response?.data;
          this.technicianList.forEach((element) => {
            element.checked = false;
            element.disabled = false;
          });
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
    this.filteredTechnicianList = this.technicianList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
  }
  clearTeach(event) {
    this.technicianSearchText = "";
    this.filteredTechnicianList = this.technicianList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
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

  openModalDeleteAssetObject(asset: any) {
    console.log(asset, "hh")
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to delete a Asset ?";
    modalRef.componentInstance.subTitle =
      "Deleting your Asset will remove for this Asset List  ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.unCheckItemAssetList(asset);
        }
      }
    });
  }


  unCheckItemAssetList(asset) {
    const index = this.getAssetIndex(asset.id);
    this.selectedAssetList.splice(index, 1);
  }
  getAssetIndex(assetId) {
    return this.selectedAssetList.findIndex((i) => i.id === assetId);
  }

  onMonthSkip(event) {
    console.log(this.selectMonthValue)
  }

  returnCurrentStatusClassesStatus(value: any){
    return this.commonFunctionService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any){
    return this.commonFunctionService.getStatusColorCircle(value);
  }
  
}
