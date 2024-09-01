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
export class FileManagementService {
  rItem: {};
  private token: any;
  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthAssetService
  ) {}
  getV2_MasterFolderList(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/FileManager/GetV2_MasterFolderList";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_CreateMasterFolder(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/FileManager/GetV2_CreateMasterFolder";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_FileList(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/FileManager/GetV2_FileList";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_FolderFileTotalCountByProject(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/FileManager/GetV2_FolderFileTotalCountByProject";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_CreateV2_File(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/FileManager/GetV2_CreateV2_File";
    return this._http.post(url, data);
  }


  // public DownloadFile(payload, name): void {
  //   const tokenheader = new HttpHeaders({
  //     "Content-Type": "application/pdf",
  //     Authorization: "Bearer " + this.token,
  //   });
  //   this._http
  //     .post(
  //       environment.apiUrl + "api/FileManager/DownloadFileFileManager",
  //       payload
  //     )
  //     .subscribe(
  //       (data) => this.downloadFileXL(data, name),
  //       (error) => {}
  //     );
  // }
  // downloadFileXL(data: any, filename: string): void {
  //   const blob = new Blob([data], { type: "application/pdf" });
  //   saveAs(blob, filename);
  // }

  downloadFile(payload: any): Observable<Blob> {
    // Make a GET request to the API endpoint
    return this._http.post(
      environment.apiUrl + "api/FileManager/DownloadFileFileManager",
      payload,
      {
        responseType: "blob", // Ensure response is treated as a Blob
      }
    );
  }
}
