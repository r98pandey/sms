import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketTypeComponent } from './ticket-type.component';
import { TicketTypeListComponent } from './ticket-type-list/ticket-type-list.component';




const routes: Routes = [
  {
    path: '',
    component: TicketTypeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'ticket-type-list' },
      { path: 'ticket-type-list', component: TicketTypeListComponent},  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TicketTypeRoutingModule { }
