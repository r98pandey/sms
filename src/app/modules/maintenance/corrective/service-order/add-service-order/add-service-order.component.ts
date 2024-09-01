import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
// import date from 'date-and-time';
import { MaintenanceService } from "src/app/core/services/maintenance.service";
import Swal from "sweetalert2";
import { GenerateWorkOrder } from "src/app/core/models/ticket.interface";
import { environment } from "src/environments/environment";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";

@Component({
  selector: "app-add-service-order",
  templateUrl: "./add-service-order.component.html",
  styleUrls: ["./add-service-order.component.scss"],
})
export class AddServiceOrderComponent implements OnInit {
  @Input() ticketInfo: any;
  @Input() serviceOrderDetailOnlyObject: any = {};
  @Output() submitAfterGernateServiceOrder = new EventEmitter();
  @ViewChild("successDataModal", { static: true }) successDataModal: ElementRef;
  minDate: Date = new Date();
  public Editor = ClassicEditor;
  serviceOrderFrom!: UntypedFormGroup;
  supportTypeAarry = ["On-Site", "Remote", "Phone Call"];
  startTime: string;
  technicianList: any = [];

  selectedTech: any[] = [];
  payload: GenerateWorkOrder;
  searchText: string;
  submitted: boolean = false;

  selectedTimes = { F: null };

