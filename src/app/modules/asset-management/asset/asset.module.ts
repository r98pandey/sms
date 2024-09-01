import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { AssetComponent } from "./asset.component";
import { AddassetComponent } from "./addasset/addasset.component";
import { AssetRoutingModule } from "./asset-routing-module";
import { TodolistComponent } from "./todolist/todolist.component";
import { ViewassetprofileComponent } from "./viewassetprofile/viewassetprofile.component";
import { ViewassetComponent } from "./viewasset/viewasset.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  NgbActiveModal,
  NgbModule,
  NgbToastModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import {
  NgbDropdownModule,
  NgbDatepickerModule,
  NgbAccordionModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgApexchartsModule } from "ng-apexcharts";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { TodolistdisposeComponent } from "./todolistdispose/todolistdispose.component";
import { ViewdisposeassetprofileComponent } from "./viewdisposeassetprofile/viewdisposeassetprofile.component";
import { AppTwoDigitDecimaNumberDirective } from "./addasset/app-two-digit-decima-number.directive";
import { SparePartComponent } from "./spare-part/spare-part.component";
import { QrDetailComponent } from "./qr-detail/qr-detail.component";
import { PreviousRouteService } from "src/app/core/services/previous-route.service";
import { CountUpModule } from 'ngx-countup';// Flat Picker
import { SimplebarAngularModule } from "simplebar-angular";
import { SharedModule } from "src/app/shared/shared.module";

// Ck Editer
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
// File Uploads
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
// Flat Picker
import { FlatpickrModule } from "angularx-flatpickr";
import { AssetListComponent } from "./asset-list/asset-list.component";
import { AssetViewComponent } from "./asset-view/asset-view.component";
import { AssetEditComponent } from "./asset-edit/asset-edit.component";
import { LightboxModule } from "ngx-lightbox";
import { PipesModule } from "src/app/core/pipes/pipe-module";

@NgModule({
  declarations: [
    AssetComponent,
    AddassetComponent,
    TodolistComponent,
    ViewassetprofileComponent,
    ViewassetComponent,
    TodolistdisposeComponent,
    ViewdisposeassetprofileComponent,
    AppTwoDigitDecimaNumberDirective,
    SparePartComponent,
    QrDetailComponent,
    AssetListComponent,
    AssetViewComponent,
    AssetEditComponent,
  ],
  imports: [
    CommonModule,
    
    AssetRoutingModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    
    NgbAccordionModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgbToastModule,
    CountUpModule,
    NgApexchartsModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    SharedModule,
    /** Suresh Added**/
    CKEditorModule,
    DropzoneModule,
    FlatpickrModule.forRoot(),
    LightboxModule,
    PipesModule
  ],
  providers: [DatePipe, PreviousRouteService, NgbActiveModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AssetModule {}
