import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SoftwareDashboardService {
  constructor(private _http: HttpClient) {}

  getV2_TotalCountTicketOnlySoftwareSupportDash(payload): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/MaintentDash/GetV2_TotalCountTicketOnlySoftwareSupportDash";
    return this._http.post(url,payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TicketListSoftwareDeveloperDash_ByPagination(
    payload: any
  ): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/Maintenance/GetV2_TicketListSoftwareDeveloperDash_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TicketListDashWthoutComplDate_ByPagination(
    payload: any
  ): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl +
      "api/Maintenance/GetV2_TicketListDashWthoutComplDate_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
}
