import { Component, Input, OnInit } from '@angular/core';
import { DepartmentService } from 'src/app/core/services/department.service';
import { concatMap, of } from 'rxjs';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment.prod';
import { CommonHttpServiceCallerService } from '../../../../core/services/common-http-service-caller.service';

@Component({
  selector: 'app-add-access-right',
  templateUrl: './add-access-right.component.html',
  styleUrl: './add-access-right.component.scss'
})
export class AddAccessRightComponent implements OnInit {
  @Input() accessRight: any;
  apiUrl: any = environment.apiUrl;
  @Input() projectDepartmentId: any
  @Input() maintenanceProcessComing: any
  selectObjectSend: any[] = [];
  internalSearchTerm: string = '';
  externalSearchTerm: string = '';
  @Input() accessGroup: any;
  constructor(private departmentService: DepartmentService, public modal: NgbOffcanvas,
    public CommonHttpServiceCallerService: CommonHttpServiceCallerService,
  ) {

  }
  ngOnInit(): void {
    this.getProjectTeamMemberList();
  }
  teamMemberList: any = []
  getProjectTeamMemberList() {
    const payload = {
      SearchProjectId: this.projectDepartmentId,
      SearchUserType: 'Application',
      ProjectId: this.projectDepartmentId,
      displayLength: 2000,
      displayStart: 0
    };
    //


    //
    let url: any = this.maintenanceProcessComing ? 'api/MaintentDash/GetV2_MyTaskMaintenanceMemberAndMyTaskList' : 'api/ProjectManagement/GetV2_GetMX_ProjectUserAccessList_ServerPaging'
    this.CommonHttpServiceCallerService
      .postWithFormDataMethod(url, payload)
      .pipe(
        concatMap((res: any) => {
          const existingUserIds = new Set(this.accessRight.childList.map(child => child.userId));
          this.teamMemberList = res.list.map((member: any) => {
            const existingChild = this.accessRight.childList.find(child => child.userId === member.userId);
            return {
              ...member,
              type: 'Internal',
              isVerified: existingChild ? existingChild.isVerified : false,
              isAcknowledgement: existingChild ? existingChild.isAcknowledgement : false,
              isApprove: existingChild ? existingChild.isApprove : false
            };
          });
          return of(null); // Emit a value to continue the chain
        }),
        concatMap(() => this.getProjectClientList())
      )
      .subscribe();
  }

  getProjectClientList() {
    const payload = {
      SearchProjectId: this.projectDepartmentId,
      SearchUserType: 'Client',
      ProjectId: this.projectDepartmentId,
      displayLength: 2000,
      displayStart: 0
    };
    let url: any = this.maintenanceProcessComing ? 'api/MaintentDash/GetV2_MyTaskMaintenanceMemberAndMyTaskList' : 'api/ProjectManagement/GetV2_GetMX_ProjectUserAccessList_ServerPaging'
    return this.CommonHttpServiceCallerService
      .postWithFormDataMethod(url, payload)
      .pipe(
        concatMap((res: any) => {
          const existingUserIds = new Set(this.accessRight.childList.map(child => child.userId));
          const externalMembers = res.list.map((member: any) => {
            const existingChild = this.accessRight.childList.find(child => child.userId === member.userId);
            return {
              ...member,
              type: 'External',
              isVerified: existingChild ? existingChild.isVerified : false,
              isAcknowledgement: existingChild ? existingChild.isAcknowledgement : false,
              isApprove: existingChild ? existingChild.isApprove : false
            };
          });
          this.teamMemberList = [...this.teamMemberList, ...externalMembers];
          console.log("  this.teamMemberList", this.teamMemberList)
          return of(null); // Emit a value to continue the chain if needed
        })
      );


  }

  close(value: any) {
    this.modal.dismiss({
      type: value,
    });
  }
  submit(value: any) {
    this.modal.dismiss({
      type: value,
      selectObjectSend: this.selectObjectSend
    });
  }

  onChangeAccessRightGroup(team: any) {
    if (!this.selectObjectSend) {
      this.selectObjectSend = [];
    }
    if (!team || !team.userId) {
      console.error('Invalid team member data:', team);
      return;
    }

    const modifiedMemberIndex = this.selectObjectSend.findIndex(member => member.UserId === team.userId);
    if (modifiedMemberIndex !== -1) {

      this.selectObjectSend[modifiedMemberIndex].IsVerified = team.isVerified;
      this.selectObjectSend[modifiedMemberIndex].IsAcknowledgement = team.isAcknowledgement;
      this.selectObjectSend[modifiedMemberIndex].IsApprove = team.isApprove;
    } else {

      this.selectObjectSend.push({
        MasterProjectProcessAccessRightId: this.accessRight.masterProjectProcessAccessRightId,
        IsVerified: team.isVerified,
        IsAcknowledgement: team.isAcknowledgement,
        IsApprove: team.isApprove,
        UserId: team.userId
      });
    }

  }

  transform(value: string, limit: number): string {
    if (!value) return '';
    if (value.length > limit) {
      return value.substring(0, limit) + '...';
    }
    return value;
  }

  filteredTeamMembers(type: string): any[] {
    const searchTerm = type === 'Internal' ? this.internalSearchTerm : this.externalSearchTerm;
    return this.teamMemberList.filter(team =>
      team.type === type &&
      team.fullName &&
      team.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
