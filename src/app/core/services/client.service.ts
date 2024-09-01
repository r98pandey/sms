import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  // cItem:{};
  // cId:number;
  private token: any;
  constructor(private _http: HttpClient, private _route: Router, private authService: AuthAssetService) {
    this.token = this.authService.getAccessToken();
  }

  getClient(): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/GetClientList';
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getGetCompanyListWithDept(): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/GetCompanyListWithDept';
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getCompanyListByUserAccess(): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/GetCompanyListByUserAccess';
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }


  postClient(data: any) {
    let url = environment.apiUrl + 'api/Master/CreateCLient';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  postUpdateClient(data: any) {
    let url = environment.apiUrl + 'api/Master/UpdateCLient';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }
  postDeleteClient(data: any) {
    let url = environment.apiUrl + 'api/Master/DeleteCLient';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }


 }



