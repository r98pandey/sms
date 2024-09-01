import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CategoryRoutingModule } from "./category-routing.module";
import { CategoryComponent } from "./category.component";
import { CategoryListComponent } from "./category-list/category-list.component";
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

@NgModule({
  declarations: [
    CategoryComponent,
    CategoryListComponent,
  ],
  imports: [CommonModule, CategoryRoutingModule,
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
export class CategoryModule {}
