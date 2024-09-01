import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PreventiveService {
  configPreventiveId: number = 0;
  preventiveCategoryId: number = 0;
  scheduleId: number = 0;
  accessRight: boolean = false;
 
  pageAction: any = null;

  lastStorePreventiveRouterName: any =
  "maintenance-management/preventive/schedule/list-schedule";

  constructor(private http: HttpClient, private _route: Router) { }

  getV2_MX_PM_ScheduleList_ServerPaging(data): Observable<Object> {
    let url =
      environment.apiUrl + "api/Prevent/GetV2_MX_PM_ScheduleList_ServerPaging";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  GetPreventiveStatusList(pageName): Observable<Object> {
    let url =
      environment.apiUrl + "api/Prevent/GetPreventiveStatusList/" + pageName;
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_MX_PM_ScheduleList_Calendor(data): Observable<Object> {
    let url =
      environment.apiUrl + "api/Prevent/GetV2_MX_PM_ScheduleList_Calendor";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MX_PM_ScheduleAndAsset(data): Observable<Object> {
    let url = environment.apiUrl + "api/Prevent/GetV2_MX_PM_ScheduleAndAsset";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  GetV2_MX_PM_ScheduleAndAssetCheckList(data): Observable<Object> {
    let url =
      environment.apiUrl + "api/Prevent/GetV2_MX_PM_ScheduleAndAssetCheckList";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getV2_MX_PM_ScheduleAndAssetCheckListByScheudleId(data): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Prevent/GetV2_MX_PM_ScheduleAndAssetCheckListByScheudleId";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MX_Config_PreventiveList_ServerPaging(data): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Prevent/GetV2_MX_Config_PreventiveList_ServerPaging";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_GetMX_PreventiveMaintenanceCategoryDrobDown(
    data: any
  ): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/V2_Master/GetMX_PreventiveMaintenanceCategoryDrobDown";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  DeactivteConfigSchedule(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Prevent/DeactivteConfigSchedule";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getMX_PreventiveMaintenanceTypeDrobDown(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/V2_Master/GetMX_PreventiveMaintenanceTypeDrobDown";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_MX_Config_PreventiveScheduleDetail(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Prevent/GetV2_MX_Config_PreventiveScheduleDetail";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getMX_ConfigScheduleCheckListSetup(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Prevent/GetMX_ConfigScheduleCheckListSetup";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }



  updateV2_MX_ScheduleAssetChecklist(data: any): Observable<Object> {
    let url =
      environment.apiUrl +
      "api/Maintenance/UpdateV2_MX_ScheduleAssetChecklist";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getTechnitionAttendanceListByTaskForSchedule(data: any) {
    let url =
      environment.apiUrl +
      "api/Prevent/GetTechnitionAttendanceListByTaskForSchedule";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  CreateMX_Config_Preventive(data: any) {
    let url = environment.apiUrl + "api/Prevent/CreateMX_Config_Preventive";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  createUpdateSchedueleChecklistConfiguration(data: any) {
    let url = environment.apiUrl + "api/Prevent/CreateUpdateSchedueleChecklistConfiguration";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  updateAssetIChecklistImage(data: any) {
    let url = environment.apiUrl + "api/Prevent/UpdateAssetIChecklistImage";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  updateAssetIChecklistImage1(data: any) {
    let url = environment.apiUrl + "api/Prevent/UpdateAssetIChecklistImage1";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  updateAssetIChecklistImage2(data: any) {
    let url = environment.apiUrl + "api/Prevent/UpdateAssetIChecklistImage2";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  getTestReport(scheduleId: number, RenderFormat: any): Observable<Blob> {
    const url = `${environment.apiUrl}api/SMSReport/GetTestReport`;
    const payload = { ScheduleId: scheduleId, RenderFormat: RenderFormat };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post<Blob>(url, payload, {
      headers: headers,
      responseType: "blob" as "json",
    });
  }

  InsertTechnitionforConfigSchedule(payload): Observable<any> {
    let url =
      environment.apiUrl + "api/Prevent/InsertTechnitionforConfigSchedule";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  DeleteTechnitionforConfigScheudle(payload): Observable<any> {
    let url =
      environment.apiUrl + "api/Prevent/DeleteTechnitionforConfigScheudle";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  InsertTechnitionforSchedule(payload): Observable<any> {
    let url = environment.apiUrl + "api/Prevent/InsertTechnitionforSchedule";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  DeleteTechnitionforScheudle(payload): Observable<any> {
    let url = environment.apiUrl + "api/Prevent/DeleteTechnitionforScheudle";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  // Payload ConfigPreventiveId
  getV2_MX_MaintenanceScheduleSkipList(payload): Observable<any> {
    let url = environment.apiUrl + "api/Prevent/GetV2_MX_MaintenanceScheduleSkipList";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  //   payload
  // ConfigPreventiveId
  deleteMX_MaintenanceScheduleSkip(payload): Observable<any> {
    let url = environment.apiUrl + "api/Prevent/DeleteMX_MaintenanceScheduleSkip";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  //   ConfigPreventiveId
  // SkipFlag
  createMX_MaintenanceScheduleSkip(payload): Observable<any> {
    let url = environment.apiUrl + "api/Prevent/CreateMX_MaintenanceScheduleSkip";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

//   payload
  // ScheduleItemChecklistId
  deleteV2_MX_ScheduleAssetChecklist(payload): Observable<any> {
    let url = environment.apiUrl + "api/Prevent/DeleteV2_MX_ScheduleAssetChecklist";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  
  createV2_MX_ScheduleAssetChecklist(payload): Observable<any> {
    let url = environment.apiUrl + "api/Prevent/CreateV2_MX_ScheduleAssetChecklist";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  updateScheduleVerification(payload): Observable<any> {
    let url = environment.apiUrl + "api/Prevent/UpdateScheduleVerification";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }




  getPreventiveStatusList(): Observable<any> {
    let url = environment.apiUrl + "api/Prevent/GetPreventiveStatusList/ConfigureScheduleStatus";
    return this.http.get(url, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  DeletSchduleMaintenance(payload): Observable<any> {
    let url = environment.apiUrl + "api/Prevent/DeletSchduleMaintenance";
    return this.http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  

}
