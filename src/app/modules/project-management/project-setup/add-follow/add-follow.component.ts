import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from 'src/app/core/services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-follow',
  templateUrl: './add-follow.component.html',
  styleUrl: './add-follow.component.scss'
})
export class AddFollowComponent implements OnInit, OnChanges {
  formGroupfollow!: FormGroup;
  @Input() ProjectId: any;
  masterFollowTypeList: any = [];
  public Editor = ClassicEditor;
  constructor(public formBuilder: FormBuilder, private departmentService: DepartmentService,
    public modal: NgbActiveModal, private datePipe: DatePipe,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.getfromBinding();
    this.getV2_MX_MasterFollowType();
  }
  ngOnInit(): void {
    this.getfromBinding();
    this.getV2_MX_MasterFollowType();
  }

  clearChangeStartDate() {
    this.followUpStartDate.reset();
    this.followUpStartDateTime.reset();
  }

  clearChangeEndDate() {
    this.followUpEndDate.reset();
    this.followUpEndDateTime.reset();
  }
  onchanfStartDate(){
    this.followUpStartDateTime.reset();
    this.onchanfStartTime()
  }
  onchanfStartTime(){
    this.followUpEndDate.reset();
    this.followUpEndDateTime.reset();
  }
  getfromBinding() {
    this.formGroupfollow = this.formBuilder.group({
      followUpTitle: [null, Validators.required],
      followUpType: [null, Validators.required],
      followDescription: [null, Validators.required],
      followUpStartDate: [null, Validators.required],
      followUpEndDate: [null, Validators.required],
      isReminderRequired: [true, Validators.required],
      followUpStartDateTime: [null, Validators.required],
      followUpEndDateTime: [null, Validators.required]
    });
  }


  getV2_MX_MasterFollowType() {
    this.departmentService.getV2_MX_MasterFollowType().subscribe((res: any) => {
      this.masterFollowTypeList = res.list;
    }, (err) => {
    })
  }

  get followUpTitle() {
    return this.formGroupfollow.get("followUpTitle");
  }
  get followUpType() {
    return this.formGroupfollow.get("followUpType");
  }
  get followDescription() {
    return this.formGroupfollow.get("followDescription");
  }
  get followUpStartDate() {
    return this.formGroupfollow.get("followUpStartDate");
  }
  get followUpEndDate() {
    return this.formGroupfollow.get("followUpEndDate");
  }
  get isReminderRequired() {
    return this.formGroupfollow.get("isReminderRequired");
  }
  get followUpEndDateTime() {
    return this.formGroupfollow.get("followUpEndDateTime");
  }
  get followUpStartDateTime() {
    return this.formGroupfollow.get("followUpStartDateTime");
  }

  submitFollowFromDetails() {
    let requestData: any = {
      ProjectId: this.ProjectId,
      FollowUpName: this.followUpTitle.value,
      Description: this.followDescription.value,
      FollowUpTypeId: this.followUpType.value,
      FollowUpType: this.findNameById(
        this.followUpType.value,
        this.masterFollowTypeList,
        "followUpType",
        "followUpTypeId"
      ),
      StartDateTime: this.datePipe.transform(this.followUpStartDate.value, "yyyy-MM-dd ") + " " + this.followUpStartDateTime.value,
      EndDateTime: this.datePipe.transform(this.followUpEndDate.value, "yyyy-MM-dd ") + " " + this.followUpEndDateTime.value,
      IsReminderRequired: this.isReminderRequired.value
    };
    this.departmentService.createV2_MX_ProjectFollowUp(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.close('submit',res)
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


  close(value,res:any={}) {
    if (value === "submit") {
      let sendObject = {
        value: value,
        res: res,
      };
      this.modal.close(sendObject);
    } else {
      this.modal.close({
        value:value
      });
    }
  }

}
