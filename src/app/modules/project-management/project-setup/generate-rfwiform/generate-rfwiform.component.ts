
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormArray,
  Validators,
  AbstractControl,
  FormArray,
} from "@angular/forms";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { LocationService } from "src/app/core/services/location.service";
import { DepartmentService } from "src/app/core/services/department.service";
import Swal from "sweetalert2";
import { UserProfileService } from "src/app/core/services/user.service";
import { DomSanitizer } from "@angular/platform-browser";
import { NgxDropzoneComponent } from 'ngx-dropzone';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { Observable, Subscription, catchError, concatMap, from, map, of, tap } from "rxjs";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { EditRwifFormComponent } from "../edit-rwif-form/edit-rwif-form.component";

import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
interface FileWithRemark {
  file: File;
  remark: string;
  imageUrl: string
}
@Component({
  selector: 'app-generate-rfwiform',
  templateUrl: './generate-rfwiform.component.html',
  styleUrl: './generate-rfwiform.component.scss'
})
export class GenerateRFWIFormComponent implements OnInit, OnChanges {
  @Input() dDetail: any;
  // @Output() submitAfterQuotation = new EventEmitter();
  editiorDescription: any = []
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild("openAfter", { static: true })
  openAfter: ElementRef;
  @Input() projectProcessId: any;
  @Input() projectProcessHeaderDocId: any
  @Input() selectedTab: any = {};
  @Input() followUpDetailObject: any
  @Output() getUodate = new EventEmitter();
  InvoicesForm!: UntypedFormGroup;
  counter = [];
  imgUrl: any = environment.apiUrl;
  locationList: any[] = [];
  projectProcessDocList: any = [];
  maxCharsDecision = 300;
  selectedCity: any
  supervisorList: any = [];
  clientList: any = [];

  supervisorStoreValue: any;
  clientStoreValue: any;
  loadingForSubmitBtn: boolean;
  locationStoreValue: any = [];
  rfwiId: any;
  uploadShown: boolean = false;

