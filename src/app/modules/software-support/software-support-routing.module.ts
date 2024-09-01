import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SoftwareDashboardComponent } from "./software-dashboard/software-dashboard.component";

const routes: Routes = [
  {
    path: "software-dashboard",
    component: SoftwareDashboardComponent,
  },

  {
    path: "",
    pathMatch: "full",
    redirectTo: "software-dashboard",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoftwareSupportRoutingModule {}
