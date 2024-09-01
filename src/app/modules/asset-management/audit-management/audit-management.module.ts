import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditManagementRoutingModule } from './audit-management-routing-module';
import { AuditManagementComponent } from './audit-management.component';


@NgModule({
  declarations: [AuditManagementComponent],
  imports: [
    CommonModule,
    AuditManagementRoutingModule
  ]
})
export class AuditManagementModule { }
