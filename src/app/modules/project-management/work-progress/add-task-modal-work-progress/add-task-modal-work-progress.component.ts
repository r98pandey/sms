


import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { DepartmentService } from 'src/app/core/services/department.service';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-add-task-modal-work-progress',
  templateUrl: './add-task-modal-work-progress.component.html',
  styleUrl: './add-task-modal-work-progress.component.scss'
})
export class AddTaskModalWorkProgressComponent implements OnInit, OnChanges {
  addTaskForm!: FormGroup;
  projectOwnerList: any = [];
  maxCharsDecision:number=100

  @Input() storeProjectScheduleId: any;
  
  @Input() storeProjectScheduleObject: any;
  projectOwnerStoreValue: any = null

  imgUrl: any = environment.apiUrl;
  public Editor = ClassicEditor;
  constructor(public formBuilder: FormBuilder, private departmentService: DepartmentService,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
     private datePipe: DatePipe, private projectScheduleService: ProjectScheduleService,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.getfromBinding();
    this.loadProjectOwner();

  }
  ngOnInit(): void {
    this.getfromBinding();
    this.loadProjectOwner();

  }

  clearChangeStartDate() {
    this.StartDate.reset();
    this.clearChangeEndDate();

  }

  clearChangeEndDate() {
    this.EndDate.reset();
  }

  getfromBinding() {
    this.addTaskForm = this.formBuilder.group({
      TaskTitle: ['', Validators.required],
      ProjectOwner: [null, Validators.required],
      Description: [null, Validators.required],
      StartDate: [null, Validators.required],
      EndDate: [null, Validators.required],
      });
  }

  get TaskTitle() {
    return this.addTaskForm.get("TaskTitle");
  }
  get ProjectOwner() {
    return this.addTaskForm.get("ProjectOwner");
  }
  get Description() {
    return this.addTaskForm.get("Description");
  }
  get StartDate() {
    return this.addTaskForm.get("StartDate");
  }
  get EndDate() {
    return this.addTaskForm.get("EndDate");
  }





  addTaskSucessModal() {
    let requestData: any = {
      ProjectScheduleId: this.storeProjectScheduleId,
      TaskTitle: this.TaskTitle.value,
      Description: this.Description.value,
      CompanyId: this.storeProjectScheduleObject.companyId,
      CompanyName: this.storeProjectScheduleObject.companyName,
      ClientId: this.storeProjectScheduleObject.clientId,
      ClientName: this.storeProjectScheduleObject.clientName,
      ProjectId: this.storeProjectScheduleObject.projectId,
      ProjectName: this.storeProjectScheduleObject.projectName,
      StartDate: this.datePipe.transform(this.StartDate.value, "yyyy-MM-dd"),
      EndDate: this.datePipe.transform(this.EndDate.value, "yyyy-MM-dd"),
      ProjectOwnerId: this.ProjectOwner.value,
      ProjectOwnerName: this.projectOwnerStoreValue.fullName,
      ProjectOwnerDesig: this.projectOwnerStoreValue.accessGroupName
    };
    this.projectScheduleService.createV2_MX_ProjectScheduleTask(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.close('submit', res)
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

  findNameById(
    idToFind: number,
    items,
    objectname,
    objectId
  ): string | undefined {
    const foundItem = items.find((item) => item[objectId] === idToFind);
    return foundItem ? foundItem[objectname] : undefined;
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


  close(value, res: any = {}) {
    if (value === "submit") {
      let sendObject = {
        value: value,
        res: res,
      };
      this.modal.close(sendObject);
    } else {
      this.modal.close({
        value: value
      });
    }
  }
  onChangeProjectOwner(value) {
    this.projectOwnerStoreValue = value;
  }

  loadProjectOwner(): void {
    let payload: any = {
      displayLength: 1000,
      displayStart: 0,
      // SearchCompanyId: this.storeProjectScheduleObject.companyId,
      // SearchClientId: this.storeProjectScheduleObject.clientId,
      SearchProjectId: this.storeProjectScheduleObject.projectId,
      ProjectId: this.storeProjectScheduleObject.projectId,
      // SearchProjectScheduleId:this.storeProjectScheduleId
    }
    this.departmentService
      .getV2_GetMX_ProjectUserAccessList_ServerPaging(payload)
      .subscribe(
        (response: any) => {
          if (response) {
            this.projectOwnerList = response?.list;
          }
        }
      );

  }



}
