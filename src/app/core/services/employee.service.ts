import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employeeItem: {};
  private token: any;
  constructor(private _http: HttpClient, private _route: Router, private authService: AuthAssetService) {
    this.token = this.authService.getAccessToken();

  }

  getEmployeeList_ByPagination(companyId: any, displayLength: any, displayStart: any, SearchDepartmentName: any, SearchEmpName: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/GetEmployeeList_ByPagination?companyId=' + companyId + '&displayLength=' + displayLength + '&displayStart=' + displayStart + '&SearchDepartmentName=' + SearchDepartmentName + '&SearchEmpName=' + SearchEmpName;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  postCreateEmployee(data: any) {
    let url = environment.apiUrl + 'api/Master/CreateEmployee';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  postUpdatEmployeeLogo(data: any) {
    let url = environment.apiUrl + 'api/Master/UpdateEmployeeLogo';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  postUpdateEmployee(data: any) {
    let url = environment.apiUrl + 'api/Master/UpdateEmployee';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  postDeleteEmployee(data: any) {
    let url = environment.apiUrl + 'api/Master/DeleteEmployee';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    })
  }

  getEmployeeTableListServerPagination(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/V2_Master/GetEmployeeTableList_ServerPagination';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  createEmployee(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/V2_Master/CreateEmployee';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  getEmployee(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/V2_Master/GetEmployeeDetail';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  
  updateEmployee(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Master/UpdateEmployee';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  updateEmployeeProfileImage(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/V2_Master/UpdateEmployeeProfileImage';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  deleteEmployee(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/V2_Master/DeleteEmployee';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
}
