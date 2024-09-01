import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { DecimalPipe, Location } from '@angular/common';
import { Observable } from "rxjs";
import { NgbModal, NgbNav } from "@ng-bootstrap/ng-bootstrap";
import { TicketService } from "src/app/core/services/ticket.service";
import { Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { environment } from "src/environments/environment";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import Swal from "sweetalert2";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { QuotationService } from "src/app/core/services/quotation.service";
import { Lightbox } from "ngx-lightbox";
import { AuditService } from "src/app/core/services/audit.service";
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { TechnicianListModalComponent } from "src/app/shared/components/technician-list-modal/technician-list-modal.component";
import { TechnicianAuditComponent } from "src/app/shared/components/technician-audit/technician-audit.component";
import { AssetService } from "src/app/core/services/asset.service";


@Component({
  selector: "app-new-view-audit",
  templateUrl: "./new-view-audit.component.html",
  styleUrls: ["./new-view-audit.component.scss"],
})
export class NewViewAuditComponent implements OnInit {
  auditData: any = [];
  assetTicketItem: any = [];
  breadCrumbItems = [
    { label: "Ticket" },
    { label: "Ticket View", active: true },
  ];
  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
  };
  assetAuditId: any;
  isProject: any;
  activeId: number = 1;
  imageUrl: any = environment.apiUrl;
  auditAssetList: any;
  mx_WOStartEndTask: any = [];
  @ViewChild("customNav") customNav: NgbNav; // Reference to the ngbNav component
  @ViewChild("defaultNav") defaultNav: NgbNav; // Reference to the ngbNav component
  mX_WOTechAssignment: any[] = [];
  deleteButtonAddButtonShown: boolean = true;

  isTaskStart: any;
  auditTaskAvailablity={
    
      "woTaskId": null,
      "isTaskStart": null,
      "isTaskEnd": null,
      "isCheckin": null,
      "techAttendacenId": null
  
  };
  constructor(
    private router: Router,
    private auditService: AuditService,
    private authService: AuthAssetService,
    private commonFunctionService: CommonFunctionService,
    private lightbox: Lightbox,
    private modalService: NgbModal,
    private maintenanceService: MaintenanceService,
    private location: Location,
    private assetService: AssetService
  ) {
    let url = this.router.url;
    this.breadCrumbItems = [
      { label: "Audit Management" },
      { label: "Audit View", active: true },
    ];
    this.isProject = this.authService.getisProject();
    this.assetAuditId = this.auditService.auditId;
    if (this.assetAuditId !== 0) {
      this.getViewDetails(this.assetAuditId);
    } else {
      this.location.back();
      // this.router.navigate([
      //   "asset-management/audit-management/audit/listaudit",
      // ]);
    }
  }

  ngOnInit(): void {
    this.activeId = 1;
  }

  afterSubmitAudit(event) {
    this.getViewDetails(this.assetAuditId);
  }
  refreshThePage() {
    this.activeId = 1;
    this.getViewDetails(this.assetAuditId);
  }
  GetAuditTaskAvailablity() {
    let payload = {
      WOId: this.assetAuditId
    }

    this.auditService.GetAuditTaskAvailablity(payload).subscribe((res: any) => {
      console.log(res, "gg")

      this.auditTaskAvailablity = res.obj


    })

  }
  getViewDetails(auditId: any) {
    let payload = {
      assetAuditId: auditId,
    };
    this.auditService
      .getMasterAssetAuditDetail(payload)
      .subscribe((res: any) => {

        this.auditData = res.objAssetAuditDetail ? res.objAssetAuditDetail : [];
        this.mx_WOStartEndTask = res.objTaskTech.mx_WOStartEndTask
          ? res.objTaskTech.mx_WOStartEndTask
          : [];

        this.mX_WOTechAssignment = res.objTaskTech.mX_WOTechAssignment
          ? res.objTaskTech.mX_WOTechAssignment
          : [];

        //61 Acknowledgement Required
        //62 Pending-Close
        //32 Closed
        if (
          this.auditData.auditStatusId == 32 ||
          this.auditData.auditStatusId == 61 ||
          this.auditData.auditStatusId == 62
        ) {
          this.deleteButtonAddButtonShown = false;
        } else {
          this.deleteButtonAddButtonShown = true;
        }

        this.GetAuditTaskAvailablity()
      });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  goBack() {
    this.location.back();
    // this.router.navigate(["asset-management/audit-management/audit/listaudit"]);
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

  //Tenchimiom

  selectedTechList: any = [];
  openModalTechnician(projectDepartmentId) {
    console.log("mX_WOTechAssignment", this.mX_WOTechAssignment)
    this.selectedTechList = [];
    const modalRef = this.modalService.open(TechnicianAuditComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.projectId = projectDepartmentId;
    modalRef.componentInstance.nameTitle = "Member";
    modalRef.componentInstance.followUpMemberList = this.mX_WOTechAssignment.length != 0 ? this.mX_WOTechAssignment : [];

    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {
          console.log(result.selectedTech)
          if (result.selectedTech) {
            this.selectedTechList = result.selectedTech ? result.selectedTech : [];
            this.submitTechinionDetails()
          }
        }
      }
    });
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
      "Deleting your Member will remove for this Schedule list";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.DeleteTechnitionforScheudle(techobject);
        }
      }
    });
  }

  DeleteTechnitionforScheudle(element) {
    let sendingPayloadArrayh = {
      TicketTechId: element.ticketTechId,
      techId: element.techId,
    };
    this.auditService.DeleteTechnitionforAudit(sendingPayloadArrayh).subscribe(
      (res: any) => {
        this.getViewDetails(this.assetAuditId);
        this.success(res)
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
        } else {
          //this.onBack();
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
  //     //confirmButtonColor: '#727CF5',
  //     cancelButtonColor: "#FF3366",
  //     confirmButtonText: "<span class='swal2-confirm '> Yes, Update it!</span>",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.submitTechinionDetails();
  //     }
  //   });
  // }

  submitTechinionDetails() {
    let sendingPayloadArray = [];
    this.selectedTechList.forEach((element) => {
      sendingPayloadArray.push({
        techId: element.userId,
        techName: element.fullName,
        ticketId: this.assetAuditId,
      });
    });
    this.auditService
      .InsertTechnitionforAudit(sendingPayloadArray)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        this.selectedTechList = [];
        this.getViewDetails(this.assetAuditId);
        this.success(res)
      });
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


  downloadReport(value) {
    let payload: any = {};
    let newDate = new Date();
    let projectName = 'AuditReport ';
    payload.batchstatusId = this.auditData?.assetAuditId;
    payload.assetAuditId = this.auditData?.auditStatusId;
    payload.downloadType = value;
    console.log(payload);
    this.assetService
      .downloadrptAssetAuditPending(this.commonFunctionService.clean(payload))
      .subscribe((data: Blob) => {
        const filename =
          value === "PDF"
            ? projectName + newDate + ".pdf"
            : projectName + newDate + ".xls";
        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  openModalUpdateComplete() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are You Sure Want To Complete This audit?";
    modalRef.componentInstance.subTitle = "You Be Not Able To Revert This Audit"
    modalRef.componentInstance.subTitle1 =
      this.auditData.pending != 0 ? "It seems that you cannot complete your entire asset audit, yet you still want to complete the task. If yes, you will not revert this back." : "";

    modalRef.componentInstance.buttonName = "Complete It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.UpdateMasterAssetAuditAsCompleted();
        }
      }
    });
  }

  UpdateMasterAssetAuditAsCompleted() {

    let requestData = {
      AssetAuditId: this.assetAuditId
    };

    this.auditService.UpdateMasterAssetAuditAsCompleted(requestData).subscribe(
      (res: any) => {
        this.success(res)
        this.getViewDetails(this.assetAuditId);
      },
      (error) => {
        this.error(error);
        this.getViewDetails(this.assetAuditId);
      }
    );

  }

  error(err) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err,
      showConfirmButton: false,
      timer: 2000,
    });
  }


}
