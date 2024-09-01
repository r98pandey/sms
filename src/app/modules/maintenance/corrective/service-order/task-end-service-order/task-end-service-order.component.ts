import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EndTastCreatedComponent } from '../end-tast-created/end-tast-created.component';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { CommonFunctionService } from '../../../../../shared/Service-common/common-function.service';
import { ServiceOrderService } from 'src/app/core/services/service-order.service';
import { TechnicianComponent } from '../technician/technician.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../../../../core/services/ticket.service';
import { AuthAssetService } from '../../../../../core/services/auth-asset.service';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';
import { Lightbox } from "ngx-lightbox";
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { StartandstropModaalComponent } from 'src/app/shared/components/startandstrop-modaal/startandstrop-modaal.component';

@Component({
  selector: "app-task-end-service-order",
  templateUrl: "./task-end-service-order.component.html",
  styleUrls: ["./task-end-service-order.component.scss"],
})
export class TaskEndServiceOrderComponent implements OnInit, OnChanges {
  @Input() ticketWOStartEndTask: any = [];
  @Input() mX_WorkOder: any;
  @Input() workorderId: any;
  @Input() ticketData: any = [];
  @Input() expectedComplitionDateTime: boolean = true;
  @Output() afterSubmitServiceOrder = new EventEmitter();
  dontShowTheEndTaskButtonForClient: boolean = true;
  isFirstImageVisible: any;
  imageUrl: any = environment.apiUrl;
  imageOneUrl: any = "";
  shownHideButtonAdd: boolean = false;
  technitionsAttendanceTransaction: any;
  constructor(
    private modalService: NgbModal,
    public commonFunctionService: CommonFunctionService,
    private serviceOrderService: ServiceOrderService,
    private offcanvasService: NgbOffcanvas,
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private lightbox: Lightbox,
    private authAssetService: AuthAssetService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.imageOneUrl = "../../../../../../assets/images/placeholderimage.png";
    this.getMasterStatusList("TaskPage");
    if (this.authAssetService.getRole() !== "Client User") {
      if (
        this.ticketService.ticketPageAction == "Basic Service Page" ||
        this.ticketService.ticketPageAction == "Basic Ticket Page" ||
        this.ticketService.ticketPageAction == "Software Support Dashboard Page"
      ) {
        if (
          this.ticketData[0]?.ticketStatusId == 29 ||
          this.ticketData[0]?.ticketStatusId == 30 ||
          this.ticketData[0]?.ticketStatusId == 34
        ) {
          this.checkEndTaskthere(this.ticketWOStartEndTask);
        } else {
          this.shownStartbutton = false;
        }
      } else {
        this.shownStartbutton = false;
      }
    } else {
      this.shownStartbutton = false;
    }
    if (this.authAssetService.getRole() === "Client User") {
      this.dontShowTheEndTaskButtonForClient = false;
    }
  }
  ngOnInit(): void {
    this.imageOneUrl = "../../../../../../assets/images/placeholderimage.png";
    if (this.authAssetService.getRole() !== "Client User") {
      if (
        this.ticketService.ticketPageAction == "Basic Service Page" ||
        this.ticketService.ticketPageAction == "Basic Ticket Page" ||
        this.ticketService.ticketPageAction == "Software Support Dashboard Page"
      ) {
        if (
          this.ticketData[0]?.ticketStatusId == 29 ||
          this.ticketData[0]?.ticketStatusId == 30 ||
          this.ticketData[0]?.ticketStatusId == 34
        ) {
          this.checkEndTaskthere(this.ticketWOStartEndTask);
        } else {
          this.shownStartbutton = false;
        }
      } else {
        this.shownStartbutton = false;
      }
    } else {
      this.shownStartbutton = false;
    }

    if (this.authAssetService.getRole() === "Client User") {
      this.dontShowTheEndTaskButtonForClient = false;
    }
  }

