import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';


@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  subCateItem:{};
  private token: any;
  constructor(private _http: HttpClient, private _route: Router, private authService: AuthAssetService) {
    this.token = this.authService.getAccessToken();
  }
  getSubCategory(): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/GetSubCategoryList';
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }


  postSubCategory(data: any) {
    let url = environment.apiUrl + 'api/Master/CreateSubCategory';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }
  getSubCategoryById(id:any): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/GetSubCategoryListBySubCategoryId/'+id;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getSubCategoryByCompanyId(id:any): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/GetSubCategoryList/'+id;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  postUpdateSubCategory(data: any) {
    let url = environment.apiUrl + 'api/Master/UpdateSubCategory';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }
  postDeleteSubCategory(data: any) {
    let url = environment.apiUrl + 'api/Master/DeleteSubCategory';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  getSubCategoryServerPagination(payload) {
    let url =
      environment.apiUrl +
      "api/v2_Master/GetSubCateogyrTableList_ServerPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

 }