  apiUrl: string = environment.apiUrl;
  supportTypeOnSite: boolean = false;
  loadingForSubmitBtn: boolean = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    private maintenanceService: MaintenanceService,
    private commonFunctionService: CommonFunctionService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    //console.log(this.ticketInfo);
    this.buildForm();
    this.loadTechnician();
    this.getMX_MasterTicketType(this.ticketInfo.isDeviceRelated);
    this.getMX_MasterUrgentTypeList();
    if (this.serviceOrderDetailOnlyObject) {
      this.patchFromServiceOrder(this.serviceOrderDetailOnlyObject);
    }
  }

  buildForm(): void {
    this.serviceOrderFrom = this.formBuilder.group({
      taskType: [{ value: "Corrective", disabled: true }],
      priority: ["", [Validators.required]],
      category: [null, [Validators.required]],
      date: [""],
      time: [""],
      note: [""],
      supportType: [null, [Validators.required]],
      expectedComplitionDateTime: [""],
      
    });
  }
  patchFromServiceOrder(data: any): void {
    this.serviceOrderFrom.patchValue({
      name: data?.woName,
      taskType: data?.taskType ? data?.taskType : "Corrective",
      priority: data?.urgencyTypeName,
      category: data?.ticketTypeId,
      date: data?.expWrkStartDate ? data?.expWrkStartDate : "",
      time: data?.expWrkStartTime ? data?.expWrkStartTime : "",
      note: data?.addtionalNote ? data?.addtionalNote : "",
      supportType: data?.supportType ? data?.supportType : null,
      expectedComplitionDateTime: data?.expectedComplitionDateTime
        ? this.commonFunctionService.dateFormatter(data?.expectedComplitionDateTime)
        : null,
    });
    this.serviceOrderFrom.disable();
    this.serviceOrderFrom.get("date").enable();
    this.serviceOrderFrom.get("note").enable();
    this.serviceOrderFrom.get("time").enable();
    this.serviceOrderFrom.get("expectedComplitionDateTime").enable();
  }
  get name() {
    return this.serviceOrderFrom.get("name");
  }
  get priority() {
    return this.serviceOrderFrom.get("priority");
  }
  get category() {
    return this.serviceOrderFrom.get("category");
  }
  get time() {
    return this.serviceOrderFrom.get("time");
  }
  get date() {
    return this.serviceOrderFrom.get("date");
  }
  get taskType() {
    return this.serviceOrderFrom.get("taskType");
  }
  get note() {
    return this.serviceOrderFrom.get("note");
  }
  get supportType() {
    return this.serviceOrderFrom.get("supportType");
  }
  get expectedComplitionDateTime() {
    return this.serviceOrderFrom.get("expectedComplitionDateTime");
  }
  cetagoryList: any = [];
  cetagory: any;
  priorityList: any = [];

  getMX_MasterTicketType(Isdevice: any): void {
    this.ticketService
      .getMX_MasterTicketType(Isdevice)
      .subscribe((response: any) => {
        if (response) {
          this.cetagoryList = response?.list;
          if (this.ticketInfo.ticketTypeId) {
            this.cetagoryList.forEach((element) => {
              if (element.ticketTypeId === this.ticketInfo.ticketTypeId) {
                this.serviceOrderFrom
                  .get("category")
                  .setValue(this.ticketInfo.ticketTypeId);
              }
            });
          }
          if (this.serviceOrderDetailOnlyObject) {
            this.patchFromServiceOrder(this.serviceOrderDetailOnlyObject);
          }
        }
      });
  }

  getMX_MasterUrgentTypeList(): void {
    this.ticketService
      .getMX_MasterUrgentTypeList()
      .subscribe((response: any) => {
        if (response) {
          this.priorityList = response?.data;
        }
        if (this.ticketInfo.urgencyTypeId) {
          const urgentType = this.priorityList.find(
            (item) => item.urgencyTypeId == this.ticketInfo?.urgencyTypeId
          );
          this.serviceOrderFrom
            .get("priority")
            .setValue(urgentType?.urgencyTypeName);
        }
        if (this.serviceOrderDetailOnlyObject) {
          this.patchFromServiceOrder(this.serviceOrderDetailOnlyObject);
        }
      });
  }

  ticketCategoryHandler(event): void {
    this.cetagory = event;
  }

  loadTechnician(): void {
    this.maintenanceService.getTechnician(this.ticketInfo.projectId).subscribe(
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

  isAllTechCheckBoxChecked() {
    return this.technicianList?.every((p) => p.checked);
  }

  checkAllTechCheckBox(ev, rows: any) {
    this.technicianList.forEach((x) => (x.checked = ev.target.checked));
    if (ev.target.checked == true) {
      this.technicianList.forEach((ele) => {
        ele.checked = true;
        this.selectedTech.push(ele);
      });
    } else {
      this.selectedTech = this.selectedTech.filter((item) => {
        let foundItemArray: any[] = this.technicianList.filter(
          (el) => el.techId == item.techId
        );
        if (foundItemArray.length > 0) return false;
        return true;
      });
    }
  }

  uniqByKeepZLast(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  getTodoListChecked(isSelected: any, tech: any) {
    if (isSelected == true) {
      tech.checked = true;
      this.selectedTech.push(tech);
    } else {
      this.selectedTech.forEach((value, index) => {
        if (value.userId == tech.userId) {
          this.selectedTech.splice(index, 1);
        }
      });
    }
    //console.log(" this.selectedTech", this.selectedTech);
  }

  removeCheckedTech(tech: any) {
    this.technicianList.forEach((ele, i) => {
      if (ele.userId == tech.userId) {
        this.technicianList[i].checked = false;
      }
    });
    this.selectedTech.forEach((value, index) => {
      if (value.userId == tech.userId) {
        this.selectedTech.splice(index, 1);
      }
    });
  }

  getTicketTypeName(ticketTypeId) {
    const result = this.cetagoryList.find(
      (i) => i.ticketTypeId === ticketTypeId
    );
    return result;
  }

  onSubmit(): void {
    this.loadingForSubmitBtn = true;
    if (!this.serviceOrderFrom.valid) {
      this.waring("Please fill required field");
      return;
    } else {
      let formData = this.serviceOrderFrom.value;
      const urgentType = this.priorityList.find(
        (itme) => itme?.urgencyTypeName === formData?.priority
      );
      let selectedTech = [];
      if (this.selectedTech.length !== 0) {
        this.selectedTech.forEach((element) => {
          selectedTech.push({
            TechId: element?.userId,
            TechName: element?.fullName,
          });
        });
      }
      this.payload = {
        mX_WorkOder: {
          TicketId: this.ticketInfo?.ticketId,
          TicketTypeId: formData?.category,
          UrgencyTypeId: urgentType?.urgencyTypeId,
          UrgencyTypeName: formData?.priority ? formData?.priority : "",
          IsBillingRequired:
            this.ticketInfo?.isBillingRequired == null
              ? false
              : this.ticketInfo?.isBillingRequired,
          AddtionalNote: formData?.note ? formData?.note.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>') : "",
          isDeviceRelated: this.ticketInfo.isDeviceRelated,
          SupportType: formData?.supportType ? formData?.supportType : "",
          OperationType: this.ticketInfo?.operationType,
          TicketTypeName: this.getTicketTypeName(formData?.category)
            .ticketTypeName,
        },
        mX_WOTechAssignment: selectedTech ? selectedTech : [],
      };
      if (formData?.date) {
        this.payload.mX_WorkOder.ExpWrkStartDate =
          this.commonFunctionService.dateFormatter(formData?.date);
      }
      if (formData?.time) {
        this.payload.mX_WorkOder.ExpWrkStartTime = this.formatTime(
          formData?.time
        );
      }

      if (formData?.expectedComplitionDateTime) {
        this.payload.mX_WorkOder.ExpectedComplitionDateTime = this
          .expectedComplitionDateTime.value
          ? this.commonFunctionService.dateFormatter(
              this.expectedComplitionDateTime.value
            )
          : null;
      }
      this.saveWorkOrder(this.payload);
    }
  }

  saveWorkOrder(payload): void {
    this.loadingForSubmitBtn = true;
    this.maintenanceService.generateWorkOrder(this.payload).subscribe(
      (res: any) => {
        this.loadingForSubmitBtn = false;
        this.successModal();
      },
      (err) => {
        this.loadingForSubmitBtn = false;
      }
    );
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

  confirmation() {
    this.loadingForSubmitBtn = true;
    if (!this.serviceOrderFrom.valid) {
      this.waring("Please fill required field");
      return;
    }

    let formData = this.serviceOrderFrom.value;

    if (formData?.date) {
      if (!formData?.time) {
        // this.time.
        this.waring("Please Enter Expected Work Start Time ");
        return;
      }
    }

    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you sure, You want to proceed? .";
    modalRef.componentInstance.subTitle = "you won't be able to revert this!";
    modalRef.componentInstance.buttonName = "Submit It";
    modalRef.result.then((result) => {
      if (result == "success") {
        this.onSubmit();
      } else {
        this.loadingForSubmitBtn = false;
      }
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

  formatTime(value) { 
    let da = moment(value, "hh:mm:ss A");
    const an_hour_ago = moment(da).subtract(0, "hour");
    return an_hour_ago.format("hh:mm A");
  }

  openModalTechnician(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: "lg", centered: true });
  }

  goBack() {
    let lastRouter = this.ticketService.lastStoreRouterDashboardName;
    this.router.navigate([lastRouter]);
    // this.router.navigate([
    //   "/maintenance-management/corrective/ticket/list-ticket",
    // ]);
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
    //console.log("index", index, this.technicianList[index]);
    if (this.technicianList[index].checked) {
      this.technicianList[index].checked = false;
    } else {
      this.technicianList[index].checked = true;
    }
    this.getTodoListChecked(technicianList[i].checked, tech);
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
    //console.log("filteredTechnicianList---", this.filteredTechnicianList);
  }

  /**
   * Open Success modal
   */
  successModal() {
    this.modalService
      .open(this.successDataModal, {
        backdrop: "static",
        keyboard: false,
        centered: true,
      })
      .result.then(
        (result) => {
          if (this.serviceOrderDetailOnlyObject) {
            this.router.navigate([
              "/maintenance-management/dashboard/dashboard-servicet-order-list",
            ]);
          } else {
            this.submitAfterGernateServiceOrder.emit(true);
          }
        },
        (reason) => {}
      );
  }
  updateExpStarWorkDateTime(UpdateStatusValue) {
    if (this.time.value && this.date.value) {
      let selectedTech = [];
      this.selectedTech.forEach((element) => {
        selectedTech.push({
          TechId: element?.userId,
          TechName: element?.fullName,
          WOId: UpdateStatusValue.woId,
          TicketId: UpdateStatusValue.ticketId,
        });
      });
      let mX_WorkOder: any = {
        WorkOrderId: UpdateStatusValue.woId,
        ExpWrkStartDate: this.commonFunctionService.dateFormatter(
          this.date.value
        ),
        ExpectedComplitionDateTime: this.expectedComplitionDateTime.value
          ? this.commonFunctionService.dateFormatter(
              this.expectedComplitionDateTime.value
            )
          : null,
        TicketId: UpdateStatusValue.ticketId,
        ExpWrkStartTime: this.time.value,
      };

      let payloadData = {
        mX_WorkOder: this.commonFunctionService.clean(mX_WorkOder),
        mX_WOTechAssignment: selectedTech ? selectedTech : [],
      };
      console.log("request", payloadData);
      this.maintenanceService
        .UpdateExpStarWorkDateTime(
          this.commonFunctionService.clean(payloadData)
        )
        .subscribe((res) => {
          this.successModal();
        });
    }
  }

  serviceOrderConfirmation() {
    this.loadingForSubmitBtn = true;
    if (!this.serviceOrderFrom.valid) {
      this.waring("Please fill required field");
      return;
    }

    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you confirming the submission?";
    modalRef.componentInstance.subTitle =
      "Will update the expected start date and time and send a notification to the technician/ support team to proceed with the site visit and address the issue.";
    modalRef.componentInstance.buttonName = "Update It";
    modalRef.result.then((result) => { 
      if (result == "success") {
        this.updateExpStarWorkDateTime(this.serviceOrderDetailOnlyObject);
      } else { 
        this.loadingForSubmitBtn = false;
      }
    });
  }
  returnValueDisabled() {
    let value: boolean = true;
    if (this.serviceOrderFrom.valid) {
      if (this.date.value) {
        if (this.time.value) {
          if (this.selectedTech.length == 0) {
            value = true;
          } else {
            value = false;
          }
        }
      } else {
        value = false;
      }
    } else {
      value = true;
    }
    return value;
  }

  returnValueDisabled2() {
    let value: boolean = true;
    if (this.serviceOrderFrom.valid) {
      if (this.date.value) {
        if (this.time.value) {
          if (this.selectedTech.length == 0) {
            value = true;
          } else {
            value = false;
          } 
        }
      } else {
        value = true;
      }
    } else {
      value = true;
    }
    return value;
  }

  changDate() {
    this.time.reset();
    //console.log("gt");
    this.selectedTech = [];
  }
  clearChangDate() {
    this.time.reset();
    this.date.reset();
    this.selectedTech = [];
    this.filteredTechnicianList.forEach((ele) => {
      ele.checked = false;
    });
    this.technicianList.forEach((ele) => {
      ele.checked = false;
    });
  }

  clearChangTime() {
    this.time.reset();
    this.selectedTech = [];
    this.filteredTechnicianList.forEach((ele) => {
      ele.checked = false;
    });
    this.technicianList.forEach((ele) => {
      ele.checked = false;
    });
  }

  clearChangeExpectedComplitionDate() {
    this.expectedComplitionDateTime.reset();
  }

  returnDate(originalDateString) {
    const originalDate = new Date(originalDateString);
    return this.datePipe.transform(originalDate, "dd-MM-yyyy");
  }
  
  returnCurrentStatusClassesStatus(value: any){
    return this.commonFunctionService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any){
    return this.commonFunctionService.getStatusColorCircle(value);
  }

}
