import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthAssetService } from './auth-asset.service';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DisposableService {
  private token: any;
disposableId: number = 0;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthAssetService
  ) {
    this.token = this.authService.getAccessToken();
  }

  
  GetV2_DisposableBatchList_ByPagination_list(payload: any) {
    let url =
      environment.apiUrl + "api/DisposableAsset/GetV2_DisposableBatchList_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  GetV2_DisposeBatchHeaderAndAssetList(payload: any) {
    let url =
      environment.apiUrl + "api/DisposableAsset/GetV2_DisposeBatchHeaderAndAssetList";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_DisposeReportBatch(payload: any): Observable<Blob> {
    
    return this._http.post(
      environment.apiUrl + "api/StandardReport/GetV2_DisposeReportBatch",
      payload,
      {
        responseType: "blob", 
      }
    );
  }

  
  getAssetStatusList(page: any): Observable<Object> {
    let url = environment.apiUrl + 'api/assetmanagement/GetAssetStatusList/' + page;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  
  CreateAssetDispose(data: any) {
    let url = environment.apiUrl + 'api/DisposableAsset/CreateAssetDispose';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }




}
