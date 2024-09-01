import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { SelfAuditComponent } from "./self-audit.component";
import { CreateSelfAuditComponent } from "./create-self-audit/create-self-audit.component";
import { ListSelfAuditComponent } from "./list-self-audit/list-self-audit.component";
import { EditSelfAuditComponent } from "./edit-self-audit/edit-self-audit.component";
import { SelfAuditRoutingModule } from "./self-audit-routing-module";

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
import { ViewSelfAuditComponent } from "./view-self-audit/view-self-audit.component";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { FlatpickrModule } from "angularx-flatpickr";
import { SimplebarAngularModule } from "simplebar-angular";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    CreateSelfAuditComponent,
    ListSelfAuditComponent,
    EditSelfAuditComponent,
    SelfAuditComponent,
    ViewSelfAuditComponent,
  ],
  imports: [
    CommonModule,
    SelfAuditRoutingModule,
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
export class SelfAuditModule {}
