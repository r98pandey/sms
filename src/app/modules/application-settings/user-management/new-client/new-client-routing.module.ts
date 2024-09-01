import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewClientComponent } from './add-new-client/add-new-client.component';
import { EditNewClientComponent } from './edit-new-client/edit-new-client.component';
import { ListNewClientComponent } from './list-new-client/list-new-client.component';
import { ViewNewClientComponent } from './view-new-client/view-new-client.component';
import { NewClientComponent } from './new-client.component';
import { DashboardClientComponent } from "./dashboard-client/dashboard-client.component";

const routes: Routes = [
  {
    path: "",
    component: NewClientComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "list" },
      { path: "list", component: ListNewClientComponent },
      { path: "add", component: AddNewClientComponent },
      { path: "edit", component: EditNewClientComponent },
      { path: "view", component: ViewNewClientComponent },
      { path: "dashboard-client", component: DashboardClientComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewClientRoutingModule { }
