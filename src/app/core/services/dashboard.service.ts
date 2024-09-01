import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { AuthAssetService } from './auth-asset.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  dotoItem:{};
  viewItem:{};
  seeMore:{};
  veiwDetails:{};
  checkerPage:string;
  _masterWorkflowId:number;
  _approverType:string;
  statusType:string;
  private token: any;
  loading: any;
  constructor(private _http: HttpClient, private _route: Router, private authService: AuthAssetService,
    
    ) {
    this.token = this.authService.getAccessToken();
  }
  getTodolist(companyId:any): Observable<Object> {
    let url = environment.apiUrl + 'api/Workflow/DashboardTodolist/'+companyId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getDashboardTodoListDetails(approverType:any,masterWorkflowId:any): Observable<Object> {
    let url = environment.apiUrl + 'api/Workflow/DashboardTodoListDetails/'+approverType+'/'+masterWorkflowId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getAssetProfileDetails(assetId:any): Observable<Object> {
    let url = environment.apiUrl + 'api/Workflow/GetAssetProfileDetails/'+assetId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getDisposeReportBatch(masterDisposeTransactionId:any): Observable<Object> {
    let url = environment.apiUrl + 'api/DisposableAsset/GetDisposeReportBatch/'+masterDisposeTransactionId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/pdf')
        .set('Authorization', 'Bearer ' + this.token)
    } );
  }

  
  public DownloadProfileListReportSuresh(masterDisposeTransaction): void {

    const tokenheader = new HttpHeaders({
      'Content-Type': 'application/pdf',
      Authorization: 'Bearer ' +  this.token
    });
    this._http
      .get(
        environment.apiUrl +
          "api/StandardReport/GetDisposeReportBatch/" +
          masterDisposeTransaction,
        {
          headers: tokenheader,
          responseType: "blob",
        }
      )
      .subscribe(
        (data) => this.downloadFile(data, "BatchCertificate.pdf"),
        (error) => {}
      );
        this.loading=false;

  }
  downloadFile(data: any, filename: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  }

    
  public DownloadGetDisposeReportCert(masterDisposeTransaction,asssetDisposableId): void {
    //console.log(masterDisposeTransaction)
    const tokenheader = new HttpHeaders({
      "Content-Type": "application/pdf",
      Authorization: "Bearer " + this.token,
    });

    this._http
      .get(
        environment.apiUrl +
          "api/StandardReport/GetDisposeReportCert/" +
          masterDisposeTransaction +
          "/" +
          asssetDisposableId,
        {
          headers: tokenheader,
          responseType: "blob",
        }
      )
      .subscribe(
        (data) => this.downloadDisposeReportCert(data, "DisposeReportCert.pdf"),

        (error) => {
          //console.log(error);
        }
      );
    this.loading = false;
  }
  downloadDisposeReportCert(data: any, filename: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    saveAs(blob, filename);
    
  }
  getDisposeReportBatchDownload(masterDisposeTransactionId:any): Observable<Object> {
    let url = environment.apiUrl + 'api/StandardReport/GetDisposeReportBatch/'+masterDisposeTransactionId;
    return this._http.get(url,{
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getDashboadStatusCount(companyId:any): Observable<Object> {
    let url = environment.apiUrl + 'api/Workflow/GetDashboadStatusCount/'+companyId;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  getDashboardTodoListDetails_Paging(companyId:any,masterWorkflowId:any,approverType:any,displayLength:any,displayStart:any): Observable<Object> {
    let url = environment.apiUrl + 'api/Workflow/DashboardTodoListDetails_Paging?companyId='+companyId+'&masterWorkflowId='+masterWorkflowId+'&approverType='+approverType+'&displayLength='+displayLength+'&displayStart='+displayStart;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
  getLoanReturnAsset_ByPagination(companyId:any,assignType:any,displayLength:any,displayStart:any,SearchDepartmentName:any,SearchEmpName:any,SearchAssetName:any): Observable<Object> {
    let url = environment.apiUrl + 'api/AssetManagement/GetLoanReturnAsset_ByPagination?companyId='+companyId+'&assignType='+assignType +'&displayLength='+displayLength+'&displayStart='+displayStart+'&SearchDepartmentName='+SearchDepartmentName+'&SearchEmpName='+SearchEmpName+'&SearchAssetName='+SearchAssetName;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }
 
}