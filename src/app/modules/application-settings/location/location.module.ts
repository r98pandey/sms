import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationRoutingModule } from './location-routing.module';
import { LocationListComponent } from './location-list/location-list.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbDatepickerModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { NgApexchartsModule } from "ng-apexcharts";
import { FlatpickrModule } from "angularx-flatpickr";
import { SharedModule } from "src/app/shared/shared.module";
import { SimplebarAngularModule } from "simplebar-angular";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";
import { LocationComponent } from './location.component';


@NgModule({
  declarations: [
    LocationListComponent,
    LocationComponent
  ],
  imports: [
    CommonModule,
    LocationRoutingModule,
    CommonModule,
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
    NgbNavModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LocationModule { }
