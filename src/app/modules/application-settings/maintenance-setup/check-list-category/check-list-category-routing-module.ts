import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckListCategoryComponent } from './check-list-category.component';
import { CheckListCategoryListComponent } from './check-list-category-list/check-list-category-list.component';




const routes: Routes = [
  {
    path: '',
    component: CheckListCategoryComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'check-list-category-list' },
      { path: 'check-list-category-list', component: CheckListCategoryListComponent },  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CheckListCategoryRoutingModule { }
