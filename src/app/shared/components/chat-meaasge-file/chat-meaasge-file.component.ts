import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { environment } from 'src/environments/environment';
import { AuthAssetService } from '../../../core/services/auth-asset.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { CommonHttpServiceCallerService } from '../../../core/services/common-http-service-caller.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat-meaasge-file',
  templateUrl: './chat-meaasge-file.component.html',
  styleUrl: './chat-meaasge-file.component.scss'
})
export class ChatMeaasgeFileComponent implements OnChanges {

  @Output() AfterDeleteCall = new EventEmitter();
  @Input() chat: any;
  @Input() singlerow: boolean;
  @Input() deleteUrl: string;
  @Input() payloadName: string;
  @Input() viewDeleteButton: boolean


  imageUrl: any = environment.apiUrl;
  currentUserId: any;
  constructor(private modalService: NgbModal, private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private lightbox: Lightbox, private authAssetService: AuthAssetService) {
    this.currentUserId = this.authAssetService.getUserInfoID();

  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("chat", this.chat)msgById
  }

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
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

  downloadFileDocument(fileUrl:any,) {
  

    let con = fileUrl.substring(fileUrl.lastIndexOf('\\') + 1).split(".")
    let payload = {
      FileURL: fileUrl,
      ContentType: 'application/' + con[con.length - 1]
    }
    this.CommonHttpServiceCallerService.downloadTikcetFile(payload).subscribe((data: Blob) => {
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

  storeInfomationImage: any = '';
  linkImage: any = '';
  openModaImage(link: any, content: any) {
    this.storeInfomationImage = link
    console.log("attachmentURL", link)
    this.linkImage = environment.apiUrl + link.attachmentURL;
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

  openModalDelete(value: any,) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = 'Are you sure you want to delete this message';
    modalRef.componentInstance.subTitle = "You won't be able to revert this";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteApiCallOfMessage(value);
        }
      }
    });
  }
  deleteApiCallOfMessage(value) {
    let payload = {};
    payload[this.payloadName] = value[this.payloadName];
    let url = this.deleteUrl;
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe((res) => {
      this.AfterDeleteCall.emit(true);
      this.success(res);
    })

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

}
