import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubCategoryRoutingModule } from './sub-category-routing.module';
import { SubCategoryComponent } from './sub-category.component';
import { SubCategoryListComponent } from './sub-category-list/sub-category-list.component';
import { NgbDatepickerModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { allIcons } from 'angular-feather/icons';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [
    SubCategoryComponent,
    SubCategoryListComponent
  ],
  imports: [
    CommonModule,
    SubCategoryRoutingModule,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubCategoryModule { }
