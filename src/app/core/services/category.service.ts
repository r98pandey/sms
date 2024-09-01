import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { AuthenticationService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  // cateItem:{};
  private token: any;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthenticationService
  ) {
    // this.token = this.authService.getAccessToken();
  }
  getCategory(): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetCategoryList";
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  postCategory(data: any) {
    let url = environment.apiUrl + "api/Master/CreateCategory";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  GetV2_GetCateogyrTableList(data: any) {
    let url = environment.apiUrl + "api/Master/GetV2_GetCateogyrTableList";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getCategoryById(id: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/Master/GetCategoryListByCategoryId/" + id;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  getCategoryByCompanyId(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetCategoryList/" + id;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  postUpdateCategory(data: any) {
    let url = environment.apiUrl + "api/Master/UpdateCategory";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  postDeleteCategory(data: any) {
    let url = environment.apiUrl + "api/Master/DeleteCategory";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getCategoryServerPagination(payload) {
    let url =
      environment.apiUrl +
      "api/v2_Master/GetcategoryTableList_ServerPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
}
