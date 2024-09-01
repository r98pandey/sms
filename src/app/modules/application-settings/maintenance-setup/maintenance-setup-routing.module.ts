import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'check-list-category', loadChildren: () => import('./check-list-category/check-list-category.module').then(m => m.CheckListCategoryModule)
  },
  {
    path: 'check-list-type', loadChildren: () => import('./check-list-type/check-list-type.module').then(m => m.CheckListTypeModule)
  },
  {
    path: 'ticket-type', loadChildren: () => import('./ticket-type/ticket-type.module').then(m => m.TicketTypeModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceSetupRoutingModule { }
