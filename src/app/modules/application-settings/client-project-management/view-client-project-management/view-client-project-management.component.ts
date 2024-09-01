
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientService } from "../../../../core/services/client.services";
import { environment } from "src/environments/environment";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import Swal from "sweetalert2";
import { UpdateStatusComponent } from "src/app/shared/components/update-status/update-status.component";

@Component({
  selector: 'app-view-client-project-management',
  templateUrl: './view-client-project-management.component.html',
  styleUrl: './view-client-project-management.component.scss'
})
export class ViewClientProjectManagementComponent implements OnInit {
  clientId: any;
  clientData: any = [];

  label: any = "View Client/Prospect";
  breadCrumbItems: any = [
    { label: "Client/Prospect" },
    { label: "View Client/Prospect", active: true },
  ];

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private commonFunctionService: CommonFunctionService,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService,
    private modalService: NgbModal,
  ) { }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  ngOnInit(): void {
    if (this.router.url.includes('pm-view-prospect')) {
      console.log("pm-view-prospect",)
      this.label = "Prospect View";
      this.breadCrumbItems = [
        { label: "Prospect View" },
        { label: "Prospect", active: true }
      ];
    } else {
      this.label = "Client View";
      this.breadCrumbItems = [
        { label: "Client View" },
        { label: "Client", active: true },
      ];
    }

    this.route.params.subscribe((params) => {
      this.clientId = params["id"];
      if (this.clientId) {
        this.getClientDetailById();
      } else {
        this.router.navigate(["/application-settings/pm-client/pm-client-list"]);
      }
    });
  }
  default_clientLogoImg: any;
  clientLogoImg: any;
  getClientDetailById() {
    this.clientService
      .getClientDetailById(this.clientId)
      .subscribe((res: any) => {
        this.clientData = res?.data;
        if (
          this.clientData.clientImageUrl === " " ||
          this.clientData.clientImageUrl === null ||
          this.clientData.clientImageUrl === "undefined"
        ) {
          this.clientLogoImg = this.default_clientLogoImg =
            "../../../../../assets/images/placeholderimage.png";
        } else {
          this.clientLogoImg = environment.apiUrl + res?.data?.clientImageUrl;
        }
      });
  }

  goBack() {
    if (this.router.url.includes('pm-view-prospect')) {
      this.router.navigate(["/application-settings/pm-client/pm-prospect-list"]);
    } else {
      this.router.navigate(["/application-settings/pm-client/pm-client-list"]);
    }
  }

  toUpperCaseword(data: string) {
    if (data) return data.toUpperCase();
    return "";
  }

  currrentClientId: any
  clientStatusList: any = []
  openStatusModal(data) {
    let url = 'api/ProjectManagement/GetClientStatus/ClientUpdateStatus'
    this.CommonHttpServiceCallerService.getWithoutParmaMethod(url).subscribe((res: any) => {
      this.clientStatusList = res

      this.currrentClientId = data.clientId
      const modalRef = this.modalService.open(UpdateStatusComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      const filteredData = this.clientStatusList.filter(item => item.assetStatusId !== data.clientStatusId);


      modalRef.componentInstance.assetListStatus = filteredData;

      modalRef.result.then((result) => {
        if (result) {
          if (result.value == "success") {
            this.updateV2_ClientStatus(result)

          }
        }
      });
    })
  }
  updateV2_ClientStatus(sendObject: any) {
    let paylod = {
      ClientId: this.currrentClientId,
      ClientStatusId: sendObject.statusId,
      ClientStatusName: sendObject.statusName,

    }

    let url = 'api/V2_Master/UpdateV2_ClientStatus'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.success(res);
      this.getClientDetailById();
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

}
