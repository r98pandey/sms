import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientDashbaordService {

  constructor(private _http: HttpClient, private _route: Router) { }

  getV2_MyTaskRulesActiveCount(): Observable<Object> {
    let url = environment.apiUrl + 'api/MaintentDash/GetV2_MyTaskRulesActiveCount';
    return this._http.post(url, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')

    });
  }

}
