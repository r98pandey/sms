import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetHandlerComponent } from './asset-handler.component';
import { AssetHandlerListComponent } from './asset-handler-list/asset-handler-list.component';




const routes: Routes = [
  {
    path: '',
    component: AssetHandlerComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'asset-handler-list' },
      { path: 'asset-handler-list', component: AssetHandlerListComponent },  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AssetHandlerRoutingModule { }
