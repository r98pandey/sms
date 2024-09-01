
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { GlobalComponent } from 'src/app/global-component';
// import { NewAuthService } from './new-auth.service';
const _API = GlobalComponent.AUTH_API;
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private token: any;
  private tempToken: any;

  constructor(private _http: HttpClient, private _route: Router) {
    // this.token = this.authService.getAccessToken();
  }

  setTempToken(data:any) {
    this.tempToken = data;
  }

  updateOrganisationMaster(data: any) {
    let url = _API+'api/Account/UpdateOrganisationMaster';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }
  // 
  getCountryList(): Observable<Object> {
    let url = _API+'api/Master/GetCountryList';
    let token = this.token ? this.token : this.tempToken
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    });
  }

  saveOrganisationMaster(payload: any) {
    let token = this.token ? this.token : this.tempToken;
    let url = _API+'api/Account/CreateOrganisationMaster';
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
    })
  }
}

