import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Components
import { BasicComponent } from "./basic/basic.component";
import { CoverComponent } from "./cover/cover.component";
import { AltComponent } from "./alt/alt.component";
import { Page500Component } from "./page500/page500.component";
import { OfflineComponent } from "./offline/offline.component";
import { ErrorMessageComponent } from "./error-message/error-message.component";

const routes: Routes = [
  {
    path: "not-found",
    component: BasicComponent,
  },
  {
    path: "404-cover",
    component: CoverComponent,
  },
  {
    path: "404-alt",
    component: AltComponent,
  },
  {
    path: "page-500",
    component: Page500Component,
  },
  {
    path: "offline",
    component: OfflineComponent,
  },
  {
    path: "error-message",
    component: ErrorMessageComponent,
  },
  { path: "", redirectTo: "not-found", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Error404RoutingModule {}
