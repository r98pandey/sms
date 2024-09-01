import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetHandlerComponent } from './asset-handler.component';
import { AssetHandlerRoutingModule } from './asset-handler-routing-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbDatepickerModule, NgbPaginationModule, NgbTypeaheadModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { AssetHandlerListComponent } from './asset-handler-list/asset-handler-list.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormGroup } from '@angular/forms';
import { LightboxModule } from "ngx-lightbox";

@NgModule({
  declarations: [AssetHandlerComponent, AssetHandlerListComponent],
  imports: [
    CommonModule,
    AssetHandlerRoutingModule,
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
    LightboxModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AssetHandlerModule {}
