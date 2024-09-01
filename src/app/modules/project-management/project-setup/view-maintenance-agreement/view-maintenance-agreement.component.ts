import { Component, Input, OnInit } from '@angular/core';
import { NgbOffcanvas, NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';

@Component({
  selector: 'app-view-maintenance-agreement',
  templateUrl: './view-maintenance-agreement.component.html',
  styleUrl: './view-maintenance-agreement.component.scss'
})
export class ViewMaintenanceAgreementComponent implements OnInit {
  activeTaskTab:any=1
  @Input() ProjectId: any;
  @Input() MaintenanceId: any;
  @Input() dDetail:any;
  maintenanceAgreement: any;
  agreementDocList: any;
  constructor(private offcanvasService: NgbOffcanvas
    , public activeOffcanvas: NgbActiveOffcanvas, private modalService: NgbModal,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private commonFunctionService: CommonFunctionService) {

  }
  ngOnInit(): void {
    this.GetV2_MaintenanceAgreementDetail();
    this.GetV2_MaintenanceAgreementDocList();
  }

  getUpdateResults(){
    this.GetV2_MaintenanceAgreementDetail();
    this.GetV2_MaintenanceAgreementDocList();
  }

  close(value: any) {
    this.activeOffcanvas.dismiss(value)
  }

  GetV2_MaintenanceAgreementDetail() {
    let url: any = 'api/ProjectManagement/GetV2_MaintenanceAgreementDetail'
    let paylaod = {
      MaintenanceId: this.MaintenanceId
    }
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, paylaod).subscribe((res: any) => {
      this.maintenanceAgreement = res.obj;
    });
  }
  GetV2_MaintenanceAgreementDocList() {
    let url: any = 'api/ProjectManagement/GetV2_MaintenanceAgreementDocList'
    let paylaod = {
      MaintenanceId: this.MaintenanceId
    }
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, paylaod).subscribe((res: any) => {
      this.agreementDocList = res.obj;
    });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }



}
