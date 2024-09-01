
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DisposableRoutingModule } from './disposable-routing.module';
import { DisposableListComponent } from './disposable-list/disposable-list.component';
import { DatePipe } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import {
  NgbDropdownModule,
  NgbDatepickerModule,
  NgbAccordionModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";

import {
  NgbActiveModal,
  NgbModule,
  NgbNavModule,
  NgbToastModule,
} from "@ng-bootstrap/ng-bootstrap";
import { DisposableAddComponent } from './disposable-add/disposable-add.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
// Ck Editer
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { DisposableViewComponent } from './disposable-view/disposable-view.component';

@NgModule({
  declarations: [
    DisposableListComponent,
    DisposableAddComponent,
    DisposableViewComponent
  ],
  imports: [
    CommonModule,
    DisposableRoutingModule,
    SharedModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbModule,
    NgbNavModule,
    NgbToastModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
  ],
  providers: [DatePipe,NgbActiveModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DisposableModule { }
