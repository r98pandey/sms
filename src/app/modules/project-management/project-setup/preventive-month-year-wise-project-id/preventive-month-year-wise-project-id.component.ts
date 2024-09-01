


import { Component, OnInit, SimpleChanges, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { AuditService } from 'src/app/core/services/audit.service';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { CommonHttpServiceCallerService } from "src/app/core/services/common-http-service-caller.service";
import { PreventiveService } from 'src/app/core/services/preventive.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preventive-month-year-wise-project-id',
  templateUrl: './preventive-month-year-wise-project-id.component.html',
  styleUrl: './preventive-month-year-wise-project-id.component.scss'
})
export class PreventiveMonthYearWiseProjectIdComponent implements OnInit, OnChanges {
  customDataLabelsChart: any;
  apiUrl = environment.apiUrl;
  totalWorkingHours12Month_PreventiveList: any = [];
  totalWorkingHoursDetailList: any = [];
  totalWorkingHoursByTech_Preventive: any = []
  @Input() selectedIndexData: any
  label: any = "Attendance";
  breadCrumbItems: any = [
    { label: "Attendance" },
    { label: "Month-Year wise Attendance", active: true },
  ];
  currentIndex: any = -1;
  @Input() ProjectId:any;
  constructor(private ticketService: TicketService,
    private authService: AuthAssetService,
    private commonHttpServiceCallerService: CommonHttpServiceCallerService,
    private lightbox: Lightbox, private preventiveService: PreventiveService,
    private auditService: AuditService, private router: Router,) { }
  ngOnInit(): void {
    this.currentIndex = sessionStorage.getItem("PreventiveCurrentIndexWorkingHoursTop_ByProject") ? Number(sessionStorage.getItem("PreventiveCurrentIndexWorkingHoursTop_ByProject")) : 0;
    this.Get_V3_GetTotalWorkingHours12Month_Preventive();

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.currentIndex = sessionStorage.getItem("PreventiveCurrentIndexWorkingHoursTop_ByProject") ? Number(sessionStorage.getItem("PreventiveCurrentIndexWorkingHoursTop_ByProject")) : 0;
    this.Get_V3_GetTotalWorkingHours12Month_Preventive();


  }
  Get_V3_GetTotalWorkingHours12Month_Preventive() {
    let url = 'api/MaintentDash/Get_V3_GetTotalWorkingHours12Month_Preventive_ByProject'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, {  ProjectId:this.ProjectId}).subscribe((res: any) => {
      this.totalWorkingHours12Month_PreventiveList = res.list;
      if (res.list) {
        if (this.currentIndex) {
          this.callAfterClickYearMonth(this.currentIndex)

        } else {
          this.callAfterClickYearMonth(0)

        }
      }
    });
  }

  Get_V3_GetTotalWorkingHoursDetailList_Preventive(yearMonth) {
    let paylod = {
      yearMonth: yearMonth,
      ProjectId:this.ProjectId
    }
    let url = 'api/MaintentDash/Get_V3_GetTotalWorkingHoursDetailList_Preventive_ByProject'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.totalWorkingHoursDetailList = res.list;
    });
  }
  Get_V3_GetTotalWorkingHoursByTech_Preventive(yearMonth) {
    let paylod = {
      yearMonth: yearMonth,
      ProjectId:this.ProjectId
    }
    let url = 'api/MaintentDash/Get_V3_GetTotalWorkingHoursByTech_Preventive_ByProject'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.totalWorkingHoursByTech_Preventive = res.list;
    });
  }
  open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }
  openTicket(scheduleInfo: any) {
    if (scheduleInfo.taskType == 'Preventive') {
      // this.preventiveService.scheduleId = scheduleInfo.scheduleId;;
      // this.preventiveService.lastStorePreventiveRouterName = "maintenance-management/preventive/schedule/current-schedule"
      // this.router.navigate([
      //   "maintenance-management/preventive/schedule/current-schedule",
      // ]);
      this.preventiveService.scheduleId = scheduleInfo.scheduleId;
      this.preventiveService.lastStorePreventiveRouterName = "maintenance-management/attendance/task-attendance"
      this.router.navigate([
        "maintenance-management/preventive/schedule/current-schedule",
      ]);
    } else if (scheduleInfo.taskType == 'Audit') {
      this.auditService.auditId = scheduleInfo.scheduleId;;
      this.router.navigate(["asset-management/audit-management/audit/viewaudit"]);
    } else {

    }
  }


  callAfterClickYearMonth(index) {

    this.currentIndex = index
    this.selectedIndexData = this.totalWorkingHours12Month_PreventiveList[index];
    sessionStorage.setItem("PreventiveCurrentIndexWorkingHoursTop_ByProject", "" + index)
    this.Get_V3_GetTotalWorkingHoursByTech_Preventive(this.selectedIndexData.yearMonth);
    this.Get_V3_GetTotalWorkingHoursDetailList_Preventive(this.selectedIndexData.yearMonth);

  }

}
