
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { AddMaintenanceAgreementModelComponent } from '../add-maintenance-agreement-model/add-maintenance-agreement-model.component';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { ViewMaintenanceAgreementComponent } from '../view-maintenance-agreement/view-maintenance-agreement.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { AddWarrantyComponent } from '../add-warranty/add-warranty.component';
import { ViewWarrantyComponent } from '../view-warranty/view-warranty.component';

@Component({
  selector: 'app-warranty-list',
  templateUrl: './warranty-list.component.html',
  styleUrl: './warranty-list.component.scss'
})
export class WarrantyListComponent implements OnInit {
  @Input() projectId: any;
  @Input() dDetail: any
  @Input() clientStatus: any;
  @Input() commeToProject: boolean;
  @Input() accessRight: any
  @Output() completeProcess = new EventEmitter();
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    ProjectId: null
  }

  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  auditList = [];
  page = 1;
  collectionSize = 0;

  maintenanceAgreementList: any = [];
  projectWarrentyRecordId: any;
  constructor(private offcanvasService: NgbOffcanvas, public commonFunctionService: CommonFunctionService, public formBuilder: FormBuilder, private modalService: NgbModal, private CommonHttpServiceCallerService: CommonHttpServiceCallerService) {

  }
  arrayListDropDownAssetStatus: any = []
  ngOnInit(): void {
    console.log("clientStatus", this.clientStatus)
    this.GetV2_ProjectWarrenty_ServerPaging();
    this.getAddFromBinding()
  }
  addAccessGroupForm: FormGroup;

  GetV2_ProjectWarrenty_ServerPaging() {
    let url: any = 'api/ProjectManagement/GetV2_ProjectWarrenty_ServerPaging'
    this.payload.ProjectId = this.projectId
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, this.payload).subscribe((res: any) => {
      this.maintenanceAgreementList = res.list;

      if (this.maintenanceAgreementList.length > 0) {
        const statusIds = [28, 72, 61, 106];
        this.projectWarrentyRecordId = this.maintenanceAgreementList.find(item => statusIds.includes(item.projectWarrentyStatusId));
        this.totalRecordsFromApi = res.list[0].totalCount;
        this.from = res.list.reduce(
          (min, p) => (p.rowNum < min ? p.rowNum : min),
          res.list[0].rowNum
        );
        this.to = res.list.reduce(
          (max, p) => (p.rowNum > max ? p.rowNum : max),
          res.list[0].rowNum
        );
        this.pageSize = this.payload.displayLength;
      } else {
        this.totalRecordsFromApi = 0;
        this.from = 0;
        this.to = 0;
        this.pageSize = this.payload.displayLength;
      }
    });





  }

  OnChangesPage(pageNo: number) {
    if (pageNo) {
      this.payload.displayStart = this.pageSize * (pageNo - 1);
      this.GetV2_ProjectWarrenty_ServerPaging();
    }
  }

  maxCharsDecision: any = 300;
  openADD(content) {
    this.modalService
      .open(content, {

        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.addAccessGroupForm.reset();
        },
        (reason) => {
          this.addAccessGroupForm.reset();
          // this.addspareForm.reset();
        }
      );


  }
  getAddFromBinding() {

    this.addAccessGroupForm = this.formBuilder.group({
      AssetStatusId: [null, Validators.required],
      StatusRemark: ["", Validators.required],
    });
  }

  get AssetStatusId() {
    return this.addAccessGroupForm.get("AssetStatusId");
  }
  get StatusRemark() {
    return this.addAccessGroupForm.get("StatusRemark");
  }
  createMaintenanceAgreement(): void {
    const modalRef = this.modalService.open(AddWarrantyComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.dDetail = this.dDetail;
    modalRef.componentInstance.commeToProject = this.commeToProject;

    modalRef.result.then((result) => {
      if (result) {
        if (result.value == "submit") {
          if (result) {
            // this.openSuccessModalTask(result.res);
          }

        }
        this.GetV2_ProjectWarrenty_ServerPaging();
        this.completeProcess.emit(result)
      }
    });


  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }


  openViewHandleTask(projectWarrenty): void {
    const modalRef = this.offcanvasService.open(ViewWarrantyComponent, {
      scroll: false,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4",
    });
    modalRef.componentInstance.ProjectWarrentyId = projectWarrenty.projectWarrentyId;
    modalRef.componentInstance.ProjectId = this.projectId;
    modalRef.componentInstance.dDetail = this.dDetail;

    modalRef.result
      .then((result) => {
          this.GetV2_ProjectWarrenty_ServerPaging();

      })
      .catch((result) => {
          this.GetV2_ProjectWarrenty_ServerPaging();


      });


  }

  viewHandler(projectWarrentyId) {

  }
  openCancelAgreementModalTask(MaintenanceId) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure to Cancel this current Warranty?"
    modalRef.componentInstance.subTitle1 = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = " Cancel It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.UpdateV2_WarrentyCancel(
            MaintenanceId
          );

        } else {
        
          this.GetV2_ProjectWarrenty_ServerPaging();
          this.completeProcess.emit(result)
        }

      
      }
    });
  }
  UpdateV2_WarrentyCancel(MaintenanceId) {
    let url = 'api/ProjectManagement/UpdateV2_WarrentyCancel'
    let payload = {
      "ProjectId": this.projectId,
      "MaintenanceId": MaintenanceId.projectWarrentyId

    }
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe((res: any) => {
      this.completeProcess.emit('Submit')
      this.GetV2_ProjectWarrenty_ServerPaging()
    

    });
  }

}
