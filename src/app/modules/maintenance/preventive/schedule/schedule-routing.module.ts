import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListScheduleComponent } from "./list-schedule/list-schedule.component";
import { ViewScheduleComponent } from "./view-schedule/view-schedule.component";
import { CurrentScheduleComponent } from "./current-schedule/current-schedule.component";
import { EditCurrentScheduleComponent } from "./edit-current-schedule/edit-current-schedule.component";
import { MainComponentListComponent } from "./main-component-list/main-component-list.component";

const routes: Routes = [
  {
    path: "list-schedule",
    component: MainComponentListComponent,
  },
  {
    path: "view-schedule",
    component: ViewScheduleComponent,
  },
  {
    path: "current-schedule",
    component: CurrentScheduleComponent,
  },
  {
    path: "edit-current-schedule",
    component: EditCurrentScheduleComponent,
  },

  
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list-schedule",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SCHEDULERoutingModule {}
