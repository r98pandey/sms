
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { error, event } from "jquery";
import { UserProfileService } from 'src/app/core/services/user.service';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import Swal from 'sweetalert2';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mytask-access-right-modal-internal-external-matainance',
  templateUrl: './mytask-access-right-modal-internal-external-matainance.component.html',
  styleUrl: './mytask-access-right-modal-internal-external-matainance.component.scss'
})
export class MytaskAccessRightModalInternalExternalMatainanceComponent implements OnInit, OnChanges {
  @Input() selectedUserId: any
  @Input() MyTaskId: any
  @Input() myTaskRulesActiveCount: any[]
  @Input() teamMember: any;
  @Output() sendAfterSubmit = new EventEmitter();
  @Input() dDetail:any
  imageUrl: any = environment.apiUrl
  groupedTasks = {};;
  constructor(public modal: NgbActiveModal, private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private modalService: NgbModal, private userService: UserProfileService,) { }
  groupOrder = [
    'Task Process',
    'Quotation Process',
    'Ticket Internal Verification Process',
    'Ticket External Verification Process',
    'Schedule Acknowledgement Process',
    'Audit Acknowledgement Process'
  ];

  ngOnInit(): void {
    this.groupTasks()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.groupTasks()
  }
  close(value) {
    this.modal.close(value);
  }
  changesMyTaskRulesActive(event, groupName, index) {
    this.groupedTasks[groupName][index].checked = event.target.checked;
    this.openModalCreateMyTask(this.groupedTasks[groupName][index], groupName, index, event.target.checked);
  }
  
  openModalCreateMyTask(fulldata: any, groupName: any, index: any, value) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Update My Task ";
    modalRef.componentInstance.subTitle = "";
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.updateV2_MX_MyTaskRights_Maintenance(groupName,index, value);
        } else {
          console.log("index", index);
          this.myTaskRulesActiveCount[index].checked = false;
          this.groupedTasks[groupName][index].checked = false;
        }
      }
    });
  }
  

  updateV2_MX_MyTaskRights_Maintenance(groupName:any, index: any, value) {
    let payload = {
      userId: this.selectedUserId,
      MyTaskId: this.MyTaskId
    };
    this.myTaskRulesActiveCount.forEach((element) => {
      payload[element.type] = element.checked;
    });
    let url = 'api/Account/UpdateV2_MX_MyTaskRights_Maintenance'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe((res: any) => {
      this.success(res);
      this.sendAfterSubmit.emit(res)

    }, (error) => {
      this.myTaskRulesActiveCount[index].checked = !value;
      this.groupedTasks[groupName][index].checked = false;
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

  groupTasks() {
    this.groupedTasks = this.myTaskRulesActiveCount.reduce((groups, task) => {
      const group = task.group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(task);
      return groups;
    }, {});
  }
}
