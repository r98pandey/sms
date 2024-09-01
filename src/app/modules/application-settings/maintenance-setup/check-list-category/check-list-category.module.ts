import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckListCategoryComponent } from './check-list-category.component';
import { CheckListCategoryRoutingModule } from './check-list-category-routing-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { CheckListCategoryListComponent } from './check-list-category-list/check-list-category-list.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormGroup } from '@angular/forms';

@NgModule({
  declarations: [CheckListCategoryComponent,CheckListCategoryListComponent],
  imports: [
    CommonModule,
    CheckListCategoryRoutingModule,
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
    NgbTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckListCategoryModule { }
