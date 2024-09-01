import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientProjectManagementComponent } from './client-project-management.component';
import { AddClientProjectManagementComponent } from './add-client-project-management/add-client-project-management.component';
import { ListClientProjectManagementComponent } from './list-client-project-management/list-client-project-management.component';
import { ViewClientProjectManagementComponent } from './view-client-project-management/view-client-project-management.component';
import { PmProspectListComponent } from './pm-prospect-list/pm-prospect-list.component';


const routes: Routes = [
  {
    path: '',
    component: ClientProjectManagementComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'pm-client-list' },
      { path: 'pm-client-list', component: ListClientProjectManagementComponent },
      { path: 'pm-prospect-list', component: PmProspectListComponent },
    
      { path: 'pm-add-client', component: AddClientProjectManagementComponent },
      { path: 'pm-add-prospect', component: AddClientProjectManagementComponent },
      { path: 'pm-edit-client/:id', component: AddClientProjectManagementComponent },
      { path: 'pm-edit-prospect/:id', component: AddClientProjectManagementComponent },
      { path: 'pm-view-client/:id', component: ViewClientProjectManagementComponent },
      { path: 'pm-view-prospect/:id', component: ViewClientProjectManagementComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ClientProjectManagementRoutingModule { }
