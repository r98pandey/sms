import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class DropdownService {
  // dItem: {};
  private token: any;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthenticationService
  ) {
    // this.token = this.authService.getAccessToken();
  }
  GetCompanyListDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetCompanyListDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }


  Getv3_MaintenanceCompanyDropDownList(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceCompanyDropDownList";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_MaintenanceCompanyDropDownList_Active(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceCompanyDropDownList_Active";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_CompanyDropDownList_AssetManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_CompanyDropDownList_AssetManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }  
  
  Getv3_MaintenanceCompanyDropDownList_Active_AssetManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceCompanyDropDownList_Active_AssetManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_CompanyDropDownList_ProjectManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_CompanyDropDownList_ProjectManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }  
  
  //Added by Suresh Rao 22/07/2024
  Getv3_CompanyDropDownList_Global(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/GetV3_CompanyDrobDown_Global";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }  

  Getv3_MaintenanceCompanyDropDownList_Active_ProjectManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceCompanyDropDownList_Active_ProjectManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_CompanyDropDownList_ProjectManagement_WorkPrograme(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_CompanyDropDownList_ProjectManagement_WorkPrograme";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_MaintenanceCompanyDropDownList_Active_ProjectManagement_WorkPrograme(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceCompanyDropDownList_Active_ProjectManagement_WorkPrograme";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }



  /**
   *
   * @param data
   *  payload SearchCompanyId
   * @returns
   */
  GetClientListDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetClientListDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_MaintenanceClientDropDownList(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceClientDropDownList";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_MaintenanceClientDropDownList_Active(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceClientDropDownList_Active";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  
  Getv3_ClientDropDownList_AssetManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_ClientDropDownList_AssetManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_MaintenanceClientDropDownList_Active_AssetManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceClientDropDownList_Active_AssetManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_ClientDropDownList_ProjectManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_ClientDropDownList_ProjectManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  getClientTableList_LocalPagination(data: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/V2_Master/GetClientTableList_LocalPagination";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }
  
  Getv3_MaintenanceClientDropDownList_Active_ProjectManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceClientDropDownList_Active_ProjectManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_ClientDropDownList_ProjectManagement_WorkPrograme(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_ClientDropDownList_ProjectManagement_WorkPrograme";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_MaintenanceClientDropDownList_Active_ProjectManagement_WorkPrograme(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceClientDropDownList_Active_ProjectManagement_WorkPrograme";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  
  
  /**
     *
     * @param data
     *  payload SearchCompanyId
     * @returns
     */
  getClientListProjectScheduleDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetClientListProjectScheduleDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  /**
     *
     * @param data
     *  payload SearchCompanyId
     * @returns
     */
  getClientListMaintenanceDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetClientListMaintenanceDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }


  

  /**
   *
   * @param data
   *  payload SearchCompanyId, SearchClientId
   * @returns
   */
  GetDepartmentListDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetDepartmentListDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  
  Getv3_MaintenanceDepartmentDropDownList(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceDepartmentDropDownList";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  Getv3_MaintenanceDepartmentDropDownList_Active(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceDepartmentDropDownList_Active";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  Getv3_DepartmentDropDownList_AssetManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_DepartmentDropDownList_AssetManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  Getv3_MaintenanceDepartmentDropDownList_Active_AssetManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceDepartmentDropDownList_Active_AssetManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }  
  Getv3_DepartmentDropDownList_ProjectManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_DepartmentDropDownList_ProjectManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  Getv3_MaintenanceDepartmentDropDownList_Active_ProjectManagement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceDepartmentDropDownList_Active_ProjectManagement";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  Getv3_DepartmentDropDownList_ProjectManagement_WorkPrograme(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_DepartmentDropDownList_ProjectManagement_WorkPrograme";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }  
  Getv3_MaintenanceDepartmentDropDownList_Active_ProjectManagement_WorkPrograme(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/Getv3_MaintenanceDepartmentDropDownList_Active_ProjectManagement_WorkPrograme";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  /**
  *
  * @param data
  *  payload SearchCompanyId, SearchClientId
  * @returns
  */
  getDepartmentListProjectDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetDepartmentListProjectDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });

  }
  getDepartmentProjectScheduleDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetDepartmentProjectScheduleDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });

  }

  /** 
   *
  * @param data
  *  payload SearchCompanyId, SearchClientId
  * @returns
  */
  GetDepartmentListMaintenanceDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetDepartmentListMaintenanceDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });

  }




  /**
   *
   * @param data
   *  payload SearchCompanyId
   * @returns
   */

  GetCategoryListDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetCategoryListDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  /**
   *
   * @param data
   *  payload SearchCompanyId, SearchCategoryId
   * @returns
   */

  GetSubCategoryListDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetSubCategoryListDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  /**
   *
   * @param data
   *  payload SearchCompanyId
   * @returns
   */

  GetVendorListDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetVendorListDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  /**
   *
   * @param data
   *  payload SearchCompanyId, SearchClientId,SearchDepartmentId
   * @returns
   */

  GetLocationListDrobDown(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetLocationListDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getCountryList(): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetCountryList";
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getCountryListDrobDown(): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetCountryListDrobDown";
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getClientForApplicationSettingDrobDown(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/V2_Master/GetClientForApplicationSettingDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getV2_UserListDD(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Maintenance/GetV2_UserListDD";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

}
