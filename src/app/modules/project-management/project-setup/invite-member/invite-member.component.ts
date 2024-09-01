import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DepartmentService } from "src/app/core/services/department.service";
import { environment } from "src/environments/environment";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrl: './invite-member.component.scss'
})
export class InviteMemberComponent {

  to = 0;
  from = 0;
  pageSize = 12;
  totalRecordsFromApi: number = 0;
  payload: any = {
    displayLength: 10,
    displayStart: 0,
  };
  addMemberList: any[] = [];
  mX_WOTechAssignment: any = [];
  imgURl: any = environment.apiUrl;
  filteredTechnicianList: any[] = [];
  selectedTech: any[]=[];

  @Input() projectId: any
  technicianList: any = [];
  apiUrl:any=environment.apiUrl;
  @Input()followUpMemberList:any[];
  @Input() nameTitle:any='Technicians';

  addTechnicianList: any = [];
  departmentProjectLabel: string = "";
  projectDepartmentId: any;

  constructor(
    private departmentService: DepartmentService,
    private commonFunctionService: CommonFunctionService,
    public modal: NgbActiveModal,
    private authService: AuthAssetService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.departmentProjectLabel = this.authService.getisProject()
    ? "Project"
    : "Department";


  const departmentId = DepartmentService.editDepartmentId;
  this.projectDepartmentId = DepartmentService.editDepartmentId;
  if (departmentId == 0) {
    this.router.navigate(["/project-management/project-setup/list-project"]);
  } else {
    // this.getDepartmentDetail(departmentId);
    // this.getV2_MX_MasterProjectProcessHeaderByProject(departmentId)
   
  }
  }

  ngOnInit(): void {

    this.loadTechnician();
  }


  loadTechnician(): void { 
    this.departmentService
      .GetV2_UserListApplication(this.payload)
      .subscribe(
        (response: any) => {
          if (response) {
            this.technicianList = response?.data; console.log("texh::",this.technicianList);
            this.technicianList.forEach((element) => {
              element.checked = false;
              element.disabled = false;
            });
            if (this.mX_WOTechAssignment.length > 0) {
              this.technicianList.forEach((ele1) => {
                this.mX_WOTechAssignment.forEach((ele) => {
                  if (ele.techId === ele1.userId) {
                    ele1.checked = true;
                    ele1.disabled=true;
                  }
                });
              });
            }
            this.filteredTechnicianList = this.technicianList;
          }
        },
        (error) => {
          //console.log("err", error);
        }
      );
  }

  isAllTechCheckBoxChecked() {
    return this.technicianList?.every((p) => p.checked);
  }

  checkAllTechCheckBox(ev, rows: any) {
    this.technicianList.forEach((x) => (x.checked = ev.target.checked));
    if (ev.target.checked == true) {
      this.technicianList.forEach((ele) => {
        ele.checked = true;
        this.selectedTech.push(ele);
      });
    } else {
      this.selectedTech = this.selectedTech.filter((item) => {
        let foundItemArray: any[] = this.technicianList.filter(
          (el) => el.techId == item.techId
        );
        if (foundItemArray.length > 0) return false;
        return true;
      });
    }
  }

  uniqByKeepZLast(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }

  getTodoListChecked(isSelected: any, tech: any) {
    if (isSelected == true) {
      tech.checked = true;
      this.selectedTech.push(tech);
    } else {
      this.selectedTech.forEach((value, index) => {
        if (value.userId == tech.userId) {
          this.selectedTech.splice(index, 1);
        }
      });
    }

  }

  getTechnicianIndex(userId) {
    return this.technicianList.findIndex((i) => i.userId === userId);
  }

  getSelectedTechnicianIndex(userId) {
    return this.selectedTech.findIndex((i) => i.userId === userId);
  }

  selectTechnician(technicianList, i, tech) {
    if (this.filteredTechnicianList[i].disabled) {
      return
    }
    const index = this.getTechnicianIndex(tech.userId);
    if (this.technicianList[index].checked) {
      this.technicianList[index].checked = false;
    } else {
      this.technicianList[index].checked = true;
    }
    this.getTodoListChecked(technicianList[i].checked, tech);
  }

  unCheckItem(tech) {
    const index = this.getTechnicianIndex(tech.userId);
    this.technicianList[index].checked = false;
    const selectedTechnicianIndex = this.getSelectedTechnicianIndex(
      tech.userId
    );
    this.selectedTech.splice(selectedTechnicianIndex, 1);
  }

 
  technicianSearchText: string = "";
  filterTechnician(event) {
    this.filteredTechnicianList = this.technicianList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
  }


  clearTeach(event) {
    this.technicianSearchText = "";
    this.filteredTechnicianList = this.technicianList.filter((i) =>
      i.fullName.toLowerCase().includes(event.target.value.toLowerCase() || "")
    );
    
  }


  close(value) {
    this.modal.close({
      value:value,
      selectedTech:this.selectedTech
    });
  }

  submit(value) { 
    this.modal.close({
      value:value,
      selectedTech:this.selectedTech
    });

    let sendingPayloadArray = [];
    this.selectedTech.forEach((element) => {
      sendingPayloadArray.push({
        userId: element.id,
      });
    });
    let payload = {
      "ProjectId": this.projectDepartmentId,
      "userIdObject": sendingPayloadArray
    };

    console.log("payload::",payload);

    this.departmentService
    .CreateV2_MX_ProjectUserAccessBulkUser(payload) 
    .subscribe((res: any) => {
      //this.modalService.dismissAll();
      this.addTechnicianList = res.list;
      this.success(res);
      console.log("list::",this.addTechnicianList);
    });  
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



}
