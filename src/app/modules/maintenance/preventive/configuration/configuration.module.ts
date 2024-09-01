import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ConfigurationRoutingModule } from "./configuration-routing.module";
import { ConfigurationListComponent } from "./configuration-list/configuration-list.component";
import { ConfigurationAddComponent } from "./configuration-add/configuration-add.component";
import { ConfigurationViewComponent } from "./configuration-view/configuration-view.component";

import { DatePipe } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { FeatherModule } from "angular-feather";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { NgSelectModule } from "@ng-select/ng-select";
import { allIcons } from "angular-feather/icons";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbDropdownModule,
  NgbTooltipModule,
  NgbProgressbarModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import { CountUpModule } from 'ngx-countup';// Flat Picker
import { FlatpickrModule } from "angularx-flatpickr";
import { SimplebarAngularModule } from "simplebar-angular";
import { QuotationModule } from "../../corrective/quotation/quotation.module";
import { ServiceOrderModule } from "../../corrective/service-order/service-order.module";
import { DashboardModule } from "../../dashboard/dashboard.module";

import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    ConfigurationListComponent,
    ConfigurationAddComponent,
    ConfigurationViewComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgbTooltipModule,
    CountUpModule,
    FlatpickrModule.forRoot(),
    SimplebarAngularModule,
    SharedModule,
    NgbProgressbarModule,
    NgbNavModule,
    FeatherModule.pick(allIcons),
    CKEditorModule,
    DropzoneModule,
    NgSelectModule,
    DashboardModule,
    QuotationModule,
    ServiceOrderModule,
    NgxMatTimepickerModule,
    MatInputModule
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConfigurationModule {}
