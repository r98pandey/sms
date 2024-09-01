
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';
@Injectable({
  providedIn: "root",
})
export class MaintenanceService {
  assestTransferItem: {};
  editTransfer: {};
  transferValue: boolean;
  private token: any;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthAssetService
  ) {
    this.token = this.authService.getAccessToken();
  }

  getTicketList(payload, uitype): Observable<Object> {
    let url: any;
    if (uitype == 1) {
      url = environment.apiUrl + "api/Maintenance/GetTicketList_ByPagination";
    } else {
      url =
        environment.apiUrl +
        "api/MaintentDash/GetTicketSOGenPendingDashboard_ByPagination";
    }
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getType(IsDeviceRelated: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetMX_MasterTicketType?IsDeviceRelated=" +
      IsDeviceRelated;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  GetTiketTypeIssueList(TiketTypeId: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Master/GetTiketTypeIssueList?TiketTypeId=" +
      TiketTypeId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getProjectDepartment(companyId: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetDepartmentList?companyId=" +
      companyId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  GetTechnitionAttendanceListByTaskForSeerviceOrder(data: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetTechnitionAttendanceListByTaskForSeerviceOrder";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getDepartMent(companyId, clientId) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetDepartmentList?companyId=" +
      companyId +
      "&clientId=" +
      clientId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getUrgent() {
    let url = environment.apiUrl + "api/Maintenance/GetMX_MasterUrgentTypeList";
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getAssetList(
    departmentId: any,
    displayLength: any,
    displayStart: any
  ): Observable<Object> {
    //console.log("departmentId", departmentId);
    let url =
      environment.apiUrl +
      "api/Maintenance/GetMX_AssetList_ByPagination?departmentId=" +
      departmentId +
      "&displayLength=" +
      displayLength +
      "&displayStart=" +
      displayStart;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  GetV2_MXGetAssetListPopUp_ServerPaging(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetV2_MXGetAssetListPopUp_ServerPaging";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  addTicket(payload: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/CreateTicket";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  UpdateStatusWorkOrder(payload: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/UpdateStatusWorkOrder";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  EndServiceOrder(payload: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/EndServiceOrder";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  UpdateExpStarWorkDateTime(payload: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/UpdateExpStarWorkDateTime";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  GetTicketViewListByIncident(IncidentId: any) {
    // let url = environment.apiUrl + 'api/Maintenance/GetMX_TicketFullDetailWithWO?ticketId=' + ticketId;
    let url =
      environment.apiUrl +
      "api/Incident/GetTicketViewListByIncident?IncidentId=" +
      IncidentId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getTicketDetails(ticketId: any) {
    // let url = environment.apiUrl + 'api/Maintenance/GetMX_TicketFullDetailWithWO?ticketId=' + ticketId;
    let url =
      environment.apiUrl +
      "api/Maintenance/GetTicketViewList?ticketId=" +
      ticketId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getWorkOrderDetails(wono: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetWOTechAssetViewList?wono=" +
      wono;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  GetMaintenanceStatus(page: any) {
    let url =
      environment.apiUrl + "api/Maintenance/GetMaintenanceStatus/" + page;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  GetTicketingAssetList(ticketId: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetTicketingAssetList?ticketId=" +
      ticketId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getTechnician(departmentId: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetTechnitionListAccessByDepartment/" +
      departmentId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  //old Code
  // getTechnician() {
  //   let url =
  //     environment.apiUrl + "api/Maintenance/GetTechnitionListOnlyMobileAccess";
  //   return this._http.get(url, {
  //     headers: new HttpHeaders()
  //       .set("Content-Type", "application/json")
  //       .set("Authorization", "Bearer " + this.token),
  //   });
  // }

  insertTechnitionforServiceOrderIndividual(data: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/InsertTechnitionforServiceOrderIndividual";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  generateWorkOrder(payload: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/GenerateWONO_V2";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getWorkOrderList(payload: any, uitype: any): Observable<Object> {
    let url: any;
    if (uitype == 1) {
      url = environment.apiUrl + "api/Maintenance/GetWOList_ByPagination";
    } else if (uitype == 2) {
      url =
        environment.apiUrl +
        "api/MaintentDash/GetWOExpDatePendDashboard_ByPagination";
    } else if (uitype == 3) {
      url =
        environment.apiUrl +
        "api/MaintentDash/GetWOTechAssingPendingDashboard_ByPagination";
    }

    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getWorkOrderWithDateTime(payload): Observable<any> {
    let url =
      environment.apiUrl +
      "api/MaintentDash/GetWOExpDatePendDashboard_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getWorkOrderWithoutTechnician(payload): Observable<any> {
    let url =
      environment.apiUrl +
      "api/MaintentDash/GetWOTechAssingPendingDashboard_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getStartEndTaskList(workOrderId): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetServiceOrderStartEndTaskList?woid=" +
      workOrderId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  GetTaskList(woid): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/GetTaskList?woid=" + woid;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  GetStartServiceOrder(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/StartServiceOrder";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getAssetStatusList(): Observable<any> {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetMaintenanceStatus/TicketAssetStatus";
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  updateAsset(payload): Observable<any> {
    let url =
      environment.apiUrl +
      "api/Maintenance/UpdateTicketItemStatusAndImageByTech";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  updateExpCompletionDateTime(payload): Observable<any> {
    let url =
      environment.apiUrl + "api/Maintenance/UpdateExpCompletionDateTime";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  deleteTechnitionforServiceOrderIndividual(payload): Observable<any> {
    let url =
      environment.apiUrl +
      "api/Maintenance/DeleteTechnitionforServiceOrderIndividual";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
}
