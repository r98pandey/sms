import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'company', loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
  },
  {
    path: 'client', loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
  },
  {
    path: 'pm-client', loadChildren: () => import('./client-project-management/client-project-management.module').then(m => m.ClientProjectManagementModule)
  },


  {
    path: 'department', loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule)
  },

  {
    path: 'asset-setup', loadChildren: () => import('./asset-setup/asset-setup.module').then(m => m.AssetSetupModule)
  },
  {
    path: 'access-group', loadChildren: () => import('./access-group/access-group.module').then(m => m.AccessGroupModule)
  },
  {
    path: 'asset-handler', loadChildren: () => import('./asset-handler/asset-handler.module').then(m => m.AssetHandlerModule)
  },
  {
    path: 'user-management', loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule)
  },
  {
    path: 'workflow-setup', loadChildren: () => import('./workflow/workflow.module').then(m => m.WorkflowModule)
  },
  {
    path: 'maintenance-setup', loadChildren: () => import('./maintenance-setup/maintenance-setup.module').then(m => m.MaintenanceSetupModule)
  },
  // {
  //   path: 'check-list-category', loadChildren: () => import('./check-list-category/check-list-category.module').then(m => m.CheckListCategoryModule)
  // },
  // {
  //   path: 'check-list-type', loadChildren: () => import('./check-list-type/check-list-type.module').then(m => m.CheckListTypeModule)
  // },
  // {
  //   path: 'sub-category', loadChildren: () => import('./sub-category/sub-category.module').then(m => m.SubCategoryModule)
  // },
  {
    path: 'location', loadChildren: () => import('./location/location.module').then(m => m.LocationModule)
  },
  {
    path: 'vendor', loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule)
  },
  //   {
  //   path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationSettingRoutingModule { }
