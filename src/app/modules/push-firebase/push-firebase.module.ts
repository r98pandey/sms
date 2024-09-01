import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PushFirebaseRoutingModule } from "./push-firebase-routing.module";
import { TourComponent } from "./tour/tour.component";
import { SharedModule } from "src/app/shared/shared.module";
import {
  NgbAlertModule,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbPaginationModule,
  NgbNavModule,
  NgbAccordionModule,
  NgbCollapseModule,
  NgbToastModule,
} from "@ng-bootstrap/ng-bootstrap";
@NgModule({
  declarations: [TourComponent],
  imports: [
    CommonModule,
    PushFirebaseRoutingModule,
    SharedModule,
    NgbNavModule,
  ],
})
export class PushFirebaseModule {}
