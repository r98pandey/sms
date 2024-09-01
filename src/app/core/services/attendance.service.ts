import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AttendanceService {
  constructor(private http: HttpClient) {}
  getV2_DailyAttendance_ByPagination(data: any): Observable<Object> {
    let url =
      environment.apiUrl + "api/Maintenance/GetV2_DailyAttendance_ByPagination";
    return this.http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_StaffDailyAttendanceCount() {
    let url = environment.apiUrl + "api/MaintentDash/GetV2_StaffDailyAttendanceCount";
    return this.http.get(url, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
    });
  }

  GetV2_StaffAbsentList(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/Maintenance/GetV2_StaffAbsentList";
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
    });
  }
  
  getDailyAttendanceReport(payload: any): Observable<Blob> {
    return this.http.post(
      environment.apiUrl + "api/SMSReport/GetDailyAttendanceReport",
      payload,
      {
        responseType: "blob", 
      }
    );
  }
}
