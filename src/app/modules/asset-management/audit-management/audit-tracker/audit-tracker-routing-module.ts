import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateaudittrackerComponent } from './createaudittracker/createaudittracker.component';
import { ListaudittrackerComponent } from './listaudittracker/listaudittracker.component';
import { EditaudittrackerComponent } from './editaudittracker/editaudittracker.component';
import { AuditTrackerComponent } from './audit-tracker.component';
import { ViewauditComponent } from './viewaudit/viewaudit.component';

const routes: Routes = [
  {
    path: '',
    component: AuditTrackerComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'listaudittracker' },
      { path: 'listaudittracker', component: ListaudittrackerComponent },
      { path: 'createaudittracker', component: CreateaudittrackerComponent },
      { path: 'editaudittracker', component: EditaudittrackerComponent },
      { path: 'viewaudittracker', component: ViewauditComponent },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuditTrackerRoutingModule { }
