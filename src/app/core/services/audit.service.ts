import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { AuthAssetService } from "./auth-asset.service";
import * as saveAs from "file-saver";

@Injectable({
  providedIn: "root",
})
export class AuditService {
  aItem: {};
  auditAsset: {};
  auditType: string;
  auditId: number = 0;
  private token: any;

  accessRight: boolean = false;
  loading: boolean;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthAssetService
  ) {
    this.token = this.authService.getAccessToken();
  }

  getAudit(
    companyId: any,
    year1: any,
    statusId: any,
    selfAudit: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/assetaudit/GetMasterAssetAudit/" +
      companyId +
      "/" +
      year1 +
      "/" +
      statusId +
      "/" +
      selfAudit;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getMasterAssetAudit(data: any) {
    let url = environment.apiUrl + "api/V2_AssetAudit/GetMasterAssetAudit";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getMasterAssetAudit_Paging(data: any) {
    let url =
      environment.apiUrl + "api/V2_AssetAudit/GetMasterAssetAudit_Paging";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getMasterAssetAuditDetail(data: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/V2_AssetAudit/V2_GetMasterAssetAuditDetail";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getAssetAuditNotMatch(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/V2_AssetAudit/GetAssetAuditNotMatch";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getTransactionAssetAudit_ByPagination(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/V2_AssetAudit/GetTransactionAssetAudit_ByPagination";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getTechnitionAttendanceListByTaskForAudit(data: any) {
    let url =
      environment.apiUrl +
      "api/V2_AssetAudit/GetTechnitionAttendanceListByTaskForAudit";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  UpdateV2_AuditAcknowledge(data: any) {
    let url =
      environment.apiUrl + "api/V2_AssetAudit/UpdateV2_AuditAcknowledge";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  } 
  UpdateMasterAssetAuditAsCompleted(data: any) {
    let url =
      environment.apiUrl + "api/FmsMobileApp/UpdateMasterAssetAuditAsCompleted";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  UpdateV2_AuditApprove(data: any) {
    let url = environment.apiUrl + "api/V2_AssetAudit/UpdateV2_AuditApprove";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  postInsertAudit(data: any) {
    let url = environment.apiUrl + "api/V2_AssetAudit/CreateAssetAudit";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  postInsertAuditSelfAudit(data: any) {
    let url = environment.apiUrl + "api/assetaudit/CreateAssetAuditSelfAudit ";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  postUpdateMasterAssetAuditVerification(data: any) {
    let url =
      environment.apiUrl + "api/assetaudit/UpdateMasterAssetAuditVerification";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  postUpdateMasterAssetAuditAsCompleted(data: any) {
    let url =
      environment.apiUrl + "api/AssetAudit/UpdateMasterAssetAuditAsCompleted";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  InsertTechnitionforAudit(payload): Observable<any> {
    let url = environment.apiUrl + "api/V2_AssetAudit/InsertTechnitionforAudit";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  DeleteTechnitionforAudit(payload): Observable<any> {
    let url = environment.apiUrl + "api/V2_AssetAudit/DeleteTechnitionforAudit";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  GetAuditTaskAvailablity(payload): Observable<any> {
    let url = environment.apiUrl + "api/FmsMobileApp/GetAuditTaskAvailablity";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  // getTransactionAssetAudit_ByPagination(
  //   assetAuditId: any,
  //   displayLength: any,
  //   displayStart: any
  // ): Observable<Object> {
  //   let url =
  //     environment.apiUrl +
  //     "api/assetaudit/GetTransactionAssetAudit_ByPagination?assetAuditId=" +
  //     assetAuditId +
  //     "&displayLength=" +
  //     displayLength +
  //     "&displayStart=" +
  //     displayStart;
  //   return this._http.get(url, {
  //     headers: new HttpHeaders().set("Content-Type", "application/json"),
  //   });
  // }
  getTransactionAssetSelfAudit_ByPagination(
    assetAuditId: any,
    displayLength: any,
    displayStart: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/assetaudit/GetTransactionAssetAuditSelfAudit_ByPagination?assetAuditId=" +
      assetAuditId +
      "&displayLength=" +
      displayLength +
      "&displayStart=" +
      displayStart;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  public DownloadRptAssetAuditPendingPDf(batchstatusId, assetAuditId): void {
    const tokenheader = new HttpHeaders({
      "Content-Type": "application/pdf",
      Authorization: "Bearer " + this.token,
    });
    this._http
      .get(
        environment.apiUrl +
        "api/StandardReport/GetRptAssetAuditPending/pdf/" +
        batchstatusId +
        "?assetAuditId=" +
        assetAuditId,
        {
          headers: tokenheader,
          responseType: "blob",
        }
      )
      .subscribe(
        (data) => this.downloadFilePDF(data, "AssetAuditReport.pdf"),
        (error) => {
          // //console.log(error);
        }
      );
    this.loading = false;
  }

  public DownloadRptAssetAuditPendingPDfSelf(
    batchstatusId,
    assetAuditId
  ): void {
    const tokenheader = new HttpHeaders({
      "Content-Type": "application/pdf",
      Authorization: "Bearer " + this.token,
    });
    this._http
      .get(
        environment.apiUrl +
        "api/StandardReport/GetRptAssetAuditPendingSelfAudit/pdf/" +
        batchstatusId +
        "?assetAuditId=" +
        assetAuditId,
        {
          headers: tokenheader,
          responseType: "blob",
        }
      )
      .subscribe(
        (data) => this.downloadFilePDF(data, "SelfAssetAuditReport.pdf"),
        (error) => {
          //console.log(error);
        }
      );
    this.loading = false;
  }
  downloadFilePDF(data: any, filename: string): void {
    const blob = new Blob([data], { type: "application/octet-stream" });
    saveAs(blob, filename);
  }

  public DownloadRptAssetAuditPendingExcel(batchstatusId, assetAuditId): void {
    const tokenheader = new HttpHeaders({
      "Content-Type": "application/pdf",
      Authorization: "Bearer " + this.token,
    });
    this._http
      .get(
        environment.apiUrl +
        "api/StandardReport/GetRptAssetAuditPending/excel/" +
        batchstatusId +
        "?assetAuditId=" +
        assetAuditId,
        {
          headers: tokenheader,
          responseType: "blob",
        }
      )
      .subscribe(
        (data) => this.downloadFileXL(data, "AssetAuditReport.xls"),
        (error) => {
          //console.log(error);
        }
      );
    this.loading = false;
  }
  public DownloadRptAssetAuditPendingExcelSelf(
    batchstatusId,
    assetAuditId
  ): void {
    const tokenheader = new HttpHeaders({
      "Content-Type": "application/pdf",
      Authorization: "Bearer " + this.token,
    });
    this._http
      .get(
        environment.apiUrl +
        "api/StandardReport/GetRptAssetAuditPendingSelfAudit/excel/" +
        batchstatusId +
        "?assetAuditId=" +
        assetAuditId,
        {
          headers: tokenheader,
          responseType: "blob",
        }
      )
      .subscribe(
        (data) => this.downloadFileXL(data, "SelfAssetAuditReport.xls"),
        (error) => {
          //console.log(error);
        }
      );
    this.loading = false;
  }
  downloadFileXL(data: any, filename: string): void {
    const blob = new Blob([data], { type: "application/octet-stream" });
    saveAs(blob, filename);
  }

  StartTaskAudit(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/StartTaskAudit';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }
  EndTaskAudit(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/EndTaskAudit';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }
  StartTechTaskAudit(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/StartTechTaskAudit';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }
  EndTechTaskAudit(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/EndTechTaskAudit';
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }

}
