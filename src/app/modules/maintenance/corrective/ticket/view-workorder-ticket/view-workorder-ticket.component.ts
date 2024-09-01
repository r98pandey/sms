import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { environment } from "src/environments/environment";
import { CommonFunctionService } from "../../../../../shared/Service-common/common-function.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import Swal from "sweetalert2";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import Step from 'shepherd.js/src/types/step';
import { ShepherdService } from "angular-shepherd";

@Component({
  selector: "app-view-workorder-ticket",
  templateUrl: "./view-workorder-ticket.component.html",
  styleUrls: ["./view-workorder-ticket.component.scss"],
})
export class ViewWorkorderTicketComponent implements OnInit, OnChanges {
  @Input() ticketData: any;
  @Input() mX_WOTechAssignment: any;
  @Input() mX_WorkOder: any;
  @Input() mx_WOStartEndTask: any;
  @Output() setUpdateListValue = new EventEmitter();
  shownAddTechButton: boolean = false;
  imgUrl: any = environment.apiUrl;
  technicianList: any = [];
  selectedTech: any = [];
  deleteButtonShown: boolean = true;
  updateDateForm: FormGroup;
  alreadyTrue: boolean = true;
  constructor(
    public commonFunctionService: CommonFunctionService,
    public modalService: NgbModal,
    private maintenanceService: MaintenanceService,
    private authAssetService: AuthAssetService,
    private ticketService: TicketService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe, private shepherdService: ShepherdService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("mX_WOTechAssignment", this.mX_WOTechAssignment, this.mX_WorkOder);
    this.buildForm();
    this.loadTechnician();
    if (this.authAssetService.getRole() === "Client User") {
      this.deleteButtonShown = false;
    }
    if (this.authAssetService.getRole() !== "Client User") {
      if (
        this.ticketService.ticketPageAction == "Basic Service Page" ||
        this.ticketService.ticketPageAction == "Basic Ticket Page"
      ) {
        switch (this.mX_WorkOder.woStatusId) {
          case 2:
            if (
              this.mX_WorkOder.expWrkStartDate == null ||
              this.mX_WorkOder.expWrkStartTime == null
            ) {
              this.shownAddTechButton = false;
            } else {
              this.shownAddTechButton = true;
            }
            break;
          case 30:
            if (
              this.mX_WorkOder.expWrkStartDate == null ||
              this.mX_WorkOder.expWrkStartTime == null
            ) {
              this.shownAddTechButton = false;
            } else {
              this.shownAddTechButton = true;
            }
            break;
          case 34:
            if (
              this.mX_WorkOder.expWrkStartDate == null ||
              this.mX_WorkOder.expWrkStartTime == null
            ) {
              this.shownAddTechButton = false;
            } else {
              this.shownAddTechButton = true;
            }
            break;
          case 25:
            this.shownAddTechButton = false;
            break;
          default: {
            this.shownAddTechButton = false;
          }
        }
      }
    }

    const builtInButtons = {
      cancel: {
        classes: 'cancel-button',
        secondary: true,
        text: 'Exit',
        type: 'cancel'
      },
      next: {
        classes: 'btn btn-success',
        text: 'Next',
        type: 'next'
      },
      back: {
        classes: 'back-button',
        secondary: true,
        text: 'Back',
        type: 'back'
      },
      finish: {
        classes: 'btn btn-primary',
        text: 'Okay!',
        type: 'cancel'
      },
    };

    const defaultStepOptions: Step.StepOptions = {
      classes: 'shepherd-theme-arrows custom-default-class',
      scrollTo: { behavior: 'smooth', block: 'center' },
      cancelIcon: {
        enabled: true
      },
      canClickTarget: false,
    };
    if (this.alreadyTrue) {
      if (this.updateLinkOfDateCom() && !this.mX_WorkOder.expectedComplitionDateTime) {
        this.alreadyTrue = false
        let steps: Step.StepOptions[] = [
          {
            attachTo: {
              element: '.actions',
              on: 'bottom'
            },
            buttons: [
              builtInButtons.finish
            ],
            classes: 'custom-class-name-1 custom-class-name-2',
            id: 'intro',
            title: 'Update Exp. Comp. Date!',
            text: 'Kindly update the completion date, then only can start the service order activity.'
          },
        ];

        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(steps);
        this.shepherdService.start();

      }
    }
  }
  ngOnInit(): void {
    if (this.authAssetService.getRole() !== "Client User") {
      if (
        this.ticketService.ticketPageAction == "Basic Service Page" ||
        this.ticketService.ticketPageAction == "Basic Ticket Page"
      ) {
        switch (this.mX_WorkOder.woStatusId) {
          case 2:
            if (
              this.mX_WorkOder.expWrkStartDate == null ||
              this.mX_WorkOder.expWrkStartTime == null
            ) {
              this.shownAddTechButton = false;
            } else {
              this.shownAddTechButton = true;
            }
            break;
          case 30:
            if (
              this.mX_WorkOder.expWrkStartDate == null ||
              this.mX_WorkOder.expWrkStartTime == null
            ) {
              this.shownAddTechButton = false;
            } else {
              this.shownAddTechButton = true;
            }
            break;
          case 34:
            if (
              this.mX_WorkOder.expWrkStartDate == null ||
              this.mX_WorkOder.expWrkStartTime == null
            ) {
              this.shownAddTechButton = false;
            } else {
              this.shownAddTechButton = true;
            }
            break;
          case 25:
            this.shownAddTechButton = false;
            break;
          default: {
            this.shownAddTechButton = false;
          }
        }
      }
    }

  }

