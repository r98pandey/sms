import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

import { DeliveryNoteRoutingModule } from "./delivery-note-routing.module";
import { DeliveryNoteComponent } from "./delivery-note.component";
import { DeliveryNoteListComponent } from "./delivery-note-list/delivery-note-list.component";
import { DeliveryNoteAddComponent } from "./delivery-note-add/delivery-note-add.component";
import { DeliveryNoteViewComponent } from "./delivery-note-view/delivery-note-view.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbModule,
  NgbAccordionModule,
  NgbTooltipModule,
  NgbDropdownModule,
  NgbDatepickerModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ArchwizardModule } from "angular-archwizard";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { SharedModule } from "src/app/shared/shared.module";
import { FlatpickrModule } from "angularx-flatpickr";
import { CountUpModule } from 'ngx-countup';// Flat Picker
import { LightboxModule } from "ngx-lightbox";
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    DeliveryNoteComponent,
    DeliveryNoteListComponent,
    DeliveryNoteAddComponent,
    DeliveryNoteViewComponent,
  ],
  imports: [
    CommonModule,
    DeliveryNoteRoutingModule,
    
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    
    NgbAccordionModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    SharedModule,
    CountUpModule,
    FlatpickrModule.forRoot(),
    LightboxModule,
    NgxMatTimepickerModule,
    MatInputModule
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DeliveryNoteModule {}
