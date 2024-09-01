

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: "root",
})
export class CommonHttpServiceCallerService {
  cItem: any = {};
  clientId: any;
  addAccess: boolean = false;
  myTaskSendObject = {}
  letOpenOffCancvas:boolean=false;
  private token: any;
  constructor(
    private _http: HttpClient,
    private _route: Router,

  ) { }

  getWithoutParmaMethod(sendUrl: any): Observable<Object> {
    let url =
      environment.apiUrl + sendUrl;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }
  getWithParmaMethod(sendUrl: any, parm: any): Observable<Object> {
    let url =
      environment.apiUrl + sendUrl + parm;
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")

    });
  }
  //FormData
  postWithFormDataMethod(sendUrl, data: any): Observable<Object> {
    let url = environment.apiUrl + sendUrl;
    return this._http.post(url, data);
  }


  postWithJsonDataMethod(sendUrl, data: any) {
    let url = environment.apiUrl + sendUrl;
    return this._http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
    });
  }
  downloadFile(url: string, filename: string): Observable<void> {
    return this._http.get(url, { responseType: 'blob' }).pipe(
      map((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
    );
  }
  // Payload
  // FileURL
  downloadFileWithApi(payload: any): Observable<Blob> {
    // Make a GET request to the API endpoint
    return this._http.post(
      environment.apiUrl + "api/ProjectManagement/DownloadFile",
      payload,
      {
        responseType: "blob", // Ensure response is treated as a Blob
      }
    );
  }


  downloadTikcetFile(payload: any): Observable<Blob> {
    // Make a GET request to the API endpoint
    return this._http.post(
      environment.apiUrl + "api/Maintenance/DownloadTikcetFile",
      payload,
      {
        responseType: "blob", // Ensure response is treated as a Blob
      }
    );
  }


}



