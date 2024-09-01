import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: "root",
})
export class DepartmentService {
  static editDepartmentId: number = 0;
  currentProjectCompanyId:number=0;
  currentProjectClientId:number=0;
  
  accessRight: boolean = false;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthenticationService
  ) { }
  getDepartmentTableList_LocalPagination(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/V2_Master/GetDepartmentTableList_LocalPagination";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getClientForApplicationSettingDrobDown(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/V2_Master/GetClientForApplicationSettingDrobDown";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  postDepartment(data: any) {
    let url = environment.apiUrl + "api/V2_Master/CreateDepartment";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  CreateV2_Department(data: any) {
    let url = environment.apiUrl + "api/V2_Master/CreateV2_Department";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  
  createDepartmentForPM(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateDepartment";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  postUpdateDepartmentLogo(data: any) {
    let url = environment.apiUrl + "api/Master/UpdateDepartmentLogo";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }




  getDepartmentByCompanyId(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetDepartmentList/" + id;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }



  getDepartmentByClientId(id: any, clientId: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Master/GetDepartmentListByClient/" +
      id +
      "/" +
      clientId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getCompanyListWithDept(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetCompanyListWithDept/" + id;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getDepartmentListByDeptId(id: any): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetDepartmentListByDeptId/" + id;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getDepartmentDetail(id) {
    const url = environment.apiUrl + "api/V2_Master/GetDepartmentDetail";
    return this._http.post(
      url,
      {
        DepartmentId: id,
      },
      {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      }
    );
  }
  postUpdateDepartment(data: any) {
    let url = environment.apiUrl + "api/V2_Master/UpdateDepartment";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MX_MasterProjectProcessHeaderByProject(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_MX_MasterProjectProcessHeaderByProject";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  postDeleteDepartment(data: any) {
    let url = environment.apiUrl + "api/Master/DeleteDepartment";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getClient(companyId: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetClientListDrobDown";
    return this._http.post(
      url,
      { SearchCompanyId: companyId },
      {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      }
    );
  }

  getDepartmentListDropdown(companyId: any, clientId: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetDepartmentListDrobDown";
    return this._http.post(
      url,
      { SearchCompanyId: companyId, SearchClientId: clientId },
      {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      }
    );
  }

  // Starting for PM

  getV2_MX_MasterProjectProcessList() {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_MX_MasterProjectProcessList";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  UploadProjectProcessDocument(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/UploadProjectProcessDocument";
    return this._http.post(url, data);
  }

  createV2_ProjectProcessHeaderDocument(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_ProjectProcessHeaderDocument";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  

  getMX_ProjectProcessDocList(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/GetMX_ProjectProcessDocList";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  updateMX_ProjectProcessHeaderComplete(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/UpdateMX_ProjectProcessHeaderComplete";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getMX_ProjectProcessDocDetail(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/GetMX_ProjectProcessDocDetail";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  
  getMX_ProjectProcessHeaderDocDetail(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/GetMX_ProjectProcessHeaderDocDetail";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
   getMX_ProjectProcessMX_ProjectProcessRFWIFormDetail(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/GetMX_ProjectProcessMX_ProjectProcessRFWIFormDetail";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  

  // GetV2_MX_MasterFollowType
  getV2_MX_MasterFollowType() {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_MX_MasterFollowType";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  createV2_MX_ProjectFollowUp(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_MX_ProjectFollowUp";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  UpdateV2_MX_ProjectFollowUpDesc(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/UpdateV2_MX_ProjectFollowUpDesc";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  // payload ProjectProcessHeaderDocId Remark
  updateMX_ProjectProcessHeaderDocRemark(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/UpdateMX_ProjectProcessHeaderDocRemark";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  

  UpdateV2_MX_ProjectFollowUpStatus(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/UpdateV2_MX_ProjectFollowUpStatus";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getProjectManagementStatus(value: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetProjectManagementStatus/" + value;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MX_MasterFollowList_ServerPaging(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_MX_MasterFollowList_ServerPaging";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_MX_MasterFollowWithMembersList_ServerPaging(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_MX_MasterFollowWithMembersList_ServerPaging";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // Payload FollowUpId
  getV2_FollowUpDetail(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_FollowUpDetail";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // Payload ProjectId  FollowUpId
  getV2_FollowUpMemberList(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_FollowUpMemberList";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // Payload ProjectId  FollowUpId
  addV2_ProjectFollowUpMember(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/AddV2_ProjectFollowUpMember";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // Payload ProjectFollowUpMemberId
  deleteV2_ProjectFollowUpMember(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/DeleteV2_ProjectFollowUpMember";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }



  // Payload FollowUpId Title Remark  ImageBase64URL Type
  uploadV2_ProjectFollowUpDocument(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/UploadV2_ProjectFollowUpDocument";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  //ToDoList 

  //Payload FollowUpId
  getV2_FollowUpToDoList(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_FollowUpToDoList";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  //Payload Create FollowUpId Title Remark DueDate Priority
  addV2_ProjectFollowUpTodo(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/AddV2_ProjectFollowUpTodo";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  //Delete Payload ProjectFollowUpToDoId
  deleteV2_ProjectFollowUpTodo(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/DeleteV2_ProjectFollowUpTodo";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  //Delete Payload ProjectFollowUpToDoId ProjectFollowUpTodoStatusId ProjectFollowUpTodoStatusName
  updateV2_ProjectFollowUpTodoStatus(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/UpdateV2_ProjectFollowUpTodoStatus";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  //follow UP document List



  //Payload FollowUpId
  getV2_FollowUpDocList(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_FollowUpDocList";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // delete document ProjectFollowUpDocId Remark
  deleteV2_MX_ProjecFollowUpDoc(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/DeleteV2_MX_ProjecFollowUpDoc";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  
 // delete  ProjectProcessHeaderDocId 
 deleteMX_ProjectProcessHeaderDoc(data: any) {
  let url = environment.apiUrl + "api/ProjectManagement/DeleteMX_ProjectProcessHeaderDoc";
  return this._http.post(url, data, {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
  });
}

  //Payload Create FollowUpId Title Remark Type ImageBase64URL

  UploadV2_ProjectFollowUpDocument(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/UploadV2_ProjectFollowUpDocument";
    return this._http.post(url, data);
  }
  //Payload Create ProjectFollowUpDocId Title Remark 
  UpdateV2_MX_ProjecFollowUpDocRemarkTitle(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/UpdateV2_MX_ProjecFollowUpDocRemarkTitle";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  //fro Comment
  // Payload FollowUpId MessageContain AccessGroup
  CreateV2_TicketDiscussionProjFollowUp(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_TicketDiscussionProjFollowUp";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  

  //List api Payload FollowUpId FollowUpId displayLength displayStart
  GetV2_TicketDisscusionProjFollowUp_ServerPaging(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_TicketDisscusionProjFollowUp_ServerPaging";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  //Project

  GetDepartmentListProjectDrobDownApiProject(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetDepartmentListProjectDrobDown";
    return this._http.post(
      url,data,{
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      }
    );
  }

  //Set Up workforce Member

  GetClientListProjectDrobDownApi(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetClientListProjectDrobDown";
    return this._http.post(
      url,data,{
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      }
    );
  }

  //Added Suresh Rao 22-07-2024
  GetV3_ClientDrobDown_Global_Active(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/DropDowns/GetV3_ClientDrobDown_Global_Active";
    return this._http.post(
      url,data,{
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      }
    );
  }

  GetDepartmentListProjectDrobDownApi(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_Master/GetDepartmentListProjectWorkforceSetupDrobDown";
    return this._http.post(
      url,data,{
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      }
    );
  }


  GetMX_MX_ProjectWorkforceList_ServerPaging(payload): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/ProjectManagement/GetMX_MX_ProjectWorkforceList_ServerPaging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  //team

  GetV2_GetMX_ProjectUserAccessList_ServerPaging(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_GetMX_ProjectUserAccessList_ServerPaging";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  GetV2_GetMX_MaintenanceUserAccessList_ServerPaging(data: any) {
    let url = environment.apiUrl + "api/Maintenance/GetV2_GetMX_MaintenanceUserAccessList_ServerPaging";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  
 
// api/Maintenance/CreateV2_MX_MaintenanceUserAccessIndividualUser
 
// api/Maintenance/CreateV2_MX_MaintenanceUserAccessBulkUser


  // team member get
  GetV2_UserListApplication(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_UserListApplication";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  } 
   GetV2_UserListClient(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_UserListClient";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  CreateV2_MX_ProjectUserAccessBulkUser(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_MX_ProjectUserAccessBulkUser";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }  
  CreateV2_MX_MaintenanceUserAccessBulkUser(data: any) {
    let url = environment.apiUrl + "api/Maintenance/CreateV2_MX_MaintenanceUserAccessBulkUser";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  CreateV2_MX_ProjectUserAccessBulkClientUser(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_MX_ProjectUserAccessBulkClientUser";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }  
  CreateV2_MX_MaintenanceUserAccessBulkClientUser(data: any) {
    let url = environment.apiUrl + "api/Maintenance/CreateV2_MX_MaintenanceUserAccessBulkClientUser";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }  
  CreateV2_MX_AssetUserAccessBulkClient(data: any) {
    let url = environment.apiUrl + "api/AssetManagement/CreateV2_MX_AssetUserAccessBulkClient";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  CreateV2_MX_AssetUserAccessBulkUser(data: any) {
    let url = environment.apiUrl + "api/AssetManagement/CreateV2_MX_AssetUserAccessBulkUser";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  getV2_GetMX_ProjectUserAccessList_ServerPaging(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_GetMX_ProjectUserAccessList_ServerPaging"
    {
      return this._http.post(url, data, {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      });
    }
  } 
  
  getV2_GetMX_ProjectActivityAuditList_ServerPaging(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/GetV2_GetMX_ProjectActivityAuditList_ServerPaging"
    {
      return this._http.post(url, data, {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      });
    }
  }
  
  getMX_ProjectProcessHeaderDocList(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/GetMX_ProjectProcessHeaderDocList"
    {
      return this._http.post(url, data, {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      });
    }
  }


  //payload ProjectProcessDocId Remark
  updateMX_ProjectProcessDocRemark(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/UpdateMX_ProjectProcessDocRemark"
    {
      return this._http.post(url, data, {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      });
    }
  }


  //payload ProjectProcessDocId
  deleteMX_ProjectProcessDoc(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/DeleteMX_ProjectProcessDoc"
    {
      return this._http.post(url, data, {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      });
    }
  }
  createV2_MX_ProjectProcessRFWI(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/ProjectManagement/CreateV2_MX_ProjectProcessRFWI'
    {
      return this._http.post(url, data, {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
      });
    }
  }


  uploadV2_MX_ProjectProcessRFWIImages(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/UploadV2_MX_ProjectProcessRFWIImages";
    return this._http.post(url, data);
  }



  



 
 




}


