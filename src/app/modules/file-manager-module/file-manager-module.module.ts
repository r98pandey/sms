import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FileManagerModuleRoutingModule } from "./file-manager-module-routing.module";
import { FileManagerComponent } from "./file-manager/file-manager.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  NgbTooltipModule,
  NgbDropdownModule,
  NgbAccordionModule,
  NgbProgressbarModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";

// Feather Icon
import { FeatherModule } from "angular-feather";
import { allIcons } from "angular-feather/icons";

// Emoji Picker
import { PickerModule } from "@ctrl/ngx-emoji-mart";

// Load Icon
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";

// Calendar package
import { FullCalendarModule } from "@fullcalendar/angular";

// Flat Picker
import { FlatpickrModule } from "angularx-flatpickr";
// Simplebar
import { SimplebarAngularModule } from "simplebar-angular";
// Ck Editer
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
// Counter
import { CountUpModule } from 'ngx-countup';// Flat Picker
// Apex Chart Package
import { NgApexchartsModule } from "ng-apexcharts";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

//  Drag and drop
import { DndModule } from "ngx-drag-drop";

// Select Droup down
import { NgSelectModule } from "@ng-select/ng-select";

// NG2 Search Filter
import { Ng2SearchPipeModule } from "ng2-search-filter";

// drag and droup row table
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatTableModule } from "@angular/material/table";
import { DatePipe } from "@angular/common";

// Mask
import {
  NgxMaskDirective,
  NgxMaskPipe,
  provideNgxMask,
  IConfig,
} from "ngx-mask";

// Swiper Slider
import { SharedModule } from "src/app/shared/shared.module";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { NgxDropzoneModule } from "ngx-dropzone";
import { FileListShownComponent } from './file-list-shown/file-list-shown.component';
import { NewFileManagerComponent } from './new-file-manager/new-file-manager.component';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: "https://httpbin.org/post",
  maxFilesize: 50,
  acceptedFiles: "image/*",
};
@NgModule({
  declarations: [FileManagerComponent, FileListShownComponent, NewFileManagerComponent],
  imports: [
    CommonModule,
    FileManagerModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbProgressbarModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbCollapseModule,
    FeatherModule.pick(allIcons),
    FullCalendarModule,
    FlatpickrModule.forRoot(),
    SimplebarAngularModule,
    CKEditorModule,
    CountUpModule,
    NgApexchartsModule,
    LeafletModule,
    SharedModule,
    PickerModule,
    DndModule,
    NgSelectModule,
    DragDropModule,
    MatTableModule,
    
    NgxMaskDirective,
    NgxMaskPipe,
    DropzoneModule,
    NgxDropzoneModule,
  ],
  providers: [
    DatePipe,
    provideNgxMask(),
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FileManagerModuleModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