  getafterSubmitServiceOrder(event) {
    this.setUpdateListValue.emit(event);
  }

  openModalTechnician(content: any) {
    this.checktheUserAlreadySelected(this.mX_WOTechAssignment).then(() => {
      this.modalService.open(content, { size: "lg", centered: true });
    });
  }

  async checktheUserAlreadySelected(mX_WOTechAssignment) {
    console.log(this.technicianList, "gh");

    if (mX_WOTechAssignment.length > 0) {
      for (let index = this.technicianList.length - 1; index >= 0; index--) {
        let ele1 = this.technicianList[index];
        for (let ele of mX_WOTechAssignment) {
          if (ele.techId === ele1.userId) {
            this.technicianList.splice(index, 1);
            break; // Exit inner loop after splice
          }
        }
      }
    }

    console.log(" this.selectedTech", this.technicianList.length);
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
    //console.log("index", index, this.technicianList[index]);
    if (this.technicianList[index].checked) {
      this.technicianList[index].checked = false;
    } else {
      this.technicianList[index].checked = true;
    }
    this.getTodoListChecked(technicianList[i].checked, tech);
  }

  filteredTechnicianList: any[] = [];
  technicianSearchText: string = "";
  filterTechnician(event) {
    this.filteredTechnicianList = this.technicianList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
    //console.log("this.filteredTechnicianList", this.filteredTechnicianList);
  }

