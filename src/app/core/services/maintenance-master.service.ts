
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthAssetService } from './auth-asset.service';
@Injectable({
    providedIn: 'root'
})
export class MaintenanceMasterService {
    private token: any;
    constructor(
        private _http: HttpClient,
        private _route: Router,
        private authService: AuthAssetService
    ) {
        this.token = this.authService.getAccessToken();
    }


    getTicketTypeList(): Observable<Object> {
        let url = environment.apiUrl + 'api/Master/GetMX_MasterTicketTypeList?IsDeviceRelated=' + true;
        return this._http.get(url, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        }
        );
    }
    getTicketTypeList_new(value): Observable<Object> {
        let url = environment.apiUrl + 'api/Master/GetMX_MasterTicketTypeList?IsDeviceRelated=' + value;
        return this._http.get(url, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        }
        );
    }
    getpreventCategoryList(data): Observable<Object> {
        let url = environment.apiUrl + 'api/Prevent/GetMX_PreventiveMaintenanceCategory_ByPagination';
        return this._http.post(url, data, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        }
        );
    }
    addTicketType(payload: any): Observable<Object> {
        let url = environment.apiUrl + 'api/Master/CreateMX_MasterTicketType';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        });
    }
    addPreventCategory(payload: any): Observable<Object> {
        let url = environment.apiUrl + 'api/Prevent/CreateMX_PreventiveMaintenanceCategory';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        });
    }

    updateTicketType(payload: any) {
        let url = environment.apiUrl + 'api/Master/UpdateMX_MasterTicketType';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        })
    }
    updatePreventCategory(payload: any) {
        let url = environment.apiUrl + 'api/Prevent/UpdateMX_PreventiveMaintenanceCategory';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        })
    }

    deleteTicketType(payload: any) {
        let url = environment.apiUrl + 'api/Master/DeleteMX_MasterTicketType';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        })
    }
    deletePreventCategory(payload: any) {
        let url = environment.apiUrl + 'api/Prevent/DeleteMX_PreventiveMaintenanceCategory';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        })
    }

    getTicketTypeIssueList(TiketTypeId): Observable<Object> {
        let url = environment.apiUrl + 'api/Master/GetTiketTypeIssueList?TiketTypeId=' + TiketTypeId;
        return this._http.get(url, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        }
        );
    }

    addTicketTypeIssue(payload: any): Observable<Object> {
        let url = environment.apiUrl + 'api/Master/CreateTiketTypeIssue';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        });
    }

    updateTicketTypeIssue(payload: any) {
        let url = environment.apiUrl + 'api/Master/UpdateTiketTypeIssue';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        })
    }

    deleteTicketTypeIssue(payload: any) {
        let url = environment.apiUrl + 'api/Master/DeleteTiketTypeIssue';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        })
    }

    getPreventiveTypeList(payload): Observable<Object> {
        let url = environment.apiUrl + 'api/Prevent/GetMX_PreventiveMaintenanceType_ByPagination';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        }
        );
    }

    getPreventiveCategory(payload): Observable<Object> {
        let url = environment.apiUrl + 'api/V2_Master/GetMX_PreventiveMaintenanceCategoryDrobDown';        
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        }
        );
    }

    addPreventiveType(payload: any): Observable<Object> {
        let url = environment.apiUrl + 'api/Prevent/CreateMX_PreventiveMaintenanceType';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        });
    }

    updatePreventiveType(payload: any) {
        let url = environment.apiUrl + 'api/Prevent/UpdateMX_PreventiveMaintenanceType';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        })
    }

    deletePreventiveType(payload: any) {
        let url = environment.apiUrl + 'api/Prevent/DeleteMX_PreventiveMaintenanceType';
        return this._http.post(url, payload, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + this.token)
        })
    }
}
