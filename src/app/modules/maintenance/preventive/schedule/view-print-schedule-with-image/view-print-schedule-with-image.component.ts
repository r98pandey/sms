import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { CompanyService } from "src/app/core/services/company.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-view-print-schedule-with-image",
  templateUrl: "./view-print-schedule-with-image.component.html",
  styleUrls: ["./view-print-schedule-with-image.component.scss"],
})
export class ViewPrintScheduleWithImageComponent implements OnInit, OnChanges {
  @Input() masterScheduleList: any;
  @Input() assetTicketItem: any;
  @Input() scheduleAndAssetCheckList: any;
  @Input() pm_ScheduleAndAssetCheckList: any;
  @Input() imageShown: any = false;
  imageUrl = environment.apiUrl;

  scheduleItemCheckStatusAwaitingAction45 = 0;
  scheduleItemCheckStatusVerified_Passed24 = 0;
  scheduleItemCheckStatusVerified_Failed49 = 0;
  companyData: any = {};
  constructor(
    private commonFunctionService: CommonFunctionService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.masterScheduleList = this.masterScheduleList;
    this.assetTicketItem = this.assetTicketItem;
    this.checkTheValue();
    this.checkTheAssetStatusValue();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.masterScheduleList = this.masterScheduleList;
    this.assetTicketItem = this.assetTicketItem;
    this.checkTheValue();
    this.checkTheAssetStatusValue();
    if (this.masterScheduleList?.companyId) {
      let payload: any = {};
      payload.companyId = Number(this.masterScheduleList?.companyId);
      this.getViewData(payload);
    }
  }
  getViewData(paylod: any) {
    this.companyService.getCompanyDetail(paylod).subscribe((res: any) => {
      this.companyData = res?.data;
      ////console.log(this.companyData);
    });
  }

  checkTheValue() {
    if (this.pm_ScheduleAndAssetCheckList.length != 0) {
      this.scheduleItemCheckStatusAwaitingAction45 = 0;
      this.scheduleItemCheckStatusVerified_Passed24 = 0;
      this.scheduleItemCheckStatusVerified_Failed49 = 0;
      for (var i = 0; i < this.pm_ScheduleAndAssetCheckList.length; i++) {
        var currentItem = this.pm_ScheduleAndAssetCheckList[i];
        if (currentItem.scheduleItemCheckStatusId === 45) {
          this.scheduleItemCheckStatusAwaitingAction45++;
        } else if (currentItem.scheduleItemCheckStatusId === 49) {
          this.scheduleItemCheckStatusVerified_Failed49++;
        } else if (currentItem.scheduleItemCheckStatusId === 24) {
          this.scheduleItemCheckStatusVerified_Passed24++;
        }
      }
    }
  }

  scheduleAssetItemCheckStatusPending2 = 0;
  scheduleAssetItemCheckStatusIn_Progress30 = 0;
  scheduleAssetItemCheckStatusCompleted25 = 0;

  checkTheAssetStatusValue() {
    if (this.assetTicketItem.length != 0) {
      this.scheduleAssetItemCheckStatusPending2 = 0;
      this.scheduleAssetItemCheckStatusIn_Progress30 = 0;
      this.scheduleAssetItemCheckStatusCompleted25 = 0;

      for (var i = 0; i < this.assetTicketItem.length; i++) {
        var currentItem = this.assetTicketItem[i];
        if (currentItem.scheduleItemStatusId === 2) {
          this.scheduleAssetItemCheckStatusPending2++;
        } else if (currentItem.scheduleItemStatusId === 30) {
          this.scheduleAssetItemCheckStatusIn_Progress30++;
        } else if (currentItem.scheduleItemStatusId === 25) {
          this.scheduleAssetItemCheckStatusCompleted25++;
        }
      }
    }
  }
}
