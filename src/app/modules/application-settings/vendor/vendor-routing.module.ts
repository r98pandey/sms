import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorComponent } from './vendor.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { VendorViewComponent } from './vendor-view/vendor-view.component';

const routes: Routes = [
  {
    path: '',
    component: VendorComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'vendor-list' },
      { path: 'vendor-list', component: VendorListComponent },
      { path: 'vendor-add', component: VendorFormComponent },
      { path: 'vendor-edit', component: VendorFormComponent },
      { path: 'vendor-view', component: VendorViewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
