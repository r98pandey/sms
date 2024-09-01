import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetComponent } from "./asset.component";
import { AddassetComponent } from "./addasset/addasset.component";
import { TodolistComponent } from "./todolist/todolist.component";
import { ViewassetComponent } from './viewasset/viewasset.component';
import { TodolistdisposeComponent } from './todolistdispose/todolistdispose.component';
import { ViewdisposeassetprofileComponent } from './viewdisposeassetprofile/viewdisposeassetprofile.component';
import { QrDetailComponent } from './qr-detail/qr-detail.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetViewComponent } from './asset-view/asset-view.component';
import { AssetEditComponent } from './asset-edit/asset-edit.component';

const routes: Routes = [
  {
    path: "",
    component: AssetComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "listasset" },
      { path: "listasset", component: AssetListComponent },
      { path: "createasset", component: AddassetComponent },
      { path: "editasset", component: AssetEditComponent },
      { path: "todolist", component: TodolistComponent },
      { path: "viewasset", component: AssetViewComponent },
      { path: "addSpareList", component: AssetViewComponent },
      { path: "viewassetprofile", component: ViewassetComponent },
      { path: "todolistdispose", component: TodolistdisposeComponent },
      { path: "todolist/:id/:type", component: TodolistComponent },
      {
        path: "viewassetprofiledispose",
        component: ViewdisposeassetprofileComponent,
      },
      { path: "qr-detail", component: QrDetailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AssetRoutingModule { }
