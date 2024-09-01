import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DeliveryNoteComponent } from "./delivery-note.component";
import { DeliveryNoteListComponent } from "./delivery-note-list/delivery-note-list.component";
import { DeliveryNoteAddComponent } from "./delivery-note-add/delivery-note-add.component";
import { DeliveryNoteViewComponent } from "./delivery-note-view/delivery-note-view.component";

const routes: Routes = [
  {
    path: "",
    component: DeliveryNoteComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "list-delivery" },
      { path: "list-delivery", component: DeliveryNoteListComponent },
      { path: "add-delivery", component: DeliveryNoteAddComponent },
      { path: "view-delivery", component: DeliveryNoteViewComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryNoteRoutingModule {}
