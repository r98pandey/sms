import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';

@Injectable({
  providedIn: "root",
})
export class WorkflowService {
  wfItem: {};
  approverType: string;
  private token: any;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthAssetService
  ) {
    this.token = this.authService.getAccessToken();
  }
  getWorkflow(): Observable<Object> {
    let url = environment.apiUrl + "api/workflow/GetWorkflow";
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  postWorkflow(data: any) {
    let url = environment.apiUrl + "api/Master/CreateVendor";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getWorkflowDepartmentList(id: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/workflow/GetWorkflowDepartmentList/" + id;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  getWorkflowMasterByDepartment(departmenttId: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/workflow/GetWorkflowMasterByDepartment/" +
      departmenttId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  getMasterApproverGroupTypeList(): Observable<Object> {
    let url =
      environment.apiUrl + "api/workflow/GetMasterApproverGroupTypeList";
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  getApproverTypeByGroupTypeId(
    typeId: any,
    departmentId: any,
    masterWorkflowId: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/workflow/GetApproverTypeByGroupTypeId/" +
      typeId +
      "/" +
      departmentId +
      "/" +
      masterWorkflowId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  postInsertWorkflowUser(data: any) {
    let url = environment.apiUrl + "api/workflow/InsertWorkflowUser";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  postRemoveWorkflowSetup(data: any) {
    let url = environment.apiUrl + "api/Workflow/RemoveWorkflowSetup";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  postUpdateWorkflowUser(data: any) {
    let url = environment.apiUrl + "api/workflow/UpdateWorkflowUser";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  postUpdateReviewerApproverProcess(data: any) {
    let url = environment.apiUrl + "api/Workflow/UpdateReviewerApproverProcess";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  postUpdateLoanReviewApproverProcess(data: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/UpdateLoanReviewApproverProcess";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  postUpdateReviewerMultiApproverProcess(data: any) {
    let url =
      environment.apiUrl + "api/Workflow/UpdateReviewerMultiApproverProcess";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  postUpdateMultipleTransferReviewApproverProcessWF2(data: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/UpdateMultipleTransferReviewApproverProcessWF2";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  postUpdateMultiDisposeReviewApproverProcess(data: any) {
    let url =
      environment.apiUrl +
      "api/DisposableAsset/UpdateMultiDisposeReviewApproverProcess";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  postUpdateMultiLoanReviewApproverProcess(data: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/UpdateMultiLoanReviewApproverProcess";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }

  //Suresh Rao Added 10022021 WF 3
  postUpdateReviewerApproverAssetTrasnferProcessWF3(data: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/UpdateTransferReviewApproverProcessWF3";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  postUpdateMultipleTransferReviewApproverProcessWF3(data: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/UpdateMultipleTransferReviewApproverProcessWF3";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  //Suresh Rao Added 10022021 WF 2
  postUpdateReviewerApproverAssetTrasnferProcessWF2(data: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/UpdateTransferReviewApproverProcessWF2";
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  getClientUserListByCompany(compnayId: any) {
    let url =
      environment.apiUrl +
      "api/Account/GetClientUserListByCompany/" +
      compnayId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  getUserListByCompany(compnayId: any, departmentid: any) {
    let url =
      environment.apiUrl +
      "api/Account/GetUserListByCompany/" +
      compnayId +
      "/" +
      departmentid;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  getClientListByCompany(compnayId: any, departmentid: any) {
    let url =
      environment.apiUrl +
      "api/Account/GetClientListByCompany/" +
      compnayId +
      "/" +
      departmentid;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
}
