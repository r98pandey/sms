

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { CommonHttpServiceCallerService } from 'src/app/core/services/common-http-service-caller.service';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ProjectFileUploadWithoutTypeComponent } from 'src/app/shared/components/project-file-upload-without-type/project-file-upload-without-type.component';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';

@Component({
  selector: 'app-attmachment-agreement-warranty',
  templateUrl: './attmachment-agreement-warranty.component.html',
  styleUrl: './attmachment-agreement-warranty.component.scss'
})
export class AttmachmentAgreementWarrantyComponent implements OnInit {
  @Input() projectId: any;
  @Input() maintenanceId: any;
  @Input() maintenanceStatusId: any
  @Input() projectAttachment: any[] = [];
  @Output() completeProcess = new EventEmitter()
  imageUrl: any = environment.apiUrl;

  constructor(public commonFunctionService: CommonFunctionService,
    private commonHttpServiceCallerService: CommonHttpServiceCallerService,
    private lightbox: Lightbox,
    private projectScheduleService: ProjectScheduleService,
    private modalService: NgbModal,
    private authService: AuthAssetService,) {
  }

  ngOnInit(): void {

  } open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }

  downloadFileDocument(fileUrl:any,) {
    // let filename:any= fileUrl.substring(fileUrl.lastIndexOf('\\') + 1); ;
    // this.commonHttpServiceCallerService.downloadFile(fileUrl, filename).subscribe({
    //   next: () => this.success_new('Download completed successfully'),
    //   error: (err) => console.error('Download failed', err),
    // });
    
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


  // openUploaadDocumentAttachment(listOfDocumentAlreadyUpload: any = []) {
  //   const modalRef = this.modalService.open(ProjectFileUploadWithoutTypeComponent, {
  //     ariaLabelledBy: "modal-basic-title",
  //     size: "lg",
  //     centered: true,
  //     backdrop: "static",
  //     keyboard: false,
  //   });
  //   modalRef.componentInstance.listOfDocumentAlreadyUpload = listOfDocumentAlreadyUpload ? listOfDocumentAlreadyUpload : []

  //   modalRef.result
  //     .then((result) => {
  //       if (result.type == 'upload') {
  //         console.log(result, "submitAttachment")
  //         this.submitAttachment(result)
  //       }
  //     })
  //     .catch((result) => {
  //       console.log("result", result)

  //     });


  // }



  confirmDelete(maintenanceDocId: any) {
    let payload = {
      ProjectId: this.projectId,
      MaintenanceDocId: maintenanceDocId
    }

    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You are about to delete a Maintenance Agreement Document?";
    modalRef.componentInstance.subTitle =
      "Deleting your Maintenance Agreement Document will remove all of your information from our database.";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteV2_ProjectMaintenanceAgreementDocDelete(payload);
        }
      }
    });
  }

  deleteV2_ProjectMaintenanceAgreementDocDelete(payload) {
    let url = 'api/ProjectManagement/DeleteV2_ProjectMaintenanceAgreementDocDelete'
    this.commonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe(
      (res: any) => {
        this.success(res)
        this.completeProcess.emit(res)
      },
      (err: any) => {
        //console.log("error", err);
      }
    );
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

  success_new(res: any) {
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


  processDocUrls(docurl) {
    return this.commonFunctionService.processDocUrls(docurl)
  }
  openModalAfterCanceledUpdloadDelete(type) {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = 'You cannot ' + type + '  document because the maintenance agreement is cancelled.';
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      console.log(result, "result");
      if (result) {
        if (result == "Close click") {

        }
      }
    });
  }
}
