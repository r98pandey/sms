
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { ProjectFileUploadWithoutTypeComponent } from 'src/app/shared/components/project-file-upload-without-type/project-file-upload-without-type.component';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CommonHttpServiceCallerService } from 'src/app/core/services/common-http-service-caller.service';


@Component({
  selector: 'app-project-work-progress-sub-task-document-upload',
  templateUrl: './project-work-progress-sub-task-document-upload.component.html',
  styleUrl: './project-work-progress-sub-task-document-upload.component.scss'
})
export class ProjectWorkProgressSubTaskDocumentUploadComponent implements OnInit {
  @Input() startTaskAccessRight: boolean
  @Input() typeView: any
  @Input() TaskId: any;
  @Input() SubTaskId: any;
  @Input() ScheduleNo: any;
  @Input() statusValue: any
  imageUrl: any = environment.apiUrl;
  projectAttachment: any[] = [];
  currentUserRole: any;
  currentUserId: any;
  currentUserAccessGroup: any;
  createdBy: any;
  projectOwnerId: any;
  constructor(private commonHttpServiceCallerService: CommonHttpServiceCallerService, private lightbox: Lightbox, private projectScheduleService: ProjectScheduleService, private modalService: NgbModal, private authService: AuthAssetService,) {
  }

  ngOnInit(): void {
    this.currentUserRole = JSON.parse(localStorage.getItem("currentUser")).role;
    this.currentUserId = JSON.parse(localStorage.getItem("currentUser")).userId;
    this.currentUserAccessGroup = JSON.parse(localStorage.getItem("currentUser")).accessGroupName;

    if (this.typeView == 'task') {
      this.getV2_ProjectTaskAttachementlist();
    } else {
      this.getV2_ProjectSubTaskAttachementlist()
    }
  } open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums, 0, { showZoom: true, });
  }

  shownTheUploadButton() {
    if (this.typeView == 'task') {
      return this.currentUserRole == 'System Administrator' || this.currentUserRole == 'Super Admin' || this.createdBy?.createdById == this.currentUserId

    } else {
      return this.currentUserRole == 'System Administrator' || this.currentUserRole == 'Super Admin' || this.createdBy?.createdById == this.currentUserId || this.projectOwnerId == this.currentUserId
    }
  }
  getV2_ProjectTaskAttachementlist() {
    let paylod = {
      TaskId: this.TaskId
    }
    this.projectScheduleService.getV2_ProjectTaskAttachementlist(paylod).subscribe((res: any) => {
      this.projectAttachment = res.list
    })
  }

  getV2_ProjectSubTaskAttachementlist() {
    let paylod = {
      SubTaskId: this.SubTaskId
    }
    this.projectScheduleService.getV2_ProjectSubTaskAttachementlist(paylod).subscribe((res: any) => {
      this.projectAttachment = res.list
    })
  }
  downloadFIle(file: any) {
    // let con = file.fileName.split(".")
    // let payload = {
    //   FileURL: file.fileURL,
    //   ContentType: 'application/' + con[con.length - 1]
    // }
    // this.ticketService.downloadTikcetFile(payload).subscribe((data: Blob) => {
    //   const blob = new Blob([data], { type: "application/octet-stream" });
    //   const link = document.createElement("a");
    //   link.download = file.fileName;
    //   link.href = window.URL.createObjectURL(blob);
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   window.URL.revokeObjectURL(link.href);
    // });

  }

  getFileIcon(file: any): string {
    if (file) {


      const extension = file.split('.').pop()?.toLowerCase();
      if (!extension) {
        return 'Unknown';
      }
      const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
      const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
      const videoExtensions = ['mp4', 'avi', 'mkv', 'mov'];
      const zipExtensions = ['zip'];
      const rarExtensions = ['rar'];
      const dwgExtensions = ['dwg'];

      if (imageExtensions.includes(extension)) {
        return 'ri-image-line b2';
      } else if (documentExtensions.includes(extension)) {
        return "ri-file-line";
      } else if (videoExtensions.includes(extension)) {
        return 'ri-video-line';
      } else if (zipExtensions.includes(extension)) {
        return 'ri-folder-zip-line';
      } else if (dwgExtensions.includes(extension)) {
        return 'ri-folder-zip-line';
      } else if (rarExtensions.includes(extension)) {
        return 'ri-survey-fill';
      } else {
        return 'ri-file-list-line';
      }
    } else {
      return null
    }
  }

  openUploaadDocumentAttachment(listOfDocumentAlreadyUpload: any = []) {
    const modalRef = this.modalService.open(ProjectFileUploadWithoutTypeComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.listOfDocumentAlreadyUpload = listOfDocumentAlreadyUpload ? listOfDocumentAlreadyUpload : []

    modalRef.result
      .then((result) => {
        if (result.type == 'upload') {
          console.log(result, "submitAttachment")
          this.submitAttachment(result)
        }
      })
      .catch((result) => {
        console.log("result", result)

      });


  }


  submitAttachment(res: any) {
    const formdata = new FormData();
    if (this.typeView == 'task') {
      formdata.append("TaskId", this.TaskId);
    } else {
      formdata.append("SubTaskId", this.SubTaskId);
    }
    formdata.append("ScheduleNo", this.ScheduleNo);
    if (res.remark) {
      formdata.append("Remark", res.remark);
    }
    if (res.file) {
      formdata.append("FileType", res.fileType);
      formdata.append("file", res.file, res.file.name);
      formdata.append("fileName", res.fileName);
    }
    if (this.typeView == 'task') {
      this.projectScheduleService.createV2_ProjectTaskAttachement(formdata).subscribe((res) => {
        this.success(res);
        this.getV2_ProjectTaskAttachementlist();
      });
    } else {
      this.projectScheduleService.createV2_ProjectSubTaskAttachement(formdata).subscribe((res) => {
        this.success(res);
        this.getV2_ProjectSubTaskAttachementlist()
      });
    }
  }

  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  success_new(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res,
      showConfirmButton: false,
      timer: 3000,
    });
  }


  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;

  storeInfomationVideo: any = '';
  linkVideo: any = '';
  openModaVideeo(link, content) {
    this.storeInfomationVideo = link

    if (link.attachmentURL) {
      this.linkVideo = environment.apiUrl + link.attachmentURL;
    } else {
      this.linkVideo = environment.apiUrl + link.fileURL;
    }
    //this.linkVideo = environment.apiUrl + link.fileURL;
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
  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }
  playPause() {
    var myVideo: any = document.getElementById("my_video_1");
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }


  storeInfomationImage: any = '';
  linkImage: any = '';
  openModaImage(link: any, content: any) {
    this.storeInfomationImage = link
    console.log("attachmentURL", link)
    this.linkImage = environment.apiUrl + link.fileURL;
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

  downloadFile(fileURL: string, fileName: string): void {
    fetch(fileURL)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .catch(error => console.error('Download failed:', error));
  }

  downloadFileDocument(fileUrl: any,) {
    let con = fileUrl.substring(fileUrl.lastIndexOf('\\') + 1).split(".")
    let payload = {
      FileURL: fileUrl,
      ContentType: 'application/' + con[con.length - 1]
    }
    this.commonHttpServiceCallerService.downloadTikcetFile(payload).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.download = fileUrl.substring(fileUrl.lastIndexOf('\\') + 1);
      link.href = window.URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    });
  }


}
