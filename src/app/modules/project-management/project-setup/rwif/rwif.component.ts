import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { DepartmentService } from 'src/app/core/services/department.service';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';

@Component({
  selector: 'app-rwif',
  templateUrl: './rwif.component.html',
  styleUrl: './rwif.component.scss'
})
export class RwifComponent implements OnInit, OnChanges {
  showlistpostion: boolean = true
  storeRWIFUpload: any = []
  @Input() projectProcessHeaderDocId: any
  @Input() dDetail: any
  constructor(private lightbox: Lightbox, private departmentService: DepartmentService, private modalService: NgbModal, private commonFunctionService: CommonFunctionService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("hh",this.dDetail);


  }
  ngOnInit(): void {
console.log("aaaa",this.projectProcessHeaderDocId);
  }
  openList() {
    this.showlistpostion = true
  }
  uploadFile() {
    this.showlistpostion = false
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
}
