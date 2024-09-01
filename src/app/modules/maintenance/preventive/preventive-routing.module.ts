import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PreventiveComponent } from "./preventive.component";

const routes: Routes = [
  {
    path: "",
    component: PreventiveComponent,
    children: [
      {
        path: "configuration",
        loadChildren: () =>
          import("./configuration/configuration.module").then(
            (m) => m.ConfigurationModule
          ),
      },
      {
        path: "schedule",
        loadChildren: () =>
          import("./schedule/schedule.module").then((m) => m.SCHEDULEModule),
      },
      {
        path: "schedule-verification",
        loadChildren: () =>
          import("./schedule-verification/schedule-verification.module").then((m) => m.ScheduleVerificationModule),
      },

      {
        path: "",
        pathMatch: "full",
        redirectTo: "workorder",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreventiveRoutingModule {}
