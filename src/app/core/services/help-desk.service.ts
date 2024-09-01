import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root",
})
export class HelpDeskService {
  constructor(private _http: HttpClient, private _route: Router) { }

  ticketStatusId: number = 0;
  serviceStatusId: number = 0;
  auditStatusId: number = 0;
  initalToTabs: number = Number(sessionStorage.getItem("initalToTabs")) ? Number(sessionStorage.getItem("initalToTabs")) : 1;
  innerTaskTab: number = Number(sessionStorage.getItem("innerTaskTab")) ? Number(sessionStorage.getItem("innerTaskTab")) : 1;
  ticketAgingTab: number = Number(sessionStorage.getItem("ticketAgingTab")) ? Number(sessionStorage.getItem("ticketAgingTab")) : 1;
  billingTab: number = Number(sessionStorage.getItem("billingTab")) ? Number(sessionStorage.getItem("billingTab")) : 1;
  workflowObject: any = {};
  pageAction: any = null;
  scheduleStatusId: number = 0;
  scheduleTypeAdminAndClient: any = "";
  auditTypeAdminAndClient: any = "";



  getMaintenanceTodoList_V2(): Observable<Object> {
    let url = environment.apiUrl + "api/MaintentDash/GetMaintenanceTodoList_V2";
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TotalCountTicketServiceOrderIncident(): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/MaintentDash/GetV2_TotalCountTicketServiceOrderIncident";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_MaintenanceWorkflowTodoList(): Observable<Object> {
    let url =
      environment.apiUrl + "api/MaintentDash/GetV2_MaintenanceWorkflowTodoList";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_DashboardTodoList(): Observable<Object> {
    let url = environment.apiUrl + "api/AssetDash/GetV2_DashboardTodoList";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MX_PM_ScheduleList_ServerPaging(data): Observable<Object> {
    let url =
      environment.apiUrl + "api/Prevent/GetV2_MX_PM_ScheduleList_ServerPaging";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getSupportTypeCounts() {
    let url =
      environment.apiUrl + "api/MaintentDash/GetV2_TotalCountSupportTypeDash";
    return this._http.post(
      url,
      {},
      {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      }
    );
  }

  getBillableNonBillableCounts() {
    let url =
      environment.apiUrl + "api/MaintentDash/GetV2_TotalCountIsBillingeDash";
    return this._http.post(
      url,
      {},
      {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      }
    );
  }

  getProjectList() {
    let url =
      environment.apiUrl +
      "api/MaintentDash/GetV2_ProjectTotalTicketWIthBillableNonBillList";
    return this._http.post(
      url,
      {},
      {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      }
    );
  }

  getV2_ServiceOrder_Tech_TaskListAndDetail(data: any) {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetV2_ServiceOrder_Tech_TaskListAndDetail";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  updateV2_SignatureTech(data: any) {
    let url = environment.apiUrl + "api/Maintenance/UpdateV2_SignatureTech";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  updateSignatureClient(data: any) {
    let url = environment.apiUrl + "api/Incident/UpdateSignatureClient";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  updateV2_ScheudleSignatureUser(data: any) {
    let url = environment.apiUrl + "api/Prevent/UpdateV2_ScheudleSignatureUser";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  updateV2_ScheudleSignatureClient(data: any) {
    let url =
      environment.apiUrl + "api/Prevent/UpdateV2_ScheudleSignatureClient";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_MX_PM_ScheduleList_ByDate(data: any) {
    let url =
      environment.apiUrl + "api/Prevent/GetV2_MX_PM_ScheduleList_ByDate";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TechnitionsAttendanceTransaction() {
    let url =
      environment.apiUrl +
      "api/MaintentDash/GetV2_TechnitionsAttendanceTransaction";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TechnitionsAttendanceTransactionDaily() {
    let url =
      environment.apiUrl +
      "api/MaintentDash/GetV2_TechnitionsAttendanceTransactionDaily";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TotalTicket7DayGraph() {
    let url =
      environment.apiUrl + "api/MaintentDash/GetV2_TotalTicket7DayGraph";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TotalTicketMonthlyGraph() {
    let url =
      environment.apiUrl + "api/MaintentDash/GetV2_TotalTicketMonthlyGraph";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_OverDue() {
    let url = environment.apiUrl + "api/MaintentDash/GetV2_OverDue";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  createV2_TicketDiscussionGlobalAudit(payload) {
    let url =
      environment.apiUrl +
      "api/Maintenance/CreateV2_TicketDiscussionGlobalAudit";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  createV2_TicketDiscussionAudit(payload) {
    let url =
      environment.apiUrl + "api/Maintenance/CreateV2_TicketDiscussionAudit";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
}
