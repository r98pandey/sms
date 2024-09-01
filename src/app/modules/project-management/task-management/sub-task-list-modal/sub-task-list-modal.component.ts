import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from "src/app/core/services/department.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { UploadAttachmentsModalComponent } from '../upload-attachments-modal/upload-attachments-modal.component';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";

@Component({
  selector: 'app-sub-task-list-modal',
  templateUrl: './sub-task-list-modal.component.html',
  styleUrl: './sub-task-list-modal.component.scss'
})
export class SubTaskListModalComponent implements OnInit {

  defaultNavActiveId: 1;

  statusList: any[] = [];
  arrayListDropDownPriority = ['Low', 'Medium', 'High'];
  arrayListDropDownSubTAsk: any;
  arrayListDropDownTaskName: any;
  filteredTechnicianList: any[] = [];
  selectedStatus: any;

  projectOwnerList: any = [];
  projectOwnerStoreValue: any = null
  imgUrl: any = environment.apiUrl;

  ChildTaskDetail: any = {};
  getChildMember: any ={};

  dDetail: any = {};
  technicianList: any = [];
  selectedTech: any = [];
  addTechnicianList: any = [];
  teamMemberList: any[] = [];
  apiUrl: any = environment.apiUrl;

  ChildTaskStartEndTask: any = [];

  

  public Editor = ClassicEditor;

  payload: any = {
    displayLength: 10,
    displayStart: 0,
  };

  memberModel: any;

  constructor(
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    public modal: NgbActiveModal,
    private departmentService: DepartmentService,
    public modalOff: NgbOffcanvas,
    private projectScheduleService: ProjectScheduleService,
    private datePipe: DatePipe,
    private commonFunctionService: CommonFunctionService
  ) {

  }

  ngOnInit(): void {
  }

  addStartTaskSucessModal() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Start Task";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          //this.submitAssetvalue();
        } else {
          //this.onBack();
        }
      }
    });
  }

  addDocumentsModal() {

    const modalRef = this.modalService.open(UploadAttachmentsModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    //modalRef.componentInstance.projectId = this.projectDepartmentId;
    //modalRef.componentInstance.followUpId = this.followUpId;

    modalRef.result.then((result) => {
      if (result) {
        if (result == 'submit') {
          //this.getV2_FollowUpDocList();
        }
      }
    });

  }


  addTaskChildModal(content: any): void {
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
          console.log("result", result)
        },
        (reason) => {

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


  

  onChangeProjectOwner(value) {
    this.projectOwnerStoreValue = value;
  }





  //invite member code

 
  technicianSearchText: string = "";
  filterTechnician(event) {
    this.filteredTechnicianList = this.technicianList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
    //console.log("this.filteredTechnicianList", this.filteredTechnicianList);
  }

  getDepartmentDetail(departmentId) {
    this.departmentService.getDepartmentDetail(departmentId).subscribe({
      next: (res: any) => {
        this.dDetail = res.data;

      },
    });
  }


  closesubtask(value) {
    this.modalOff.dismiss();
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

  openModalStartTask() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to Start Task";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          // this.submitAssetvalue();
        } else {
          //this.onBack();
        }
      }
    });
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  stripHtmlTags(html: string): string {
    // Create a temporary element to parse HTML
    let tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    // Extract the text content
    return tempElement.textContent || tempElement.innerText;
  }

 
  openDescriptionViewModal(ProjectSubTaskChildTaskId: any, content) { 
    let payload = { "ProjectSubTaskChildTaskId": ProjectSubTaskChildTaskId }
    this.projectScheduleService.GetV2_MX_ProjectScheduleSubTaskChildDetail(payload).subscribe((res: any) => {
      this.ChildTaskDetail = res.obj
      this.getChildTaskMemberListView(ProjectSubTaskChildTaskId);
      this.modalService.open(content, { size: "md", centered: true })
    }, (err) => {

    })
  }


  getChildTaskMemberListView(ProjectSubTaskChildTaskId: any) { 
    let payload = {
       "ProjectSubTaskChildTaskId": ProjectSubTaskChildTaskId 
      }
    this.projectScheduleService.GetV2_MX_ProjectScheduleSubTaskChildMemberList(payload).subscribe((res: any) => {
      console.log("res chil::",res);
     // this.getChildMember = res.obj
    }, (err) => {

    })
  }


}
