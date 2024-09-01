import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { AddMaintenanceAgreementModelComponent } from '../add-maintenance-agreement-model/add-maintenance-agreement-model.component';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { ViewMaintenanceAgreementComponent } from '../view-maintenance-agreement/view-maintenance-agreement.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import Step from 'shepherd.js/src/types/step';
import { ShepherdService } from "angular-shepherd";

@Component({
  selector: 'app-maintenance-agreement',
  templateUrl: './maintenance-agreement.component.html',
  styleUrl: './maintenance-agreement.component.scss'
})
export class MaintenanceAgreementComponent implements OnInit {
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
  maintenanceRecordId: any;
  constructor(private shepherdService: ShepherdService, private offcanvasService: NgbOffcanvas, public commonFunctionService: CommonFunctionService, public formBuilder: FormBuilder, private modalService: NgbModal, private CommonHttpServiceCallerService: CommonHttpServiceCallerService) {

  }
  arrayListDropDownAssetStatus: any = []
  ngOnInit(): void {
    console.log("clientStatus", this.clientStatus)
    this.getV2_MaintenanceAgreement_ServerPaging();
    this.getAddFromBinding()
    if (this.commeToProject) {
      const builtInButtons = {
        cancel: {
          classes: 'cancel-button',
          secondary: true,
          text: 'Exit',
          type: 'cancel'
        },
        next: {
          classes: 'btn btn-success',
          text: 'Next',
          type: 'next'
        },
        back: {
          classes: 'back-button',
          secondary: true,
          text: 'Back',
          type: 'back'
        },
        finish: {
          classes: 'btn btn-primary',
          text: 'Okay!',
          type: 'cancel'
        },
      };

      const defaultStepOptions: Step.StepOptions = {
        classes: 'shepherd-theme-arrows custom-default-class',
        scrollTo: { behavior: 'smooth', block: 'center' },
        cancelIcon: {
          enabled: true
        },
        canClickTarget: false,
      };
      if (this.dDetail.isMaintenance == false) {

        let steps: Step.StepOptions[] = [
          {
            attachTo: {
              element: '.actions',
              on: 'bottom'
            },
            buttons: [
              builtInButtons.finish
            ],
            classes: 'custom-class-name-1 custom-class-name-2',
            id: 'intro',
            title: 'Maintenance Agreement !',
            text: 'The project is eligible for a maintenance agreement setup. Click on the "Add Maintenance Agreement" button to proceed. Uploading the physical maintenance agreement document is optional.'
          },
        ];

        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(steps);
        this.shepherdService.start();
      } else if (this.dDetail.isMaintenance == true && this.dDetail.maintenanceStatusId != 28) {
        let steps: Step.StepOptions[] = [
          {
            attachTo: {
              element: '.actions',
              on: 'bottom'
            },
            buttons: [
              builtInButtons.finish
            ],
            classes: 'custom-class-name-1 custom-class-name-2',
            id: 'intro',
            title: 'Maintenance Agreement !',
            text: 'The Maintenance Agreement is no longer active. If you want to extend the agreement, you can create a new Maintenance Agreement by clicking on "Add Maintenance Agreement."'
          },
        ];

        this.shepherdService.defaultStepOptions = defaultStepOptions;
        this.shepherdService.modal = true;
        this.shepherdService.confirmCancel = false;
        this.shepherdService.addSteps(steps);
        this.shepherdService.start();
      }
    }
  }
  addAccessGroupForm: FormGroup;

  getV2_MaintenanceAgreement_ServerPaging() {
    let url: any = 'api/ProjectManagement/GetV2_MaintenanceAgreement_ServerPaging'
    this.payload.ProjectId = this.projectId
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, this.payload).subscribe((res: any) => {
      this.maintenanceAgreementList = res.list;

      if (this.maintenanceAgreementList.length > 0) {
        const statusIds = [28, 72, 61, 106];
        this.maintenanceRecordId = this.maintenanceAgreementList.find(item => statusIds.includes(item.maintenanceStatusId));
console.log(
  "  this.maintenanceRecordId",  this.maintenanceRecordId
)
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
      this.getV2_MaintenanceAgreement_ServerPaging();
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
    const modalRef = this.modalService.open(AddMaintenanceAgreementModelComponent, {
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
        this.getV2_MaintenanceAgreement_ServerPaging();
        this.completeProcess.emit(result)
      }
    });


  }
  // openSuccessModalTask(successMesage) {
  //   const modalRef = this.modalService.open(SuccessModalComponent, {
  //     ariaLabelledBy: "modal-basic-title",
  //     size: "md",
  //     centered: true,
  //     backdrop: "static",
  //     keyboard: false,
  //   });
  //   modalRef.componentInstance.title =
  //     "After successfully creating the task, would you can also update the task details it?"
  //   modalRef.componentInstance.subTitle1 = "If so, we'll guide you to the view page for further action?";
  //   modalRef.componentInstance.buttonName = " Update Task ";

  //   modalRef.result.then((result) => {
  //     if (result) {
  //       // if (result == "success") {
  //       //   this.openViewHandleTask(
  //       //     successMesage.projectTaskId, this.storeProjectScheduleObject
  //       //   );
  //       // } else {
  //       //   this.loadData();
  //       // }
  //     }
  //   });
  // }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }


  openViewHandleTask(maintenanceId): void {
    const modalRef = this.offcanvasService.open(ViewMaintenanceAgreementComponent, {
      scroll: false,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4",
    });
    modalRef.componentInstance.MaintenanceId = maintenanceId;
    modalRef.componentInstance.ProjectId = this.projectId;
    modalRef.componentInstance.dDetail = this.dDetail;
    
    modalRef.result
      .then((result) => {
        this.getV2_MaintenanceAgreement_ServerPaging();

      })
      .catch((result) => {
        this.getV2_MaintenanceAgreement_ServerPaging();


      });


  }

  viewHandler(maintenanceId) {

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
      "Are you sure to Cancel this current Agreement?"
    modalRef.componentInstance.subTitle1 = "You won't be able to revert this!";
    modalRef.componentInstance.buttonName = " Cancel It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.UpdateV2_ProjectMaintenanceAgreementCancel(
            MaintenanceId
          );
        } else {
          this.completeProcess.emit(result)
          this.getV2_MaintenanceAgreement_ServerPaging();
        }

      
      }
    });
  }
  UpdateV2_ProjectMaintenanceAgreementCancel(MaintenanceId) {
    let url = 'api/ProjectManagement/UpdateV2_ProjectMaintenanceAgreementCancel'
    let payload = {
      "ProjectId": this.projectId,
      "MaintenanceId": MaintenanceId.maintenanceId

    }
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe((res: any) => {
    
      this.completeProcess.emit('submit');
      this.getV2_MaintenanceAgreement_ServerPaging()



    });
  }

}