  viewRFWIPage: boolean = false;
  selectedLocationName: string | null = null;
  activeId = 1
  pasteImageAll: any[] = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private locationService: LocationService,
    private departmentService: DepartmentService,
    private userService: UserProfileService,
    private sanitizer: DomSanitizer,
    private NgbOffcanvas: NgbOffcanvas, private cdr: ChangeDetectorRef
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getLocation(this.dDetail.companyId, this.dDetail.departmentId);
    this.loadSupervisor();
    this.getClientListByCompany(this.dDetail.companyId, this.dDetail.departmentId)
  }


  getClientListByCompany(companyId: any, departmentId: any) {
    let paylod = {

      displayLength: 20000,
      displayStart: 0,
      SearchProjectId: departmentId ,
      ProjectId:departmentId,
      SearchUserType: "Client"
    }
    this.departmentService
      .GetV2_GetMX_ProjectUserAccessList_ServerPaging(paylod)
      .subscribe((res: any) => {
        this.clientList = res.list;

      });
  }
  ngOnInit(): void {
    this.InvoicesForm = this.formBuilder.group({
      items: this.formBuilder.array([this.initRows()]),
      inspectionby: [null, [Validators.required]],
      supervisor: [null, [Validators.required]],
      location: [null, [Validators.required]],
      comment: ['', [Validators.required]]
    });
  }

  get inspectionby() {
    return this.InvoicesForm.get("inspectionby");
  }
  get supervisor() {
    return this.InvoicesForm.get("supervisor");
  }
  get location() {
    return this.InvoicesForm.get("location");
  }
  get comment() {
    return this.InvoicesForm.get("comment");
  }

  onChangeSupervisor(value) {
    this.supervisorStoreValue = value;
    console.log(this.inspectionby.value)

  }
  onChangeClient(value) {
    this.clientStoreValue = value;

  }
  onChangeLocation(value) {
    console.log("inside location")
    this.locationStoreValue = value; console.log("get location", this.locationStoreValue)

  }


  /**
   *
   * @param id
   * @description  for getting  location list by department and companyId
   */
  getLocation(companyId: any, projectId: any) {
    this.locationService
      .getLocationByCompanyIdDepartmentId(companyId, projectId)
      .subscribe((res: any) => {
        this.locationList = res.data;

        this.locationList.forEach((ele) => {
          if (ele.locationName == "Not Applicable") {
            this.location.setValue(ele.locationId);
            this.selectedLocationName = ele.locationName;

          }
        });
      });
  }

  //add image row

  triggerImageUpload() {
    // Programmatically trigger click event on the file input element
    this.fileInput.nativeElement.click();
  }

  removeItemImage(index: any) {

    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to remove a Remark and Image ?";
    modalRef.componentInstance.subTitle =
      "Removing your Remark and Image will remove for this Remark and Image ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.files.splice(index, 1);
        }
      }
    });
  }
  deleteBoxItem(index: any) {

    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to delete the item ?";
    modalRef.componentInstance.subTitle =
      "Removing your item  will remove for this table ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.removeItem(index)
        }
      }
    });
  }

  initImageRows() {
    return this.formBuilder.group({
      nameImage: [''],
      remarkImage: [''],
    });
  }

  initRows() {
    return this.formBuilder.group({
      itemName: ['', [Validators.required]],
      remark: ['', [Validators.required]],
    });
  }

  get itemsValueControl(): FormArray {
    return this.InvoicesForm.get("items") as FormArray;
  }

  // Add Item
  addItem(
    i,

  ): void {
    this.formArr.push(this.initRows());
    this.counter[i] = 0;
  }
  get formArr() {
    return this.InvoicesForm.get("items") as FormArray;
  }
  removeItem(index: any) {
    (this.InvoicesForm.get("items") as UntypedFormArray).removeAt(index);
    this.counter.splice(index, 1);
  }

  loadSupervisor(): void {

    let payload: any = {
      displayLength: 1000,
      displayStart: 0,
      SearchCompanyId: this.dDetail.companyId,
      SearchClientId: this.dDetail.clientId,
      SearchProjectId: this.dDetail.projectId
    }
    this.departmentService
      .GetV2_UserListApplication(payload)
      .subscribe(
        (response: any) => {
          if (response) {
            this.supervisorList = response?.data;
          }
        }
      );

  }

  submitGenerateRfw() {

    this.loadingForSubmitBtn = true;
    let mX_rwifItem = [];
    this.InvoicesForm.value.items.forEach((element) => {
      mX_rwifItem.push({
        RFWIItemName: element.itemName,
        Remark: element.remark
      });
    });
    let payload = {
      ProjectProcessHeaderDocId: this.projectProcessHeaderDocId,
      InspectionById: this.inspectionby.value+'',
      InspectionByName: this.clientStoreValue?.fullName,
      InspectionByDesignation: this.clientStoreValue?.accessGroupName,
      InspectionByContactNo: this.clientStoreValue?.phoneNumber,
      SupervisorById: this.supervisorStoreValue?.id,
      SupervisorByName: this.clientStoreValue?.accessGroupName,
      SupervisorByDesignation: this.clientStoreValue?.accessGroupName,
      SupervisorByContactNo: this.supervisorStoreValue?.phoneNumber,
      LocationId: this.location?.value,
      LocationName: this.selectedLocationName,
      Comment: this.comment?.value,
      RefNo: this.followUpDetailObject?.refNo,
      mX_ProjectProcessRFWIItem: mX_rwifItem,
    }

    this.departmentService.createV2_MX_ProjectProcessRFWI(payload).subscribe((res: any) => {
      this.success(res);
      this.loadingForSubmitBtn = false;
      this.rfwiId = res.rfwiId;
      if (this.rfwiId) {
        this.openUploaderFile();

      }

    })


  }


  afterSubmitModalOpen() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.subTitle1 = "Your RWI data has been generated.";
    modalRef.componentInstance.subTitle2 = "Would you like to proceed to view the next process verification form? ";
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.viewRFWIPage = true;
        } else {
          this.router.navigate(['/project-management/project-setup/list-project'])
        }
      }
    });
  }



  openUploaderFile() {
    this.uploadShown = true
    this.startUpload()
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


  files: FileWithRemark[] = [];
  showExistFileLabel: boolean = false;
  getImageUrl(file: File): string {
    return URL.createObjectURL(file);
  }
  onSelect(event: any) {
    const filesWithRemarks = event.addedFiles.map((file: File) => ({
      file: file,
      remark: '',
      imageUrl: URL.createObjectURL(file) // Create Blob URL
    }));

    // Push the new objects into the 'files' array
    this.files.push(...filesWithRemarks);

    this.cdr.detectChanges();

  }
  onRemove(index) {
    this.files.splice(index, 1);
  }

  totalFiles = 0;
  currentFileIndex = 0;
  progress = 0;
  uploadSubscription: Subscription;

  isopenModal(content: any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }


  startUpload() {
    this.isopenModal(this.openAfter);
    this.totalFiles = this.files.length;
    this.progress = 0;
    this.currentFileIndex = 0; // Current index of file being uploaded

    const observables$ = from(this.files).pipe(
      concatMap((fileWithRemark, index) => {
        const jsonPayload: any = {
          RFWIId: this.rfwiId,
          RFWIImageRemark: fileWithRemark.remark || '',
          type: "Image"
        };

        if (fileWithRemark.file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.readAsDataURL(fileWithRemark.file);
          return new Observable(subscriber => {
            reader.onload = () => {
              jsonPayload.RFWIImageBase64 = (reader.result as string).split(',')[1];
              this.departmentService.uploadV2_MX_ProjectProcessRFWIImages(jsonPayload).pipe(
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
          // Ignore non-image files or handle them as needed
          return of({ success: false, message: "Skipped non-image file", fileName: fileWithRemark.file.name });
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
        console.log('All image uploads completed.');
        this.success({ message: 'All image files uploaded successfully.' });
        this.modalService.dismissAll();

        this.afterSubmitModalOpen();
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



  EditRwifFormComponent() {
    const modalRef = this.modalService.open(EditRwifFormComponent, {
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

    });
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
    this.files[index].remark = this.editiorDescription[index]
  }
}



