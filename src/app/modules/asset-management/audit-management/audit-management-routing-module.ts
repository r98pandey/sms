import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
const routes: Routes = [
  {
    path: "audit",
    loadChildren: () =>
      import("./audit/audit.module").then((m) => m.AuditModule),
  },
  {
    path: "audit-tracker",
    loadChildren: () =>
      import("./audit-tracker/audit-tracker.module").then(
        (m) => m.AuditTrackerModule
      ),
  },
  {
    path: "audit-self",
    loadChildren: () =>
      import("./self-audit/self-audit.module").then((m) => m.SelfAuditModule),
  },
  { path: "", redirectTo: "audit", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditManagementRoutingModule {}
