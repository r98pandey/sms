import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from 'src/app/core/services/department.service';
import Swal from 'sweetalert2';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { TechnicianListModalComponent } from 'src/app/shared/components/technician-list-modal/technician-list-modal.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { UploadeAttachmentsComponent } from '../uploade-attachments/uploade-attachments.component';
import { Lightbox } from 'ngx-lightbox';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { EditUploadAttachementsComponent } from '../edit-upload-attachements/edit-upload-attachements.component';
import { forEach } from 'lodash';
import { environment } from 'src/environments/environment';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
@Component({
  selector: 'app-view-event-full-details',
  templateUrl: './view-event-full-details.component.html',
  styleUrl: './view-event-full-details.component.scss'
})
export class ViewEventFullDetailsComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  @Input() dDetail: any
  @Input() followUpId: any;
  @Input() projectDepartmentId: any;
  @Input() checkListOpen: number;
  apiurl: any = environment.apiUrl;
  tooltipVisibleEditDescription: boolean
  followUpMemberList: any = []
  public Editor = ClassicEditor;
  selectedTechList: any = [];
  statusList: any[] = [];
  selectedStatus: any = null;
  editiorDescription: any = null;
  followUpDetailObject: any;
  followUpDocList: any[] = [];
  activeTabs: number = 1;
  constructor(private authService: AuthAssetService,
    private commonHttpServiceCallerService:CommonHttpServiceCallerService,
    public modal: NgbOffcanvas, private lightbox: Lightbox, private commonFunctionService: CommonFunctionService, private departmentService: DepartmentService, private modalService: NgbModal) {

  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.activeTabs = this.checkListOpen;
    this.apiCall();
  }
  apiCall() {
    this.getV2_FollowUpDetail();
    this.getV2_FollowUpMemberList();
    this.getV2_FollowUpDocList();
    this.getV2_TicketDisscusionProjFollowUp_ServerPaging();


  }
  ngOnChanges(changes: SimpleChanges): void {
    this.activeTabs = this.checkListOpen;
    // this.getV2_FollowUpDetail()
    // this.getV2_FollowUpMemberList()
  }
  close(value: any) {
    this.modal.dismiss(value)
  }
  getV2_FollowUpDetail() {
    let payload = {
      FollowUpId: this.followUpId
    }
    this.departmentService.getV2_FollowUpDetail(payload).subscribe((res: any) => {
      this.followUpDetailObject = res.obj

    })

  }
  getV2_FollowUpMemberList() {
    let payload = {
      FollowUpId: this.followUpId,
      ProjectId: this.projectDepartmentId
    }
    this.departmentService.getV2_FollowUpMemberList(payload).subscribe((res: any) => {
      this.followUpMemberList = res.list

      console.log("  this.followUpMemberList.", this.followUpMemberList);
    })

  }
  getV2_FollowUpDocList() {
    let payload = {
      FollowUpId: this.followUpId,
      ProjectId: this.projectDepartmentId
    }
    this.departmentService.getV2_FollowUpDocList(payload).subscribe((res: any) => {
      this.followUpDocList = res.list
    })

  }
  getProjectManagementStatus(content) {
    this.statusList = [];
    this.selectedStatus = null;
    this.departmentService.getProjectManagementStatus('FollowUpStatus').subscribe((res: any) => {
      this.statusList = res;

      this.statusList = this.statusList.filter(item => item.assetStatusId !== this.followUpDetailObject.followUpStatusId);
      this.modalService
        .open(content, {
          ariaLabelledBy: "modal-basic-title",
          size: "md",
          centered: true,
          backdrop: "static",
          keyboard: false,
        })

    })
  }
  toUpperCaseword(data: string) {
    if (data) return data.toUpperCase();
    return "";
  }
  openModalPopup(content: any): void {
    this.editiorDescription = this.followUpDetailObject.description;

    // this.selectedStatus = this.followUpDetailObject.followUpStatusId != 2 ? this.followUpDetailObject.followUpStatusId : null;


    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
  }


  submitDescription() {
    let requestData: any = {
      FollowUpId: this.followUpId,
      Description: this.editiorDescription
    };
    this.departmentService.UpdateV2_MX_ProjectFollowUpDesc(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.getV2_FollowUpDetail();
      },
      (err) => {
        this.error(err);
      }
    );

  }
  submitUpdateStatus() {
    let requestData: any = {
      FollowUpId: this.followUpId,
      FollowUpStatusId: this.selectedStatus,
      FollowUpStatusName: this.findNameById(
        this.selectedStatus,
        this.statusList,
        "assetStatus",
        "assetStatusId"
      ),
    };
    this.departmentService.UpdateV2_MX_ProjectFollowUpStatus(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.getV2_FollowUpDetail();
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
  findNameById(
    idToFind: number,
    items,
    objectname,
    objectId
  ): string | undefined {
    const foundItem = items.find((item) => item[objectId] === idToFind);
    return foundItem ? foundItem[objectname] : undefined;
  }
  addInviteMember(content: any): void {

    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          //this.formGroupfollow.reset();
        },
        (reason) => {
          //this.formGroupfollow.reset();
        }
      );
  }
  UploadAttachments(content: any): void {

    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          //this.formGroupfollow.reset();
        },
        (reason) => {
          //this.formGroupfollow.reset();
        }
      );
  }
  openEditAttachement(content: any): void {

    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          //this.formGroupfollow.reset();
        },
        (reason) => {
          //this.formGroupfollow.reset();
        }
      );
  }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  transformInnerHTML(string: any) {
    return this.commonFunctionService.transform(string);
  }
  openModalMember() {
    this.selectedTechList = [];
    const modalRef = this.modalService.open(TechnicianListModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.projectId = this.projectDepartmentId;
    modalRef.componentInstance.nameTitle = "Member";
    modalRef.componentInstance.followUpMemberList = this.followUpMemberList.length != 0 ? this.followUpMemberList : [];

    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {
          console.log(result.selectedTech)
          if (result.selectedTech) {
            this.selectedTechList = result.selectedTech ? result.selectedTech : [];
            this.addV2_ProjectFollowUpMember(this.selectedTechList)
          }
        }
      }
    });
  }
  addV2_ProjectFollowUpMember(userDataList) {
    let userDataSend = [];
    userDataList.forEach(userData => {
      userDataSend.push({
        projectId: this.projectDepartmentId,
        followUpId: this.followUpId,
        userId: userData.userId,
        fullName: userData.fullName,
        designation: userData.accessGroupName,
        email: userData.email,
        contactNo: userData.phoneNumber,

      })
    });
    // let payload = {
    //   ProjectId: this.projectDepartmentId,
    //   FollowUpId: this.followUpId,
    //   UserId: userDataList[0].userId,
    //   FullName: userDataList[0].fullName,
    //   Designation: userDataList[0].designation,
    //   Email: userDataList[0].email,
    //   ContactNo: userDataList[0].phoneNumber
    // }

    this.departmentService.addV2_ProjectFollowUpMember(userDataSend).subscribe((res) => {
      this.getV2_FollowUpMemberList();
      this.success(res)
    })
  }
  openModalDeleteMember(projectFollowUpMemberId: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to delete the member?";
    modalRef.componentInstance.subTitle =
      "Deleting your member will remove it from the database";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteV2_ProjectFollowUpMember(projectFollowUpMemberId)
        }
      }
    });
  }
  deleteV2_ProjectFollowUpMember(id) {
    this.departmentService.deleteV2_ProjectFollowUpMember({ ProjectFollowUpMemberId: id }).subscribe({
      next: (res) => {
        this.getV2_FollowUpMemberList();
        this.success(res)
      },
    });
  }


  openModalUploadeAttachments() {
    this.selectedTechList = [];
    const modalRef = this.modalService.open(UploadeAttachmentsComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.projectId = this.projectDepartmentId;
    modalRef.componentInstance.followUpId = this.followUpId;
    modalRef.componentInstance.followUpDocList = this.followUpDocList;

    modalRef.result.then((result) => {
      if (result) {
        if (result == 'submit') {
          this.getV2_FollowUpDocList();
        }
      }
    });
  }

  openModalUpdateTitleAttachments(aDatea) {
    this.selectedTechList = [];
    const modalRef = this.modalService.open(EditUploadAttachementsComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.setData = aDatea;

    modalRef.result.then((result) => {
      if (result) {
        if (result == 'submit') {
          this.getV2_FollowUpDocList();
        }
      }
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

  openModalDeleteDocment(projectFollowUpDocId: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to delete this Document/file?";
    modalRef.componentInstance.subTitle =
      "Deleting your Document/file will remove it from the database";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteV2_MX_ProjecFollowUpDoc(projectFollowUpDocId)
        }
      }
    });
  }

  deleteV2_MX_ProjecFollowUpDoc(id) {
    this.departmentService.deleteV2_MX_ProjecFollowUpDoc({ projectFollowUpDocId: id }).subscribe({
      next: (res) => {
        this.getV2_FollowUpDocList();
        this.success(res)
      },
    });
  }




  ticketDisscusionTotalRecordsFromApiProjFollowUp: number = 0;
  ticketDisscusionFromProjFollowUp: number = 0;
  ticketDisscusionToProjFollowUp: number = 0;
  ticketDisscusionPageSizeProjFollowUp: number = 10;
  ticketDiscussionProjFollowUp: any = [];
  maxCharMessage: number = 2000;
  MessageContainProjFollowUp: any = "";

  scrollContainerProjFollowUp: any;
  @ViewChild("scrollframeProjFollowUp", { static: false })
  scrollFrameProjFollowUp: ElementRef;
  getV2_TicketDisscusionProjFollowUp_ServerPaging(
    displayLength: number = 500,
    startIndex: Number = 0
  ) {
    let payload = {
      FollowUpId: this.followUpId,
      displayLength: displayLength,
      displayStart: startIndex,
    };
    this.departmentService
      .GetV2_TicketDisscusionProjFollowUp_ServerPaging(payload)
      .subscribe((res: any) => {
        if (res.list.length > 0) {
          this.ticketDiscussionProjFollowUp = res.list;

          this.ticketDisscusionTotalRecordsFromApiProjFollowUp =
            res.list[0].totalCount;
          this.ticketDisscusionFromProjFollowUp = res.list.reduce(
            (min, p) => (p.rowNum < min ? p.rowNum : min),
            res.list[0].rowNum
          );
          this.ticketDisscusionToProjFollowUp = res.list.reduce(
            (max, p) => (p.rowNum > max ? p.rowNum : max),
            res.list[0].rowNum
          );
          this.ticketDisscusionPageSizeProjFollowUp = displayLength;
        } else if (
          this.ticketDiscussionProjFollowUp.length == 0 &&
          res.list.length == 0
        ) {
          // this.ticketDisscusionPage = 1;
          this.ticketDisscusionTotalRecordsFromApiProjFollowUp = 0;
          this.ticketDisscusionFromProjFollowUp = 0;
          this.ticketDisscusionToProjFollowUp = 0;
          this.ticketDisscusionPageSizeProjFollowUp = displayLength;
        }
      });
  }
  ngAfterViewChecked(): void {
    if (this.ticketDiscussionProjFollowUp.length != 0) {
      if (this.scrollFrameProjFollowUp && !this.scrollContainerProjFollowUp) {
        this.scrollContainerProjFollowUp = this.scrollFrameProjFollowUp.nativeElement;
      }
    }

  }

  submitChatProjFollowUp() {
    if (this.MessageContainProjFollowUp) {
      let payload: any = {
        FollowUpId: this.followUpId,
        MessageContain: this.commonFunctionService.formatDescription(this.MessageContainProjFollowUp),
        IsClient: this.authService.getRole() === "Client" ? true : false,
        AccessGroup: this.authService.getaccessGroupName(),
      };
      this.departmentService
        .CreateV2_TicketDiscussionProjFollowUp(payload)
        .subscribe((res) => {
          this.scrollToTopProjFollowUp();
          this.MessageContainProjFollowUp = "";
          this.success(res);
          this.getV2_TicketDisscusionProjFollowUp_ServerPaging()

        });
    } else {
      this.warning("Please Put Message  ");
    }
  }

  scrollToTopProjFollowUp() {
    if (this.scrollContainerProjFollowUp) {
      this.scrollContainerProjFollowUp.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
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

  checkDescriptionButtonVisible(createdById) {
    return this.authService.getRole() == 'System Administrator' || createdById == this.authService.getUserInfoID()
  }
  checkUpdateStatusButtonVisible(createdById) {
    return this.authService.getRole() == 'System Administrator' || createdById == this.authService.getUserInfoID();
  }
  checkAddDeleteMemberButtonVisible(createdById) {
    return this.authService.getRole() == 'System Administrator' || createdById == this.authService.getUserInfoID()
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


