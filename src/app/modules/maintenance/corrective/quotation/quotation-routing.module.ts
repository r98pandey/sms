import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuotationComponent } from './add-quotation/add-quotation.component';
import { ViewQuotationComponent } from './view-quotation/view-quotation.component';
import { QuotationComponent } from './quotation.component';
import { ListQuotationComponent } from "./list-quotation/list-quotation.component";

const routes: Routes = [
  {
    path: "add-quotation",
    component: AddQuotationComponent,
  },
  {
    path: "list-quotation",
    component: ListQuotationComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list-quotation",
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
