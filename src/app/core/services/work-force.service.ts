
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';
@Injectable({
  providedIn: 'root'
})
export class WorkForceService {
  editWorkForceId: number = 0;
  accessRight: boolean = false;
  constructor(private _http: HttpClient, private _route: Router, private authService: AuthAssetService) {
  }


  // Payload
  // displayLength
  // displayStart
  // optional
  // SearchCompanyId
  // SearchClientId
  // SearchProjectId
  // SearchProjectWorkforceName
  getMX_MX_ProjectWorkforceList_ServerPaging(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/ProjectManagement/GetMX_MX_ProjectWorkforceList_ServerPaging';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')

    });
  }



  // Payload
  // ProjectWorkforceName
  // CompanyId
  // ClientId
  // ProjectId
  //mX_ProjectWorkforceMember 
  CreateV2_MX_ProjectWorkforce(data: any) {
    let url = environment.apiUrl + 'api/ProjectManagement/CreateV2_MX_ProjectWorkforce';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')

    })
  }




}



