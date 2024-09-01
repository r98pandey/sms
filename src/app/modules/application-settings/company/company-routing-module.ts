import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { CompanyComponent } from './company.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyViewComponent } from "./company-view/company-view.component";
const routes: Routes = [
  {
    path: "",
    component: CompanyComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "company-list" },
      {
        path: "company-list",
        component: CompanyListComponent,
      },
      { path: "add-company", component: CompanyFormComponent },
      { path: "edit-company/:id", component: CompanyFormComponent },
      { path: "company-view/:id", component: CompanyViewComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CompanyRoutingModule { }
