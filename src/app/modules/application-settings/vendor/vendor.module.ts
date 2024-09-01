import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { VendorRoutingModule } from "./vendor-routing.module";
import { VendorComponent } from "./vendor.component";
import { VendorListComponent } from "./vendor-list/vendor-list.component";
import { VendorFormComponent } from "./vendor-form/vendor-form.component";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  NgbNavModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ArchwizardModule } from "angular-archwizard";
import { NgSelectModule } from "@ng-select/ng-select";
import {
  NgbDropdownModule,
  NgbDatepickerModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgApexchartsModule } from "ng-apexcharts";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { SimplebarAngularModule } from "simplebar-angular";
import { SharedModule } from "src/app/shared/shared.module";
import { FlatpickrModule } from "angularx-flatpickr";
import { allIcons } from "angular-feather/icons";
import { FeatherModule } from "angular-feather";
import { CUSTOM_ELEMENTS_SCHEMA,  } from '@angular/core';
import { VendorViewComponent } from './vendor-view/vendor-view.component';

@NgModule({
  declarations: [VendorComponent, VendorListComponent, VendorFormComponent, VendorViewComponent],
  imports: [
    CommonModule,
    VendorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    //
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FlatpickrModule,
    SharedModule,
    SimplebarAngularModule,
    
    FeatherModule.pick(allIcons),
    NgbNavModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VendorModule {}
