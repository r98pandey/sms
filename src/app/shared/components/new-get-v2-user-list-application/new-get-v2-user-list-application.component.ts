
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { DepartmentService } from '../../../core/services/department.service';
import { CreateClientMemberDymiComponent } from '../create-client-member-dymi/create-client-member-dymi.component';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { CommonHttpServiceCallerService } from '../../../core/services/common-http-service-caller.service';

@Component({
  selector: 'app-new-get-v2-user-list-application',
  templateUrl: './new-get-v2-user-list-application.component.html',
  styleUrl: './new-get-v2-user-list-application.component.scss'
})
export class NewGetV2UserListApplicationComponent implements OnInit, OnChanges {
  @Input() projectId: any
  @Input() addButton: boolean
  @Input() clientApi: boolean
  @Input() comingWhichTab: any
  technicianList: any = [];
  apiUrl: any = environment.apiUrl;
  @Input() followUpMemberList: any[]
  selectedTech: any[] = [];
  @Input() nameTitle: any = 'Technicians';
  @Input() clientObject: any
  
  to = 0;
  from = 0;
  pageSize = 10;
  totalRecordsFromApi: number = 0;
  ticketList = [];
  page = 1;
  collectionSize = 0;

  payload: any = {
    displayLength: 10000,
    displayStart: 0,
    SearchProjectId: null,

  };
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    private maintenanceService: MaintenanceService,
    private departmentService: DepartmentService,
    public modal: NgbActiveModal,
    private userService: UserProfileService,

    public CommonHttpServiceCallerService: CommonHttpServiceCallerService,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.loadTechnician();

  }
  ngOnInit(): void {
    this.loadTechnician()
  }

  loadTechnician(): void {
    let payload: any = {
      displayLength: 1000,
      displayStart: 0,
      projectId: this.projectId,
      SearchProjectId: this.projectId

    }
    if (!this.clientApi) {
      this.departmentService.GetV2_UserListApplication(payload).subscribe(
        (response: any) => {
          if (response) {
            this.technicianList = response?.data;
            this.technicianList.forEach((element) => {
              element.checked = false;

            });
            if (this.technicianList.length > 0) {
              this.technicianList = this.technicianList.filter(tech =>
                !this.followUpMemberList.some(member => member.id === tech.id)
              );
            }
            this.filteredTechnicianList = this.technicianList;


          }
        }
      );
    }
    else {
      this.departmentService.GetV2_UserListClient(payload).subscribe(
        (response: any) => {
          if (response) {
            this.technicianList = response?.data;
            this.technicianList.forEach((element) => {
              element.checked = false;

            });
            if (this.technicianList.length > 0) {
              this.technicianList = this.technicianList.filter(tech =>
                !this.followUpMemberList.some(member => member.id === tech.id)
              );
            }
            this.filteredTechnicianList = this.technicianList;


          }
        }
      );
    }
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
        if (value.id == tech.id) {
          this.selectedTech.splice(index, 1);
        }
      });
    }

  }

  getTechnicianIndex(id) {
    return this.technicianList.findIndex((i) => i.id === id);
  }

  getSelectedTechnicianIndex(id) {
    return this.selectedTech.findIndex((i) => i.id === id);
  }

  selectTechnician(technicianList, i, tech) {

    const index = this.getTechnicianIndex(tech.id);
    if (this.technicianList[index].checked) {
      this.technicianList[index].checked = false;
    } else {
      this.technicianList[index].checked = true;
    }
    this.getTodoListChecked(technicianList[i].checked, tech);
  }

  unCheckItem(tech) {
    const index = this.getTechnicianIndex(tech.id);
    this.technicianList[index].checked = false;
    const selectedTechnicianIndex = this.getSelectedTechnicianIndex(
      tech.id
    );
    this.selectedTech.splice(selectedTechnicianIndex, 1);
  }

  filteredTechnicianList: any[] = [];
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
      value: value,
      selectedTech: this.selectedTech
    });
  }

  submit(value) {

    this.modal.close({
      value: value,
      selectedTech: this.selectedTech
    });
  }
  openModalUpdateStatus(value) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to assign the " + this.nameTitle + '?';
    modalRef.componentInstance.buttonName = "Submit It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submit(value);
        }
      }
    });
  }
  openAddObject() {
    const modalRef = this.modalService.open(CreateClientMemberDymiComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.nameTitle = this.nameTitle;
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.clientApi = this.clientApi;



    modalRef.result.then((result) => {
      if (result) {
        if (result.value == 'submit') {
          if (this.comingWhichTab == 'Maintenance') {
            if (this.clientApi) {
              this.submitCreateClientUserProfile_MaintenantManagement(result.payload)
            } else {
              this.submitCreateUser_MaintenanceManagement(result.payload)
            }
          } else if (this.comingWhichTab == 'Project') {
            if (this.clientApi) {
              this.submitClientUser(result.payload)
            } else {
              this.submitMemberProject(result.payload)
            }

          } else if (this.comingWhichTab == 'Asset') {
            if (this.clientApi) {
              this.submitAssetClientUser(result.payload)
            } else {
              this.submitAssetMemberProject(result.payload)
            }

          }

        }
      }
    });
  }


  submitClientUser(payload: any) {
    payload.clientId = this.clientObject.clientId;
    payload.clientName = this.clientObject.clientName;
    this.userService.createClientUserProfile_ProjectManagement(payload).subscribe(
      (res) => {
        this.success(res);
        this.close('Cross click')
      },
      (err) => {


      }
    );
  }
  submitMemberProject(payload) {
    this.userService.createUser_ProjectManagement(payload).subscribe(
      (res) => {
        this.success(res);
        this.submit('Cross click')
      },
      (err) => {


      }
    );
  }
  submitAssetClientUser(payload: any) {
    let url = 'api/Account/CreateClientUserProfile_AssetManagement'
    payload.clientId = this.clientObject.clientId;
    payload.clientName = this.clientObject.clientName;

    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe(
      (res) => {
        this.success(res);
        this.close('Cross click')
      },
    )
  }
  submitAssetMemberProject(payload) {
    let url = 'api/Account/CreateUser_AssetManagement'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe(
      (res) => {
        this.success(res);
        this.submit('Cross click')
      },
      (err) => {


      }
    );
  }

  

  submitCreateClientUserProfile_MaintenantManagement(payload: any) {
    let url = 'api/Account/CreateClientUserProfile_MaintenantManagement'
    payload.clientId = this.clientObject.clientId;
    payload.clientName = this.clientObject.clientName;

    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe(
      (res) => {
        this.success(res);
        this.close('Cross click')
      },
    )
  }
  submitCreateUser_MaintenanceManagement(payload) {
    let url = 'api/Account/CreateUser_MaintenanceManagement'
    this.CommonHttpServiceCallerService.postWithJsonDataMethod(url, payload).subscribe(
      (res) => {
        this.success(res);
        this.submit('Cross click')
      },
      (err) => {


      }
    );
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

}
