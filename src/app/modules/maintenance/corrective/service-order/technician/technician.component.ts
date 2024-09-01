import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { Lightbox } from "ngx-lightbox";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-technician",
  templateUrl: "./technician.component.html",
  styleUrls: ["./technician.component.scss"],
})
export class TechnicianComponent implements OnInit {
  @Input() ticketingTechnicianList: any;
  isProject: boolean = false;
  baseUrl: any;
  constructor(
    public modal: NgbOffcanvas,
    private auth: AuthAssetService,
    private lightbox: Lightbox
  ) {
    this.baseUrl = environment.apiUrl;
    this.isProject = this.auth.getisProject();
  }

  ngOnInit(): void {
    //console.log(this.ticketingTechnicianList);
  }
  passBack(value) {
    this.modal.dismiss(value);
  }

  returnClassname(task) {
    return (
      "status-workTaskStatuId-" +
      task.woTaskStatusId +
      "-" +
      task.woTaskStatusName
    );
  }
  open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }
}
