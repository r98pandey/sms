import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { AuthenticationService } from "./auth.service";

const _url = environment.apiUrl;
@Injectable({
  providedIn: "root",
})
export class CompanyService {
  addCompanyAccess: boolean = false;
  constructor(private _http: HttpClient) {}
  getCompanyTableList_LocalPagination(): Observable<Object> {
    let url =
      environment.apiUrl + "api/V2_Master/GetCompanyTableList_LocalPagination";
    return this._http.post(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${localStorage.getItem("token")}`),
    });
  }

  postCompany(data: any) {
    let url = environment.apiUrl + "api/V2_Master/CreateCompany";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${localStorage.getItem("token")}`),
    });
  }

  updateCompanyLogo(data: any) {
    let url = environment.apiUrl + "api/V2_Master/UpdateCompanyLogo";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${localStorage.getItem("token")}`),
    });
  }

  getCompanyDetail(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetCompanyDetail";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${localStorage.getItem("token")}`),
    });
  }

  updateCompany(data: any) {
    let url = environment.apiUrl + "api/V2_Master/UpdateCompany";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${localStorage.getItem("token")}`),
    });
  }
  deleteCompany(data: any) {
    let url = environment.apiUrl + "api/V2_Master/DeleteCompany";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${localStorage.getItem("token")}`),
    });
  }
}
