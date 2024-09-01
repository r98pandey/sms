import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthAssetService } from "./auth-asset.service";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class DeliveryService {
  accessRight: boolean = false;
  sendDeliveryId: number = 0;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthAssetService
  ) {}

  getV2_DeliveryingtList_ByPagination(payload): Observable<Object> {
    let url: any;
    url =
      environment.apiUrl + "api/Delivery/GetV2_DeliveryNoteList_ServerPaging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getDeliveryNoteStatus(page: any) {
    let url = environment.apiUrl + "api/Delivery/GetDeliveryStatus/" + page;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  GetAssetStatusList(page: any) {
    let url =
      environment.apiUrl + "api/AssetManagement/GetAssetStatusList/" + page;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  createDeliveryNote(payload): Observable<Object> {
    let url: any;
    url = environment.apiUrl + "api/Delivery/V2_CreateDeliveryNote";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  updateDeliveryNoteToClient(payload): Observable<Object> {
    let url: any;
    url = environment.apiUrl + "api/Delivery/V2_UpdateDeliveryNoteToClient";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_DeliveryNoteAndTransDetail(payload): Observable<Object> {
    let url: any;
    url = environment.apiUrl + "api/Delivery/GetV2_DeliveryNoteAndTransDetail";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  // DeliveryNoteStatus
}
