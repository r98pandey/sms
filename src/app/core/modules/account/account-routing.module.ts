import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from './registration/registration.component';
import { LockPageComponent } from './lock-page/lock-page.component';
import { SingleSignOnComponent } from "./single-sign-on/single-sign-on.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

const routes: Routes = [
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "registration",
    component: RegistrationComponent,
  },

  {
    path: "lock-page",
    component: LockPageComponent,
  }, {
    path: "inactive-user-page",
    component: LockPageComponent,
  },
  {
    path: "single-Sign-On",
    component: SingleSignOnComponent,
  },
  {
    path: "forgot-Password",
    component: ResetPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
