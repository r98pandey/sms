import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditComponent } from './audit.component';


import { ListauditComponent } from "./listaudit/listaudit.component";
import { EditauditComponent } from "./editaudit/editaudit.component";
import { NewAddAuditComponent } from "./new-add-audit/new-add-audit.component";
import { NewViewAuditComponent } from "./new-view-audit/new-view-audit.component";

const routes: Routes = [
  {
    path: "",
    component: AuditComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "listaudit" },
      { path: "listaudit", component: ListauditComponent },
      { path: "createaudit", component: NewAddAuditComponent },
      { path: "editaudit", component: EditauditComponent },
      { path: "viewaudit", component: NewViewAuditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuditRoutingModule { }
