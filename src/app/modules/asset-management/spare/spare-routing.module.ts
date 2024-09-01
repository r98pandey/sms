import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpareComponent } from './spare.component';
import { SpareListComponent } from './spare-list/spare-list.component';

const routes: Routes = [
  {
    path: '',
    component: SpareComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list-spare' },
      { path: 'list-spare', component: SpareListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpareRoutingModule { }
