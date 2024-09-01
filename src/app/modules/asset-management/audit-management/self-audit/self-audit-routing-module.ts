import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelfAuditComponent } from './self-audit.component';
import { CreateSelfAuditComponent } from './create-self-audit/create-self-audit.component';
import { ListSelfAuditComponent } from './list-self-audit/list-self-audit.component';
import { EditSelfAuditComponent } from './edit-self-audit/edit-self-audit.component';
import { ViewSelfAuditComponent } from './view-self-audit/view-self-audit.component';

const routes: Routes = [
  {
    path: '',
    component: SelfAuditComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'listauditself' },
      { path: 'listauditself', component: ListSelfAuditComponent },
      { path: 'createauditself', component: CreateSelfAuditComponent },
      { path: 'editauditself', component: EditSelfAuditComponent },
      { path: 'viewauditself', component: ViewSelfAuditComponent },
   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SelfAuditRoutingModule { }
