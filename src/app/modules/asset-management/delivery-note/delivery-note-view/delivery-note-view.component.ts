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
import { DeliveryService } from "src/app/core/services/delivery.service";
import * as moment from "moment";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-delivery-note-view",
  templateUrl: "./delivery-note-view.component.html",
  styleUrls: ["./delivery-note-view.component.scss"],
})
export class DeliveryNoteViewComponent {
  defaultNavActiveId: number = 1;
  assetTicketItem: any = [];
  label: any = "Preventive Management";
  breadCrumbItems: any = [
    { label: "Delivery" },
    { label: "Delivery View", active: true },
  ];
  storesendDeliveryId: any;
  isProject: any;
  activeId: number = 1;
  imageUrl: any = environment.apiUrl;
  @ViewChild("customNav") customNav: NgbNav; // Reference to the ngbNav component
  @ViewChild("defaultNav") defaultNav: NgbNav; // Reference to the ngbNav component
  storePreventiveCategoryId: number;
  paylod: any = {
    DeliveryNoteId: null,
  };
  masterDeliveryList: any = [];
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private deliveryService: DeliveryService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    private commonFunctionService: CommonFunctionService,
    public formBuilder: FormBuilder
  ) {
    let url = this.router.url;
    this.isProject = this.authService.getisProject();

    this.storesendDeliveryId = this.deliveryService.sendDeliveryId
      ? this.deliveryService.sendDeliveryId
      : 0;

    this.paylod.DeliveryNoteId = this.storesendDeliveryId;
    if (this.storesendDeliveryId == 0 || this.storesendDeliveryId == null) {
      this.router.navigate(["/asset-management/delivery-note/list-delivery"]);
    } else {
      this.getV2_DeliveryNoteAndTransDetail();
    }
  }

  ngOnInit(): void {
    this.defaultNavActiveId = 1;
  }
  refreshThePage() {
    this.defaultNavActiveId = 1;
    this.getV2_DeliveryNoteAndTransDetail();
  }

  getV2_DeliveryNoteAndTransDetail() {
    this.deliveryService
      .getV2_DeliveryNoteAndTransDetail(this.paylod)
      .subscribe((res: any) => {
        Object.keys(res).forEach((key) => {
          if (res[key] === null) {
            res[key] = [];
          }
        });
        this.masterDeliveryList = res.objHeader;
        this.assetTicketItem = res.objAssetList;
      });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  goback() {
    this.router.navigate(["/asset-management/delivery-note/list-delivery"]);
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

    this.deliveryService
      .updateDeliveryNoteToClient(payload)
      .subscribe((res) => {
        //console.log(res);
        this.goback();
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
}
