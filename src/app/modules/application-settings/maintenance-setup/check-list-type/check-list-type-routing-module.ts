import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckListTypeComponent } from './check-list-type.component';
import { CheckListTypeListComponent } from './check-list-type-list/check-list-type-list.component';




const routes: Routes = [
  {
    path: '',
    component: CheckListTypeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'check-list-type-list' },
      { path: 'check-list-type-list', component: CheckListTypeListComponent },  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CheckListTypeRoutingModule { }
