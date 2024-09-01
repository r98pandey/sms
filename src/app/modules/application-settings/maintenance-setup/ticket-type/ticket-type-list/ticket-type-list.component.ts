import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EmployeeService } from "src/app/core/services/employee.service";
import { MaintenanceMasterService } from "src/app/core/services/maintenance-master.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import Swal from "sweetalert2";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-ticket-type-list",
  templateUrl: "./ticket-type-list.component.html",
  styleUrls: ["./ticket-type-list.component.scss"],
})
export class TicketTypeListComponent implements OnInit {
  ticketTypeList: any[] = [];
  ticketDetails: any;
  isEdit: boolean = false;
  label: any = "Ticket Types";
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  setectedCatType: any = true;
  typeList = [
    {
      value: true,
      name: "Hardware",
    },
    {
      value: false,
      name: "Non-Hardware",
    },
  ];
  breadCrumbItems: any = [
    { label: "Maintenance Setup" },
    { label: "Ticket Types", active: true },
  ];
  apiUrl: string;
  formGroup: FormGroup;
  editFormGroup: FormGroup;
  selectedTicketType: any = null;
  filteredList: any;
  totalRecords: number = 0;
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
    private maintenanceMasterService: MaintenanceMasterService,
    private formBuilder: FormBuilder,
    private menuService: MenuServiceService,
    private router: Router
  ) {
    let url = this.router.url;
    this.returnValueMenu = this.menuService.getvalueObjectreturn(url);
  }

  ngOnInit(): void {
    this.buildForm();
    this.getTicketType();
  }
  changeSelectedHandler(event) {
    this.page = 1;
    this.getTicketType();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      ticketTypeName: ["", [Validators.required]],
      isDeviceRelated: ["device", [Validators.required]],
    });

    this.editFormGroup = this.formBuilder.group({
      ticketTypeName: ["", [Validators.required]],
      isDeviceRelated: ["", [Validators.required]],
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  getTicketType(): void {
    this.maintenanceMasterService
      .getTicketTypeList_new(this.setectedCatType)
      .subscribe(
        (response: any) => {
          this.ticketTypeList = response.list;
          this.totalRecords = response?.list.length;
          this.filteredList = this.ticketTypeList;
          this.collectionSize = this.ticketTypeList.length;
          this.getLocalPagination();
        },
        (error) => {
          //console.log("erroe", error);
        }
      );
  }
  getLocalPagination() {
    this.filteredList = this.ticketTypeList.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.to =
      this.page * this.pageSize > this.ticketTypeList.length
        ? this.ticketTypeList.length
        : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.ticketTypeList.length == 0 ? 0 : this.from;
  }
  patchForm(data): void {
    this.formGroup.patchValue({
      ticketTypeName: data?.ticketTypeName ? data?.ticketTypeName : "",
      isDeviceRelated: data?.isDeviceRelated == true ? "Device" : "Non-Device",
    });
  }

  deleteModalPopupHandler(modal, ticket) {
    this.ticketDetails = ticket;
    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  onDeleteSubmitHandler() {
    let requestData = {
      ticketTypeId: this.ticketDetails.ticketTypeId,
    };
    //console.log("tickectid", requestData);
    this.maintenanceMasterService.deleteTicketType(requestData).subscribe(
      (res: any) => {
        this.modalService.dismissAll();
        this.getTicketType();
        this.success(res);
      },
      (err: any) => {
        //console.log("error", err);
      }
    );
  }

  editModalPopupHandlerModal(modal, ticket: any): void {
    //console.log("edit", ticket);
    this.editFormGroup.patchValue({
      ticketTypeName: ticket?.ticketTypeName,
      isDeviceRelated: ticket?.isDeviceRelated == true ? "device" : "nonDevice",
    });
    this.ticketDetails = ticket;
    this.isEdit = true;
    this.modalService.open(modal, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  editModalPopupHandler(): void {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Edit Ticket type";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.onEditSubmitHandler();
        } else {
          //this.onBack();
        }
      }
    });
  }

  onEditSubmitHandler(): void {
    let payload = {
      TicketTypeId: this.ticketDetails.ticketTypeId,
      TicketTypeName: this.editFormGroup.value.ticketTypeName,
      IsDeviceRelated:
        this.editFormGroup.value.isDeviceRelated === "device" ? true : false,
    };
    //console.log("this payload", payload);
    this.maintenanceMasterService.updateTicketType(payload).subscribe(
      (res) => {
        this.modalService.dismissAll();
        this.getTicketType();
        this.success(res);
      },
      (err) => {
        this.modalService.dismissAll();
      }
    );
  }

  addModalPopupHandler(modal) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  onSubmitHandler() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to add Ticket Type";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addAddTickettypeSucessModal();
        } else {
          //this.onBack();
        }
      }
    });
  }

  addAddTickettypeSucessModal() {
    //console.log("this.formGroup ", this.formGroup.value);
    let requestData = {
      TicketTypeName: this.formGroup.value.ticketTypeName,
      IsDeviceRelated:
        this.formGroup.value.isDeviceRelated === "device" ? true : false,
    };
    this.maintenanceMasterService.addTicketType(requestData).subscribe(
      (res: any) => {
        this.formGroup.reset();
        this.getTicketType();
        this.modalService.dismissAll();
        this.success(res);
      },
      (err: any) => {
        //console.log("error", err);
      }
    );
  }

  viewModal(modal, ticketType) {
    this.selectedTicketType = ticketType;

    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          // this.save();
        },
        (reason) => {}
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
}
