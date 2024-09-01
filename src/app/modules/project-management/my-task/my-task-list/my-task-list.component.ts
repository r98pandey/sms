


import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { elementAt, map } from 'rxjs/operators';
import { circle, latLng, tileLayer } from 'leaflet';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { Task } from '../my-task-interface'
import { forEach } from 'lodash';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { ViewEventFullDetailsComponent } from '../../project-setup/view-event-full-details/view-event-full-details.component';
import { NgbModal, NgbNavChangeEvent, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProjectTaskDetailsComponent } from '../../task-management/project-task-details/project-task-details.component';
import { NavigationStart, Router } from '@angular/router';
import { Location } from '@angular/common';
import { event } from 'jquery';
@Component({
  selector: 'app-my-task-list',
  templateUrl: './my-task-list.component.html',
  styleUrl: './my-task-list.component.scss'
})
export class MyTaskListComponent implements OnInit, OnDestroy {
  myDailyAttendanceWorkingHours: Task[];
  activeIdTop: number = 1;
  GaugeChart: any;
  officeFormattedTime: string = '00 hrs : 00 min';
  homeFormattedTime: string = '00 hrs : 00 min';
  grandTotalFormattedTime: string = '00 hrs : 00 min';
  onSiteFormattedTime: string = '00 hrs : 00 min';
  currentMonthName: any = ''
  myTasKDocumentSubmissionProcess: any = [
    {
      "count": 0,
      "sequence": 2,
      "projectProcessId": 1,
      "nameOfProcess": "countTendeDocumentSubmition_IsVerified",
      "type": "IsVerified",
      "projectProcessHeaderDocStatusId": 72,
      "name": "Tender Document Submission - Verify",
      "remark": "The tender document submission is in the verification queue. Kindly verify."
    },
    {
      "count": 0,
      "sequence": 2,
      "projectProcessId": 1,
      "nameOfProcess": "countTendeDocumentSubmition_IsAcknowledge",
      "type": "IsAcknowledgement",
      "projectProcessHeaderDocStatusId": 61,
      "name": "Tender Document Submission - Acknowledge",
      "remark": "Acknowledgment is required for the tender document submitted."
    },
    {
      "count": 0,
      "sequence": 2,
      "projectProcessId": 1,
      "nameOfProcess": "countTendeDocumentSubmition_IsApprove",
      "type": "IsApprove",
      "projectProcessHeaderDocStatusId": 106,
      "name": "Tender Document Submission - Approval",
      "remark": "Waiting for approval of the submitted tender document."
    },
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 2,
      "nameOfProcess": "countSiteVisit_IsVerified",
      "type": "IsVerified",
      "projectProcessHeaderDocStatusId": 72,
      "name": "Site Visit-Verify",
      "remark": "Kindly check the Site Visit document and Verify it."
    },
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 2,
      "nameOfProcess": "countSiteVisit_IsAcknowledge",
      "type": "IsAcknowledgement",
      "projectProcessHeaderDocStatusId": 61,
      "name": "Site Visit-Acknowledge",
      "remark": "Acknowledge the Site Visit document submitted so that we can proceed with the next steps in the process."
    },
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 2,
      "nameOfProcess": "countSiteVisit_IsApprove",
      "type": "IsApprove",
      "projectProcessHeaderDocStatusId": 106,
      "name": "Site Visit - Approval",
      "remark": "The Site Visit document listed in the queue Kindly approve the document we can proceed with the next steps in the process."
    },
    {
      "count": 0,
      "sequence": 3,
      "projectProcessId": 3,
      "nameOfProcess": "countProjectScheduleSubmission_IsVerified",
      "type": "IsVerified",
      "projectProcessHeaderDocStatusId": 72,
      "name": "Project Schedule Submission - Verify",
      "remark": "Verification is needed for the submitted Project Schedule document."
    },
    {
      "count": 0,
      "sequence": 3,
      "projectProcessId": 3,
      "nameOfProcess": "countProjectScheduleSubmission_IsAcknowledge",
      "type": "IsAcknowledgement",
      "projectProcessHeaderDocStatusId": 61,
      "name": "Project Schedule Submission - Acknowledge",
      "remark": "Kindly acknowledge the submitted document for the project schedule."
    },
    {
      "count": 0,
      "sequence": 3,
      "projectProcessId": 3,
      "nameOfProcess": "countProjectScheduleSubmission_IsApprove",
      "type": "IsApprove",
      "projectProcessHeaderDocStatusId": 106,
      "name": "Project Schedule Submission - Approval",
      "remark": "Approval is required for the project schedule. Kindly review and complete the necessary process."
    },
    {
      "count": 0,
      "sequence": 4,
      "projectProcessId": 4,
      "nameOfProcess": "countTechnicalProposalSubmission_IsVerified",
      "type": "IsVerified",
      "projectProcessHeaderDocStatusId": 72,
      "name": "Technical Proposal Submission - Verify",
      "remark": "The technical proposal has been submitted. Kindly Verify the proposal."
    },
    {
      "count": 0,
      "sequence": 4,
      "projectProcessId": 4,
      "nameOfProcess": "countTechnicalProposalSubmission_IsAcknowledge",
      "type": "IsAcknowledgement",
      "projectProcessHeaderDocStatusId": 61,
      "name": "Technical Proposal Submission - Acknowledge",
      "remark": "The technical proposal is under the acknowledgment process. Kindly acknowledge and move it to the next process for further work.\n"
    },
    {
      "count": 0,
      "sequence": 4,
      "projectProcessId": 4,
      "nameOfProcess": "countTechnicalProposalSubmission_IsApprove",
      "type": "IsApprove",
      "projectProcessHeaderDocStatusId": 106,
      "name": "Technical Proposal Submission - Approval",
      "remark": "Proposal document submitted. Please check and approve the document to accelerate the process.\n"
    },
    {
      "count": 0,
      "sequence": 5,
      "projectProcessId": 5,
      "nameOfProcess": "countAwardEvaluation_IsVerified",
      "type": "IsVerified",
      "projectProcessHeaderDocStatusId": 72,
      "name": "Award Evaluation - Verify",
      "remark": "The Award Evaluation document has been submitted and requires verification. Please proceed with the verification process."
    },
    {
      "count": 0,
      "sequence": 5,
      "projectProcessId": 5,
      "nameOfProcess": "countAwardEvaluation_IsAcknowledge",
      "type": "IsAcknowledgement",
      "projectProcessHeaderDocStatusId": 61,
      "name": "Award Evaluation - Acknowledge",
      "remark": "Acknowledgement of the Award Evaluation document has been submitted. Please proceed with the necessary process."
    },
    {
      "count": 0,
      "sequence": 5,
      "projectProcessId": 5,
      "nameOfProcess": "countAwardEvaluation_IsApprove",
      "type": "IsApprove",
      "projectProcessHeaderDocStatusId": 106,
      "name": "Award Evaluation - Approval",
      "remark": "Approval is required for the Award Evaluation document that has been submitted."
    },
    {
      "count": 0,
      "sequence": 6,
      "projectProcessId": 6,
      "nameOfProcess": "countUAT_IsVerified",
      "type": "IsVerified",
      "projectProcessHeaderDocStatusId": 72,
      "name": "UAT - Verify",
      "remark": "The UAT document is in the verification queue. Please verify the document to proceed with further activities."
    },
    {
      "count": 0,
      "sequence": 6,
      "projectProcessId": 6,
      "nameOfProcess": "countUAT_IsAcknowledge",
      "type": "IsAcknowledgement",
      "projectProcessHeaderDocStatusId": 61,
      "name": "UAT - Acknowledge",
      "remark": "Kindly acknowledge the submitted UAT document for the project process."
    },
    {
      "count": 0,
      "sequence": 6,
      "projectProcessId": 6,
      "nameOfProcess": "countUAT_IsApprove",
      "type": "IsApprove",
      "projectProcessHeaderDocStatusId": 106,
      "name": "UAT - Approval",
      "remark": "Please approve the submitted UAT document before we can proceed with the further project process."
    },
    {
      "count": 0,
      "sequence": 7,
      "projectProcessId": 7,
      "nameOfProcess": "countMAR_IsVerified",
      "type": "IsVerified",
      "projectProcessHeaderDocStatusId": 72,
      "name": "MAR(Material Request Approval) Submission - Verify",
      "remark": "Verification is required for the Material Request Approval Document. Kindly check."
    },
    {
      "count": 0,
      "sequence": 7,
      "projectProcessId": 7,
      "nameOfProcess": "countMAR_IsAcknowledge",
      "type": "IsAcknowledgement",
      "projectProcessHeaderDocStatusId": 61,
      "name": "MAR(Material Request Approval) Submission - Acknowledge",
      "remark": "The Material Request Approval document needs to be acknowledged. Kindly facilitate the process."
    },
    {
      "count": 0,
      "sequence": 7,
      "projectProcessId": 7,
      "nameOfProcess": "countMAR_IsApprove",
      "type": "IsApprove",
      "projectProcessHeaderDocStatusId": 106,
      "name": "MAR(Material Request Approval) Submission - Approval",
      "remark": "The Material Request Approval document is waiting for approval. Kindly accelerate the process"
    },
    {
      "count": 0,
      "sequence": 8,
      "projectProcessId": 8,
      "nameOfProcess": "countRFWI_IsVerified",
      "type": "IsVerified",
      "projectProcessHeaderDocStatusId": 72,
      "name": "RWIF - Verify",
      "remark": "The RWIF document is awaiting the verification process."
    },
    {
      "count": 0,
      "sequence": 8,
      "projectProcessId": 8,
      "nameOfProcess": "countRFWI_IsAcknowledge",
      "type": "IsAcknowledgement",
      "projectProcessHeaderDocStatusId": 61,
      "name": "RWIF - Acknowledge",
      "remark": "Acknowledgement is required for the submitted RWIF document to proceed with further processing."
    },
    {
      "count": 0,
      "sequence": 8,
      "projectProcessId": 8,
      "nameOfProcess": "countRFWI_IsApprove",
      "type": "IsApprove",
      "projectProcessHeaderDocStatusId": 106,
      "name": "RWIF - Approval",
      "remark": "The RWIF document is currently under the approval process. Please expedite the next steps."
    },
    {
      "count": 0,
      "sequence": 9,
      "projectProcessId": 9,
      "nameOfProcess": "countTNC_IsVerified",
      "type": "IsVerified",
      "projectProcessHeaderDocStatusId": 72,
      "name": "T&C - Verify",
      "remark": "The T&C document for the project process is under verification."
    },
    {
      "count": 0,
      "sequence": 9,
      "projectProcessId": 9,
      "nameOfProcess": "countTNC_IsAcknowledge",
      "type": "IsAcknowledgement",
      "projectProcessHeaderDocStatusId": 61,
      "name": "T&C - Acknowledge",
      "remark": "Kindly acknowledge the T&C document and facilitate the project process."
    },
    {
      "count": 0,
      "sequence": 9,
      "projectProcessId": 9,
      "nameOfProcess": "countTNC_IsApprove",
      "type": "IsApprove",
      "projectProcessHeaderDocStatusId": 106,
      "name": "T&C - Approval",
      "remark": "The T&C document needs to be approved. Kindly check"
    }
  ]

  myMaintenanceSubmissionProcess: any = [
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 12,
      "nameOfProcess": "countMaintenance_IsVerified",
      "type": "IsVerified",
      "maintenanceStatusId": 72,
      "name": "Maintenance Agreements - Verify",
      "remark": "The maintenance agreement is in the queue for the verification process. Kindly proceed with the necessary steps."
    },
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 12,
      "nameOfProcess": "countMaintenance_IsAcknowledge",
      "type": "IsAcknowledgement",
      "maintenanceStatusId": 61,
      "name": "Maintenance Agreements - Acknowledge",
      "remark": "The acknowledgement of the maintenance agreement is needed. Kindly continue with the steps."
    },
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 12,
      "nameOfProcess": "countMaintenance_IsApprove",
      "type": "IsApprove",
      "maintenanceStatusId": 106,
      "name": "Maintenance Agreements - Approval",
      "remark": "Approval of the maintenance agreement is required. Kindly accelerate the process."
    },]


  myWarrantyPeriodSubmissionProcess: any = [
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 11,
      "nameOfProcess": "countWarrantyPeriod_IsVerified",
      "type": "IsVerified",
      "projectWarrentyStatusId": 72,
      "name": "Warranty Period - Verify",
      "remark": "The Warranty Document is in the queue for the verification process. Kindly proceed with the necessary steps."
    },
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 11,
      "nameOfProcess": "countWarrantyPeriod_IsAcknowledge",
      "type": "IsAcknowledgement",
      "projectWarrentyStatusId": 61,
      "name": "Warranty Period - Acknowledge",
      "remark": "The acknowledgement of the Warranty Document is needed. Kindly continue with the steps."

    },
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 11,
      "nameOfProcess": "countWarrantyPeriod_IsApprove",
      "type": "IsApprove",
      "projectWarrentyStatusId": 106,
      "name": "Warranty Period - Approval",
      "remark": "Approval of the Warranty Document is required. Kindly accelerate the process."
    },]


  myProjectTaskProcess: any = [
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 13,
      "nameOfProcess": "countProjectTask_IsVerified",
      "type": "IsVerified",
      "ProjectTaskStatusId": 72,
      "name": "Task - Verify",
      "remark": "The Task is in the queue for the verification process. Kindly proceed with the necessary steps."
    },
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 13,
      "nameOfProcess": "countProjectTask_IsAcknowledge",
      "type": "IsAcknowledgement",
      "ProjectTaskStatusId": 61,
      "name": "Task - Acknowledge",
      "remark": "The acknowledgement of the Task is needed. Kindly continue with the steps."

    },
    {
      "count": 0,
      "sequence": 1,
      "projectProcessId": 13,
      "nameOfProcess": "countProjectTask_IsApprove",
      "type": "IsApprove",
      "ProjectTaskStatusId": 106,
      "name": "Task - Approval",
      "remark": "Approval of the Task  is required. Kindly accelerate the process."
    },]

  myDailyAttendance_AttendAndAbsent = {
    "totalDaysAttended": 0,
    "totalDaysAbsent": 0
  }
  myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage = {
    "currentMonthHoursMinutes": "00 Hrs : 00 Min",
    "previousMonthHoursMinutes": "00 Hrs : 00 Min",
    "percentageDifference": 0,
    "changeIndicator": ""
  }
  myDailyProjectWorkingHoursByCurrentAndPreviusPercentage = {
    "currentMonthHoursMinutes": "00 Hrs : 00 Min",
    "previousMonthHoursMinutes": "00 Hrs : 00 Min",
    "percentageDifference": 0,
    "changeIndicator": ""
  }
  breadCrumbItems!: Array<{}>;
  attendanceWorkingHoursByCurrentList: any[] = [];
  ProjectManagement_MyTask_Verification_Ack_ApprovalList: any;
  mainTask_Verification_Ack_ApprovalList
  taskColumnChart: any;
  subTaskColumnChart: any;
  staffDailyAttendanceScoringList: any;
  myProjectManagementTaskAging: any = [];
  isProject: boolean = true;
  maintenance_MyTask_Verification_Ack_ApprovalList: any;
  warrenty_MyTask_Verification_Ack_ApprovalList: any;
  MasterFollowListPending_ServerPaging: any;
  myTaskActiveId: number = 1;
  totalCountProjectManagementTaskStatusTab: any = {
    "totalProjectApprovalPending": 0,
    "totalProjectInProgress": 0,
    "totalProjectPending": 0,
    "totalProjectCompleted": 0,
    "totalProjectTaskStarted": 0,
    "totalProjectApprovalPendingForMainTab": 0,
    "totalProjectMyTaskTab": 0


  };
  myDailyCorrectiveWorkingHoursByCurrentAndPreviusPercentage: any;
  myDailyPreventiveWorkingHoursByCurrentAndPreviusPercentage: any;
  constructor(private location: Location, private router: Router, private modalService: NgbModal, private offcanvasService: NgbOffcanvas, private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private authAssetService: AuthAssetService,) {

  }

  private isOffcanvasOpen = false;
  private routerSubscription: Subscription;
  ngOnInit(): void {

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.offcanvasService.dismiss();
        this.modalService.dismissAll();
        this.isOffcanvasOpen = false;
        if (this.CommonHttpServiceCallerService.letOpenOffCancvas) {
          setTimeout(() => this.location.forward(), 0);
        }

      }
    });
    this.isProject = this.authAssetService.getisProject();
    this.currentMonthName = this.getCurrentMonthName()
    console.log("currentMonthName", this.currentMonthName)
    this.breadCrumbItems = [
      { label: 'My Task' },
      { label: 'My Task Dashboard', active: true }
    ];




    this.getV3_ProjectManagement_MyTask();
    this.getV3_ProjectManagement_MyTask_Verification_Ack_Approval();
    this.GetV3_Warrenty_MyTask_Verification_Ack_Approval();
    this.GetV3_Maintenance_MyTask_Verification_Ack_Approval();
    this.GetV3_ProjectManagement_MainTask_Verification_Ack_Approval_Latest();
    this.getV3_StaffDailyAttendanceScoring();
    this.getV2_MX_MasterFollowListPending_ServerPaging();

    this.GetV3_TotalCountProjectManagementTaskStatusTab();
    this.initialTabOpenBackFromThePage();
  
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  getCurrentMonthName() {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const d = new Date();
    let name = month[d.getMonth()];
    return name;
  }
  getV3_ProjectManagement_MyTask() {
    let url = 'api/ProjectManagementDash/GetV3_ProjectManagement_MyTask'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, {}).subscribe((res: any) => {
      this.assignTheValueIntoFormattedTime(res.myDailyAttendanceWorkingHours);
      this.attendanceWorkingHoursByCurrentList = [];
      this.myDailyAttendance_AttendAndAbsent = res.myDailyAttendance_AttendAndAbsent;
      this.myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage = res.myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage;
      this.myDailyProjectWorkingHoursByCurrentAndPreviusPercentage = res.myDailyProjectWorkingHoursByCurrentAndPreviusPercentage;
      this.myProjectManagementTaskAging = res.myProjectManagementTaskAging;
      this.myDailyCorrectiveWorkingHoursByCurrentAndPreviusPercentage=res.myDailyCorrectiveWorkingHoursByCurrentAndPreviusPercentage
      this.myDailyPreventiveWorkingHoursByCurrentAndPreviusPercentage=res.myDailyPreventiveWorkingHoursByCurrentAndPreviusPercentage
      this._taskColumnChart('["--vz-primary","--vz-warning","--vz-warning","--vz-danger","--vz-dark","--vz-info"]', res.myProjectManagementTaskByStatus);
      this._subTaskColumnChart('["--vz-success","--vz-warning","--vz-warning","--vz-danger","--vz-dark","--vz-info"]', res.myProjectManagementSubTaskByStatus);
      this.bindTwoObjectOfHours(this.myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage, this.myDailyProjectWorkingHoursByCurrentAndPreviusPercentage,this.myDailyCorrectiveWorkingHoursByCurrentAndPreviusPercentage,this.myDailyPreventiveWorkingHoursByCurrentAndPreviusPercentage);
    })
  }


  openViewHandleTask(projectTaskId, projectScheduleObject): void {
    this.CommonHttpServiceCallerService.letOpenOffCancvas = true;
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
          this.getV3_ProjectManagement_MyTask();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.CommonHttpServiceCallerService.letOpenOffCancvas = false;
          this.resetScroll();
        }, 100);
      })
      .catch((result) => {
        setTimeout(() => {
          this.getV3_ProjectManagement_MyTask();
          this.offcanvasService.dismiss();
          this.modalService.dismissAll()
          this.CommonHttpServiceCallerService.letOpenOffCancvas = false;
          this.resetScroll();
        }, 100);
      });



  }

  resetScroll() {
    document.body.style.overflow = 'auto';
  }
  calculateScore(myScore) {
    if (myScore >= 100) {
      return 100;
    } else if (myScore <= 0) {
      return myScore < 0 ? 0 : 1;
    } else {
      let calculatedScore = Math.floor(myScore * 10) / 10;
      return calculatedScore < 0.1 ? 1 : calculatedScore;
    }
  }



  getV2_MX_MasterFollowListPending_ServerPaging() {
    let url = 'api/ProjectManagementDash/GetV2_MX_MasterFollowListPending_ServerPaging'
    let payload = {
      "displayLength": 10,
      "displayStart": 0
    };
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe((res: any) => {
      this.MasterFollowListPending_ServerPaging = res.myTask;
    })
  }


  getV3_ProjectManagement_MyTask_Verification_Ack_Approval() {

    let url = 'api/ProjectManagementDash/GetV3_ProjectManagement_MyTask_Verification_Ack_Approval'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, {}).subscribe((res: any) => {
      this.ProjectManagement_MyTask_Verification_Ack_ApprovalList = res.myTask;
      if (res.myTask) this.bindCountsMyTask(this.ProjectManagement_MyTask_Verification_Ack_ApprovalList)
    })
  }



  GetV3_Warrenty_MyTask_Verification_Ack_Approval() {
    let url = 'api/ProjectManagementDash/GetV3_Warrenty_MyTask_Verification_Ack_Approval'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, {}).subscribe((res: any) => {
      this.warrenty_MyTask_Verification_Ack_ApprovalList = res.myTaskWarrenty;
      if (res.myTaskWarrenty) this.bindCountsWarrantyPeriodSubmission(this.warrenty_MyTask_Verification_Ack_ApprovalList)

    })
  }
  GetV3_Maintenance_MyTask_Verification_Ack_Approval() {
    let url = 'api/ProjectManagementDash/GetV3_Maintenance_MyTask_Verification_Ack_Approval'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, {}).subscribe((res: any) => {
      this.maintenance_MyTask_Verification_Ack_ApprovalList = res.myTaskMaintance;
      if (res.myTaskMaintance)
        this.bindCountsMaintenanceSubmission(this.maintenance_MyTask_Verification_Ack_ApprovalList)
    })
  }
  GetV3_ProjectManagement_MainTask_Verification_Ack_Approval_Latest() {
    // let url = 'api/ProjectManagementDash/GetV3_ProjectManagement_MainTask_Verification_Ack_Approval'
    let url = 'api/ProjectManagementDash/GetV3_ProjectManagement_MainTask_Verification_Ack_Approval_Latest'
    
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, {}).subscribe((res: any) => {
      this.mainTask_Verification_Ack_ApprovalList = res.myMainTaskPending;
      if (res.myMainTaskPending) this.bindCountsProjectTask(this.mainTask_Verification_Ack_ApprovalList)
    })
  }
  GetV3_TotalCountProjectManagementTaskStatusTab() {
    let url = 'api/ProjectManagementMobile/GetV3_TotalCountProjectManagementTaskStatusTab'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, {}).subscribe((res: any) => {
      this.totalCountProjectManagementTaskStatusTab = res.dataTaskStatusTab;
      console.log("this.totalCountProjectManagementTaskStatusTab", this.totalCountProjectManagementTaskStatusTab)

    })
  }





  getV3_StaffDailyAttendanceScoring() {
    let url = 'api/ProjectManagementDash/GetV3_StaffDailyAttendanceScoring'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, {}).subscribe((res: any) => {
      this.staffDailyAttendanceScoringList = res.obj;
      this._GaugeChart('["--vz-primary","--vz-warning"]', this.calculateScore(this.staffDailyAttendanceScoringList.myScore));
    })
  }

  _GaugeChartNew() {
    setTimeout(() => {
      this._GaugeChart('["--vz-primary","--vz-warning"]', this.calculateScore(this.staffDailyAttendanceScoringList.myScore));
    }, 0); //

  }
  returnNonCount(processList: any[]) {
    return processList.reduce((sum, item) => sum + item.count, 0);
}

  bindCountsMyTask(myTask) {
    this.myTasKDocumentSubmissionProcess.forEach(process => {
      if (myTask.hasOwnProperty(process.nameOfProcess)) {
        process.count = myTask[process.nameOfProcess] ? myTask[process.nameOfProcess] : 0;
      }
    });
    this.myTasKDocumentSubmissionProcess.sort((a, b) => a.sequence - b.sequence);
  }
  bindCountsMaintenanceSubmission(myTask) {
    this.myMaintenanceSubmissionProcess.forEach(process => {
      if (myTask.hasOwnProperty(process.nameOfProcess)) {
        process.count = myTask[process.nameOfProcess] ? myTask[process.nameOfProcess] : 0;
      }
    });
    this.myMaintenanceSubmissionProcess.sort((a, b) => a.sequence - b.sequence);
  }

  bindCountsProjectTask(myTask) {
    this.myProjectTaskProcess.sort((a, b) => a.sequence - b.sequence);

    this.myProjectTaskProcess.forEach(process => {
      if (myTask.hasOwnProperty(process.nameOfProcess)) {
        process.count = myTask[process.nameOfProcess] ? myTask[process.nameOfProcess] : 0;
      }
    });




  }
  bindCountsWarrantyPeriodSubmission(myTask) {
    this.myWarrantyPeriodSubmissionProcess.sort((a, b) => a.sequence - b.sequence);

    this.myWarrantyPeriodSubmissionProcess.forEach(process => {
      if (myTask.hasOwnProperty(process.nameOfProcess)) {
        process.count = myTask[process.nameOfProcess] ? myTask[process.nameOfProcess] : 0;
      }
    });




  }


  bindTwoObjectOfHours(myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage, myDailyProjectWorkingHoursByCurrentAndPreviusPercentage,myDailyCorrectiveWorkingHoursByCurrentAndPreviusPercentage,myDailyPreventiveWorkingHoursByCurrentAndPreviusPercentage) {
    myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage.title = 'Daily Attendance'
    myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage.icon = 'las la-hourglass-end'
    myDailyProjectWorkingHoursByCurrentAndPreviusPercentage.title = 'Task Attendance'
    myDailyProjectWorkingHoursByCurrentAndPreviusPercentage.icon = 'las la-hourglass-end'
    myDailyCorrectiveWorkingHoursByCurrentAndPreviusPercentage.title = 'Corrective Attendance'
    myDailyPreventiveWorkingHoursByCurrentAndPreviusPercentage.title = 'Preventive Attendance'
    myDailyCorrectiveWorkingHoursByCurrentAndPreviusPercentage.icon = 'las la-hourglass-end'
    myDailyPreventiveWorkingHoursByCurrentAndPreviusPercentage.icon = 'las la-hourglass-end'
    this.attendanceWorkingHoursByCurrentList.push(myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage, myDailyProjectWorkingHoursByCurrentAndPreviusPercentage,myDailyCorrectiveWorkingHoursByCurrentAndPreviusPercentage,myDailyPreventiveWorkingHoursByCurrentAndPreviusPercentage)
    console.log("attendanceWorkingHoursByCurrentList", this.attendanceWorkingHoursByCurrentList)


  }

  assignTheValueIntoFormattedTime(myDailyAttendanceWorkingHours: Task[]) {
    myDailyAttendanceWorkingHours.forEach((element: any) => {
      if (element.taskType == 'Home') {
        this.homeFormattedTime = element.formattedTime ? element.formattedTime : '00 hours : 00 minutes'
      } else if (element.taskType == 'Office') {
        this.officeFormattedTime = element.formattedTime ? element.formattedTime : '00 hours : 00 minutes'
      } else if (element.taskType == 'On-Site') {
        this.onSiteFormattedTime = element.formattedTime ? element.formattedTime : '00 hours : 00 minutes'
      } else if (element.taskType == 'Grand Total') {
        this.grandTotalFormattedTime = element.formattedTime ? element.formattedTime : '00 hours : 00 minutes'
      } else {
      }
    })

  }
  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };


  // GaugeChart
  private _GaugeChart(colors: any, myScore) {
    colors = this.getChartColorsArray(colors);
    this.GaugeChart = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      color: colors,
      textStyle: {
        fontFamily: 'Poppins, sans-serif',
      },
      series: [{
        name: 'Attending',
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: '#858d98',
        },
        axisLabel: {
          color: '#858d98',
        },
        data: [{
          title: {
            color: '#858d98',
          },
          value: myScore,
          name: 'SCORE',
        }]
      }]
    }
  }

  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace("", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace("", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }
  private getTaskData(data: any) {
    return data.map((item: any) => item.totalTask);
  }

  private getTaskCategories(data: any) {
    return data.map((item: any) => item.projectTaskStatusName);
  }

  private getSubTaskData(data: any) {
    return data.map((item: any) => item.totalSubTask);
  }

  private getSubTaskCategories(data: any) {
    return data.map((item: any) => item.projectSubTaskStatusName);
  }
  AfterEmitCall(event){
    this.GetV3_TotalCountProjectManagementTaskStatusTab();
  }
  private _taskColumnChart(colors: any, taskData: any) {
    colors = this.getChartColorsArray(colors);
    this.taskColumnChart = {
      series: [{
        name: 'Tasks',
        data: this.getTaskData(taskData)
      }],
      chart: {
        height: 230,
        type: 'bar',
        events: {
          click: function (chart: any, w: any, e: any) {
          }
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: this.getTaskCategories(taskData),
        labels: {
          style: {
            colors: colors,
            fontSize: '12px'
          }
        }
      }
    };
  }

  private _subTaskColumnChart(colors: any, subTaskData: any) {
    colors = this.getChartColorsArray(colors);
    this.subTaskColumnChart = {
      series: [{
        name: 'Sub-Tasks',
        data: this.getSubTaskData(subTaskData)
      }],
      chart: {
        height: 230,
        type: 'bar',
        events: {
          click: function (chart: any, w: any, e: any) {
          }
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: this.getSubTaskCategories(subTaskData),
        labels: {
          style: {
            colors: colors,
            fontSize: '12px'
          }
        }
      }
    };
  }
  onNavChange(currentId: any) {
    sessionStorage.setItem("myTaskActiveId", "" + currentId)
    this.GetV3_TotalCountProjectManagementTaskStatusTab();

  }
  onNavTopChange(currentId: any) {
    console.log("changeEvent", currentId)
    sessionStorage.setItem("activeIdTop", "" + currentId);
    this.myTaskActiveId = sessionStorage.getItem("myTaskActiveId") ? Number(sessionStorage.getItem("myTaskActiveId")) : 1;

    this.GetV3_TotalCountProjectManagementTaskStatusTab();

  }
  initialTabOpenBackFromThePage() {

    this.activeIdTop = 1;
    this.myTaskActiveId = 1;
    this.activeIdTop = sessionStorage.getItem("activeIdTop") ? Number(sessionStorage.getItem("activeIdTop")) : 1;
    this.myTaskActiveId = sessionStorage.getItem("myTaskActiveId") ? Number(sessionStorage.getItem("myTaskActiveId")) : 1;


  }
}




