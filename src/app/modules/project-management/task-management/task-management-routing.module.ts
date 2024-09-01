import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectScheduleListComponent } from './project-schedule-list/project-schedule-list.component';
import { SubTaskViewComponent } from './sub-task-view/sub-task-view.component';
import { ProjectScheduleViewWithTaskComponent } from './project-schedule-view-with-task/project-schedule-view-with-task.component';

const routes: Routes = [
  {
    path: "project-schedule-list",
    component: ProjectScheduleListComponent,
  }, {
    path: "project-schedule-view",
    component: ProjectScheduleViewWithTaskComponent,
   },
   // {
  //   path: "pm-schedule-view",
  //   component: ProjectScheduleViewWithTaskComponent,
  // },
  {
    path: "view-sub-task",
    component: SubTaskViewComponent,
  },

  {
    path: "",
    pathMatch: "full",
    redirectTo: "project-schedule-list",
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskManagementRoutingModule { }
