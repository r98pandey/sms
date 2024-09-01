import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FileManagerComponent } from "./file-manager/file-manager.component";
import { NewFileManagerComponent } from "./new-file-manager/new-file-manager.component";

const routes: Routes = [
  {
    path: "",
    //component: FileManagerComponent,
     component: NewFileManagerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileManagerModuleRoutingModule {}
