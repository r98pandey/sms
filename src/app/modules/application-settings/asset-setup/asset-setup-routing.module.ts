import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "category",
    loadChildren: () =>
      import("./category/category.module").then((m) => m.CategoryModule),
  },
  {
    path: "sub-category",
    loadChildren: () =>
      import("./sub-category/sub-category.module").then((m) => m.SubCategoryModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetSetupRoutingModule {}
