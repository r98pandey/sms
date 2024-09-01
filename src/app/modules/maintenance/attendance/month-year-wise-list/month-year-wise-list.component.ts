

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { AuditService } from 'src/app/core/services/audit.service';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { CommonHttpServiceCallerService } from "src/app/core/services/common-http-service-caller.service";
import { PreventiveService } from 'src/app/core/services/preventive.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-month-year-wise-list',
  templateUrl: './month-year-wise-list.component.html',
  styleUrl: './month-year-wise-list.component.scss'
})
export class MonthYearWiseListComponent implements OnInit {
  customDataLabelsChart: any;
  activeIdWorkingHoursTop: number = 1;
  apiUrl = environment.apiUrl;
  totalWorkingHours12Month_CorrectiveList: any = [];
  totalWorkingHoursDetailList: any = [];
  totalWorkingHoursByTech_Corrective: any = []

  label: any = "Total Working Hours - Task";
  breadCrumbItems: any = [
    { label: "Task Working Hours" },
    { label: "Total Working Hours - Task ", active: true },
  ];

  constructor(private ticketService: TicketService,
    private authService: AuthAssetService,
    private commonHttpServiceCallerService: CommonHttpServiceCallerService,
    private lightbox: Lightbox, private preventiveService: PreventiveService,
    private auditService: AuditService, private router: Router,) { }
  ngOnInit(): void {


    this.activeIdWorkingHoursTop = sessionStorage.getItem("activeIdWorkingHoursTop") ? Number(sessionStorage.getItem("activeIdWorkingHoursTop")) : 1;

  }







  onNavChange(currentId: any) {
    sessionStorage.setItem("activeIdWorkingHoursTop", "" + currentId)

  }
}
