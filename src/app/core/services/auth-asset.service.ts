
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";


import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalStoreService } from "./local-store.service";
@Injectable({
  providedIn: "root",
})
export class AuthAssetService {
  rItem = {};
  authenticated = true;
  private userSubject = new Subject<any>();
  constructor(
    private store: LocalStoreService,
    private _route: Router,
    private _http: HttpClient
  ) { }
  signout() {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
    this.authenticated = false;
    localStorage.removeItem("vam-user");
    localStorage.removeItem("isLoggedin");
    localStorage.removeItem("menuItems");
    localStorage.removeItem("clientDetail");

  }
  login(requestData: any) {
    this.authenticated = true;
    let url = environment.apiUrl + "api/Account/LoginUser";
    return this._http.post(url, requestData);
  }

  getSession() {
    return this.userSubject.asObservable();
  }
  removeSession() {
    localStorage.removeItem("vam-user");
    localStorage.removeItem("menuItems");
    localStorage.removeItem("clientDetail");
    this.userSubject.next(null);
    this._route.navigate(["auth/login"]);
  }

  createSession(user: any) {
    localStorage.setItem("vam-user", JSON.stringify(user));
    this.userSubject.next(user);
  }
  getAccessToken() {
    let result = JSON.parse(localStorage.getItem("vam-user"))?.token;
    return result;
  }
  getUserName() {
    let result = JSON.parse(localStorage.getItem("vam-user")).userInfor
      .userName;
    if (result) {
      return result;
    } else {
      this.removeSession();
      this.signout()
    }
  }
  getCurrentStatus() {
    let result = JSON.parse(localStorage.getItem("vam-user")).userInfor
      .currentStatus;
    return result;
  }
  getCurrentStatusRemark() {
    let result = JSON.parse(localStorage.getItem("vam-user")).userInfor
      .currentStatusRemark;
    return result;
  }
  getUserID() {
    let result = JSON.parse(localStorage.getItem("vam-user")).userInfor.email;
    if (result) {
      return result;
    } else {
      this.removeSession();
      this.signout()
    }
  }
  getUserInfoID() {
    let result = JSON.parse(localStorage.getItem("vam-user")).userInfor.userId;
    if (result) {
      return result;
    } else {
      this.removeSession();
      this.signout()
    }
  }
  getUserInfo() {
    let result = JSON.parse(localStorage.getItem("vam-user")).userInfor;
    if (result) {
      return result;
    } else {
      this.removeSession();
      this.signout()
    }
  }
  getFullName() {
    let result = JSON.parse(localStorage.getItem("vam-user"))?.userInfor
      .fullName;
    if (result) {
      return result;
    } else {
      this.removeSession();
      this.signout()
    }
  }
  getprofileImageUrl() {
    let result = JSON.parse(localStorage.getItem("vam-user"))?.userInfor
      .profileImageUrl;
    return result;
  }
  getRole() {
    let result = JSON.parse(localStorage.getItem("vam-user"))?.userInfor?.role;
    if (result) {
      return result;
    } else {
      this.removeSession();
      this.signout()
    }

  }

  getaccessGroupName() {
    let result = JSON.parse(localStorage.getItem("vam-user")).userInfor
      .accessGroupName;
    return result;
  } getaccessGroupId() {
    let result = JSON.parse(localStorage.getItem("vam-user")).userInfor
      .accessGroupId;
    return result;
  }
  getBuildVersionValue() {
    let result = JSON.parse(localStorage.getItem("vam-user")).buildVersion
    return result;
  }

  getisProject() {
    let result = JSON.parse(localStorage.getItem("vam-user")).isProject;
    if (result) {
      return result;
    } else {
      this.removeSession();
      this.signout()
    }
  }
  getIsMaintenanceModule() {
    let result = JSON.parse(localStorage.getItem("vam-user")).isMaintenanceModule;
    return result;
  }
  getIsAssetManagementtModule() {
    let result = JSON.parse(localStorage.getItem("vam-user")).isAssetManagementtModule;
    return result;
  }
  getIsAttendanceManagementtModule() {
    let result = JSON.parse(localStorage.getItem("vam-user")).isAttendanceManagementtModule;
    return result;
  }
  getIsFleetManagementtModule() {
    let result = JSON.parse(localStorage.getItem("vam-user")).isFleetManagementtModule;
    return result;
  }
  getIsProjectManagementModule() {
    let result = JSON.parse(localStorage.getItem("vam-user")).isProjectManagementModule;
    return result;
  }

  getResetLogin(loginToken: string) {
    const params = new HttpParams()
      .set('firstTimeLoginToken', loginToken);
    return this._http.get(environment.apiUrl + 'api/ChangePwd/GetResetLogin', {
      params: params, headers: {
        ApiKey: environment.ApiKey
      }
    });
  }
  changePasswordForResetPwd(data: any) {
    const params = new HttpParams();
    let url = environment.apiUrl + 'api/ChangePwd/ChangePasswordForResetPwd';
    return this._http.post(url, data, {
      params: params, headers: {
        ApiKey: environment.ApiKey
      }
    })
  }
  GetBuildVersion() {
    return this._http.get(environment.apiUrl + 'api/Account/GetBuildVersion', {
      headers: {
        ApiKey: environment.ApiKey
      }
    });
  }

}



