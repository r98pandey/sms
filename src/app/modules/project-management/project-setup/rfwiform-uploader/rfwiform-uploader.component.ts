import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DepartmentService } from 'src/app/core/services/department.service';
import Swal from 'sweetalert2';
import { from, forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { environment } from 'src/environments/environment';
import { Lightbox } from 'ngx-lightbox';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';
interface FileWithRemark {
  file: File;
  remark: string;
}
  @Component({
    selector: 'app-rfwiform-uploader',
    templateUrl: './rfwiform-uploader.component.html',
    styleUrl: './rfwiform-uploader.component.scss'
  })
  export class RfwiformUploaderComponent implements OnInit, OnChanges {
  editiorDescription: any = null;
  @ViewChild("openAfter", { static: true })
  openAfter: ElementRef;
  @Input() RFWIId: any;
  storeFileUpload: any[] = [];
  public Editor = ClassicEditor;
  constructor(private lightbox: Lightbox,
     private departmentService: DepartmentService, 
     private modalService: NgbModal, private NgbOffcanvas:NgbOffcanvas,
     private commonFunctionService: CommonFunctionService) {

  }
  showlistpostion: boolean = true;



  uploadFile() {
    this.files = []
  }

  

  ngOnChanges(changes: SimpleChanges): void {
   
  }
  ngOnInit(): void {

  }


  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  getMX_ProjectProcessDocList() {
    let payload = {
      RFWIId: this.RFWIId
    }
    this.departmentService.getMX_ProjectProcessDocList(payload).subscribe((res: any) => {
      this.storeFileUpload = res.list
    })
  }
  files: FileWithRemark[] = [];
  showExistFileLabel: boolean = false;
  onSelect(event: any) {
    const filesWithRemarks = event.addedFiles.map((file: File) => ({
      file: file,
      remark: ''
    }));

    // Push the new objects into the 'files' array
    this.files.push(...filesWithRemarks);

  }
  onRemove(index) {
    this.files.splice(index, 1);
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
  errorFile(err: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err,
      showConfirmButton: false,
      timer: 6000,
    });
  }


  openModalPopup(content: any, index: number, remark: any): void {
    this.editiorDescription = remark ? remark : null;
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      }).result.then(
        (result) => {
          this.submitDescription(index);
          this.editiorDescription = null;
        },
        (reason) => { }
      );

  }
  isopenModal(content: any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  openModalPopupEditRemark(content: any, data: any): void {
    this.editiorDescription = data.remark;
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      }).result.then(
        (result) => {
          this.submitRemark(data);

        },
        (reason) => { }
      );

  }

  submitRemark(data) {

    let requestData: any = {
      ProjectProcessDocId: data.projectProcessDocId,
      Remark: this.editiorDescription
    };
    this.departmentService.updateMX_ProjectProcessDocRemark(requestData).subscribe(
      (res: any) => {
        this.success(res);

        this.getMX_ProjectProcessDocList();
        this.editiorDescription = null
      },
      (err) => {
        this.error(err);
      }
    );

  }
  // submitprocessFromDetails(): void {
  //   if (!this.files.length) {

  //     return;
  //   }

  //   const observables = this.files.map(fileWithRemark => {
  //     const formData = new FormData();
  //     formData.append("RFWIId", this.RFWIId);
  //     formData.append("file", fileWithRemark.file, fileWithRemark.file.name);
  //     formData.append("remark", fileWithRemark.remark);
  //     return this.departmentService.uploadV2_MX_ProjectProcessRFWIImages(formData).pipe(
  //       catchError(error => {
  //         console.error('Upload failed for file: ', fileWithRemark.file.name, error);
  //         return from([]); 
  //       })
  //     );
  //   });

  //   forkJoin(observables).subscribe({
  //     next: (responses) => {
  //       this.success({ message: "All files uploaded successfully!" });
  //       this.openList();
  //     },
  //     error: (error) => {
  //       console.error('An error occurred during file uploads:', error);
  //     },
  //     complete: () => {
  //       console.log('All uploads completed.');
  //     }
  //   });
  // }
  totalFiles = 0;
  currentFileIndex = 0;
  progress = 0;
  uploadSubscription: Subscription;
 
  startUpload() {
    this.isopenModal(this.openAfter);
    this.totalFiles = this.files.length;
    this.progress = 0;
    this.currentFileIndex = 0; // Current index of file being uploaded

    const observables$ = from(this.files).pipe(
      concatMap((fileWithRemark, index) => {  // Use the second parameter index for more control
        const formData = new FormData();
        formData.append("RFWIId", this.RFWIId);
        formData.append("title", fileWithRemark.file.name);
        if (fileWithRemark.remark) {
          formData.append("RFWIImageRemark", fileWithRemark.remark);
        }
    
        const fileType = fileWithRemark.file.type;
        if (fileType.startsWith('image/')) {
          const reader = new FileReader();
          reader.readAsDataURL(fileWithRemark.file);
          return new Observable(subscriber => {
            reader.onload = () => {
              formData.append("RFWIImageBase64", (reader.result as string).split(',')[1]);
              formData.append("type", "Image");
              this.departmentService.uploadV2_MX_ProjectProcessRFWIImages(formData).pipe(
                catchError(error => {
                  console.error('Upload failed for image:', fileWithRemark.file.name, error);
                  return of({ success: false, fileName: fileWithRemark.file.name });
                })
              ).subscribe({
                next: (response) => {
                  subscriber.next({ success: true, fileName: fileWithRemark.file.name });
                  subscriber.complete();
                },
                complete: () => {
                  this.currentFileIndex = index + 1; // Increment after successful upload
                  this.updateProgress();
                }
              });
            };
            reader.onerror = (error) => {
              console.error('Error loading image:', error);
              subscriber.error({ success: false, fileName: fileWithRemark.file.name });
              this.updateProgress();
            };
          });
        } else {
          formData.append("file", fileWithRemark.file, fileWithRemark.file.name);
          formData.append("type", fileType.startsWith('video/') ? "Video" : "Document");
          return this.departmentService.uploadV2_MX_ProjectProcessRFWIImages(formData).pipe(
            catchError(error => {
              console.error(`Upload failed for ${fileType.startsWith('video/') ? 'video' : 'document'}:`, fileWithRemark.file.name, error);
              return of({ success: false, fileName: fileWithRemark.file.name });
            }),
            tap({
              next: (response) => {
                this.currentFileIndex = index + 1; // Increment after successful upload
                this.updateProgress();
              }
            }),
            map(response => ({ success: true, fileName: fileWithRemark.file.name }))
          );
        }
      })
    );
    
    this.uploadSubscription = observables$.subscribe({
      next: (response:any) => {
        console.log("Response for file:", response.fileName);
      },
      error: (error) => {
        console.error('An error occurred during file uploads:', error);
      },
      complete: () => {
        console.log('All uploads completed.');
        this.success({ message: 'All files uploaded successfully.' });
        this.modalService.dismissAll();
        this.NgbOffcanvas.dismiss();
      }
    });
    
  }

  updateProgress() {
    this.progress = (this.currentFileIndex / this.totalFiles) * 100;
    console.log(`Upload progress: ${this.progress}%`);
  }

  cancelUpload() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
      this.modalService.dismissAll();
      this.openModaWaringConf();

    }
  }

  openModaWaringConf() {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = 'Successfully uploaded file  ' + this.currentFileIndex + ' and terminated file  ' + (this.totalFiles - this.currentFileIndex);
    modalRef.componentInstance.subTitle = "";
    modalRef.result.then((result) => {
      //console.log(result, "result");
      if (result) {
        if (result == "Close click") {
         this.NgbOffcanvas.dismiss();
        }
      }
    });
  }

  submitDescription(index: number) {
    this.files[index].remark = this.editiorDescription
  }

  removeToHtml(str) {
    let st = str.replace(/<[^>]+>/g, '');
    return st.replace('<a href=" ', '')

  }

  removetheWordTicketTitle(str: string) {
    if (str.length >= 130) {
      return str.slice(0, 130) + "...";
    } else {
      return str;
    }
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


  openModalDeleteConf(object) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to delete a Project Process ?";
    modalRef.componentInstance.subTitle =
      "Deleting your Project Process will remove for this Project Process List ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteMX_ProjectProcessDoc(object);
        }
      }
    });
  }

  deleteMX_ProjectProcessDoc(id) {
    this.departmentService.deleteMX_ProjectProcessDoc({ ProjectProcessDocId: id }).subscribe({
      next: (res) => {
        this.getMX_ProjectProcessDocList()
        this.success(res)
      },
    });
  }

}

