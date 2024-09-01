import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisposableListComponent } from './disposable-list/disposable-list.component';
import { DisposableAddComponent } from './disposable-add/disposable-add.component';
import { DisposableViewComponent } from './disposable-view/disposable-view.component';

const routes: Routes = [

  { path: "", pathMatch: "full", redirectTo: "list-disposable" },
  { path: "list-disposable", component: DisposableListComponent },
  { path: "add-disposable", component: DisposableAddComponent },
  { path: "view-disposable", component: DisposableViewComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisposableRoutingModule { }
