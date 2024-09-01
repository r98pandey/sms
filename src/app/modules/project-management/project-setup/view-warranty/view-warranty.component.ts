
import { Component, Input, OnInit } from '@angular/core';
import { NgbOffcanvas, NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';

@Component({
  selector: 'app-view-warranty',
  templateUrl: './view-warranty.component.html',
  styleUrl: './view-warranty.component.scss'
})
export class ViewWarrantyComponent implements OnInit {
  activeTaskTab:any=1
  @Input() ProjectId: any;
  @Input() dDetail:any;
  @Input() ProjectWarrentyId: any;
  warrentyDetails: any;
  agreementDocList: any;
  constructor(private offcanvasService: NgbOffcanvas
    , public activeOffcanvas: NgbActiveOffcanvas, private modalService: NgbModal,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private commonFunctionService: CommonFunctionService) {

  }
  ngOnInit(): void {
    this.GetV2_ProjectWarrentyDetail();
    this.GetV2_ProjectWarrentyDocList();
  }

  getUpdateResults(){
    this.GetV2_ProjectWarrentyDetail();
    this.GetV2_ProjectWarrentyDocList();
  }

  close(value: any) {
    this.activeOffcanvas.dismiss(value)
  }

  GetV2_ProjectWarrentyDetail() {
    let url: any = 'api/ProjectManagement/GetV2_ProjectWarrentyDetail'
    let paylaod = {
      ProjectWarrentyId: this.ProjectWarrentyId
    }
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, paylaod).subscribe((res: any) => {
      this.warrentyDetails = res.obj;
    });
  }
  GetV2_ProjectWarrentyDocList() {
    let url: any = 'api/ProjectManagement/GetV2_ProjectWarrentyDocList'
    let paylaod = {
      ProjectWarrentyId: this.ProjectWarrentyId
    }
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, paylaod).subscribe((res: any) => {
      this.agreementDocList = res.obj;
    });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }



}
