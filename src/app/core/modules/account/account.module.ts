import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";

import { AccountRoutingModule } from './account-routing.module';
import { SigninModule } from "./auth/signin/signin.module";
import { SignupModule } from "./auth/signup/signup.module";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ArchwizardModule } from 'angular-archwizard';
import { LockPageComponent } from './lock-page/lock-page.component';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { SingleSignOnComponent } from './single-sign-on/single-sign-on.component';
import { SharedModule } from "src/app/shared/shared.module";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LightboxModule } from 'ngx-lightbox';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    RegistrationComponent,
    LockPageComponent,
    SingleSignOnComponent,
    ResetPasswordComponent,
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    NgSelectModule,
    AccountRoutingModule,
    SigninModule, CdkStepperModule,
    NgStepperModule,
    
    SharedModule,LightboxModule,
  ],
  providers:[
    provideNgxMask(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
