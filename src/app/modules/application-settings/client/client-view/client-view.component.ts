import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientService } from "../../../../core/services/client.services";
import { environment } from "src/environments/environment";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { UpdateStatusComponent } from "src/app/shared/components/update-status/update-status.component";
import Swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';

@Component({
  selector: "app-client-view",
  templateUrl: "./client-view.component.html",
  styleUrls: ["./client-view.component.scss"],
})
export class ClientViewComponent implements OnInit {
  clientId: any;
  clientData: any = [];

  label: any = "View Client";
  breadCrumbItems: any = [
    { label: "Client" },
    { label: "Client Details", active: true },
  ];

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private commonFunctionService: CommonFunctionService,
    private CommonHttpServiceCallerService: CommonHttpServiceCallerService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.clientId = params["id"];
      if (this.clientId) {
        this.getClientDetailById();
      } else {
        this.router.navigate(["/application-settings/client/client-list"]);
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
    this.router.navigate(["/application-settings/client/client-list"]);
  }

  toUpperCaseword(data: string) {
    if (data) return data.toUpperCase();
    return "";
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
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
