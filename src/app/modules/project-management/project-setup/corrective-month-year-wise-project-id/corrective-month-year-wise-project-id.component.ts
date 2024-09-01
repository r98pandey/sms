


import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { AuditService } from 'src/app/core/services/audit.service';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { CommonHttpServiceCallerService } from "src/app/core/services/common-http-service-caller.service";
import { PreventiveService } from 'src/app/core/services/preventive.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-corrective-month-year-wise-project-id',
  templateUrl: './corrective-month-year-wise-project-id.component.html',
  styleUrl: './corrective-month-year-wise-project-id.component.scss'
})
export class CorrectiveMonthYearWiseProjectIdComponent implements OnInit, OnChanges {
  customDataLabelsChart: any;
  apiUrl = environment.apiUrl;
  totalWorkingHours12Month_CorrectiveList: any = [];
  totalWorkingHoursDetailList: any = [];
  totalWorkingHoursByTech_Corrective: any = []
  selectedIndexData: any
  label: any = "Attendance";
  @Input()   ProjectId:any;
  breadCrumbItems: any = [
    { label: "Attendance" },
    { label: "Month-Year wise Attendance", active: true },
  ];
  currentIndex: any = -1;
  constructor(private ticketService: TicketService,
    private authService: AuthAssetService,
    private commonHttpServiceCallerService: CommonHttpServiceCallerService,
    private lightbox: Lightbox, private preventiveService: PreventiveService,
    private auditService: AuditService, private router: Router,) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.currentIndex = sessionStorage.getItem("CorrectiveCurrentIndexWorkingHoursTop_ByProject") ? Number(sessionStorage.getItem("CorrectiveCurrentIndexWorkingHoursTop_ByProject")) : 0;
    this.Get_V3_GetTotalWorkingHours12Month_Corrective();

  }
  Get_V3_GetTotalWorkingHours12Month_Corrective() {
    let url = 'api/MaintentDash/Get_V3_GetTotalWorkingHours12Month_Corrective_ByProject'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, {  ProjectId:this.ProjectId}).subscribe((res: any) => {
      this.totalWorkingHours12Month_CorrectiveList = res.list;
      if (res.list) {
        if (this.currentIndex) {
          this.callAfterClickYearMonth(this.currentIndex)

        } else {
          this.callAfterClickYearMonth(0)

        }
      }
    });
  }
  ngOnInit(): void {
    this.currentIndex = sessionStorage.getItem("CorrectiveCurrentIndexWorkingHoursTop_ByProject") ? Number(sessionStorage.getItem("CorrectiveCurrentIndexWorkingHoursTop_ByProject")) : 0;
    this.Get_V3_GetTotalWorkingHours12Month_Corrective();

  }

  Get_V3_GetTotalWorkingHoursDetailList_Corrective(yearMonth) {
    let paylod = {
      yearMonth: yearMonth,
      ProjectId:this.ProjectId
    }
    let url = 'api/MaintentDash/Get_V3_GetTotalWorkingHoursDetailList_Corrective_ByProject'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.totalWorkingHoursDetailList = res.list;
    });
  }
  Get_V3_GetTotalWorkingHoursByTech_Corrective(yearMonth) {
    let paylod = {
      yearMonth: yearMonth,
      ProjectId:this.ProjectId
    }

    let url = 'api/MaintentDash/Get_V3_GetTotalWorkingHoursByTech_Corrective_ByProject'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.totalWorkingHoursByTech_Corrective = res.list;
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


  openTicket(ticketInfo: any) {

    if (ticketInfo.taskType == 'Corrective') {
      this.ticketService.sendTicketId = ticketInfo.ticketId;

      this.ticketService.ticketPageAction = "Basic Service Page";
      this.ticketService.lastStoreTicketRouterName =
        "maintenance-management/attendance/task-attendance";
      localStorage.setItem(
        "lastStoreTicketRouterName",
        this.ticketService.lastStoreTicketRouterName
      );
      this.router.navigate([
        "/maintenance-management/corrective/ticket/ticket-view",
      ]);
    } else if (ticketInfo.taskType == 'Preventive') {
      this.preventiveService.scheduleId = ticketInfo.ticketId;;
      this.preventiveService.lastStorePreventiveRouterName = "maintenance-management/attendance/task-attendance"
      this.router.navigate([
        "maintenance-management/preventive/schedule/current-schedule",
      ]);
    } else if (ticketInfo.taskType == 'Audit') {
      this.auditService.auditId = ticketInfo.ticketId;;
      this.router.navigate(["asset-management/audit-management/audit/viewaudit"]);
    } else {

    }
  }


  callAfterClickYearMonth(index) {
    this.currentIndex = index
    this.selectedIndexData = this.totalWorkingHours12Month_CorrectiveList[index]
    sessionStorage.setItem("CorrectiveCurrentIndexWorkingHoursTop_ByProject", "" + index)
    this.Get_V3_GetTotalWorkingHoursByTech_Corrective(this.selectedIndexData.yearMonth);
    this.Get_V3_GetTotalWorkingHoursDetailList_Corrective(this.selectedIndexData.yearMonth);

  }

}
