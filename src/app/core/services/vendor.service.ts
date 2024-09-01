import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';


@Injectable({
  providedIn: "root",
})
export class VendorService {
  vItem: {};
  accessRight: boolean = false;
  private token: any;
  static selectedVendorId: number = 0;

  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthAssetService
  ) {
    this.token = this.authService.getAccessToken();
  }

  getVendor(): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetVendorList";
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  GetVendorTableList_ServerPagination(payload): Observable<Object> {
    let url =
      environment.apiUrl + "api/V2_Master/GetVendorTableList_ServerPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  postVendor(data: any) {
    let url = environment.apiUrl + "api/V2_Master/CreateVendor";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  getVendorListByCompanyId(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetVendorList/" + id;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  getVendorByVendorId(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetVendorDetail/";
    return this._http.post(
      url,
      { VendorId: id },
      {
        headers: new HttpHeaders()
          .set("Content-Type", "application/json")
          .set("Authorization", "Bearer " + this.token),
      }
    );
  }
  postUpdateVendor(data: any) {
    let url = environment.apiUrl + "api/V2_Master/UpdateVendor";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  postDeleteVendor(data: any) {
    let url = environment.apiUrl + "api/V2_Master/DeleteVendor";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
}



