import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubCategoryComponent } from './sub-category.component';
import { SubCategoryListComponent } from './sub-category-list/sub-category-list.component';


const routes: Routes = [
  {
    path: '',
    component: SubCategoryComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'list', component: SubCategoryListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubCategoryRoutingModule { }
