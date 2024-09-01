import { Injectable } from "@angular/core";
import { AuthAssetService } from "./auth-asset.service";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AssetDashboardService {
  token: string = "";

  constructor(
    private _http: HttpClient,
    private _route: Router,
    private authService: AuthAssetService
  ) {
    this.token = this.authService.getAccessToken();
  }

  getAllAssetData(companyId?: number | undefined | null) {
    let payload = {
      "displayLength": 10,
      "displayStart": 0
    };
    
    if(companyId){
      payload['SearchCompanyId'] = companyId;
    }
    
    let url = environment.apiUrl + "api/AssetDash/GetV2_AssetAllCountAndGraphAPI";
    return this._http.post(url, payload, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
}
