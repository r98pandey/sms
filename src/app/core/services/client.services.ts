import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: "root",
})
export class ClientService {
  cItem: any = {};
  clientId: any;
  addAccess: boolean = false;

  private token: any;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthenticationService
  ) { }

  getClientTableList_LocalPagination(data: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/V2_Master/GetClientTableList_LocalPagination";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }
  getClientStatus(pageName: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetClientStatus/" + pageName;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }



  clientList(payload: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetV2_GetClientListDrobDown";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }

  getClientDetailById(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetClientDetail";
    return this._http.post(
      url,
      { clientId: id },
      {
        headers: new HttpHeaders()
          .set("Content-Type", "application/json")

      }
    );
  }

  GetV2_GetClientTableList(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetV2_GetClientTableList";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }

  postClient(data: any) {
    let url = environment.apiUrl + "api/V2_Master/CreateClient";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }
  createClient_Prospect(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateClient_Prospect";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }

  postGetV2_GetCompanyListDrobDown(data: any) {
    let url = environment.apiUrl + "api/V2_Master/GetCompanyListDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }

  postUpdateClient(data: any) {
    let url = environment.apiUrl + "api/V2_Master/UpdateCLient";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }
  postDeleteClient(data: any) {
    let url = environment.apiUrl + "api/V2_Master/DeleteCLient";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }
  /* postGetV2_GetCompanyListDrobDown(data: any) {
     let url = environment.apiUrl + 'api/Master/GetV2_GetCompanyListDrobDown';
     return this._http.post(url, data, {
       headers: new HttpHeaders()
         .set('Content-Type', 'application/json')
         .set('Authorization', 'Bearer ' + this.token)
     })
   }
 */

  getClientDetailsById(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetClientDetail";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }

  UpdateClientLogo(data: any) {
    let url = environment.apiUrl + "api/V2_Master/UpdateClientLogo";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${localStorage.getItem("token")}`),
    });
  }
}



