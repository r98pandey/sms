
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationComponent } from './location.component';

const routes: Routes = [
  {
    path: '',
    component: LocationComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'location-list' },
      { path: 'location-list', component: LocationListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule {
}
