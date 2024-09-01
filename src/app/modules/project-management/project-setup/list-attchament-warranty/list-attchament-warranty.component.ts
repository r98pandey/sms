

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
import { AddUploadMainateaanceAttachmentComponent } from '../add-upload-mainateaance-attachment/add-upload-mainateaance-attachment.component';
import { AddUploadAttchamentWarrantyComponent } from '../add-upload-attchament-warranty/add-upload-attchament-warranty.component';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';

@Component({
  selector: 'app-list-attchament-warranty',
  templateUrl: './list-attchament-warranty.component.html',
  styleUrl: './list-attchament-warranty.component.scss'
})
export class ListAttchamentWarrantyComponent implements OnInit {
  @Input() projectId: any;
  @Input() projectWarrentyId: any;
  @Input() projectWarrentyName: any;
  @Input() projectAttachment: any[] = [];
  @Input() ProjectWarrentyStatusId: any;
  @Input() ProjectWarrentyStatusName: any;
  @Input()  dDetail:any;
  @Output() completeProcess = new EventEmitter()
  imageUrl: any = environment.apiUrl;

  constructor(private commonHttpServiceCallerService: CommonHttpServiceCallerService,
    public commonFunctionService: CommonFunctionService,
    private lightbox: Lightbox,
    private projectScheduleService: ProjectScheduleService,
    private modalService: NgbModal, private authService: AuthAssetService,) {
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



  confirmDelete(projectWarrentyId: any) {
    let payload = {
      ProjectId: this.projectId,
      ProjectWarrentyDocId: projectWarrentyId
    }

    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "You are about to delete a warranty Document?";
    modalRef.componentInstance.subTitle =
      "Deleting your warranty Document will remove all of your information from our database.";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.DeleteV2_ProjectWarrentyDocDelete(payload);
        }
      }
    });
  }

  DeleteV2_ProjectWarrentyDocDelete(payload) {
    let url = 'api/ProjectManagement/DeleteV2_ProjectWarrentyDocDelete'
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


  openModalUploadeAttachments() {
    console.log("ProjectWarrentyId", this.projectWarrentyId, this.projectId)

    const modalRef = this.modalService.open(AddUploadAttchamentWarrantyComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.projectWarrentyId = this.projectWarrentyId;
    modalRef.componentInstance.listOfDocumentAlreadyUpload = this.projectAttachment ? this.projectAttachment : []

    modalRef.result.then((result) => {
      if (result) {
        if (result.code == "200") {
          this.success(result)
          this.completeProcess.emit(result)
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
    modalRef.componentInstance.title = 'You cannot ' + type + '  document because the warranty is under ' + this.ProjectWarrentyStatusName + ' .';
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
  downloadFileDocument(fileUrl:any,) {
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
