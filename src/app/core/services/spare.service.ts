
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';


@Injectable({
  providedIn: "root",
})
export class SpareService {
  cateItem: {};
  sendSpareId: any = null;
  private token: any;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthAssetService
  ) {
    this.token = this.authService.getAccessToken();
  }
  getspare(): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetspareList";
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  postspare(data: any) {
    let url = environment.apiUrl + "api/AssetManagement/CreateAssetSparePart";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getspareByAssetId(assetId: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetAssetSparePartList?assetId=" +
      assetId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getspareById(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetspareList/" + id;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  postUpdatespare(data: any) {
    let url = environment.apiUrl + "api/AssetManagement/UpdateAssetSparePart";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  postDeletespare(data: any) {
    let url = environment.apiUrl + "api/AssetManagement/DeleteAssetSparePart";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getSpareList(payload: any) {
    let url =
      environment.apiUrl + "api/AssetManagement/GetSparePartList_Paging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getSparePartList_EOL_Paging(payload: any) {
    let url =
      environment.apiUrl + "api/AssetManagement/GetSparePartList_EOL_Paging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getSpartPartList_ReadyStock_ByPagination(payload: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetSparePartList_ReadyStock_Paging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getSparePartList_InService_Paging(payload: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetSparePartList_InService_Paging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getSparePartList_Paging(payload: any) {
    let url =
      environment.apiUrl + "api/AssetManagement/GetSparePartList_Paging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  addSpare(payload: any) {
    let url = environment.apiUrl + "api/AssetManagement/CreateNewSparePart";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  UpdateSparePartImageProfile(payload: any) {
    let url =
      environment.apiUrl + "api/AssetManagement/UpdateSparePartImageProfile";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getSparePartStatusList() {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetAssetStatusList/SparePartStatusList";
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_SparePartAssetStatusCount(): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetV2_SparePartAssetStatusCount";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
}



