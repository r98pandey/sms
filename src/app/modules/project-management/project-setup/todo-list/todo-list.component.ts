import { Component, QueryList, ViewChildren, ViewChild, Input } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormBuilder, UntypedFormGroup, UntypedFormArray, Validators, UntypedFormControl } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Sweet Alert
import Swal from 'sweetalert2';

// Drag and drop
import { DndDropEvent } from 'ngx-drag-drop';

import { Todo, Assigned, project } from './todo.model';
import { cloneDeep } from 'lodash';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { DepartmentService } from 'src/app/core/services/department.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
//import { PaginationService } from 'src/app/core/services/pagination.service';
//import { todoAssigned, todoProject } from 'src/app/core/data';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  @Input() followUpId: any
  @Input() followUpDetailObject: any
  @Input() followUpMemberList: any = [];
  todoFormTask: FormGroup;
  todoList: any = [];
  arrayListDropDownPriority = ['Low', 'Medium', 'High'];
  public Editor = ClassicEditor;

  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  clientData: any;
  totalRecords: number = 0;
  filteredList: any[] = []
  taskDataObject: any
  ediDataPatchData: any;
  selectedStatus: any;
  statusList: any[] = []
  constructor(private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private departmentService: DepartmentService,
    private commonFunctionService: CommonFunctionService,
    private authService: AuthAssetService,
  ) {

  }

  ngOnInit(): void {
    this.getV2_FollowUpToDoList();
    this.getProjectManagementStatus();
    this.getfromBinding();
  }

  getProjectManagementStatus() {
    this.departmentService.getProjectManagementStatus('ToDoStatus').subscribe((res: any) => {
      this.statusList = res
    })
  }
  getV2_FollowUpToDoList() {
    let payload = {
      FollowUpId: this.followUpId
    }
    this.departmentService.getV2_FollowUpToDoList(payload).subscribe((res: any) => {
      if (res?.code == "200") {
        this.todoList = res?.list;
        this.totalRecords = res?.list.length;
        this.collectionSize = this.todoList.length;
        this.filteredList = this.todoList;
        this.getLocalPagination();

      } this.todoList = res.list;
    })
  }
  getLocalPagination() {
    this.filteredList = this.todoList.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.to =
      this.page * this.pageSize > this.todoList.length
        ? this.todoList.length
        : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.todoList.length == 0 ? 0 : this.from;
  }
  searchTaskTitle: any;
  clearAllPayload() {

  }
  getfromBinding() {
    this.todoFormTask = this.formBuilder.group({
      frmTaskTitle: [null, Validators.required],
      frmdueDate: [''],
      frmPriority: [null, Validators.required],
      frmdescription: [null, Validators.required],
    });
  }

  get frmTaskTitle() {
    return this.todoFormTask.get("frmTaskTitle");
  }
  get frmdueDate() {
    return this.todoFormTask.get("frmdueDate");
  }
  get frmPriority() {
    return this.todoFormTask.get("frmPriority");
  }
  get frmdescription() {
    return this.todoFormTask.get("frmdescription");
  }

  clearChangeStartDate() {
    this.todoFormTask.reset();
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
  transformInnerHTML(string: any) {
    return this.commonFunctionService.transform(string);
  }

  UpdateStatusConf(data: any) {
    this.ProjectFollowUpToDoId = data.projectFollowUpToDoId;
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });


    modalRef.componentInstance.title = "You are about to complete that task?";
    modalRef.componentInstance.subTitle =
      "Once the Task status changes to done, you cannot revert it   ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submitUpdateStatus();
        }
      }
    });
  }
  openAddTask(content: any): void {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {

          this.addV2_ProjectFollowUpTodo();
        },
        (reason) => {
          this.getV2_FollowUpToDoList();
          this.todoFormTask.reset()
        }
      );
  }

  openAddTaskView(content: any, task: any): void {
    this.taskDataObject = task
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        centered: true,
        backdrop: "static",
        keyboard: false,
      }).result.then(
        (result) => {
          this.taskDataObject = null;
        },
        (reason) => {
          this.taskDataObject = null;
        }
      );

  }

  openAddTaskEdit(content: any, task: any): void {
    this.ediDataPatchData = task
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
          this.getV2_FollowUpToDoList();
          this.todoFormTask.reset()
        },
        (reason) => {
          this.getV2_FollowUpToDoList();
          this.todoFormTask.reset()
        }
      );
  }

  addV2_ProjectFollowUpTodo() {
    let payload = {
      FollowUpId: this.followUpId,
      Title: this.frmTaskTitle.value,
      Remark: this.commonFunctionService.formatDescription(this.frmdescription.value),
      DueDate: this.commonFunctionService.dateFormatter(this.frmdueDate.value),
      Priority: this.frmPriority.value,
    }
    this.departmentService.addV2_ProjectFollowUpTodo(payload).subscribe((res) => {
      this.getV2_FollowUpToDoList();
      this.todoFormTask.reset();
      this.success(res)
    })
  }


  openModalDeleteTask(ProjectFollowUpToDoId: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to delete this Checklist?";
    modalRef.componentInstance.subTitle =
      "Deleting your Checklist will remove it from the database";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.deleteV2_ProjectFollowUpTodo(ProjectFollowUpToDoId)
        }
      }
    });
  }


  deleteV2_ProjectFollowUpTodo(id) {
    this.departmentService.deleteV2_ProjectFollowUpTodo({ FollowUpId: this.followUpId, ProjectFollowUpToDoId: id }).subscribe({
      next: (res) => {
        this.getV2_FollowUpToDoList();
        this.success(res)
      },
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
  ProjectFollowUpToDoId: any = null
  openModalPopupStatus(content: any, data: any): void {
    this.ProjectFollowUpToDoId = data.projectFollowUpToDoId
    this.selectedStatus = 79;
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
  }
  submitUpdateStatus() {
    let requestData: any = {
      ProjectFollowUpToDoId: this.ProjectFollowUpToDoId,
      ProjectFollowUpTodoStatusId: 79,
      ProjectFollowUpTodoStatusName: 'Done'
    };
    this.departmentService.updateV2_ProjectFollowUpTodoStatus(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.ProjectFollowUpToDoId = null
        this.getV2_FollowUpToDoList();
      },
      (err) => {
        this.error(err);
      }
    );

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
  checkAddButtonVisible(createdById) {
    return this.authService.getRole() == 'System Administrator' || createdById == this.authService.getUserInfoID() ? true : false
  }
  // checkUpdateStatusButtonVisible(createdById) {
  //   return createdById == this.authService.getUserInfoID() ? true : false
  // } 

  showDeleteButtonOnCheck(createdById) {
    return this.followUpMemberList.some(member => member.userId == createdById)?true:false
  }
}
