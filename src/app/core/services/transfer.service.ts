import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';
@Injectable({
  providedIn: 'root'
})
export class TransferService {
  assestTransferItem:{};
  editTransfer:{}
  transferValue:boolean;
  private token: any;
  constructor(private _http: HttpClient, private _route: Router, private authService: AuthAssetService) {
    this.token = this.authService.getAccessToken();
  }


  getAssetTransferList_ByPagination(companyId:any,displayLength:any,displayStart:any,SearchDepartmentName:any,SearchCatName:any,SearchSubCatName:any,SearchAssetStatus:any,SearchAssetName:any,SearchAssetTagId:any,SearchTransAssetTagId:any): Observable<Object> {
    let url = environment.apiUrl +'api/assetmanagement/GetAssetTransferList_ByPagination?companyId='+companyId+'&displayLength='+displayLength +'&displayStart='+displayStart+'&SearchDepartmentName='+SearchDepartmentName+'&SearchCatName='+SearchCatName+'&SearchSubCatName='+SearchSubCatName+'&SearchAssetStatus='+SearchAssetStatus+'&SearchAssetName='+SearchAssetName+'&SearchAssetTagId='+SearchAssetTagId+'&SearchTransAssetTagId='+SearchTransAssetTagId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
 getAssetsForTransfer_ByPagination(companyId:any,displayLength:any,displayStart:any,SearchDepartmentName:any,SearchCatName:any,SearchSubCatName:any,SearchAssetStatus:any,SearchAssetName:any,SearchAssetTagId:any): Observable<Object> {
    let url = environment.apiUrl +'api/assetmanagement/GetAssetsForTransfer_ByPagination?companyId='+companyId+'&displayLength='+displayLength +'&displayStart='+displayStart+'&SearchDepartmentName='+SearchDepartmentName+'&SearchCatName='+SearchCatName+'&SearchSubCatName='+SearchSubCatName +'&SearchAssetStatus='+SearchAssetStatus+'&SearchAssetName='+SearchAssetName+'&SearchAssetTagId='+SearchAssetTagId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  postAssetTransfer(data: any) {
    let url = environment.apiUrl + 'api/AssetManagement/InsertAssetTransfer';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  } 
  
  postUpdateAssetTransfertoCollected(data: any) {
    let url = environment.apiUrl + 'api/AssetManagement/UpdateAssetTransfertoCollected';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  } 
  
  getAssetProfileDetails(assetId:any): Observable<Object> {
    let url = environment.apiUrl + 'api/AssetManagement/GetAssetProfileDetails/'+assetId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getAssetTransferProfileDetails(TransferAssetId:any): Observable<Object> {
    let url = environment.apiUrl + 'api/AssetManagement/GetAssetTransferProfileDetails/'+TransferAssetId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
 
}
