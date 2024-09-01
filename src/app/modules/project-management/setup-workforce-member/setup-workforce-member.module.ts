import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import { SetupWorkforceMemberRoutingModule } from './setup-workforce-member-routing.module';

import { SetupWorkforceMemberListComponent } from './setup-workforce-member-list/setup-workforce-member-list.component';
import { provideNgxMask } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { SetupWorkforceMemberAddComponent } from './setup-workforce-member-add/setup-workforce-member-add.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CountUpModule } from 'ngx-countup';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { LightboxModule } from 'ngx-lightbox';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbTooltipModule, NgbProgressbarModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [

    SetupWorkforceMemberListComponent,
    SetupWorkforceMemberAddComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SetupWorkforceMemberRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgbTooltipModule,
    CountUpModule,
    FlatpickrModule.forRoot(),
    SimplebarAngularModule,
    NgbProgressbarModule,
    NgbNavModule,
    FeatherModule.pick(allIcons),
    CKEditorModule,
    DropzoneModule,
    NgSelectModule,
    LightboxModule,
  ],
  providers:[
    DatePipe,
    provideNgxMask(),
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SetupWorkforceMemberModule { }
