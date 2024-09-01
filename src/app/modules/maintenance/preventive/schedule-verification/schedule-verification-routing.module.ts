import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { ListScheduleVerificationComponent } from "./list-schedule-verification/list-schedule-verification.component";
const routes: Routes = [
  {
    path: "list-schedule-verification",
    component: ListScheduleVerificationComponent,
  },
  
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list-schedule-verification",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleVerificationRoutingModule { }
