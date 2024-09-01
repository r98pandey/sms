import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { ListNewUserComponent } from './list-new-user/list-new-user.component';
import { EditNewUserComponent } from './edit-new-user/edit-new-user.component';
import { ViewNewUserComponent } from './view-new-user/view-new-user.component';
import { ViewClientUserNavComponent } from "./view-client-user-nav/view-client-user-nav.component";
import { VersionThirdAddNewUserComponent } from './version-third-add-new-user/version-third-add-new-user.component';
import { ViewNewUserWithidComponent } from './view-new-user-withid/view-new-user-withid.component';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "list" },
  { path: "list", component: ListNewUserComponent },
  { path: "employee-profile-list", component: ListNewUserComponent },
  { path: "add", component: VersionThirdAddNewUserComponent },
  { path: "edit", component: EditNewUserComponent },
  { path: "view", component: ViewNewUserComponent },
  { path: "employee-profile-add", component: VersionThirdAddNewUserComponent },
  { path: "employee-profile-edit", component: EditNewUserComponent },
  { path: "employee-profile-view", component: ViewNewUserComponent },
  { path: "dashboard-user-view/:id", component: ViewNewUserWithidComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewUserRoutingModule { }
