import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceOrderService {
  private token: any;
  sendServicOrderId: any = null;
  lastStoreRouterDashboardName = '/maintenance-management/dashboard/help-desk-dashboard';

  constructor(private http: HttpClient) { }

  getWoList(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Maintenance/GetV2_WOList_ByPagination';
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')

    });
  }
  getV2_ServiceOrderDetailOnly(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Maintenance/GetV2_ServiceOrderDetailOnly';
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')

    });
  }
  updateExpStarWorkDateTime(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Maintenance/UpdateExpStarWorkDateTime';
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')

    });
  }

  getTechnitionAttendanceListByTaskForSeerviceOrder(data: any) {
    let url = environment.apiUrl + 'api/Maintenance/GetTechnitionAttendanceListByTaskForSeerviceOrder';
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')

    })
  } 
  getTechnitionAttendanceListByTaskForPreventive(data: any) {
    let url = environment.apiUrl + 'api/Maintenance/GetTechnitionAttendanceListByTaskForPreventive';
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')

    })
  } 

  getV2_TotalCountServiceOrderOnly() {
    let url = environment.apiUrl + 'api/MaintentDash/GetV2_TotalCountServiceOrderOnly';
    return this.http.post(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')

    })
  }
  endServiceOrder(payload: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Maintenance/EndServiceOrder';
    return this.http.post(url, payload, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });
  }
  getMaintenanceStatus(page: any) {
    let url = environment.apiUrl + 'api/Maintenance/GetMaintenanceStatus/' + page
    return this.http.get(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')

    })
  }

  getStartServiceOrder(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Maintenance/StartServiceOrder';
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }
  StartTaskPreventive(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/StartTaskPreventive';
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }
  EndTaskPreventive(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/EndTaskPreventive';
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }
  StartTechTaskPreventive(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/StartTechTaskPreventive';
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }
  EndTechTaskPreventive(data: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/EndTechTaskPreventive';
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }
  
    


  StartTechTask(payload: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Maintenance/StartTechTask';
    return this.http.post(url, payload, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });
  }


  EndTechTask(payload: any): Observable<Object> {
    let url = environment.apiUrl + 'api/Maintenance/EndTechTask';
    return this.http.post(url, payload, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });
  }
  GetV2_TechnitionsAttendanceTransaction(payload: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/GetV2_TechnitionsAttendanceTransaction';
    return this.http.post(url, payload, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });
  }
  GetPreventiveTaskAvailablity(payload: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/GetPreventiveTaskAvailablity';
    return this.http.post(url, payload, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });
  } 
   getTechnitionAttendanceTransactionDetailPreventive(payload: any): Observable<Object> {
    let url = environment.apiUrl + 'api/FmsMobileApp/GetTechnitionAttendanceTransactionDetailPreventive';
    return this.http.post(url, payload, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });
  }
  
  
}
