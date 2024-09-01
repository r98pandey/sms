import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientViewComponent } from './client-view/client-view.component';


const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'client-list' },
      { path: 'client-list', component: ClientListComponent },
      { path: 'add-client', component: ClientFormComponent },
      { path: 'edit-client/:id', component: ClientFormComponent },
      { path: 'view-client/:id', component: ClientViewComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ClientRoutingModule { }
