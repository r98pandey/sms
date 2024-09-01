import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
} from "@angular/core";
import { ShepherdService } from "angular-shepherd";
import { steps as defaultSteps, defaultStepOptions } from "./data";
import { UserProfileService } from "src/app/core/services/user.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-tour",
  templateUrl: "./tour.component.html",
  styleUrls: ["./tour.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * Tour Component
 */
export class TourComponent implements OnInit, AfterViewInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(
    private shepherdService: ShepherdService,
    private user: UserProfileService,
    public router: Router
  ) {
    //console.log(this.user.activeFirebase);
    if (this.user.activeFirebase == "") {
      this.router.navigate([
        "/maintenance-management/dashboard/help-desk-dashboard",
      ]);
    }
  }

  ngAfterViewInit(): void {
    // this.shepherdService.defaultStepOptions = defaultStepOptions;
    // this.shepherdService.modal = true;
    // this.shepherdService.confirmCancel = false;
    // this.shepherdService.addSteps(defaultSteps);
    // this.shepherdService.start();
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Notification" },
      { label: "Notification", active: true },
    ];
  }
}
