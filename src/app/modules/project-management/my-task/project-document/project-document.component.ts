import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-document',
  templateUrl: './project-document.component.html',
  styleUrl: './project-document.component.scss'
})
export class ProjectDocumentComponent implements OnChanges, OnInit {
  @Input() myTasKDocumentSubmissionProcess: any;
  returnStringData: string='Data found';
  constructor(private CommonHttpServiceCallerService: CommonHttpServiceCallerService, private router: Router) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.returnStringData = this.allDataZero()
  }
  ngOnInit(): void {

    


  }

  allDataZero() {
    let allZero = this.myTasKDocumentSubmissionProcess.every(item => item.count === 0);

    if (allZero) {
      return "No Records Found";
    } else {
      return "Data found";
    }

  }




  routerToMove(data) {
    this.CommonHttpServiceCallerService.myTaskSendObject = { ...data }
    this.router.navigate(['project-management/my-task/project-document-list'])


  }


}
