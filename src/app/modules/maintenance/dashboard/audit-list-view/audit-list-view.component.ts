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
import { DecimalPipe } from "@angular/common";
import { Observable } from "rxjs";
import { NgbModal, NgbNav, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
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
import { AuditSignatureComponent } from "../audit-signature/audit-signature.component";
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
@Component({
  selector: "app-audit-list-view",
  templateUrl: "./audit-list-view.component.html",
  styleUrls: ["./audit-list-view.component.scss"],
})
export class AuditListViewComponent implements OnInit {
  defaultNavActiveId: number = 1;
  auditData: any = [];
  assetTicketItem: any = [];
  breadCrumbItems = [
    { label: "Audit" },
    { label: "Audit View", active: true },
  ];
  assetAuditId: any;
  isProject: any;
  activeId: number = 1;
  imageUrl: any = environment.apiUrl;
  auditAssetList: any;
  auditTypeAdminAndClient: any;
  auditTypeClientSignature: boolean = false;
  auditTypeAdminSignature: boolean = false;
  @ViewChild("customNav") customNav: NgbNav; // Reference to the ngbNav component
  @ViewChild("defaultNav") defaultNav: NgbNav; // Reference to the ngbNav component
  mx_WOStartEndTask: any[] = [];
  mX_WOTechAssignment: any[] = [];
  deleteButtonAddButtonShown: boolean = true;
  num: number = 0;
  option = {
  startVal: this.num,
  useEasing: true,
  duration: 2,
  decimalPlaces: 0,
  };
  constructor(
    private router: Router,
    private auditService: AuditService,
    private authService: AuthAssetService,
    private commonFunctionService: CommonFunctionService,
    private offcanvasService: NgbOffcanvas,
    private helpDeskService: HelpDeskService,
    private lightbox: Lightbox,
    private modalService: NgbModal,
    private maintenanceService: MaintenanceService
  ) {
    let url = this.router.url;
    this.breadCrumbItems = [
      { label: "Audit Management" },
      { label: "Audit View", active: true },
    ];
    this.isProject = this.authService.getisProject();
    this.auditTypeAdminAndClient = this.helpDeskService.auditTypeAdminAndClient;
    this.assetAuditId = this.auditService.auditId;
    if (this.assetAuditId != 0) {
      this.getViewDetails(this.assetAuditId);
    } else {
      this.router.navigate([
        "/maintenance-management/dashboard/audit-list-dashboard",
      ]);
    }
    if (this.auditTypeAdminAndClient === "Admin") {
      this.auditTypeAdminSignature = true;
      this.auditTypeClientSignature = false;
    } else if (this.auditTypeAdminAndClient === "Client") {
      this.auditTypeAdminSignature = true;
      this.auditTypeClientSignature = true;
    } else {
      this.auditTypeAdminSignature = false;
      this.auditTypeClientSignature = false;
    }
  }

  ngOnInit(): void {
    this.defaultNavActiveId = 1;
  }
  refreshThePage() {
    this.defaultNavActiveId = 1;
    this.getViewDetails(this.assetAuditId);
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
      });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  goBack() {
    this.router.navigate([
      "maintenance-management/dashboard/audit-list-dashboard",
    ]);
  }

  openSignatureUser() {
    const modalRef = this.offcanvasService.open(AuditSignatureComponent, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas2",
    });
    modalRef.componentInstance.auditDetails = this.auditData;

    modalRef.result
      .then((result) => {
        //console.log(result, "result");
        this.goBack();
      })
      .catch((error) => {
        //console.log(error, "error");
        if (error == false) {
        } else {
          this.goBack();
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
  //Tenchimiom
  technicianList: any = [];
  selectedTech: any = [];
  loadTechnician(): void {
    this.maintenanceService
      .getTechnician(this.auditData.departmentId)
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

  openModalTechnician(content: any) {
    // this.checktheUserAlreadySelected(this.mX_WOTechAssignment);
    this.modalService.open(content, { size: "lg", centered: true });
    this.loadTechnician();
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

    modalRef.result.then((result) => {}).catch((error) => {});
  }

  sweetAlertUpdateTechinionDetails() {
    Swal.fire({
      title:
        "Do you want to add an additional member for this  Schedule list?",
      text: "You won't be able to revert this!",
      icon: "info",
      showCancelButton: true,
      //confirmButtonColor: '#727CF5',
      cancelButtonColor: "#FF3366",
      confirmButtonText: "<span class='swal2-confirm '> Yes, Update it!</span>",
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitTechinionDetails();
      }
    });
  }

  submitTechinionDetails() {
    let sendingPayloadArray = [];
    this.selectedTech.forEach((element) => {
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
        this.selectedTech = [];
        this.getViewDetails(this.assetAuditId);
      });
  }
  afterSubmitAudit(event) {
    this.getViewDetails(this.assetAuditId);
  }
}
