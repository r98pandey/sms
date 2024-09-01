import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AddAccessRightComponent } from '../add-access-right/add-access-right.component';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';

@Component({
  selector: 'app-list-access-right',
  templateUrl: './list-access-right.component.html',
  styleUrl: './list-access-right.component.scss'
})
export class ListAccessRightComponent implements OnChanges, OnInit, AfterViewInit {
  imageUrl = environment.apiUrl;
  @Output() sendBackAfterSubmitUser = new EventEmitter();
  @Input() maintenanceProcessComing: boolean;
  @Input() comingWhichTab:any;
  @Input() accessGroup:any;
  @Input() dDetail:any
  constructor(private offcanvasService: NgbOffcanvas, 
    private modalService: NgbModal, 
    private commonHttpServiceCallerService: CommonHttpServiceCallerService) {

  }
  @Input() projectProcessUserApprvalList: any[] = [];
  @Input() projectDepartmentId: any

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  openAddModelPopu(accesRight) {
    if(this.dDetail.departmentStatusId==49){
      const modalRef = this.modalService.open(MessageModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = 'You can proceed with the process because the project has been deleted.';
      modalRef.componentInstance.subTitle = "";
      modalRef.componentInstance.buttonName = 'Ok'
      modalRef.result.then((result) => {
        //console.log(result, "result");
        if (result) {
          if (result == "Close click") {
          
          }
        }
      
      });

    }else{
    const modalRef = this.offcanvasService.open(
      AddAccessRightComponent,
      {
        scroll: true,
        position: "end",
        keyboard: false,
        backdrop: "static",
        panelClass: "custom-offcanvasNooverflow",
      }
    );
    modalRef.componentInstance.accessRight =
      accesRight;
      modalRef.componentInstance.accessGroup =
      this.accessGroup;
    modalRef.componentInstance.projectDepartmentId = this.projectDepartmentId
    modalRef.componentInstance.maintenanceProcessComing = this.maintenanceProcessComing

    modalRef.result
      .then((result) => {
        if (result.type == 'success') {
          this.createV2_ProjectProcessApprovalUser(result.selectObjectSend)
        }
      })
      .catch((result) => {
        if (result.type == 'success') {
          this.createV2_ProjectProcessApprovalUser(result.selectObjectSend)
        }
      });
  }}
  listBackground = ['bg-danger-subtle', 'bg-success-subtle', 'bg-warning-subtle', 'bg-info-subtle', 'bg-secondary-subtle']

  getBackgroundClass(index: number): string {
    return this.listBackground[index % this.listBackground.length];
  }

  @ViewChildren('sameHeight') headers: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.setEqualHeight();
  }

  setEqualHeight() {
    const headerElements = this.headers.toArray().map(header => header.nativeElement);
    let maxHeight = 0;

    headerElements.forEach(header => {
      const height = header.getBoundingClientRect().height;
      if (height > maxHeight) {
        maxHeight = height;
      }
    });

    headerElements.forEach(header => {
      header.style.height = `${maxHeight}px`;
    });
  }
  createV2_ProjectProcessApprovalUser(selectObjectSend) {
    let url = this.maintenanceProcessComing ? 'api/Account/CreateV2_MaitenanceProcessApprovalUser' : 'api/Account/CreateV2_ProjectProcessApprovalUser';
    const requests = selectObjectSend.map(element => this.commonHttpServiceCallerService.postWithJsonDataMethod(url, element));
    forkJoin(requests).subscribe(
      (res: any[]) => {
        res.forEach(response => {
          this.sendBackAfterSubmitUser.emit(response);
        });
        this.success(res);
      },
      (err) => {
        console.error('Error in processing requests', err);

      }
    );
  }

  success(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: 'Data update successfully.',
      showConfirmButton: false,
      timer: 3000,
    });
  }



  openModalDeleteConf(user: any, comingWhichTab: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are You Sure You Want to Delete a User From the Process?";
    modalRef.componentInstance.subTitle =
      "Deleting your User Profile  will remove for the database";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteV2_EmailNotification(user, comingWhichTab);
        }
      }
    });
  }
  deleteV2_EmailNotification(user: any, comingWhichTab: any) {
    let payload = {
      MasterProjectProcessAccessRightId: user.masterProjectProcessAccessRightId,
      UserId: user.userId
    };
    let url: any;
    if (comingWhichTab == 'Project') {
      url = 'api/Account/DeleteV2_ProjectProcessApprovalUser';
    } else if (comingWhichTab == 'Maintenance') {
      url = 'api/Account/DeleteV2_MaitenanceProcessApprovalUser'
    } else {
    }
    if (url) {
      this.commonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe((res: any) => {
        this.success(res);

        this.sendBackAfterSubmitUser.emit(res);

      });
    } else {
      this.error('Something went wrong')
    }


  }
  error(err: any) {
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
