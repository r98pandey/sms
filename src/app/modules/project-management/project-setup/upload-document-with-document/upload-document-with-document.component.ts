import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DepartmentService } from 'src/app/core/services/department.service';
import Swal from 'sweetalert2';
import { from, forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { environment } from 'src/environments/environment';
import { Lightbox } from 'ngx-lightbox';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MessageModalComponent } from 'src/app/shared/components/message-modal/message-modal.component';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { CommonHttpServiceCallerService } from 'src/app/core/services/common-http-service-caller.service';


interface FileWithRemark {
  file: File;
  remark: string;
}
@Component({
  selector: 'app-upload-document-with-document',
  templateUrl: './upload-document-with-document.component.html',
  styleUrl: './upload-document-with-document.component.scss'
})
export class UploadDocumentWithDocumentComponent implements OnInit, OnChanges {
  editiorDescription: any = '';
  maxCharsDecision: any = 300;
  imageUrl :any=environment.apiUrl;
  @Input() isCompleted: boolean;
  @Input() dDetail:any;
  @ViewChild("openAfter", { static: true })
  openAfter: ElementRef;
  @Input() projectProcessHeaderDocId: any;
  storeFileUpload: any[] = [];
  public Editor = ClassicEditor;
  @Output() getUodate = new EventEmitter();


  constructor(private commonHttpServiceCallerService:CommonHttpServiceCallerService,private lightbox: Lightbox, private departmentService: DepartmentService, private modalService: NgbModal, private commonFunctionService: CommonFunctionService) {

  }
  showlistpostion: boolean = true;



  uploadFile() {
    this.files = []
    this.showlistpostion = false;
  }

  openList() {
    this.showlistpostion = true
    this.files = []
    this.getMX_ProjectProcessDocList()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getMX_ProjectProcessDocList();
  }
  ngOnInit(): void {

  }


  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  getMX_ProjectProcessDocList() {
    let payload = {
      ProjectProcessHeaderDocId: this.projectProcessHeaderDocId
    }
    this.departmentService.getMX_ProjectProcessDocList(payload).subscribe((res: any) => {
      this.storeFileUpload = res.list
      if (res.list.length != 0) {
        this.showlistpostion = true
      } else {
        if (this.isCompleted || this.dDetail.departmentStatusId==49) {
          this.showlistpostion = false
        } else {
          this.showlistpostion = true
        }

      }
    })
  }
  files: FileWithRemark[] = [];
  onRemove(index) {

    this.files.splice(index, 1);
  }
  showExistFileLabel: boolean = false;


  onSelect(event: any) {
    this.showExistFileLabel = false;
  
    // Map the added files to the required structure
    let checkerFiles: FileWithRemark[] = event.addedFiles.map((file: File) => ({
      file: file,
      remark: ''
    }));
  
    // Get the titles of the files already in storeFileUpload
    let storeFiles = this.storeFileUpload.map((item: any) => item.title);
    console.log("storeFileUpload", storeFiles);
  
    // Filter out the duplicates
    let nonDuplicateFiles = checkerFiles.filter(newFile => {
      let fileName = newFile.file.name;
      
      // Check for duplicates in this.files
      if (this.files.some(existingFile => existingFile.file.name === fileName)) {
        this.showExistFileLabel = true;
        return false;
      }
  
      // Check for duplicates in storeFiles
      if (storeFiles.includes(fileName)) {
        this.showExistFileLabel = true;
        return false;
      }
  
      // No duplicates found
      return true;
    });
  
    // If there are non-duplicate files, add them to this.files
    if (nonDuplicateFiles.length > 0) {
      this.files.push(...nonDuplicateFiles);
    } else {
      // If all files are duplicates, show a warning
      if (this.showExistFileLabel) {
        this.warning();
      }
    }
  }
  
  
  
