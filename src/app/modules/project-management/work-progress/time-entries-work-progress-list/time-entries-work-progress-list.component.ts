
import { Component, Input, OnInit } from '@angular/core';
import { NgbOffcanvas, NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-time-entries-work-progress-list',
  templateUrl: './time-entries-work-progress-list.component.html',
  styleUrl: './time-entries-work-progress-list.component.scss'
})
export class TimeEntriesWorkProgressListComponent implements OnInit {
  @Input() ProjectTaskId:any;
  @Input() TaskType:any;
  list:any=[];
  viewTimeEntiresDetail:any
  imgUrl:any=environment.apiUrl;
  totalRecords: number;
  pageSize: number = 10;
  pageNo: number;
  from = 0;
  to = 0;
  page = 1;
  payload: any = {
    displayLength: 10,
    displayStart: 0,
    ProjectTaskId: null,
    TaskType:null
  };

  constructor(
    private projectScheduleService: ProjectScheduleService,
    private offcanvasService: NgbOffcanvas,
    public activeOffcanvas: NgbActiveOffcanvas,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
    private authService: AuthAssetService,
    private lightbox: Lightbox
  ) {}

  ngOnInit(): void {
    this.getV2_TechAttendanceTaskSubTaskList_ServerPaging();
  }

  getV2_TechAttendanceTaskSubTaskList_ServerPaging(): void {
  this.payload.ProjectTaskId=this.ProjectTaskId,
  this.payload.TaskType=this.TaskType
    this.projectScheduleService
      .getV2_TechAttendanceTaskSubTaskList_ServerPaging(this.commonFunctionService.clean(this.payload))
      .subscribe(
        (res: any) => {
          this.list = res?.list;
          if (this.list.length > 0) {
            this.totalRecords = res.list[0].totalCount;
            this.from = res.list.reduce(
              (min, p) => (p.rowNum < min ? p.rowNum : min),
              res.list[0].rowNum
            );
            this.to = res.list.reduce(
              (max, p) => (p.rowNum > max ? p.rowNum : max),
              res.list[0].rowNum
            );
            this.pageSize = this.payload.displayLength;
          } else {
            this.totalRecords = 0;
            this.from = 0;
            this.to = 0;
            this.pageSize = this.payload.displayLength;
          }
        },
        (err) => {
        
        }
      );
  }

  loadPage(pageNo: number) {
    this.pageNo = pageNo;
    this.payload.displayLength = this.pageSize;
    this.payload.displayStart = this.pageSize * (pageNo - 1);
    this.getV2_TechAttendanceTaskSubTaskList_ServerPaging();

  }

  viewHandler(content ,data){
    this.viewTimeEntiresDetail=data;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
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
