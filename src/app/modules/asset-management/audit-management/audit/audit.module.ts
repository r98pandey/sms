import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuditComponent } from "./audit.component";
import { ListauditComponent } from "./listaudit/listaudit.component";
import { EditauditComponent } from "./editaudit/editaudit.component";

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
import { AuditRoutingModule } from "./audit-routing-module";

import { DatePipe } from "@angular/common";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { FlatpickrModule } from "angularx-flatpickr";
import { SimplebarAngularModule } from "simplebar-angular";
import { SharedModule } from "src/app/shared/shared.module";
import { NewAddAuditComponent } from "./new-add-audit/new-add-audit.component";
import { CountUpModule } from 'ngx-countup';// Flat Picker
import { LightboxModule } from "ngx-lightbox";
import { NewViewAuditComponent } from "./new-view-audit/new-view-audit.component";
import { AssetAuditViewComponent } from "../../../../shared/components/asset-audit-view/asset-audit-view.component";
import { DashboardModule } from "src/app/modules/maintenance/dashboard/dashboard.module";
import { NotMatchAssetComponent } from "../../../../shared/components/not-match-asset/not-match-asset.component";
import { SCHEDULEModule } from "src/app/modules/maintenance/preventive/schedule/schedule.module";

@NgModule({
  declarations: [
    AuditComponent,
    ListauditComponent,
    EditauditComponent,
    NewAddAuditComponent,
    NewViewAuditComponent,
  ],
  imports: [
    CommonModule,
    AuditRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    SimplebarAngularModule,
    
    NgbToastModule,
    NgbNavModule,
    NgbModule,
    NgSelectModule,
    
    NgbAccordionModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    SharedModule,
    CountUpModule,
    FlatpickrModule.forRoot(),
    LightboxModule,
    DashboardModule,
  ],

  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuditModule {}
