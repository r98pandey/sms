import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';
import { AnalyticalDashboardComponent } from './analytical-dashboard/analytical-dashboard.component';
import { ProgressDashboardComponent } from './progress-dashboard/progress-dashboard.component';

const routes: Routes = [

  {
    path: "project-dashboard-1",
    component: DashboardComponent,
  },{
    path: "project-dashboard",
    component: AnalyticalDashboardComponent,
  },{
    path: "management-dashboard",
    component: ManagementDashboardComponent,
  },{
    path: "progress-update-dashboard",
    component: ProgressDashboardComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "project-dashboard",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
