import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TicketService {
  sendTicketId: any = null;
  accessRight: boolean = false;
  lastStoreRouterDashboardName =
    "/maintenance-management/dashboard/help-desk-dashboard";
  lastStoreTicketRouterName: any =
    "/maintenance-management/corrective/service-order/list-service-order";
  ticketObjectInBillingWorkFlow: any = {};
  quotationObjectWorkFlow: any = {};
  ticketPageAction: any = null;
  constructor(private _http: HttpClient) {
    if (localStorage.getItem("lastStoreTicketRouterName")) {
      this.lastStoreTicketRouterName = localStorage.getItem(
        "lastStoreTicketRouterName"
      );
    } else {
      let data: any = JSON.parse(localStorage.getItem("currentUser"));
      if (data?.userInfor?.role === "Client User") {
        if (data?.userInfor?.accessGroupName === "Application User") {
          this.lastStoreTicketRouterName =
            "maintenance-management/corrective/ticket/list-ticket";
        } else {
          this.lastStoreTicketRouterName =
            "/maintenance-management/dashboard/client-dashboard";
        }
      } else if (data?.userInfor?.role === "Help Desk") {
        this.lastStoreTicketRouterName =
          "/maintenance-management/dashboard/help-desk-dashboard";
      }
    }
  }

  getTicketList_ByPagination(payload): Observable<Object> {
    let url: any;
    url = environment.apiUrl + "api/Maintenance/GetTicketList_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TicketingtList_ByPagination(payload): Observable<Object> {
    let url: any;
    url = environment.apiUrl + "api/Maintenance/GetV2_TicketList_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TicketList_ByPagination_OnlyMyTicket(payload): Observable<Object> {
    let url: any;
    url = environment.apiUrl + "api/Maintenance/GetV2_TicketList_ByPagination_OnlyMyTicket";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  
  getV2_TicketDiscussionDetail_Paging_ByPagination(
    payload
  ): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/Maintenance/GetV2_TicketDiscussionDetail_Paging_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TicketDiscussionGlobalDetail_Paging_ByPagination(
    payload
  ): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/Maintenance/GetV2_TicketDiscussionGlobalDetail_Paging_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TotalCountTicketOnly(): Observable<Object> {
    let url: any;
    url = environment.apiUrl + "api/MaintentDash/GetV2_TotalCountTicketOnly";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  } getV2_TotalCountTicketOnly_new(data): Observable<Object> {
    let url: any;
    url = environment.apiUrl + "api/MaintentDash/GetV2_TotalCountTicketOnly";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  } getV2_TotalCountTicketOnly_MyTicket(data): Observable<Object> {
    let url: any;
    url = environment.apiUrl + "api/MaintentDash/GetV2_TotalCountTicketOnly_MyTicket";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  

  getV2_TicketList_ByPagination(payload): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl + "api/Maintenance/GetV2_TicketListLates_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  } getV2_MaintenanceTaskList_Paging(payload): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl + "api/MaintentDash/GetV2_MaintenanceTaskList_Paging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_TicketWithIncidentReportSignature_ByPagination(
    payload
  ): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/Maintenance/GetV2_TicketWithIncidentReportSignature_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MaintenanceWorkflowTicketList(payload): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/MaintentDash/GetV2_MaintenanceWorkflowTicketList";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_MaintenanceWorkflowQuotationList(payload): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/MaintentDash/GetV2_MaintenanceWorkflowQuotationList";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_MaintenanceGeneralQuotationList(payload): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/MaintentDash/GetV2_MaintenanceGeneralQuotationList";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_MaintenanceGeneralQuotationListOnlyWaitingForInvoice(
    payload
  ): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/MaintentDash/GetV2_MaintenanceGeneralQuotationListOnlyWaitingForInvoice";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MaintenanceGeneralQuotationListInvoiceDone(
    payload
  ): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/MaintentDash/GetV2_MaintenanceGeneralQuotationListInvoiceDone";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getMaintenanceStatus(page: any) {
    let url =
      environment.apiUrl + "api/Maintenance/GetMaintenanceStatus/" + page;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getMX_MasterUrgentTypeList() {
    let url = environment.apiUrl + "api/Maintenance/GetMX_MasterUrgentTypeList";
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MasterIncidentTypeList(data: any) {
    let url =
      environment.apiUrl + "api/Maintenance/GetV2_MasterIncidentTypeList";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  deletedAssetTicketByTech(data: any) {
    let url = environment.apiUrl + "api/Maintenance/DeletedAssetTicketByTech";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getMX_MasterTicketType(IsDeviceRelated: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetMX_MasterTicketType?IsDeviceRelated=" +
      IsDeviceRelated;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  createV2_TicketDiscussion(payload: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/CreateV2_TicketDiscussion";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }



  CreateV2_TicketDiscussionGlobal_FormData(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/CreateV2_TicketDiscussionGlobal_FormData";
    return this._http.post(url, data);

  }
  CreateV2_TicketDiscussion_FormData(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/CreateV2_TicketDiscussion_FormData";
    return this._http.post(url, data);

  }
  createV2_TicketDiscussionGlobal(payload: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/Maintenance/CreateV2_TicketDiscussionGlobal";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // addTicket(payload: any): Observable<Object> {

  //   let url = environment.apiUrl + "api/Maintenance/CreateTicket";
  //   return this._http.post(url, payload,{
  //     headers: new HttpHeaders().set("Content-Type", "application/json"),
  //   });
  // }

  addTicket(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/CreateTicket";
    return this._http.post(url, data).pipe(
      catchError(error => {
        return throwError(error);
      })
    );;
  }

  createTicket(ticketData: FormData): Observable<any> {

    return this._http.post<any>(`${environment.apiUrl}api/Maintenance/CreateTicket_Wait`, ticketData)

      .pipe(

        catchError(error => {

          console.error('Error creating ticket:', error);

          return throwError(error);

        })

      );

  }

  getTicketDetails(ticketId: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetTicketViewList?ticketId=" +
      ticketId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TicketingAndIncidentListDetail(payload: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetV2_TicketingAndIncidentListDetail";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TicketingAssetIncidentQuotWorkorderTask(payload: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetV2_TicketingAssetIncidentQuotWorkorderTask";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_TicketDisscusion_ServerPaging(payload: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetV2_TicketDisscusion_ServerPaging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_TicketDisscusionGlobal_ServerPaging(payload: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetV2_TicketDisscusionGlobal_ServerPaging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  requestBillingEligibilityProcess_V2(payload: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/RequestBillingEligibilityProcess_V2";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  updateReviewerApproverBillingEligibilityProcess(payload: any) {
    let url =
      environment.apiUrl +
      "api/MaintentDash/UpdateReviewerApproverBillingEligibilityProcess";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  updateAsset(payload): Observable<any> {
    let url =
      environment.apiUrl +
      "api/Maintenance/UpdateTicketItemStatusAndImageByTech";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_UpdateTicketClose(payload): Observable<any> {
    let url = environment.apiUrl + "api/MaintentDash/GetV2_UpdateTicketClose";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_UpdateTicketAcknolodge(payload): Observable<any> {
    let url =
      environment.apiUrl + "api/MaintentDash/GetV2_UpdateTicketAcknolodge";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_UpdateTicketVerification(payload): Observable<any> {
    let url =
      environment.apiUrl + "api/MaintentDash/GetV2_UpdateTicketVerification";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  getV2_MaintenanceWorkflowAudit(payload): Observable<any> {
    let url =
      environment.apiUrl + "api/Maintenance/GetV2_MaintenanceWorkflowAudit";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  UpdateV2_TicketCancelation(payload): Observable<any> {
    let url = environment.apiUrl + "api/Maintenance/UpdateV2_TicketCancelation";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  } 
  
  UpdateV2_MX_TicketingIssueDescription(payload): Observable<any> {
    let url = environment.apiUrl + "api/Maintenance/UpdateV2_MX_TicketingIssueDescription";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TicketImagesList(payload): Observable<any> {
    let url = environment.apiUrl + "api/Maintenance/GetV2_TicketImagesList";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TicketVideo(payload): Observable<any> {
    let url = environment.apiUrl + "api/Maintenance/GetV2_TicketVideo";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }



  getV2_TicketDocument(payload): Observable<any> {
    let url = environment.apiUrl + "api/Maintenance/GetV2_TicketDocument";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  downloadTikcetFile(payload: any): Observable<Blob> {
    // Make a GET request to the API endpoint
    return this._http.post(
      environment.apiUrl + "api/Maintenance/DownloadTikcetFile",
      payload,
      {
        responseType: "blob", // Ensure response is treated as a Blob
      }
    );
  }


  //Payload TicketId AccessGroup file
  uploadTicketSingleDocument(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/UploadTicketSingleDocument";
    return this._http.post(url, data);
    // return this._http.post(url, data, {
    //   headers: new HttpHeaders().set("Content-Type", "application/json"),
    // });
  }

  uploadTicketSingleVideo(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/UploadTicketSingleVideo";
    return this._http.post(url, data);
    // return this._http.post(url, data, {
    //   headers: new HttpHeaders().set("Content-Type", "application/json"),
    // });
  }


}
