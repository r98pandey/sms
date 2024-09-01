import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupWorkforceMemberListComponent } from './setup-workforce-member-list/setup-workforce-member-list.component';
import { SetupWorkforceMemberAddComponent } from './setup-workforce-member-add/setup-workforce-member-add.component'
const routes: Routes = [
  {
    path: "setup-workforce-member-list",
    component: SetupWorkforceMemberListComponent,
  },
  {
    path: "setup-workforce-member-add",
    component: SetupWorkforceMemberAddComponent,
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
export class SetupWorkforceMemberRoutingModule { }
