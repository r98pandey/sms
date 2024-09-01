import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/auth.models";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class UserProfileService {
  static selectedUserId: any;
  accessRight: boolean = false;
  activeFirebase = "";
  constructor(private http: HttpClient) {}

  /***
   * Get All User
   */
  getAll() {
    return this.http.get<User[]>(`api/users`);
  }

  /***
   * Facked User Register
   */
  register(user: User) {
    return this.http.post(`/users/register`, user);
  }

  GetUserListByCompanyAll(): Observable<Object> {
    let url = environment.apiUrl + "api/Account/GetUserListByCompanyAll";
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  //correct one

  GetRoleList(): Observable<Object> {
    let url = environment.apiUrl + "api/Account/GetRoleList";
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  GetAccessGroupListByAccessGroupId(id): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Account/GetAccessGroupListByAccessGroupId/" +
      id;
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getAccessGroupMasterAll(): Observable<Object> {
    let url =environment.apiUrl +"api/Account/GetAccessGroupMasterAll" ;
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  

  postUpdateProfileLogo(data: any) {
    let url = environment.apiUrl + "api/Account/UpdateUserProfilePicture";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  postUser(data: any) {
    let url = environment.apiUrl + "api/Account/CreateUser";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }  
  CreateUser_UserManagement(data: any) {
    let url = environment.apiUrl + "api/Account/CreateUser_UserManagement";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  updateUserActiveInActive(data: any) {
    let url = environment.apiUrl + "api/Account/UpdateUserActiveInActive";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_UserList(data: any) {
    let url = environment.apiUrl + "api/Account/GetV2_UserList";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_TaskAttendance_ByPagination(data: any) {
    let url = environment.apiUrl + "api/Maintenance/GetV2_TaskAttendance_ByPagination";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  getV2_UserListOnlyByProject(data: any) {
    let url = environment.apiUrl + "api/Account/GetV2_UserListOnlyByProject";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_ClientListOnlyByProject(data: any) {
    let url = environment.apiUrl + "api/Account/GetV2_ClientListOnlyByProject";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_ClientUserList(data: any) {
    let url = environment.apiUrl + "api/Account/GetV2_ClientUserList";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getCompanyExistWithDepartmentList(data: any) {
    let url =
      environment.apiUrl + "api/V2_Master/GetCompanyExistWithDepartmentList";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  userAssignByProject(data: any) {
    let url = environment.apiUrl + "api/Account/UserAssignByProject";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  postClientUser(data: any) {
    let url = environment.apiUrl + "api/Account/CreateClientUserProfile";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  createClientUserProfile_ProjectManagement(data: any) {
    let url = environment.apiUrl + "api/Account/CreateClientUserProfile_ProjectManagement";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  createUser_ProjectManagement(data: any) {
    let url = environment.apiUrl + "api/Account/CreateUser_ProjectManagement";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getUserListByUserId(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/Account/GetUserDetail/" + id;
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_V2_EmailNotificationList(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Account/GetV2_V2_EmailNotificationList";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getClientDetailsByClientId(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/Account/GetClientDetail/" + id;
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getUserListByCompanyId(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/Account/GetUserListByCompany/" + id;
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getClientUserListByCompanyId(id: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/Account/GetClientUserListByCompany/" + id;
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  postUpdateUserBasicDetail(data: any) {
    let url = environment.apiUrl + "api/Account/UpdateUserBasicDetail";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  postUpdateClientBasicDetail(data: any) {
    let url = environment.apiUrl + "api/Account/UpdateClientBasicDetail";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  postUpdateCompanyDepartmentAccessLevel(data: any) {
    let url = environment.apiUrl + "api/Account/CompanyDepartmentAccessLevel";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  postDeleteUser(data: any) {
    let url = environment.apiUrl + "api/Account/DeleteUser";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getCompanyList(): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetCompanyListByUserAccess";
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getRequestActivationCode(payload): Observable<Object> {
    let url = environment.apiUrl + "api/Account/RequestActivationCode";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  } 
   getV2_TechnitionsAttendanceTransactionDaily_ByStaff(payload): Observable<Object> {
    let url = environment.apiUrl + "api/MaintentDash/GetV2_TechnitionsAttendanceTransactionDaily_ByStaff";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getClientList(companyId): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Master/GetClientDorbpDownList?companyId=" +
      companyId;
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getRoleListForClient(): Observable<Object> {
    let url = environment.apiUrl + "api/Account/GetRoleListForClient";
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getRoleListForAccessGroupCreation(): Observable<Object> {
    let url =
      environment.apiUrl + "api/Account/GetRoleListForAccessGroupCreation";
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // getRoleList(): Observable<Object> {
  //   let url = environment.apiUrl + "api/Master/GetRoleList";
  //   return this.http.get(url, {
  //     headers: new HttpHeaders().set("Content-Type", "application/json"),
  //   });
  // }

  createV2_EmailNotification(data): Observable<Object> {
    let url = environment.apiUrl + "api/Account/CreateV2_EmailNotification";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  deleteV2_EmailNotification(data): Observable<Object> {
    let url = environment.apiUrl + "api/Account/DeleteV2_EmailNotification";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MyTaskRulesActiveCountByUserId(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Account/GetV2_MyTaskRulesActiveCount";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  updateV2_MX_MyTaskRights(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Account/UpdateV2_MX_MyTaskRights";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  updateFirebaseWebByUser(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Account/UpdateFirebaseWebByUser";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  resetPassword(username: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/Account/ResetPassword?username=" + username;
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  resetPasswordByUser(username: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Account/ResetPasswordByUser?username=" +
      username;
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  userChangePassword(data: any) {
    let url = environment.apiUrl + "api/Account/UserChangePassword";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // CurrentStatus
  UpdateUserCurrentStatus_Portal(data: any) {
    let url = environment.apiUrl + "api/Account/UpdateUserCurrentStatus_Portal";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // CurrentStatusRemark
  UpdateUserCurrentStatusRemark_Portal(data: any) {
    let url = environment.apiUrl + "api/Account/UpdateUserCurrentStatusRemark_Portal";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


}
