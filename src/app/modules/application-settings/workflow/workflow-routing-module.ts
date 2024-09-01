import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow.component';
import { ListworkflowComponent } from './listworkflow/listworkflow.component';
import { ConfigurationComponent } from './configuration/configuration.component';



const routes: Routes = [
  {
    path: '',
    component: WorkflowComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'listworkflow' },
      { path: 'listworkflow', component: ListworkflowComponent },
      { path: 'configurationworkflow', component: ConfigurationComponent },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class WorkflowRoutingModule { }
