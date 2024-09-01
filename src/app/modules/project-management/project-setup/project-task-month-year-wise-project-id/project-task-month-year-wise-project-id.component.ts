



import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { AuditService } from 'src/app/core/services/audit.service';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { CommonHttpServiceCallerService } from "src/app/core/services/common-http-service-caller.service";
import { PreventiveService } from 'src/app/core/services/preventive.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { ProjectScheduleViewSubTaskSingleComponent } from 'src/app/modules/project-management/my-task/project-schedule-view-sub-task-single/project-schedule-view-sub-task-single.component';
import { ProjectTaskDetailsComponent } from 'src/app/modules/project-management/task-management/project-task-details/project-task-details.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-project-task-month-year-wise-project-id',
  templateUrl: './project-task-month-year-wise-project-id.component.html',
  styleUrl: './project-task-month-year-wise-project-id.component.scss'
})
export class ProjectTaskMonthYearWiseProjectIdComponent implements OnInit, OnChanges {
  customDataLabelsChart: any;
  apiUrl = environment.apiUrl;
  totalWorkingHours12Month_ProjectTaskList: any = [];
  totalWorkingHoursDetailList: any = [];
  totalWorkingHoursByTech_ProjectTask: any = []
  selectedIndexData: any
  label: any = "Attendance";
  @Input() ProjectId:any
  breadCrumbItems: any = [
    { label: "Attendance" },
    { label: "Month-Year wise Attendance", active: true },
  ];
  currentIndex: any = -1;
  constructor(private ticketService: TicketService,
    private authService: AuthAssetService,
    private commonHttpServiceCallerService: CommonHttpServiceCallerService,
    private lightbox: Lightbox, private preventiveService: PreventiveService,
    private auditService: AuditService, private router: Router,  private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.currentIndex = sessionStorage.getItem("ProjectTaskCurrentIndexWorkingHoursTop_ByProject") ? Number(sessionStorage.getItem("ProjectTaskCurrentIndexWorkingHoursTop_ByProject")) : 0;
    this.Get_V3_GetTotalWorkingHours12Month_ProjectTask();

  }
  Get_V3_GetTotalWorkingHours12Month_ProjectTask() {
    let url = 'api/MaintentDash/Get_V3_GetTotalWorkingHours12Month_ProjectTask_ByProject'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, {
      ProjectId:this.ProjectId
    }).subscribe((res: any) => {
      this.totalWorkingHours12Month_ProjectTaskList = res.list;
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
    this.currentIndex = sessionStorage.getItem("ProjectTaskCurrentIndexWorkingHoursTop_ByProject") ? Number(sessionStorage.getItem("ProjectTaskCurrentIndexWorkingHoursTop_ByProject")) : 0;
    this.Get_V3_GetTotalWorkingHours12Month_ProjectTask();

  }
  

  Get_V3_GetTotalWorkingHoursDetailList_ProjectTask(yearMonth) {
    let paylod = {
      yearMonth: yearMonth,
      ProjectId:this.ProjectId
    }
    let url = 'api/MaintentDash/Get_V3_GetTotalWorkingHoursDetailList_ProjectTask_ByProject'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.totalWorkingHoursDetailList = res.list;
    });
  }
  Get_V3_GetTotalWorkingHoursByTech_ProjectTask(yearMonth) {
    let paylod = {
      yearMonth: yearMonth,
      ProjectId:this.ProjectId
    }

    let url = 'api/MaintentDash/Get_V3_GetTotalWorkingHoursByTech_ProjectTask_ByProject'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, paylod).subscribe((res: any) => {
      this.totalWorkingHoursByTech_ProjectTask = res.list;
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

    if (ticketInfo.taskType == 'ProjectTask') {
      this.ticketService.sendTicketId = ticketInfo.ticketId;

      this.ticketService.ticketPageAction = "Basic Service Page";
      this.ticketService.lastStoreTicketRouterName =
        "maintenance-management/attendance/task-attendance";
      localStorage.setItem(
        "lastStoreTicketRouterName",
        this.ticketService.lastStoreTicketRouterName
      );
      this.router.navigate([
        "/maintenance-management/ProjectTask/ticket/ticket-view",
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
    this.selectedIndexData = this.totalWorkingHours12Month_ProjectTaskList[index]
    sessionStorage.setItem("ProjectTaskCurrentIndexWorkingHoursTop", "" + index)
    this.Get_V3_GetTotalWorkingHoursByTech_ProjectTask(this.selectedIndexData.yearMonth);
    this.Get_V3_GetTotalWorkingHoursDetailList_ProjectTask(this.selectedIndexData.yearMonth);

  }

  openViewHandleTask(projectTaskId, projectScheduleObject): void {
    this.commonHttpServiceCallerService.letOpenOffCancvas = true
    const modalRef = this.offcanvasService.open(ProjectTaskDetailsComponent, {
      scroll: false,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4",
    });
    modalRef.componentInstance.ProjectTaskId = projectTaskId;
    modalRef.componentInstance.projectScheduleObject = projectScheduleObject;
    modalRef.result
      .then((result) => {
        setTimeout(() => {
          this.Get_V3_GetTotalWorkingHours12Month_ProjectTask()
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.commonHttpServiceCallerService.letOpenOffCancvas = false
          this.resetScroll();
        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
          this.Get_V3_GetTotalWorkingHours12Month_ProjectTask()
          this.offcanvasService.dismiss();
          this.commonHttpServiceCallerService.letOpenOffCancvas = false
          this.modalService.dismissAll()
          this.resetScroll();
        }, 100);
      });



  }
  openViewHandleSubTask(projectTaskId,projectSubTaskId, projectScheduleObject): void {
    this.commonHttpServiceCallerService.letOpenOffCancvas=true
    const modalRef = this.offcanvasService.open(ProjectScheduleViewSubTaskSingleComponent, {
      scroll: false,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas4",
    });
    modalRef.componentInstance.ProjectTaskId = projectTaskId;
    modalRef.componentInstance.projectSubTaskId = projectSubTaskId;
    modalRef.componentInstance.projectScheduleObject = projectScheduleObject;
  
    modalRef.result
      .then((result) => {
        setTimeout(() => {
          this.Get_V3_GetTotalWorkingHours12Month_ProjectTask()
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.commonHttpServiceCallerService.letOpenOffCancvas=false
          this.resetScroll();
        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
          this.Get_V3_GetTotalWorkingHours12Month_ProjectTask()
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.commonHttpServiceCallerService.letOpenOffCancvas=false
          this.resetScroll();
        }, 100);
      });



  }
  resetScroll() {
    document.body.style.overflow = 'auto';
  }

}
