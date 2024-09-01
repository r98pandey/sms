
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
import { SuccessModalComponent } from '../success-modal/success-modal.component';
@Component({
  selector: 'app-technician-audit',
  templateUrl: './technician-audit.component.html',
  styleUrl: './technician-audit.component.scss'
})
export class TechnicianAuditComponent implements OnInit, OnChanges {
  @Input() projectId: any
  technicianList: any = [];
  apiUrl:any=environment.apiUrl;
  @Input()followUpMemberList:any[]
   selectedTech: any[]=[];
  @Input() nameTitle:any='Technicians';

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
    private departmentService:DepartmentService,
    public modal: NgbActiveModal) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.loadTechnician();
    console.log("TechnicianAuditComponent",this.followUpMemberList)

  }
  ngOnInit(): void {
    this.loadTechnician()
  }

  loadTechnician(): void {
    this.payload.SearchProjectId=this.projectId
    this.maintenanceService
    .getTechnician(this.projectId).subscribe(
      (response: any) => {
        if (response) {
       

          this.technicianList =response?.data;
          this.technicianList.forEach((element) => {
            element.checked = false;
          
          });
          if (this.technicianList.length > 0) {
            this.technicianList = this.technicianList.filter(tech => 
              !this.followUpMemberList.some(member => member.techId === tech.userId)
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
      value:value,
      selectedTech:this.selectedTech
    });
  }

  submit(value) {
    this.modal.close({
      value:value,
      selectedTech:this.selectedTech
    });
  }


  sweetAlertUpdateTechinionDetails(value) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure you want to add additional member for this audit?";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.submit(value);
        } else {
          //this.onBack();
        }
      }
    });
  }

}
