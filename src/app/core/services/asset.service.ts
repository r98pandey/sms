import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { AuthAssetService } from "./auth-asset.service";
import { saveAs } from "file-saver-es";

@Injectable({
  providedIn: "root",
})
export class AssetService {
  assestItem: {};
  assetStatus = "value";
  sendAssetId = null;
  editStatus:boolean=false;
  accessRight: boolean = false;
  assetBackRoute: any = "/asset-management/asset/listasset";
  backTabs: any;
  private token: any;
  loading: any;
  storeAssetObject: any = {};
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthAssetService
  ) {
    this.token = this.authService.getAccessToken();
    this.assetStatus = undefined;
  }
  getDepreciationList(): Observable<Object> {
    let url = environment.apiUrl + "api/Master/GetDepreciationList";
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getEmployeeListDD(departmentId: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/Master/GetEmployeeListDD/" + departmentId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getEmployeeListDDByCompany(companyId: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/Master/GetEmployeeListDDByCompany/" + companyId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getWorkflowGetAssetList(copmanyId: any): Observable<Object> {
    let url = environment.apiUrl + "api/Workflow/GetAssetList/" + copmanyId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getWFActivityList(assetId: any, assignType: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Workflow/GetWFActivityList/" +
      assetId +
      "/" +
      assignType;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getWFActivityList__New(
    assetId: number,
    wfId: number,
    wfStatusId: number
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Workflow/GetWFActivityList_New/" +
      assetId +
      "/" +
      wfId +
      "/" +
      wfStatusId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getWFActivityList_DisposeNew(
    assetId: number,
    wfId: number,
    wfStatusId: number,
    wfAssetCreationId: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Workflow/GetWFActivityList_DisposeNew/" +
      assetId +
      "/" +
      wfId +
      "/" +
      wfStatusId +
      "/" +
      wfAssetCreationId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getAssetProfileDetails(assetId: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/Workflow/GetAssetProfileDetails/" + assetId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getAssetStatusUpdate(): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetAssetStatusList/AssetStatusUpdate";
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  postInsertAsset(data: any) {
    let url = environment.apiUrl + "api/workflow/InsertAsset";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  V2_UpdateAssetStatus(data: any) {
    let url = environment.apiUrl + "api/AssetManagement/V2_UpdateAssetStatus";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  postUpdateAsset(data: any) {
    let url = environment.apiUrl + "api/Workflow/UpdateAsset";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getCommanAssetList_ByPagination(
    companyId: any,
    displayLength: any,
    displayStart: any,
    SearchDepartmentName: any,
    SearchCatName: any,
    SearchSubCatName: any,
    SearchAssetStatus: any,
    SearchAssetName: any,
    SearchAssetTagId: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetCommanAssetList_ByPagination";

    const obj = { displayStart };
    if (companyId) obj["companyId"] = companyId;
    if (displayLength) obj["displayLength"] = displayLength;

    if (SearchDepartmentName)
      obj["SearchDepartmentName"] = SearchDepartmentName;
    if (SearchCatName) obj["SearchCatName"] = SearchCatName;
    if (SearchSubCatName) obj["SearchSubCatName"] = SearchSubCatName;
    if (SearchAssetStatus) obj["SearchAssetStatus"] = SearchAssetStatus;
    if (SearchAssetName) obj["SearchAssetName"] = SearchAssetName;
    if (SearchAssetTagId) obj["SearchAssetTagId"] = SearchAssetTagId;

    return this._http.get(url, {
      params: obj,
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  GetV2_CommanAssetList_ByPagination(payload: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetV2_CommanAssetList_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  GetV2_CommanAssetListWarrenty_ByPagination(payload: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetV2_CommanAssetListWarrenty_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
   GetV2_CommanAssetListExtended_ByPagination(payload: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetV2_CommanAssetListExtended_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  } 
  GetV2_CommanAssetListRMA_ByPagination(payload: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetV2_CommanAssetListRMA_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  

  GetV2_DashboardTodoListDetails_Paging(payload: any) {
    let url =
      environment.apiUrl + "api/AssetDash/V2_DashboardTodoListDetails_Paging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  GetV2_AssetListCritical_ByPagination(payload: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetV2_AssetListCritical_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  postUpdateReviewerApproverProcess(data: any) {
    let url = environment.apiUrl + "api/Workflow/UpdateReviewerApproverProcess";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  postUpdateReviewerMultiApproverProcess(data: any) {
    let url =
      environment.apiUrl + "api/Workflow/UpdateReviewerMultiApproverProcess";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  GetV2_DeliveryAssetOnly_ByPagination(payload: any) {
    let url =
      environment.apiUrl +
      "api/AssetManagement/GetV2_DeliveryAssetOnly_ByPagination";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getSurenderAssetList_ByPagination(
    companyId: any,
    displayLength: any,
    displayStart: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/DisposableAsset/GetSurenderAssetList_ByPagination?companyId=" +
      companyId +
      "&displayLength=" +
      displayLength +
      "&displayStart=" +
      displayStart;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getAssetListForLoanRequest_ByPagination(
    companyId: any,
    displayLength: any,
    displayStart: any,
    SearchDepartmentName: any,
    SearchCatName: any,
    SearchSubCatName: any,
    SearchAssetStatus: any,
    SearchAssetName: any,
    SearchAssetTagId: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/assetmanagement/GetAssetListForLoanRequest_ByPagination?companyId=" +
      companyId +
      "&displayLength=" +
      displayLength +
      "&displayStart=" +
      displayStart +
      "&SearchDepartmentName=" +
      SearchDepartmentName +
      "&SearchCatName=" +
      SearchCatName +
      "&SearchSubCatName=" +
      SearchSubCatName +
      "&SearchAssetStatus=" +
      SearchAssetStatus +
      "&SearchAssetName=" +
      SearchAssetName +
      "&SearchAssetTagId=" +
      SearchAssetTagId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getAssetListForAuditRequest_ByPagination(
    companyId: any,
    displayLength: any,
    displayStart: any,
    SearchDepartmentName: any,
    SearchCatName: any,
    SearchSubCatName: any,
    SearchAssetStatus: any,
    SearchAssetName: any,
    SearchAssetTagId: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/AssetAudit/GetAssetListForAuditRequest_ByPagination?companyId=" +
      companyId +
      "&displayLength=" +
      displayLength +
      "&displayStart=" +
      displayStart +
      "&SearchDepartmentName=" +
      SearchDepartmentName +
      "&SearchCatName=" +
      SearchCatName +
      "&SearchSubCatName=" +
      SearchSubCatName +
      "&SearchAssetStatus=" +
      SearchAssetStatus +
      "&SearchAssetName=" +
      SearchAssetName +
      "&SearchAssetTagId=" +
      SearchAssetTagId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getAssetListForAuditRequestSelfAudit_ByPagination(
    companyId: any,
    displayLength: any,
    displayStart: any,
    SearchDepartmentName: any,
    SearchCatName: any,
    SearchSubCatName: any,
    SearchAssetStatus: any,
    SearchAssetName: any,
    SearchAssetTagId: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/AssetAudit/GetAssetListForAuditRequestSelfAudit_ByPagination?companyId=" +
      companyId +
      "&displayLength=" +
      displayLength +
      "&displayStart=" +
      displayStart +
      "&SearchDepartmentName=" +
      SearchDepartmentName +
      "&SearchCatName=" +
      SearchCatName +
      "&SearchSubCatName=" +
      SearchSubCatName +
      "&SearchAssetStatus=" +
      SearchAssetStatus +
      "&SearchAssetName=" +
      SearchAssetName +
      "&SearchAssetTagId=" +
      SearchAssetTagId;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getAssetStatusList(page: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/assetmanagement/GetAssetStatusList/" + page;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_AssetStatusCount(): Observable<Object> {
    let url = environment.apiUrl + "api/AssetManagement/GetV2_AssetStatusCount";
    return this._http.post(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getDepriciationValue(
    PurchaseDate: any,
    PurchasePrice: any,
    ResidualAmount: any,
    lifespan: number,
    DisposeDate: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Workflow/GetDepriciationValue?PurchaseDate=" +
      PurchaseDate +
      "&PurchasePrice=" +
      PurchasePrice +
      "&ResidualAmount=" +
      ResidualAmount +
      "&lifespan=" +
      lifespan +
      "&DisposeDate=" +
      DisposeDate;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getDepriciatioSchedule(
    PurchaseDate: any,
    PurchasePrice: number,
    ResidualAmount: number,
    lifespan: number,
    DisposeDate: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Workflow/GetDepriciatioSchedule?PurchaseDate=" +
      PurchaseDate +
      "&PurchasePrice=" +
      PurchasePrice +
      "&ResidualAmount=" +
      ResidualAmount +
      "&lifespan=" +
      lifespan +
      "&DisposeDate=" +
      DisposeDate;
    return this._http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  public DownloadRptCommanAssetListPDf(
    companyId,
    SearchDepartmentName,
    SearchCatName,
    SearchSubCatName,
    SearchAssetStatus,
    SearchAssetName,
    SearchAssetTagId
  ): void {
    const tokenheader = new HttpHeaders({
      "Content-Type": "application/pdf",
      Authorization: "Bearer " + this.token,
    });
    this._http
      .get(
        environment.apiUrl +
        "api/StandardReport/GetRptCommanAssetList/pdf?companyId=" +
        companyId +
        "&SearchDepartmentName=" +
        SearchDepartmentName +
        "&SearchCatName=" +
        SearchCatName +
        "&SearchSubCatName=" +
        SearchSubCatName +
        "&SearchAssetStatus=" +
        SearchAssetStatus +
        "&SearchAssetName=" +
        SearchAssetName +
        "&SearchAssetTagId=" +
        SearchAssetTagId,
        {
          headers: tokenheader,
          responseType: "blob",
        }
      )
      .subscribe(
        (data) => this.downloadFilePDF(data, "AssetListReport.pdf"),
        (error) => { }
      );
    this.loading = false;
  }


  downloadGetAssetReport(payload: any): Observable<Blob> {
    
    return this._http.post(
      environment.apiUrl + "api/SMSReport/GetAssetReport",
      payload,
      {
        responseType: "blob", 
      }
    );
  }
  downloadrptAssetAuditPending(payload: any): Observable<Blob> {
    
    return this._http.post(
      environment.apiUrl + "api/StandardReport/GetRptAssetAuditPending",
      payload,
      {
        responseType: "blob", 
      }
    );
  }
  downloadFilePDF(data: any, filename: string): void {
    const blob = new Blob([data], { type: "application/octet-stream" });
    saveAs(blob, filename);
  }

  public DownloadRptCommanAssetListXL(
    companyId,
    SearchDepartmentName,
    SearchCatName,
    SearchSubCatName,
    SearchAssetStatus,
    SearchAssetName,
    SearchAssetTagId
  ): void {
    const tokenheader = new HttpHeaders({
      "Content-Type": "application/pdf",
      Authorization: "Bearer " + this.token,
    });
    this._http
      .get(
        environment.apiUrl +
        "api/StandardReport/GetRptCommanAssetList/xl?companyId=" +
        companyId +
        "&SearchDepartmentName=" +
        SearchDepartmentName +
        "&SearchCatName=" +
        SearchCatName +
        "&SearchSubCatName=" +
        SearchSubCatName +
        "&SearchAssetStatus=" +
        SearchAssetStatus +
        "&SearchAssetName=" +
        SearchAssetName +
        "&SearchAssetTagId=" +
        SearchAssetTagId,
        {
          headers: tokenheader,
          responseType: "blob",
        }
      )
      .subscribe(
        (data) => this.downloadFileXL(data, "AssetListReport.xls"),
        (error) => { }
      );
    this.loading = false;
  }
  downloadFileXL(data: any, filename: string): void {
    const blob = new Blob([data], { type: "application/octet-stream" });
    saveAs(blob, filename);
  }

  deleteAsset(payload) {
    let url = environment.apiUrl + "api/AssetManagement/V2_DeleteAsset";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  updateAssetImage(payload) {
    let url =
      environment.apiUrl + "api/AssetManagement/UpdateAssetImageProfile";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  updateAssetImage1(payload) {
    let url =
      environment.apiUrl + "api/AssetManagement/UpdateAssetImageProfile1";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  updateAssetImage2(payload) {
    let url =
      environment.apiUrl + "api/AssetManagement/UpdateAssetImageProfile2";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  updateAssetImage3(payload) {
    let url =
      environment.apiUrl + "api/AssetManagement/UpdateAssetImageProfile3";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  public GetRptAssetListV2(data): void {
    const tokenheader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.token,
    });
    this._http
      .post(environment.apiUrl + "api/StandardReport/GetRptAssetListV2", data, {
        headers: tokenheader,
        responseType: "blob",
      })
      .subscribe(
        (data) => this.downloadFilePDF(data, "AssetListReport.pdf"),
        (error) => { }
      );
  }

  getV2_MaintenanceWorkflowAudit(
    assetId: number,
    wfId: number,
    wfStatusId: number
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Workflow/GetWFActivityList_New/" +
      assetId +
      "/" +
      wfId +
      "/" +
      wfStatusId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
}
