import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
  },{
    path: "task-setup",
    loadChildren: () =>
      import("./task-management/task-management.module").then((m) => m.TaskManagementModule),
  },
  {
    path: "project-setup",
    loadChildren: () =>
      import("./project-setup/project-setup.module").then((m) => m.ProjectSetupModule),
  },  {
    path: "work-progress",
    loadChildren: () =>
      import("./work-progress/work-progress.module").then((m) => m.WorkProgressModule),
  },
  
  {
    path: "my-task",
    loadChildren: () =>
      import("./my-task/my-task.module").then((m) => m.MyTaskModule),
  },

  
  {
    path: "setup-workforce-member",
    loadChildren: () =>
      import("./setup-workforce-member/setup-workforce-member.module").then((m) => m.SetupWorkforceMemberModule),
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "dashboard",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule { }
