import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user', loadChildren: () => import('./new-user/new-user.module').then(m => m.NewUserModule)
  },
  {
    path: 'client-user', loadChildren: () => import('./new-client/new-client.module').then(m => m.NewClientModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
