import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TourComponent } from "./tour/tour.component";

const routes: Routes = [
  {
    path: "firebase-page",
    component: TourComponent,
  },

  {
    path: "",
    pathMatch: "full",
    redirectTo: "firebase-page",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PushFirebaseRoutingModule {}
