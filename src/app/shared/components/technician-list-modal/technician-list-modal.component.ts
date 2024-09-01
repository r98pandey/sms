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
@Component({
  selector: 'app-technician-list-modal',
  templateUrl: './technician-list-modal.component.html',
  styleUrl: './technician-list-modal.component.scss'
})
export class TechnicianListModalComponent implements OnInit, OnChanges {
  @Input() projectId: any
  technicianList: any = [];
  apiUrl: any = environment.apiUrl;
  @Input() followUpMemberList: any[]
  selectedTech: any[] = [];
  @Input() nameTitle: any = 'Technicians';

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
    public modal: NgbActiveModal) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.loadTechnician();

  }
  ngOnInit(): void {
    this.loadTechnician()
  }

  loadTechnician(): void {
    this.payload.SearchProjectId = this.projectId
    this.departmentService.GetV2_UserListApplication(this.payload).subscribe(
      (response: any) => {
        if (response) {


          this.technicianList = response?.data;
          this.technicianList.forEach((element) => {
            element.checked = false;

          });
          this.technicianList.forEach((ele) => {
            if (ele.id) {
              ele['userId'] = ele.id
            }
          })
          if (this.technicianList.length > 0) {
            this.technicianList = this.technicianList.filter(tech =>
              !this.followUpMemberList.some(member => member.userId === tech.userId)
            );
          }
          this.filteredTechnicianList = this.technicianList;

          if (this.technicianList.length > 0) {
            this.totalRecordsFromApi = response.data[0].totalCount;
            this.from = response.data.reduce(
              (min, p) => (p.rowNum < min ? p.rowNum : min),
              response.data[0].rowNum
            );
            this.to = response.data.reduce(
              (max, p) => (p.rowNum > max ? p.rowNum : max),
              response.data[0].rowNum
            );
            this.pageSize = this.payload.displayLength;
          } else {
            this.totalRecordsFromApi = 0;
            this.from = 0;
            this.to = 0;
            this.pageSize = this.payload.displayLength;
          }
        }
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

}
