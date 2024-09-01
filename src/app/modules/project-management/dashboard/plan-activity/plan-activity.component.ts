import { Component } from '@angular/core';
import { CommonFunctionService } from 'src/app/shared/Service-common/common-function.service';

@Component({
  selector: 'app-plan-activity',
  templateUrl: './plan-activity.component.html',
  styleUrl: './plan-activity.component.scss'
})
export class PlanActivityComponent {


  constructor(
    private commonFunctionService: CommonFunctionService,) {
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }



}
