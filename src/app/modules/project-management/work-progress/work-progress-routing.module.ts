import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectWorkProgressListComponent } from './project-work-progress-list/project-work-progress-list.component';
import { SubTaskWorkProgressViewComponent } from './sub-task-work-progress-view/sub-task-work-progress-view.component';
import { ProjectWorkProgressViewWithTaskComponent } from './project-work-progress-view-with-task/project-work-progress-view-with-task.component';
const routes: Routes = [
  {
    path: "work-progress-list",
    component: ProjectWorkProgressListComponent,
  }, {
    path: "work-progress-view",
    component: ProjectWorkProgressViewWithTaskComponent,
   },
  
  {
    path: "view-sub-task",
    component: SubTaskWorkProgressViewComponent,
  },

  {
    path: "",
    pathMatch: "full",
    redirectTo: "work-progress-list",
  },];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkProgressRoutingModule { }
