import { Component, Input, OnInit } from "@angular/core";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { Lightbox } from "ngx-lightbox";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-check-schedule",
  templateUrl: "./check-schedule.component.html",
  styleUrls: ["./check-schedule.component.scss"],
})
export class CheckScheduleComponent implements OnInit {
  @Input() pm_ScheduleAndAssetCheckList: any;
  isProject: boolean = false;
  baseUrl: any;
  constructor(
    public modal: NgbOffcanvas,
    private auth: AuthAssetService,
    private lightbox: Lightbox,
    private commonFunctionService: CommonFunctionService
  ) {
    this.baseUrl = environment.apiUrl;
    this.isProject = this.auth.getisProject();
  }

  ngOnInit(): void {
    //console.log(this.pm_ScheduleAndAssetCheckList);
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

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
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