  openModalViewAsseetndTech(ticketingAssetList) {
    if (ticketingAssetList) {
      const modalRef = this.modalService.open(EndTastCreatedComponent, {
        centered: true,
        size: "lg",
        keyboard: false,
        backdrop: "static",
        windowClass: "modalclass",
      });
      modalRef.componentInstance.ticketId = this.ticketWOStartEndTask;
      console.log("abc::", this.ticketWOStartEndTask);
      modalRef.result.then((result) => {
        // if (result) {
        //   this.GetTaskList(this.workorderId);
        // }
      });
    } else {
      this.waring("No Record Found Asset & Technition ");
    }
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
  returnClassname(task) {
    return (
      "status-workTaskStatuId-" +
      task.woTaskStatusId +
      "-" +
      task.woTaskStatusName
    );
  }
  cardBroderFunction(id: any) {
    return (
      " card-border-" +
      this.commonFunctionService.returnAssetStatusBorderAndBadgeClasses(id)
    );
  }
  openModalViewTech(ticketingTechnicianList) {
    if (ticketingTechnicianList.length > 0) {
      const modalRef = this.offcanvasService.open(TechnicianComponent, {
        scroll: true,
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvas ",
      });
      modalRef.componentInstance.ticketingTechnicianList =
        ticketingTechnicianList;

      modalRef.result.then((result) => { }).catch((error) => { });
    } else {
      this.waring("No Record Found Technition ");
    }
  }

  getTechnitionAttendanceListByTaskForSeerviceOrder(WOTaskId) {
    let data = {
      WOTaskId: WOTaskId,
    };
    this.serviceOrderService
      .getTechnitionAttendanceListByTaskForSeerviceOrder(data)
      .subscribe((res: any) => {
        //console.log("res.obj", res.obj);
        if (res.obj) {
          this.openModalViewTech(res.obj);
        }
      });
  }
  getEndTaskConfirmation(row: any, content) {
    //console.log(row, content);
    this.getFormBinding(row);
    this.UpdateStatusValue = row;
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

        },
        (reason) => {
          //console.log(reason);
          this.updateStatusFrom.reset();
        }
      );
  }

  openModalUpdateStatus() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Do you want to update the status of task?";
    modalRef.componentInstance.buttonName = "Update It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.updateServiceOrderStatusAndRemark();
          this.modalService.dismissAll()
          this.updateStatusFrom.reset()
        }
      }
    });
  }


  getFormBinding(row: any) {
    this.imageOneUrl = "../../../../../../assets/images/placeholderimage.png";

    let ststusid = null;
    if (row.soStatusId == 2) {
      ststusid = null;
    } else {
      ststusid = row.soStatusId;
    }
    this.statusValueName = row.soStatusName;
    this.returnStautsTermCondition(this.statusValueName);
    this.updateStatusFrom = this.formBuilder.group({
      actionRemark: [row.wO_Tec_Remark, Validators.required],
      statusValue: [ststusid, Validators.required],
      checkboxRemark: ["", Validators.required],
      imageurlend: [],
    });
  }
  get actionRemark() {
    return this.updateStatusFrom.get("actionRemark");
  }
  get statusValue() {
    return this.updateStatusFrom.get("statusValue");
  }
  get checkboxRemark() {
    return this.updateStatusFrom.get("checkboxRemark");
  }

  updateServiceOrderStatusAndRemark() {
    let payloadData = {
      WOId: this.UpdateStatusValue.woId,
      TaskType: this.UpdateStatusValue.supportType,
      WOStatusId: this.statusValue.value,
      WOStatusName: this.statusValueName,
      Remark: this.actionRemark.value,
      SitePicUrlEndBase64:
        this.imageOneUrl !==
          "../../../../../../assets/images/placeholderimage.png"
          ? this.imageOneUrl.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
    };
    this.serviceOrderService.endServiceOrder(payloadData).subscribe(
      (res) => {
        this.success(res);
        this.UpdateStatusValue = null;
        this.statusValueName = null;
        this.updateStatusFrom.reset();
        this.actionRemarkValue = "";
        this.afterSubmitServiceOrder.emit(res);
        this.shownCrossbutton = false;

      },
      (err) => {
        this.openModaWaringConf(err);
        console.log("err", err);
        this.actionRemarkValue = "";
        this.afterSubmitServiceOrder.emit(err);
        this.updateStatusFrom.reset();

      }
    );
  }

  UpdateStatusValue: any;
  statusValueName: any;
  supportTypeAarry = ["On-Site", "Remote", "Phone Call"];
  shownCrossbutton = false;
  updateStatusFrom: FormGroup;
  maxChars = 300;
  actionRemarkValue: any = "";
  returnTaskListTermStatement: any;

  onSelectOneFile(event): void {
    let fileOne = event["target"].files[0];
    if (event["target"].files && event["target"].files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event["target"].files[0]); // read file as data url
      reader.onload = (event) => {
        this.shownCrossbutton = true;
        this.imageOneUrl = event["target"].result;
      };
    }
  }

  crossOneImage(url): void {
    if (url) {
      this.shownCrossbutton = false;
      this.imageOneUrl = "../../../../../assets/images/placeholderimage.png";
    }
  }

  returnStautsTermCondition(statusName) {
    if (statusName == "On-Hold") {
      this.returnTaskListTermStatement = `
        <p><b>Are you sure you want to end this task? </b></p>
        <p>By clicking "End Task," the current service order status will be changed to "On-Hold." </p>
        <p>This indicates that the task is temporarily paused or on hold for various reasons, such as starting a new day's work or waiting for further instructions or resources.</p>
        <p>If you are ready to put this task on hold and update the service order and ticket status to "On-Hold," 
        click "Confirm."</p>
        <p>If you need to review any details or continue working on the task, click "Cancel" to return to the task view.</p>`;
    } else if (statusName == "Completed") {
      this.returnTaskListTermStatement = `

        <p><b>Are you sure you want to end this task?</b></p>
        <p> By clicking "End Task," the current service order status will be changed to "Completed." This indicates that the task has been successfully executed and all associated actions have been completed.</p>
        <p>If you are confident that all tasks related to this service order have been successfully fulfilled, click "Confirm" to end the task and update the service order status to "Completed." If you need to review any details or continue working on the task, click "Cancel" to return to the task view.</p>`;
    } else if (statusName == "Escalated") {
      this.returnTaskListTermStatement = `

        <p><b>Are you sure you want to end this task?</b><p></p> By clicking "End Task," the current service order status will be changed to "Escalated." This indicates that the task requires further attention and has been escalated to a higher level of support or management due to its complexity or urgency.</p>
        <p>If you are certain that this task requires escalation, click "Confirm" to end the task and update the service order status to "Escalated." If you need to review any details or continue working on the task, click "Cancel" to return to the task view.</p>`;
    } else if (statusName == "Canceled") {
      this.returnTaskListTermStatement = `
        <p><b>Are you sure you want to end this task?</b><p></p> By clicking "End Task," the current service order status will be changed to "Canceled." This indicates that the task has been intentionally stopped or abandoned before completion, typically due to changes in priorities or requirements.</p>
        <p>If you are certain that canceling this task is necessary, click "Confirm" to end the task and update the service order status to "Canceled." If you need to review any details or continue working on the task, click "Cancel" to return to the task view.</p>`;
    } else if (statusName == "In-Progress") {
      this.returnTaskListTermStatement = `
    <p><b>Are you sure you want to start this task? </b></p>
    <p> By clicking "+," symbol A new task created, and service order and ticket status will be changed to "In-Progress." This action indicates that you are ready to begin working on the task.</p>
    <p>If you are confident and ready to proceed, click "Confirm" to create the task and change the service order status to "In-Progress." </p>
    <p>If you need more time or have any concerns, click "Cancel" to go back and review the task details.</p>`;
    }
  }

  changeStatusHandle(event) {
    this.statusValueName = event.assetStatus;
    this.returnStautsTermCondition(this.statusValueName);
  }
  masterStatusList: any = [];
  getMasterStatusList(page: any) {
    this.serviceOrderService
      .getMaintenanceStatus(page)
      .subscribe((res: any) => {
        this.masterStatusList = res;
      });
  }

  updateCreatedTaskFrom: FormGroup;
  imageTwoUrl: any;
  getcreadingTaskFormBinding() {
    this.imageTwoUrl = "../../../../../assets/images/placeholderimage.png";

    this.updateCreatedTaskFrom = this.formBuilder.group({
      supportType: [null, Validators.required],
      imageurY: [],
    });
  }
  get supportType() {
    return this.updateCreatedTaskFrom.get("supportType");
  }
  get imageurY() {
    return this.updateCreatedTaskFrom.get("imageurY");
  }
  getcreadingTaskConfirmation(woId, content) {
    this.getcreadingTaskFormBinding();
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
          this.getStartServiceOrder(woId);
        },
        (reason) => {
          //console.log(reason);
        }
      );
  }
  getStartServiceOrder(woId: any) {
    let data = {
      WOId: Number(woId),
      SupportType: this.supportType.value,
      SitePicUrlStartBase64:
        this.imageTwoUrl != "../../../../../assets/images/placeholderimage.png"
          ? this.imageTwoUrl.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
    };
    //console.log(data);
    this.serviceOrderService.getStartServiceOrder(data).subscribe(
      (res) => {
        this.success(res);
        this.shownCrossbutton = false;
        this.updateCreatedTaskFrom.reset();
        this.afterSubmitServiceOrder.emit(res);
      },
      (err) => {
        this.openModaWaringConf(err);
        this.shownCrossbutton = false;
        this.updateCreatedTaskFrom.reset();
        this.afterSubmitServiceOrder.emit(err);
        
      }
    );
  }

  onSelectSecondFile(event): void {
    let fileTwo = event["target"].files[0];
    if (event["target"].files && event["target"].files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event["target"].files[0]); // read file as data url
      reader.onload = (event) => {
        this.shownCrossbutton = true;
        this.imageTwoUrl = event["target"].result;
      };
    }
  }

  crossTwoImage(url): void {
    if (url) {
      this.shownCrossbutton = false;
      this.imageTwoUrl = "../../../../../assets/images/placeholderimage.png";
    }
  }
  shownStartbutton: boolean = true;
  showinglengthTask: number = 0;

  checkEndTaskthere(task: any) {
    this.shownStartbutton = true;
    this.showinglengthTask = task.length;
    task.forEach((element) => {
      if (element.endDateTime == null && element.endDateTimeByName == null) {
        this.shownStartbutton = false;
        this.GetV2_TechnitionsAttendanceTransaction(element)
      }
    });
  }
  showError(message): void {
    Swal.fire({
      title: "",
      text: message,
      icon: "warning",
      showCancelButton: false,
      confirmButtonText: "<span class='swal2-confirm '> Ok</span>",
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  openModaWaringConf(message) {
    console.log("err", message);
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
        }
      }
    });
  }

  open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }


  linkVideo: any = ''
  openModaVideeo(link, content) {
    this.linkVideo = environment.apiUrl + link;
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    modalRef.result.then((result) => {
      if (result) {
        if (result == "confirm") {

        }
      }
    });
  }


  startStopModal(task, value: any) {

    const modalRef = this.modalService.open(StartandstropModaalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.type = value;

    modalRef.result.then((result) => {
      if (result) {
        console.log("result", result)
        if (result.value == 'success') {
          if (value == 'Start') {
            this.createV2_MX_TechAttendanceProject_Start(task, result)
          } else if (value == 'Stop') {
            this.UpdateV2_MX_TechAttendanceProject_End(task, result)
          } else {

          }
        }
      }
    });

  }


  createV2_MX_TechAttendanceProject_Start(task, value: any) {
    let requestData: any = {
      TechPicUrlStartBase64: value.webcamImageimageAsDataUrl,
      StartRemark: value.remark,
      WOId: this.workorderId,
      TaskType: task?.supportType,

    };
    this.serviceOrderService.StartTechTask(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.afterSubmitServiceOrder.emit(res);
      },
      (err) => {
        this.error(err);
      }
    );

  }
  error(err: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err,
      showConfirmButton: false,
      timer: 1000,
    });
  }
  GetV2_TechnitionsAttendanceTransaction(task) {
    let requestData = {
      techId: this.authAssetService.getUserInfoID(),
      WOTaskId: task.woTaskId,
    }
    this.serviceOrderService.GetV2_TechnitionsAttendanceTransaction(requestData).subscribe(
      (res: any) => {
        this.technitionsAttendanceTransaction = this.findObjectByWoTaskId(res.obj, task.woTaskId);
        console.log("this.technitionsAttendanceTransaction", this.technitionsAttendanceTransaction)
      },
      (err) => {
        this.error(err);
      }
    );
  }
  findObjectByWoTaskId(array, woTaskId) {
    return array.find(obj => obj.woTaskId === woTaskId);
  }

  UpdateV2_MX_TechAttendanceProject_End(task, value: any) {
    let requestData: any = {
      TechPicUrlEndBase64: value.webcamImageimageAsDataUrl,
      EndRemark: value.remark,
      TaskType: task.supportType,
      WOId: this.workorderId
    };
    this.serviceOrderService.EndTechTask(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.GetV2_TechnitionsAttendanceTransaction(task);
        this.afterSubmitServiceOrder.emit(res);
      },
      (err) => {
        this.error(err);
      }
    );

  }
}
