import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetmanagementComponent } from './assetmanagement.component';
import { AssetManagementRoutingModule } from './assetmanagement-routing-module';



@NgModule({
  declarations: [AssetmanagementComponent],
  imports: [
    CommonModule,
    AssetManagementRoutingModule
  ]
})
export class AssetmanagementModule { }
