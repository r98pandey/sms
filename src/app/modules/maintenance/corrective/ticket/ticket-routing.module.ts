import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { ListTicketComponent } from './list-ticket/list-ticket.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';

const routes: Routes = [
  {
    path: "add-ticket",
    component: AddTicketComponent
  },
  {
    path: "list-ticket",
    component: ListTicketComponent
  },
  {
    path: "view-ticket",
    component: ViewTicketComponent
  }, {
    path: "ticket-view",
    component: ViewTicketComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list-ticket',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
