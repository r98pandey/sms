import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeparmentFormComponent } from './department-form/department-form.component';
import { DepartmentComponent } from './department.component';
import { DepartmentRoutingModule } from './department-routing-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule, NgbNavModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { DepartmentListComponent } from './department-list/department-list.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { allIcons } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';
import { DepartmentViewComponent } from './department-view/department-view.component';
import { AssignDepartmentWithUserComponent } from './assign-department-with-user/assign-department-with-user.component';

import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { ProjectSetupModule } from '../../project-management/project-setup/project-setup.module';
import { CdkDropListGroup, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgStepperModule } from 'angular-ng-stepper';
import { CountUpModule } from 'ngx-countup';
import { DndModule } from 'ngx-drag-drop';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ViewProjectComponent } from './view-project/view-project.component';
import { NewAddProjectComponent } from './new-add-project/new-add-project.component';
@NgModule({
  declarations: [NewAddProjectComponent,ViewProjectComponent,DepartmentComponent, DeparmentFormComponent, DepartmentListComponent, DepartmentViewComponent, AssignDepartmentWithUserComponent],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,

    NgbDropdownModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FlatpickrModule.forRoot(),
    SharedModule,
    SimplebarAngularModule,
    FeatherModule.pick(allIcons),
    NgbNavModule,
    CdkStepperModule,
    NgStepperModule,
    SharedModule,
    LightboxModule,
    CKEditorModule,
    NgxDropzoneModule, NgbModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    DndModule,
    CountUpModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatTableModule,
    NgxMatTimepickerModule,
    MatInputModule,
    NgOptionHighlightModule, ProjectSetupModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DepartmentModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
