
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {
  cItem: {};
  cId: number;
  rolename: any;
  private token: any;
  constructor(private _http: HttpClient, private _route: Router, private authService: AuthAssetService) {
    this.token = this.authService.getAccessToken();
    this.rolename = this.authService.getRole();
  }

  getAccessGroupMenuSubMenu(): Observable<Object> {
    let url = environment.apiUrl + 'api/AppSetting/GetAccessGroupMenuSubMenu';
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.token)
    });
  }

  GetVR_PurposeOfVisit(): Observable<Object> {
    let url =
      environment.apiUrl + "api/VisitorRecidentSetting/GetVR_PurposeOfVisit";
    return this._http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.token),
    });
  }
  getvalueObjectreturn(link) {
    let isSuperAdmin =
      String(this.authService.getRole()).trim().toLocaleLowerCase() ===
      String("Super Admin").trim().toLocaleLowerCase();
    if (!isSuperAdmin) {
      let returndata = null;
      const data = JSON.parse(localStorage.getItem("menuItems"));
      if (data) {
        returndata = data.find((element) => element.link === link);
        if (!returndata) {
          data.forEach((element) => {
            const subMenuItem = element.subMenuList.find(
              (subElement) => subElement.link === link
            );
            if (subMenuItem) {
              returndata = subMenuItem;
              return;
            }
          });
        }
      }
      // //console.log("returndata", returndata);
      return returndata || {};
    }
    else {
      return  {
        access: true,
        accessGroupMasterId: 0,
        accessGroupSubMenuId: 0,
        add: true,
        delete: true,
        edit: true,
        icon: null,
        label: '',
        link: '',
        menuId: 0,
        reportPrint: true,
        reportView: true,
        seq: 0,
        subMenuId: 0,
      }

    }
  }
}

