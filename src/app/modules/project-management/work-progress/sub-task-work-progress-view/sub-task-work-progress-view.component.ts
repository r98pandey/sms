
import { Component } from '@angular/core';
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";

@Component({
  selector: 'app-sub-task-work-progress-view',
  templateUrl: './sub-task-work-progress-view.component.html',
  styleUrl: './sub-task-work-progress-view.component.scss'
})
export class SubTaskWorkProgressViewComponent {

  label: any = "PROJECT MANAGEMENT";
  breadCrumbItems: any = [
    { label: "Sub Task List" },
    { label: "Sub Task List View", active: true },
  ];
  dDetail: any = {};
  departmentName:any='SS';
  defaultNavActiveId: any = 1;

  filteredTechnicianList: { fullName: string, roleName: string, phoneNumber: string }[] = [
    {
        fullName: 'Nancy Martino',
        roleName: 'Team Leader & HR',
        phoneNumber: '55555555555'
    },
    {
      fullName: 'Henry Baird',
      roleName: 'Full Stack Developer',
      phoneNumber: '6666666677'
  },
  {
    fullName: 'Frank Hook',
    roleName: 'Team Leader & HR',
    phoneNumber: '7777777777'
},
{
  fullName: 'Jennifer Carter',
  roleName: 'UI/UX Designer',
  phoneNumber: '4567777777'
}
];
 
  constructor(

    private commonFunctionService: CommonFunctionService,
   

  ) {
  }

  toUpperCaseword(data: string) {
    if (data) return data.toUpperCase();
    return "";
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

}
