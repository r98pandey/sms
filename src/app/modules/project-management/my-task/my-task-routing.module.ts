import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTaskListComponent } from './my-task-list/my-task-list.component';
import { ProjectDocumentViewActionComponent } from './project-document-view-action/project-document-view-action.component';
import { ProjectDocumentListActionComponent } from './project-document-list-action/project-document-list-action.component';
import { MaintenanceDocumentionsListComponent } from './maintenance-documentions-list/maintenance-documentions-list.component';
import { WarrantyDocumentListComponent } from './warranty-document-list/warranty-document-list.component';
import { MainTaskSubTaskListComponent } from './main-task-sub-task-list/main-task-sub-task-list.component';

const routes: Routes = [
  {
    path: "my-task-list",
    component: MyTaskListComponent
  },
  {
    path: "project-document-list",
    component: ProjectDocumentListActionComponent
  },{
    path: "maintenance-document-list",
    component: MaintenanceDocumentionsListComponent
  },{
    path: "warranty-document-list",
    component: WarrantyDocumentListComponent
  },{
    path: "main-sub-task-list",
    component: MainTaskSubTaskListComponent
  },

  {
    path: "",
    pathMatch: "full",
    redirectTo: "my-task-list",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTaskRoutingModule { }
