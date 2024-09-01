import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessGroupComponent } from './access-group.component';
import { AccessGroupRoutingModule } from './access-group-routing-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbToastModule, NgbTooltipModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { AccessGroupListComponent } from './access-group-list/access-group-list.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { AccessGroupEditComponent } from './access-group-edit/access-group-edit.component';
import { AccessGroupAddComponent } from './access-group-add/access-group-add.component';



@NgModule({
  declarations: [AccessGroupComponent,AccessGroupListComponent,AccessGroupEditComponent,AccessGroupAddComponent],
  imports: [
    CommonModule,
    AccessGroupRoutingModule,
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
    NgbNavModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccessGroupModule { }
