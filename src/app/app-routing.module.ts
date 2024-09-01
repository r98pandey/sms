import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { LayoutComponent } from "./core/modules/layouts/layout.component";
import { ForgotPasswordComponent } from "./modules/forgot-password/forgot-password.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "application-settings",
        loadChildren: () =>
          import(
            "./modules/application-settings/application-setting.module"
          ).then((m) => m.ApplicationSettingModule),
      },
      {
        path: "asset-management",
        loadChildren: () =>
          import("./modules/asset-management/assetmanagement.module").then(
            (m) => m.AssetmanagementModule
          ),
      },
      {
        path: "maintenance-management",
        loadChildren: () =>
          import("./modules/maintenance/maintenance.module").then(
            (m) => m.MaintenanceModule
          ),
      },
      {
        path: "firebase",
        loadChildren: () =>
          import("./modules/push-firebase/push-firebase.module").then(
            (m) => m.PushFirebaseModule
          ),
      },
      {
        path: "file-manager",
        loadChildren: () =>
          import(
            "./modules/file-manager-module/file-manager-module.module"
          ).then((m) => m.FileManagerModuleModule),
      },
      {
        path: "software-support",
        loadChildren: () =>
          import("./modules/software-support/software-support.module").then(
            (m) => m.SoftwareSupportModule
          ),
      },
      {
        path: "project-management",
        loadChildren: () =>
          import("./modules/project-management/project-management.module").then((m) => m.ProjectManagementModule),
      },{
        path: "human-resource",
        loadChildren: () =>
          import("./modules/human-resource/human-resource.module").then((m) => m.HumanResourceModule),
      },
      { path: "", redirectTo: "maintenance-management", pathMatch: "full" },
    ],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./core/modules/account/account.module").then(
        (m) => m.AccountModule
      ),
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "error",
    loadChildren: () =>
      import("../app/core/modules/account/errors/errors.module").then(
        (m) => m.ErrorsModule
      ),
  },

  { path: "**", redirectTo: "error", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
