import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbDropdownModule,
  NgbTooltipModule,
  NgbProgressbarModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";

// Counter
import { CountUpModule } from 'ngx-countup';// Flat Picker
import { FlatpickrModule } from "angularx-flatpickr";

// Simple Bar
import { SimplebarAngularModule } from "simplebar-angular";

// Load Icons
import { defineElement } from "lord-icon-element";
import lottie from "lottie-web";

// Component pages

import { DatePipe } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { FeatherModule } from "angular-feather";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { NgSelectModule } from "@ng-select/ng-select";
import { allIcons } from "angular-feather/icons";
import { LightboxModule } from "ngx-lightbox";
import { NgxPrintElementModule } from "ngx-print-element";
import { SoftwareSupportRoutingModule } from "./software-support-routing.module";
import { SoftwareDashboardComponent } from "./software-dashboard/software-dashboard.component";
import { ExpectedComplitionDateComponent } from './expected-complition-date/expected-complition-date.component';
import { AssignedTicketListComponent } from './assigned-ticket-list/assigned-ticket-list.component';

@NgModule({
  declarations: [SoftwareDashboardComponent, ExpectedComplitionDateComponent, AssignedTicketListComponent],
  imports: [
    CommonModule,
    FormsModule,
    SoftwareSupportRoutingModule,
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
    LightboxModule,
    NgxPrintElementModule,
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SoftwareSupportModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
