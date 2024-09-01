import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-view-workorder-ticket",
  templateUrl: "./view-workorder-ticket.component.html",
  styleUrls: ["./view-workorder-ticket.component.scss"],
})
export class ViewWorkorderTicketComponent implements OnInit, OnChanges {
  @Input() mX_WOTechAssignment: any;
  @Input() mX_WorkOder: any;
  @Input() mx_WOStartEndTask: any;
  @Input() ticketData: any;
  @Output() setUpdateListValue = new EventEmitter();
  updateDateForm: FormGroup;
  imgUrl: any = environment.apiUrl;
  constructor(
    public commonFunctionService: CommonFunctionService,
    public modalService: NgbModal,
    private maintenanceService: MaintenanceService,
    private authAssetService: AuthAssetService,
    private ticketService: TicketService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {}
  getafterSubmitServiceOrder(event) {
    this.setUpdateListValue.emit(event);
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
        (reason) => {}
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

  returnDate(originalDateString) {
    const originalDate = new Date(originalDateString);
    return this.datePipe.transform(originalDate, "dd-MM-yyyy");
  }
}
