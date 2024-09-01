import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  lItem:any= {};
  private token: any;
  constructor(
    private _http: HttpClient,
     private _route: Router,
      // private authService: AuthService
      ) {
    // this.token = this.authService.getAccessToken();
  }
  getLocation(): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/GetLocationList';
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  getLocationDetail(id): Observable<Object> {
    let url = environment.apiUrl + 'api/V2_Master/GetLocationDetail';
    return this._http.post(url, { LocationId: id }, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }


  postLocation(data: any) {
    let url = environment.apiUrl + 'api/Master/CreateLocation';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }


  getLocationByCompanyIdDepartmentId(request1: any, request2: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/GetLocationList/' + request1 + '/' + request2;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  GetLocationTableList_ServerPagination(data): Observable<Object> {

    let url = environment.apiUrl + 'api/V2_Master/GetLocationTableList_ServerPagination'
    return this._http.post(url,data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  getLocationListByLocationId(id: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/GetLocationListByLocationId/' + id;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  postUpdateLocation(data: any) {
    let url = environment.apiUrl + 'api/Master/UpdateLocation';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }
  GetV2_GetLocationTableList(data: any) {
    let url = environment.apiUrl + 'api/Master/GetV2_GetLocationTableList';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }
  postDeleteLocation(data: any) {
    let url = environment.apiUrl + 'api/Master/DeleteLocation';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

}



