import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'ticket', loadChildren: () => import('./ticket/ticket.module').then(m => m.TicketsModule) },
  { path: 'service-order', loadChildren: () => import('./service-order/service-order.module').then(m => m.ServiceOrderModule) },
  { path: 'quotation', loadChildren: () => import('./quotation/quotation.module').then(m => m.QuotationModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrectiveRoutingModule { }
