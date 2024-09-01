import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHumanResourceComponent } from './dashboard-human-resource/dashboard-human-resource.component';

const routes: Routes = [  {
  path: "dashboard-human-resource",
  component: DashboardHumanResourceComponent
},
{ path: "", redirectTo: "dashboard-human-resource", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HumanResourceRoutingModule { }
