import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from './add-project/add-project.component';
import { ListProjectComponent } from './list-project/list-project.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { NewAddProjectComponent } from './new-add-project/new-add-project.component';
import { AddRwifFormComponent } from './add-rwif-form/add-rwif-form.component';
import { ViewRwifFormComponent } from './view-rwif-form/view-rwif-form.component';


const routes: Routes = [
  {
    path: "add-project",
    component: NewAddProjectComponent,
  },
  {
    path: "list-project",
    component: ListProjectComponent,
  }, {
    path: "view-project",
    component: ViewProjectComponent,
  }, 
  {
    path: "edit-project",
    component: EditProjectComponent,
  },
  {
    path: "rwif-form",
    component: AddRwifFormComponent,
  },
  {
    path: "view-rwif-form",
    component: ViewRwifFormComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list-project",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectSetupRoutingModule { }
