
import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from 'src/app/core/services/department.service';
import Swal from 'sweetalert2';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { environment } from 'src/environments/environment';
import { Lightbox } from 'ngx-lightbox';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';
@Component({
  selector: 'app-view-new-proccess',
  templateUrl: './view-new-proccess.component.html',
  styleUrl: './view-new-proccess.component.scss'
})
export class ViewNewProccessComponent implements OnInit, OnChanges {
  @Input() projectDepartmentId: any;
  @Input() projectProcessHeaderDocId: any;
  @Input() dDetail:any;
  @Input() projectProcessId:any;
  @Input() projectProcessHeaderDocStatusId:any
  apiurl: any = environment.apiUrl;
  @Input() isCompleted:boolean;
  
  followUpMemberList: any = []
  public Editor = ClassicEditor;
  selectedTechList: any = [];
  statusList: any[] = [];
  selectedStatus: any = null;
  editiorDescription: any = null;
  projectProcessDocList: any[] = [];
  followUpDetailObject: any;

  constructor(private authService: AuthAssetService,
    public modal: NgbOffcanvas,
    private lightbox: Lightbox,
    private commonFunctionService: CommonFunctionService,
    private departmentService: DepartmentService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {

    this.getMX_ProjectProcessHeaderDocDetail();
    

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("hh",this.dDetail)
  }
  close(value: any) {
    this.modal.dismiss(value)
  }

  getMX_ProjectProcessHeaderDocDetail() {
    let payload = {
      ProjectProcessHeaderDocId: this.projectProcessHeaderDocId
    }
    this.departmentService.getMX_ProjectProcessHeaderDocDetail(payload).subscribe((res: any) => {
      this.followUpDetailObject = res.obj
      console.log("followUpDetailObject",this.followUpDetailObject);
    })

  }


  toUpperCaseword(data: string) {
    if (data) return data.toUpperCase();
    return "";
  }

  submitDescription() {
    let requestData: any = {
      ProjectProcessHeaderDocId: this.projectProcessHeaderDocId,
      Remark: this.editiorDescription
    };
    this.departmentService.updateMX_ProjectProcessHeaderDocRemark(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.getMX_ProjectProcessHeaderDocDetail();
      },
      (err) => {
        this.error(err);
      }
    );

  }

  error(err: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err,
      showConfirmButton: false,
      timer: 1000,
    });
  }
  success(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }


  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  transformInnerHTML(string: any) {
    return this.commonFunctionService.transform(string);
  }


  goToLink(url: string) {
    window.open(environment.apiUrl + url, "_blank");
  }

  open(image): void {
    const album = {
      src: environment.apiUrl + image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }

  linkVideo: any = ''
  openModaVideeo(link, content) {
    this.linkVideo = environment.apiUrl + link;
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    modalRef.result.then((result) => {
      if (result) {
        if (result == "confirm") {

        }
      }
    });
  }

  warning(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: res,
      showConfirmButton: false,
      timer: 3000,
    });
  }


  openModalPopup(content: any): void {
    if(this.dDetail.departmentStatusId==49){
      const modalRef = this.modalService.open(MessageModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = 'You cannot be start the project because the  Project status is deleted.';
      modalRef.componentInstance.subTitle = "";
      modalRef.componentInstance.buttonName = 'Ok'
      modalRef.result.then((result) => {
        //console.log(result, "result");
        if (result) {
          if (result == "Close click") {
          
          }
        }
      
      });

    }else{
    this.editiorDescription = this.followUpDetailObject.remark;
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
  }
  }
  getUodateHeader(event){
    this.getMX_ProjectProcessHeaderDocDetail()
  }
}


