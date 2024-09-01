

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthAssetService } from './auth-asset.service';


@Injectable({
  providedIn: "root",
})
export class ProjectScheduleService {

  sendProjectScheduleId: any = 0;
  accceesGrroup: boolean = false
  projectScheduleObject: any = {};

  constructor(
    private _http: HttpClient,
  ) {
  }

  getV2_MX_ProjectScheduleList_ServerPaging(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectScheduleList_ServerPaging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  createV2_MX_ProjectSchedule(payload: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_MX_ProjectSchedule";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  // payload "DisplayLength": 10, "DisplayStart": 0,"SearchProjectScheduleId":1
  // Optional
  // SearchTaskTitle
  // SearchProjectTaskStatusId

  getV2_MX_ProjectScheduleTaskList_ServerPaging(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectScheduleTaskList_ServerPaging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // payload
  //ProjectTaskId

  getV2_MX_ProjectScheduleTaskDetail(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectScheduleTaskDetail";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  GetV2_UpdateMX_ProjectTaskStatus(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_UpdateMX_ProjectTaskStatus";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }GetV2_UpdateMX_ProjectSubTaskStatus(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_UpdateMX_ProjectSubTaskStatus";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  // payload
  //ProjectScheduleId

  getV2_MX_ProjectScheduleDetail(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectScheduleDetail";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  // payload
  //ProjectScheduleId

  getV2_MX_ProjectSubTaskList(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/getV2_MX_ProjectSubTaskList";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  //Payload
  //ProjectSubTaskId
  getV2_MX_ProjectScheduleSubTaskDetail(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectScheduleSubTaskDetail";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }



  // payload
  // ProjectTaskId
  getV2_MX_ProjectTaskDetail_SubTaskList(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectTaskDetail_SubTaskList";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  // payload
  // TaskId
  getV2_TaskProgressupdatelist(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_TaskProgressupdatelist";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  // payload
  // SubTaskId
  getV2_SubTaskProgressupdatelist(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_SubTaskProgressupdatelist";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  createV2_SubTaskProgressupdate(payload: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_SubTaskProgressupdate";
    return this._http.post(url, payload);
  }
  CreateV2_TaskProgressupdate(payload: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_TaskProgressupdate";
    return this._http.post(url, payload);
  }


  // getV2_MX_ProjectSubTaskList(payload: any) {
  //   let url =
  //     environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectSubTaskList";
  //   return this._http.post(url, payload, {
  //     headers: new HttpHeaders().set("Content-Type", "application/json"),
  //   });
  // }



  // Payload projectScheduleId
  deleteV2_ProjectScheduleTaskList(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/DeleteV2_ProjectScheduleTaskList";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }


  createV2_MX_ProjectScheduleTask(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_MX_ProjectScheduleTask";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  createV2_MX_ProjectScheduleSubTask(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_MX_ProjectScheduleSubTask";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  //sub task

  GetV2_MX_ProjectScheduleSubTaskChildList_ServerPaging(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectScheduleSubTaskChildList_ServerPaging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  CreateV2_MX_ProjectSubTaskChildTask(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_MX_ProjectSubTaskChildTask";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  GetV2_MX_ProjectScheduleSubTaskChildDetail(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectScheduleSubTaskChildDetail";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  GetV2_MX_ProjectScheduleSubTaskChildMemberList(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectScheduleSubTaskChildMemberList";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  //   payload ScheduleNo TaskId Remark FileType file
  createV2_ProjectTaskAttachement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_ProjectTaskAttachement";
    return this._http.post(url, data);

  }
  //payload TaskId
  getV2_ProjectTaskAttachementlist(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_ProjectTaskAttachementlist";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  //   payload ScheduleNo SubTaskId Remark FileType file
  createV2_ProjectSubTaskAttachement(data: any): Observable<Object> {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_ProjectSubTaskAttachement";
    return this._http.post(url, data);

  }
  
  //payload SubTaskId
  getV2_ProjectSubTaskAttachementlist(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_ProjectSubTaskAttachementlist";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  //Payload ProjectTaskId
 

  GetV2_ProjectTaskStartEndCondition(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_ProjectTaskStartEndCondition";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  } 

//   Payload
// ProjectTaskId
GetV2_MX_ProjectTaskMembersList(payload: any) {
  let url =
    environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectTaskMembersList";
  return this._http.post(url, payload, {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
  });
} 
GetV2_MX_ProjectSubTaskMembersList(payload: any) {
  let url =
    environment.apiUrl + "api/ProjectManagement/GetV2_MX_ProjectSubTaskMembersList";
  return this._http.post(url, payload, {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
  });
} 
//ProjectTaskStatusUpdatePortal  ,ProjectTaskStatusUpdatePortal 
getProjectManagementStatus(type: any) {
  let url =
    environment.apiUrl + "api/ProjectManagement/GetProjectManagementStatus/"+type;
  return this._http.get(url, {
    headers: new HttpHeaders().set("Content-Type", "application/json"),
  });
} 




  CreateV2_MX_ProjectTaskMembers(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_MX_ProjectTaskMembers";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  CreateV2_MX_ProjectSubTaskMembers(data: any) {
    let url = environment.apiUrl + "api/ProjectManagement/CreateV2_MX_ProjectSubTaskMembers";
    return this._http.post(url, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }




  CreateV2_MX_TechAttendanceProject_Start(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/CreateV2_MX_TechAttendanceProject_Start";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }
  UpdateV2_MX_TechAttendanceProject_End(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/UpdateV2_MX_TechAttendanceProject_End";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  getV2_TechAttendanceTaskSubTaskList_ServerPaging(payload: any) {
    let url =
      environment.apiUrl + "api/ProjectManagement/GetV2_TechAttendanceTaskSubTaskList_ServerPaging";
    return this._http.post(url, payload, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  } 
  

}


