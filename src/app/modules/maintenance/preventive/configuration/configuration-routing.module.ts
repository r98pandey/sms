import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConfigurationViewComponent } from "./configuration-view/configuration-view.component";
import { ConfigurationListComponent } from "./configuration-list/configuration-list.component";
import { ConfigurationAddComponent } from "./configuration-add/configuration-add.component";

const routes: Routes = [
  {
    path: "list-configuration",
    component: ConfigurationListComponent,
  },
  {
    path: "add-configuration",
    component: ConfigurationAddComponent,
  },
  {
    path: "view-configuration",
    component: ConfigurationViewComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list-configuration",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