  warning() {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: 'You cannot upload the same file name.',
      showConfirmButton: false,
      timer: 3000,
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
    this.editiorDescription = remark ? remark : '';
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
          this.editiorDescription = '';
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
        this.editiorDescription = ''
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
  //     formData.append("ProjectProcessHeaderDocId", this.projectProcessHeaderDocId);
  //     formData.append("file", fileWithRemark.file, fileWithRemark.file.name);
  //     formData.append("remark", fileWithRemark.remark);
  //     return this.departmentService.UploadProjectProcessDocument(formData).pipe(
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
  // submitprocessFromDetails(): void {

  //   this.isopenModal(this.openAfter)
  //   if (!this.files.length) {
  //     return;
  //   }

  //   const observables = this.files.map(fileWithRemark => {
  //     const formData = new FormData();
  //     formData.append("ProjectProcessHeaderDocId", this.projectProcessHeaderDocId);
  //     formData.append("title", fileWithRemark.file.name)
  //     if (fileWithRemark.remark) {
  //       formData.append("remark", fileWithRemark.remark);
  //     }

  //     // Determine the file type and handle accordingly
  //     const fileType = fileWithRemark.file.type;
  //     if (fileType.startsWith('image/')) {
  //       // Convert image file to base64 and append as 'image'
  //       const reader = new FileReader();
  //       reader.readAsDataURL(fileWithRemark.file);
  //       return new Observable(subscriber => {
  //         reader.onload = () => {
  //           formData.append("ImageBase64URL", (reader.result as string).split(',')[1]);
  //           formData.append("type", "Image");
  //           console.log(" Start fileWithRemark.file.name", fileWithRemark.file.name)
  //           this.departmentService.UploadProjectProcessDocument(formData).pipe(
  //             catchError(error => {
  //               console.error('Upload failed for image:', fileWithRemark.file.name, error);
  //               return of({ success: false, fileName: fileWithRemark.file.name });
  //             })
  //           ).subscribe(response => {
  //             console.log(" complete fileWithRemark.file.name", fileWithRemark.file.name)
  //             subscriber.next({ success: true, fileName: fileWithRemark.file.name });
  //             subscriber.complete();
  //           });
  //         };
  //         reader.onerror = (error) => {
  //           console.error('Error loading image:', error);
  //           subscriber.error({ success: false, fileName: fileWithRemark.file.name });
  //         };
  //       });
  //     } else {
  //       // Handle video or document
  //       if (fileType.startsWith('video/')) {
  //         formData.append("file", fileWithRemark.file, fileWithRemark.file.name);
  //         formData.append("type", "Video");
  //       } else {
  //         formData.append("file", fileWithRemark.file, fileWithRemark.file.name);
  //         formData.append("type", "Document");
  //       }
  //     console.log(" Start file  fileWithRemark.file.name", fileWithRemark.file.name)
  //       return this.departmentService.UploadProjectProcessDocument(formData).pipe(
  //         catchError(error => {
  //           console.error(`Upload failed for ${fileType.startsWith('video/') ? 'video' : 'document'}:`, fileWithRemark.file.name, error);
  //           return of({ success: false, fileName: fileWithRemark.file.name });
  //         }),
  //         map(response => ({ success: true, fileName: fileWithRemark.file.name }))
  //       );
  //     }
  //   });

  //   forkJoin(observables).subscribe({
  //     next: (responses) => {
  //       console.log("responses",)
  //       const successfulUploads = responses.filter((response:any) => response.success).length;

  //       const failedUploads = responses.length - successfulUploads;
  //       this.success({ message: `${successfulUploads} files uploaded successfully, ${failedUploads} uploads failed.` });
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

  startUpload() {
    this.isopenModal(this.openAfter);
    this.totalFiles = this.files.length;
    this.progress = 0;
    this.currentFileIndex = 0;
    const observables$ = from(this.files).pipe(
      concatMap((fileWithRemark, index) => {  // Use the second parameter index for more control
        const formData = new FormData();
        formData.append("ProjectProcessHeaderDocId", this.projectProcessHeaderDocId);
        formData.append("title", fileWithRemark.file.name);
        if (fileWithRemark.remark) {
          formData.append("remark", fileWithRemark.remark);
        }

        const fileType = fileWithRemark.file.type;
        if (fileType.startsWith('image/')) {
          const reader = new FileReader();
          reader.readAsDataURL(fileWithRemark.file);
          return new Observable(subscriber => {
            reader.onload = () => {
              formData.append("ImageBase64URL", (reader.result as string).split(',')[1]);
              formData.append("type", "Image");
              this.departmentService.UploadProjectProcessDocument(formData).pipe(
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
          return this.departmentService.UploadProjectProcessDocument(formData).pipe(
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
      next: (response: any) => {
        console.log("Response for file:", response.fileName);
      },
      error: (error) => {
        console.error('An error occurred during file uploads:', error);
      },
      complete: () => {
        console.log('All uploads completed.');
        this.success({ message: 'All files uploaded successfully.' });
        this.getUodate.emit(true);
        this.openList();
        this.modalService.dismissAll();
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
          this.openList();
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

  openModalDeletePicture(index) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you sure you want to delete this file?";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.onRemove(index)
        } else {
          //this.onBack();
        }
      }
    });
  }



  openModalDeleteConf(object) {
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
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to delete a File ?";
    modalRef.componentInstance.subTitle =
      "Deleting your File will remove for this Project Process List ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteMX_ProjectProcessDoc(object);
        }
      }
    });
  }}

  deleteMX_ProjectProcessDoc(id) {
    this.departmentService.deleteMX_ProjectProcessDoc({ ProjectProcessDocId: id }).subscribe({
      next: (res) => {
        this.getMX_ProjectProcessDocList()
        this.success(res)
      },
    });
  }

}
