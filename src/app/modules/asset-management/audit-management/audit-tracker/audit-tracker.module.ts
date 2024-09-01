import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { CreateaudittrackerComponent } from "./createaudittracker/createaudittracker.component";
import { ListaudittrackerComponent } from "./listaudittracker/listaudittracker.component";
import { EditaudittrackerComponent } from "./editaudittracker/editaudittracker.component";
import { AuditTrackerComponent } from "./audit-tracker.component";
import { AuditTrackerRoutingModule } from "./audit-tracker-routing-module";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  NgbModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbToastModule,
  NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ArchwizardModule } from "angular-archwizard";
import { NgSelectModule } from "@ng-select/ng-select";
import {
  NgbDropdownModule,
  NgbDatepickerModule,
  NgbAccordionModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgApexchartsModule } from "ng-apexcharts";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { ViewauditComponent } from "./viewaudit/viewaudit.component";

import { MatTabsModule } from "@angular/material/tabs";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { FlatpickrModule } from "angularx-flatpickr";
import { SimplebarAngularModule } from "simplebar-angular";
import { SharedModule } from "src/app/shared/shared.module";
@NgModule({
  declarations: [
    AuditTrackerComponent,
    CreateaudittrackerComponent,
    ListaudittrackerComponent,
    EditaudittrackerComponent,
    ViewauditComponent,
  ],
  imports: [
    CommonModule,
    AuditTrackerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FlatpickrModule,
    SharedModule,
    SimplebarAngularModule,
    
    FeatherModule.pick(allIcons),
    NgbToastModule,
    NgSelectModule,
    NgbTooltipModule,
    NgbNavModule,
  ],
  providers: [DatePipe],
})
export class AuditTrackerModule {}
