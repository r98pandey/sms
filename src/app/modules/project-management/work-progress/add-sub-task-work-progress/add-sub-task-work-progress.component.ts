
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { DepartmentService } from 'src/app/core/services/department.service';
import { ProjectScheduleService } from 'src/app/core/services/project-schedule.service';
import { WorkForceService } from 'src/app/core/services/work-force.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-sub-task-work-progress',
  templateUrl: './add-sub-task-work-progress.component.html',
  styleUrl: './add-sub-task-work-progress.component.scss'
})
export class AddSubTaskWorkProgressComponent implements OnInit, OnChanges {
  addTaskForm!: FormGroup;
  ProjectWorkforceList: any = []
  maxCharsDecision:number=100
  @Input() taskList: any;
  ProjectWorkforceStoreValue: any = null

  imgUrl: any = environment.apiUrl;
  public Editor = ClassicEditor;
  constructor(public formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    public modal: NgbActiveModal,
    public datePipe: DatePipe,
    private projectScheduleService: ProjectScheduleService,
    private workForceService: WorkForceService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.getfromBinding();
    // this.loadProjectWorkforce();

  }
  ngOnInit(): void {
    this.getfromBinding();
    // this.loadProjectWorkforce();

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
      SubTaskTitle: ['', Validators.required],
      // ProjectWorkforce: [null, Validators.required],
      Description: [null, Validators.required],
      StartDate: [null, Validators.required],
      EndDate: [null, Validators.required],
    });
  }

  get SubTaskTitle() {
    return this.addTaskForm.get("SubTaskTitle");
  }
  // get ProjectWorkforce() {
  //   return this.addTaskForm.get("ProjectWorkforce");
  // }
  get Description() {
    return this.addTaskForm.get("Description");
  }
  get StartDate() {
    return this.addTaskForm.get("StartDate");
  }
  get EndDate() {
    return this.addTaskForm.get("EndDate");
  }



  submitFollowFromDetails() {
    let requestData: any = {
      ProjectTaskId: this.taskList.projectTaskId,
      ProjectScheduleId: this.taskList.projectScheduleId,
      SubTaskTitle: this.SubTaskTitle.value,
      Description: this.Description.value,
      ProjectId: this.taskList.projectId,
      StartDate: this.datePipe.transform(this.StartDate.value, "yyyy-MM-dd"),
      EndDate: this.datePipe.transform(this.EndDate.value, "yyyy-MM-dd"),
      // mX_ProjectSubTAskWorkForces: [
      //   {
      //     ProjectTaskId: this.taskList.projectTaskId,
      //     ProjectWorkforceId: this.ProjectWorkforce.value
      //   }
      // ]
    };
    this.projectScheduleService.createV2_MX_ProjectScheduleSubTask(requestData).subscribe(
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
  onChangeProjectWorkforce(value) {
    this.ProjectWorkforceStoreValue = value;
  }

  // loadProjectWorkforce(): void {
  //   let payload: any = {
  //     displayLength: 1000,
  //     displayStart: 0,
  //     SearchCompanyId: this.taskList.companyId,
  //     SearchClientId: this.taskList.clientId,
  //     SearchProjectId: this.taskList.projectId
  //   }
  //   this.workForceService
  //     .getMX_MX_ProjectWorkforceList_ServerPaging(
  //       payload
  //     )
  //     .subscribe(
  //       (response: any) => {
  //         if (response) {
  //           this.ProjectWorkforceList = response?.list;
  //         }
  //       }
  //     );

  // }




}
