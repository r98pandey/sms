import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddServiceOrderComponent } from './add-service-order/add-service-order.component';
import { ListServiceOrderComponent } from './list-service-order/list-service-order.component';


const routes: Routes = [
  {
    path: "add-service-order",
    component: AddServiceOrderComponent
  },
  {
    path: "list-service-order",
    component: ListServiceOrderComponent
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
export class ServiceOrderRoutingModule { }
