import { DepartmentListComponent } from './department-list/department-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeparmentFormComponent } from './department-form/department-form.component';
import { DepartmentComponent } from './department.component';
import { DepartmentViewComponent } from './department-view/department-view.component';
import { AssignDepartmentWithUserComponent } from "./assign-department-with-user/assign-department-with-user.component";
import { ViewProjectComponent } from './view-project/view-project.component';
import { NewAddProjectComponent } from './new-add-project/new-add-project.component';

const routes: Routes = [
  {
    path: "",
    component: DepartmentComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "project-list" },
      { path: "add-project", component: NewAddProjectComponent },
      { path: "project-list", component: DepartmentListComponent },
      { path: "edit-project", component: NewAddProjectComponent },
      { path: "view-project", component: ViewProjectComponent },
      {
        path: "assign-project-user",
        component: AssignDepartmentWithUserComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DepartmentRoutingModule { }
