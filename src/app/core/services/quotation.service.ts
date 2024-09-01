import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: "root",
})
export class QuotationService {
  constructor(private _http: HttpClient) {}

  genererateV2_Quotation(payload): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/GenererateV2_Quotation";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  genererateV2_QuotationResubmit(payload): Observable<Object> {
    let url =
      environment.apiUrl + "api/Maintenance/GenererateV2_QuotationResubmit";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_MX_QuotationAndItemDetails(payload): Observable<Object> {
    let url =
      environment.apiUrl + "api/Maintenance/GetV2_MX_QuotationAndItemDetails";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  updateV2_MaintenanceQuotationBillProcess(payload): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/MaintentDash/UpdateV2_MaintenanceQuotationBillProcess";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  updateReviewerApproverQuotationInReview(payload): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/MaintentDash/UpdateReviewerApproverQuotationInReview";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  UpdateReviewerApproverQuotationPending(payload): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/MaintentDash/UpdateReviewerApproverQuotationPending";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MX_QuotationAndItemDetailsByTicketId(payload): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetV2_MX_QuotationAndItemDetailsByTicketId";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_MX_QuotationNoListOnlyByTicketId(payload): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetV2_MX_QuotationNoListOnlyByTicketId";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
}