  loadTechnician(): void {
    this.maintenanceService
      .getTechnician(this.ticketData[0].projectId)
      .subscribe(
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
                    ele1.checked = true; ele1.disabled = true;

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

  getTodoListChecked(isSelected: any, tech: any) {
    if (isSelected == true) {
      tech.checked = true;
      this.selectedTech.push({
        designationName: tech.designationName,
        phoneNumber: tech.phoneNumber,
        profileImageUrl: tech.profileImageUrl,
        techId: tech.userId,
        techName: tech.fullName,
        ticketId: this.ticketData[0].ticketId,
        woId: this.mX_WorkOder.woId,
        roleName: tech.roleName,
      });
    } else {
      this.selectedTech.forEach((value, index) => {
        if (value.userId == tech.techId) {
          this.selectedTech.splice(index, 1);
        }
      });
    }
    //console.log(" this.selectedTech", this.selectedTech);
  }

  openModalNotDekleteTech() {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = 'You cannot delete this member because the task has been started by them.';
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {

      if (result) {

      }

    });
  }



  submitTechinionDetails() {
    let sendingPayloadArray = [];
    this.selectedTech.forEach((element) => {
      sendingPayloadArray.push({
        techId: element.techId,
        techName: element.techName,
        ticketId: element.ticketId,
        woId: element.woId,
      });
    });
    //console.log("this.sendingPayloadArray", sendingPayloadArray);
    this.maintenanceService
      .insertTechnitionforServiceOrderIndividual(sendingPayloadArray)
      .subscribe((res: any) => {
        this.setUpdateListValue.emit(res);
        this.modalService.dismissAll();
        this.selectedTech = [];
      });
  }

  // sweetAlertUpdateTechinionDetails() {
  //   Swal.fire({
  //     title:
  //       "Do you want to add an additional member for this service order?",
  //     text: "You won't be able to revert this!",
  //     icon: "info",
  //     showCancelButton: true,
  //     //confirmButtonColor: '#727CF5',
  //     cancelButtonColor: "#FF3366",
  //     confirmButtonText: "<span class='swal2-confirm '> Yes, Update it!</span>",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.submitTechinionDetails();
  //     }
  //   });
  // }

  sweetAlertUpdateTechinionDetails() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to add an additional member for this service order?";
    modalRef.componentInstance.subTitle = "You won't be able to revert this!";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submitTechinionDetails();
        } else {
          //this.onBack();
        }
      }
    });
  }

  updateTicketItemStatusAndImageByTech(element) {
    let sendingPayloadArrayh = {
      TicketTechId: element.ticketTechId,
      ticketId: element.ticketId,
      woId: element.woId,
      techId: element.techId,
    };
    //console.log("this.sendingPayloadArray", sendingPayloadArrayh);
    this.maintenanceService
      .deleteTechnitionforServiceOrderIndividual(sendingPayloadArrayh)
      .subscribe(
        (res: any) => {
          this.setUpdateListValue.emit(res);
        },
        (err) => {
          //console.log("err", err);
          if (err) {
            this.openModaWaringConf(err);
          }
        }
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
      "Deleting your Member will remove for this service order";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.updateTicketItemStatusAndImageByTech(techobject);
        }
      }
    });
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

  openmodalUpdateDate(mX_WorkOder: any, content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.submitModalData(mX_WorkOder);
        },
        (reason) => { }
      );
  }
  submitModalData(mX_WorkOder) {
    let payload = {
      TicketId: mX_WorkOder.ticketId,
      WOId: mX_WorkOder.woId,
      ExpectedComplitionDateTime: this.commonFunctionService.dateFormatter(
        this.expectedComplitionDateTime.value
      ),
    };

    console.log("payload", payload, "mX_WorkOder");
    this.maintenanceService.updateExpCompletionDateTime(payload).subscribe(
      (res: any) => {
        this.success(res);
        this.setUpdateListValue.emit(res);
      },
      (err) => {
        if (err) {
          this.openModaWaringConf(err);
        }
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
  buildForm() {
    this.updateDateForm = this.formBuilder.group({
      expectedComplitionDateTime: ["", Validators.required],
    });
  }
  minDate: Date = new Date();
  get expectedComplitionDateTime() {
    return this.updateDateForm.get("expectedComplitionDateTime");
  }
  clearChangeExpectedComplitionDate() {
    this.expectedComplitionDateTime.reset();
  }
  updateLinkOfDateCom() {
    let returnValue: boolean = false;
    if (this.authAssetService.getRole() !== "Client User") {
      if (
        this.ticketData[0].ticketStatusId == 29 ||
        this.ticketData[0].ticketStatusId == 30 ||
        this.ticketData[0].ticketStatusId == 34
      ) {
        returnValue = true;
      } else {
        returnValue = false;
      }
    } else {
      returnValue = false;
    }


    return returnValue;
  }
  returnDate(originalDateString) {
    const originalDate = new Date(originalDateString);
    return this.datePipe.transform(originalDate, "dd-MM-yyyy");
  }


  returnCurrentStatusClassesStatus(value: any) {
    return this.commonFunctionService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any) {
    return this.commonFunctionService.getStatusColorCircle(value);
  }

}
