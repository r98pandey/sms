import { Component, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Observable } from "rxjs";
import { NgbModal, NgbNav } from "@ng-bootstrap/ng-bootstrap";
import { TicketService } from "src/app/core/services/ticket.service";
import { Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { environment } from "src/environments/environment";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import Swal from "sweetalert2";
import { PreventiveService } from "src/app/core/services/preventive.service";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

@Component({
  selector: "app-configuration-view",
  templateUrl: "./configuration-view.component.html",
  styleUrls: ["./configuration-view.component.scss"],
})
export class ConfigurationViewComponent {
  defaultNavActiveId: number = 1;
  assetTicketItem: any = [];
  imgURl: any = environment.apiUrl;
  label: any = "Preventive Management";
  breadCrumbItems: any = [
    { label: "Configuration" },
    { label: "Configuration View", active: true },
  ];
  mX_WOTechAssignment: any = [];
  storeConfigPreventiveId: any;
  isProject: any;
  activeId: number = 1;
  imageUrl: any = environment.apiUrl;
  viewQuotationTabShown: boolean = false;
  deleteId: any;
  @ViewChild("customNav") customNav: NgbNav; // Reference to the ngbNav component
  @ViewChild("defaultNav") defaultNav: NgbNav; // Reference to the ngbNav component
  storePreventiveCategoryId: number;
  paylod: any = {
    ConfigPreventiveId: null,
    PreventiveCategoryId: null,
  };
  masterCheckListList: any = [];
  masterScheduleList: any = [];
  deleteButtonAddButtonShown: boolean = true;
  maintenanceScheduleSkipList: any[] = [];
  arrayOfMonth: any[] = [];
  selectMonthValue: any = null
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private preventiveService: PreventiveService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    private commonFunctionService: CommonFunctionService,
    private maintenanceService: MaintenanceService
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();

    this.storeConfigPreventiveId = this.preventiveService.configPreventiveId
      ? this.preventiveService.configPreventiveId
      : 0;
    this.storePreventiveCategoryId = this.preventiveService.preventiveCategoryId
      ? this.preventiveService.preventiveCategoryId
      : 0;
    this.paylod.ConfigPreventiveId = this.storeConfigPreventiveId;
    this.paylod.PreventiveCategoryId = this.storePreventiveCategoryId;

    if (
      this.storeConfigPreventiveId == 0 ||
      this.storeConfigPreventiveId == null
    ) {
      this.router.navigate([
        "maintenance-management/preventive/configuration/list-configuration",
      ]);
    } else {
      this.getV2_MX_Config_PreventiveScheduleDetail();
    }
  }

  ngOnInit(): void {

    if (this.preventiveService.pageAction === 'Add Checklist') {
      this.activeId = 4
    }
    let cur = new Date().getFullYear();
    this.arrayOfMonth = [
      {
        name: 'January',
        id: cur + '-01-01',
        disabled: false
      },

      {
        name: 'February',
        id: cur + '-02-01',
        disabled: false
      },
      {
        name: 'March',
        id: cur + '-03-01',
        disabled: false
      },
      {
        name: 'April',
        id: cur + '-04-01',
        disabled: false
      },
      {
        name: 'May',
        id: cur + '-05-01',
        disabled: false
      },
      {
        name: 'June',
        id: cur + '-06-01',
        disabled: false
      },
      {
        name: 'July',
        id: cur + '-07-01',
        disabled: false
      },
      {
        name: 'August',
        id: cur + '-08-01',
        disabled: false
      },
      {
        name: 'September',
        id: cur + '-09-01',
        disabled: false
      },
      {
        name: 'October',
        id: cur + '-10-01',
        disabled: false
      },
      {
        name: 'November',
        id: cur + '-11-01',
        disabled: false
      },
      {
        name: 'December',
        id: cur + '-12-01',
        disabled: false
      }]
    this.defaultNavActiveId = 1;
  }
  refreshThePage() {
    this.defaultNavActiveId = 1;
    this.getV2_MX_Config_PreventiveScheduleDetail();
  }

  getV2_MX_Config_PreventiveScheduleDetail() {
    this.preventiveService
      .getV2_MX_Config_PreventiveScheduleDetail(this.paylod)
      .subscribe((res: any) => {
        Object.keys(res.list).forEach((key) => {
          if (res.list[key] === null) {
            res.list[key] = [];
          }
        });

        this.masterScheduleList = res.list.schedule;
        this.assetTicketItem = res.list.assetList;
        this.masterCheckListList = res.list.checkList;
        this.mX_WOTechAssignment = res.list.mX_WOTechAssignment;
        if (
          this.masterScheduleList.scheduleStatusId == 32 ||
          this.masterScheduleList.scheduleStatusId == 61 ||
          this.masterScheduleList.scheduleStatusId == 62
        ) {
          this.deleteButtonAddButtonShown = false;
        } else {
          this.deleteButtonAddButtonShown = true;
        }
        this.getV2_MX_MaintenanceScheduleSkipList(this.storeConfigPreventiveId)
      });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  goback() {
    this.router.navigate([
      "maintenance-management/preventive/configuration/list-configuration",
    ]);
  }

  technicianList: any = [];
  selectedTech: any = [];
  loadTechnician(): void {
    this.maintenanceService
      .getTechnician(this.masterScheduleList.projectId)
      .subscribe(
        (response: any) => {
          if (response) {
            this.technicianList = response?.data;
            this.technicianList.forEach((element) => {
              element.checked = false;
              element.disabled = false;
            });
            if (this.mX_WOTechAssignment.length > 0) {
              this.technicianList.forEach((ele1) => {
                this.mX_WOTechAssignment.forEach((ele) => {
                  if (ele.techId === ele1.userId) {
                    ele1.checked = true;
                    ele1.disabled = true;
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

  openModalTechnician(content: any) {
    // this.checktheUserAlreadySelected(this.mX_WOTechAssignment);
    if (this.masterScheduleList.pmScheduleStatusId == 4) {
      this.sweetAlertAddMemberDisableScheduleStatusInactiveDetails()
    } else {
    this.modalService.open(content, { size: "lg", centered: true });
    this.loadTechnician();}
  }
  getTechnicianIndex(userId) {
    return this.technicianList.findIndex((i) => i.userId === userId);
  }

  getSelectedTechnicianIndex(userId) {
    return this.selectedTech.findIndex((i) => i.userId === userId);
  }



  selectTechnician(technicianList, i, tech) {
    if (this.filteredTechnicianList[i].disabled) {
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
          tech.checked = false;
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
    if (this.masterScheduleList.pmScheduleStatusId == 4) {
      this.sweetAlertDeleteMemberDisableScheduleStatusInactiveDetails()
    } else {

    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to delete a Member ?";
    modalRef.componentInstance.subTitle =
      "Deleting your Member will remove for this Schedule list";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.DeleteTechnitionforConfigScheudle(techobject);
        }
      }
    });
  }}

  DeleteTechnitionforConfigScheudle(element) {
    let sendingPayloadArrayh = {
      TicketTechId: element.ticketTechId,
      techId: element.techId,
    };
    this.preventiveService
      .DeleteTechnitionforConfigScheudle(sendingPayloadArrayh)
      .subscribe(
        (res: any) => {
          this.getV2_MX_Config_PreventiveScheduleDetail();
        },
        (err) => {
          if (err) {
            this.openModaWaringConf(err);
          }
        }
      );
  }

  openModaWaringConf(message) {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = message;
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "confirm") {
          // location.reload();
        }
      }
    });
  }

  sweetAlertUpdateTechinionDetails() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to add additional member for this  Schedule list?";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submitTechinionDetails();
        }
      }
    });
  }



  // sweetAlertUpdateTechinionDetails() {
  //   Swal.fire({
  //     title:
  //       "Do you want to add an additional member for this  Schedule list?",
  //     text: "You won't be able to revert this!",
  //     icon: "info",
  //     showCancelButton: true,
  //     cancelButtonColor: "#FF3366",
  //     confirmButtonText: "<span class='swal2-confirm '> Yes, Update it!</span>",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.submitTechinionDetails();

  //     }
  //   });
  // }

  resetValue() {

    this.selectedTech = [];
  }

  submitTechinionDetails() {
    console.log(this.selectedTech);
    let sendingPayloadArray = [];

    this.selectedTech.forEach((element) => {
      sendingPayloadArray.push({
        techId: element.userId,
        techName: element.fullName,
        ticketId: this.masterScheduleList.configPreventiveId,
      });
    });
    this.preventiveService
      .InsertTechnitionforConfigSchedule(sendingPayloadArray)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        this.selectedTech = [];
        this.getV2_MX_Config_PreventiveScheduleDetail();
      });
  }

  getV2_MX_MaintenanceScheduleSkipList(configPreventiveId: any) {

    for (let i = 0; i < this.arrayOfMonth.length; i++) {
      if (this.arrayOfMonth[i] && this.arrayOfMonth[i].hasOwnProperty('disabled')) {
        this.arrayOfMonth[i].disabled = false;
      }
    }


    this.maintenanceScheduleSkipList = [];
    let paylod = {
      ConfigPreventiveId: configPreventiveId
    }
    this.preventiveService.getV2_MX_MaintenanceScheduleSkipList(paylod).subscribe((res) => {
      this.maintenanceScheduleSkipList = res.list

      this.arrayOfMonth.forEach((ell, index) => {
        this.maintenanceScheduleSkipList.forEach((el) => {

          if (ell.name == el.skipFlag) {
            this.arrayOfMonth[index]['disabled'] = true
          }
        })
      })

    })

  }


  addSkipMonth(content: any) {
    if (this.masterScheduleList.pmScheduleStatusId == 4) {
      this.sweetAlertUpdateDisableScheduleStatusInactiveDetails()
    } else {
      this.arrayOfMonth = this.arrayOfMonth;
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
            if (this.selectMonthValue) {
              this.onSubmitMonth();

            }
          },
          (reason) => { }
        );
    }
  }

  sweetAlertUpdateDisableScheduleStatusInactiveDetails() {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You cannot  add skip  month because the schedule is inactive.";
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {

        }
      }
    });
  }
  sweetAlertDeleteDisableScheduleStatusInactiveDetails() {

    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You cannot  add delete  month because the schedule is inactive.";
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {

        }
      }
    });
  }

  sweetAlertAddMemberDisableScheduleStatusInactiveDetails() {

    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You cannot assign member because the schedule is inactive.";
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {

        }
      }
    });
  }
  sweetAlertDeleteMemberDisableScheduleStatusInactiveDetails() {

    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You cannot delete member because the schedule is inactive.";
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {

        }
      }
    });
  }

  openModalDeleteSkipMonth(id: any) {
    if (this.masterScheduleList.pmScheduleStatusId == 4) {
      this.sweetAlertDeleteDisableScheduleStatusInactiveDetails()
    } else {
      const modalRef = this.modalService.open(DeleteModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title =
        "Are you sure you want to delete a skip month?";
      modalRef.componentInstance.subTitle =
        "Deleting the month will remove it from the database.";

      modalRef.result.then((result) => {
        if (result) {
          if (result == "delete") {
            this.onDeleteMonth(id);
          }
        }
      });
    }
  }

  onDeleteMonth(id) {
    let payload = {
      ScheduleSkipId: id
    }
    this.preventiveService.deleteMX_MaintenanceScheduleSkip(payload).subscribe((res: any) => {

      this.getV2_MX_MaintenanceScheduleSkipList(this.storeConfigPreventiveId);
      this.success(res);
    })
  }


  onSubmitMonth() {
    let payload = {
      ConfigPreventiveId: this.storeConfigPreventiveId,
      SkipFlag: this.selectMonthValue
    }
    this.preventiveService.createMX_MaintenanceScheduleSkip(payload).subscribe((res: any) => {
      this.success(res);
      this.selectMonthValue = null;
      this.getV2_MX_MaintenanceScheduleSkipList(this.storeConfigPreventiveId);
    })
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

  returnCurrentStatusClassesStatus(value: any) {
    return this.commonFunctionService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any) {
    return this.commonFunctionService.getStatusColorCircle(value);
  }

}
