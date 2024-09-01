import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGroupComponent } from './access-group.component';
import { AccessGroupListComponent } from './access-group-list/access-group-list.component';
import { AccessGroupEditComponent } from './access-group-edit/access-group-edit.component';
import { AccessGroupAddComponent } from './access-group-add/access-group-add.component';



const routes: Routes = [
  {
    path: '',
    component: AccessGroupComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'access-group-list' },
      { path: 'access-group-list', component: AccessGroupListComponent },
      { path: 'access-group-edit', component: AccessGroupEditComponent },
      { path: 'access-group-add', component: AccessGroupAddComponent },
    

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AccessGroupRoutingModule { }
