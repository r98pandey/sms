import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "corrective",
    loadChildren: () =>
      import("./corrective/corrective.module").then((m) => m.CorrectiveModule),
  },
  {
    path: "preventive",
    loadChildren: () =>
      import("./preventive/preventive.module").then((m) => m.PreventiveModule),
  },
  {
    path: "attendance",
    loadChildren: () =>
      import("./attendance/attendance.module").then((m) => m.AttendanceModule),
  },

  {
    path: "",
    pathMatch: "full",
    redirectTo: "dashboard",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
