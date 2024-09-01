import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: "asset",
    loadChildren: () =>
      import("./asset/asset.module").then((m) => m.AssetModule),
  },
  {
    path: "spare",
    loadChildren: () =>
      import("./spare/spare.module").then((m) => m.SpareModule),
  },
  {
    path: "delivery-note",
    loadChildren: () =>
      import("./delivery-note/delivery-note.module").then(
        (m) => m.DeliveryNoteModule
      ),
  },
  {
    path: "audit-management",
    loadChildren: () =>
      import("./audit-management/audit-management.module").then(
        (m) => m.AuditManagementModule
      ),
  },
  {
    path: "disposable",
    loadChildren: () =>
      import("./disposable/disposable.module").then(
        (m) => m.DisposableModule
      ),
  },
  { path: "", redirectTo: "asset", pathMatch: "full" },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AssetManagementRoutingModule { }
