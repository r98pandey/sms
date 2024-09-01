
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';
@Injectable({
  providedIn: 'root'
})
export class SurrenderService {
  assestItem:{};
  private token: any;
  constructor(private _http: HttpClient, private _route: Router, private authService: AuthAssetService) {
    this.token = this.authService.getAccessToken();
  }



  getSurenderAssetList_ByPagination(companyId:any,displayLength:any,displayStart:any,SearchDepartmentName:any,SearchCatName:any,SearchSubCatName:any,SearchAssetName:any,SearchAssetTagId:any): Observable<Object> {
    let url = environment.apiUrl +'api/DisposableAsset/GetSurenderAssetList_ByPagination?companyId='+companyId+'&displayLength='+displayLength +'&displayStart='+displayStart+'&SearchDepartmentName='+SearchDepartmentName+'&SearchCatName='+SearchCatName+'&SearchSubCatName='+SearchSubCatName +'&SearchAssetName='+SearchAssetName+'&SearchAssetTagId='+SearchAssetTagId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  postTransactionSurrenderAsset(data: any) {
    let url = environment.apiUrl + 'api/DisposableAsset/InsertTransactionSurrenderAsset';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }


  

 }



