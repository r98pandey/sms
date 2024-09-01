import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

import { AuthAssetService } from './auth-asset.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGroupService {
  acItem: {};
  private token: any;
  constructor(private _http: HttpClient, private _route: Router, private authService: AuthAssetService) {
    this.token = this.authService.getAccessToken();
  }
  getAccessGroupListByAccessGroupId(roleid: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Account/GetAccessGroupListByAccessGroupId/' + roleid;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getMenuSubMenu(accessGroupMasterId: any, product: any): Observable<Object> {
    let url = environment.apiUrl + 'api/AppSetting/GetMenuSubMenu/' + accessGroupMasterId + '/' + product;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getAccessGroupList(): Observable<Object> {
    let url = environment.apiUrl + 'api/AppSetting/GetAccessGroupList';
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  postCreateAccessGroup(data: any) {
    let url = environment.apiUrl + 'api/Account/CreateAccessGroup';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  postUpdateAccessGroup(data: any) {
    let url = environment.apiUrl + 'api/AppSetting/UpdateAccessGroup';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  postDeleteAccessGroup(data: any) {
    let url = environment.apiUrl + 'api/AppSetting/DeleteAccessGroup';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  postUpdateMenuSubMenu(data: any) {
    let url = environment.apiUrl + 'api/AppSetting/UpdateMenuSubMenu';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  getProductList(): Observable<Object> {
    let url = environment.apiUrl + 'api/AppSetting/GetMasterApplicationList';
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }




  get_V3_ProjectManagementDepartmentUserAccess(data: any) {
    let url = environment.apiUrl + 'api/Account/Get_V3_ProjectManagementDepartmentUserAccess';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  Update_V3_AccessGroupMasterProjectSetup(data: any) {
    let url = environment.apiUrl + 'api/Account/Update_V3_AccessGroupMasterProjectSetup';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }
}