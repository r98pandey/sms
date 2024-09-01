import { Router } from "@angular/router";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from "rxjs";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { WorkflowService } from "src/app/core/services/workflow.service";

@Component({
  selector: 'app-listworkflow',
  templateUrl: './listworkflow.component.html',
  styleUrls: ['./listworkflow.component.scss']
})
export class ListworkflowComponent implements OnInit, AfterViewInit {
  page = 1;
  from = 0;
  to = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  workFlowList: any = [];
  isProject: boolean = true;
  selectedCompanyId: any;
  selectedDepartmentName: any;
  filteredList: any = [];
  payload: any = {
    companyId: "",
    SearchWorkFlowName: null,
  };
  companyListArray: any = [];
  label: any = "Workflow";
  breadCrumbItems: any = [
    { label: "Workflow" },
    { label: "Workflow List", active: true },
  ];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private authAssetService: AuthAssetService,
    private workflowService: WorkflowService,

  ) {
    this.isProject = this.authAssetService.getisProject();

  }

  ngOnInit(): void {
    this.getCompanyList();


  }


  /**
 * for Set object to refesh
 */
  setObjectBeforeRefesh() {
    let objectSerachForWorkflow: any = {};
    if (this.selectedCompanyId)
      objectSerachForWorkflow.selectedCompanyId = this.selectedCompanyId;
    if (this.searchTerm)
      objectSerachForWorkflow.searchTerm = this.searchTerm;
    if (this.page) {
      objectSerachForWorkflow.displayStart = this.pageSize * (this.page - 1);
      objectSerachForWorkflow.page = this.page;
    }
    localStorage.setItem(
      "objectSerachForWorkflow",
      JSON.stringify(objectSerachForWorkflow)
    );
  }

  /**
 * for get object for refesh
 */
  getObjectAfterRefresh() {
    let objectSerachForWorkflow: any = JSON.parse(
      localStorage.getItem("objectSerachForWorkflow")
    );

    if (objectSerachForWorkflow.searchTerm)
      this.searchTerm = objectSerachForWorkflow.searchTerm ? objectSerachForWorkflow.searchTerm : '';
    this.payload.selectedCompanyId = this.selectedCompanyId;

    if (objectSerachForWorkflow.displayStart) {
      this.payload.displayStart = objectSerachForWorkflow.displayStart;
      this.page = objectSerachForWorkflow.page;
    }
    this.getWorkFlowList();
  }



  getWorkFlowList() {
    this.workflowService
      .getWorkflowDepartmentList(
        this.selectedCompanyId
      )
      .subscribe((res: any) => {
        if (res?.data.length != 0) {
          res?.data.forEach((element) => {
            element.companyId = this.selectedCompanyId;
          });
          this.workFlowList = res?.data;
          this.totalRecords = res?.data.length;
          this.filteredList = this.workFlowList;
          this.collectionSize = this.filteredList.length;
          this.getWorkFlowPagination();

          let objectSerachForWorkflow: any = JSON.parse(
            localStorage.getItem("objectSerachForWorkflow")
          )
          if (objectSerachForWorkflow.searchTerm) {
            this.searchFilter();
          }
        } else {
          this.workFlowList = [];
          this.totalRecords = 0;
          this.filteredList = [];
          this.collectionSize = 0;
          this.getWorkFlowPagination();
        }
        this.setObjectBeforeRefesh();
      });
  }
  getWorkFlowPagination() {
    this.filteredList = this.workFlowList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.to = this.page * this.pageSize > this.workFlowList.length ? this.workFlowList.length : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.workFlowList.length == 0 ? 0 : this.from;
  }
  getCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.companyListArray = res.list;
      let objectSerachForWorkflow: any = JSON.parse(
        localStorage.getItem("objectSerachForWorkflow")
      )
      if (objectSerachForWorkflow) {
        this.selectedCompanyId = objectSerachForWorkflow.selectedCompanyId ? objectSerachForWorkflow.selectedCompanyId : this.companyListArray[0].companyId;
        this.getObjectAfterRefresh();

      } else {
        this.selectedCompanyId = this.companyListArray[0].companyId
        this.getWorkFlowList();
      }
      this.setObjectBeforeRefesh();


    });
  }

  onCompanyValueChange($event) {
    this.page = 1;
    this.searchTerm = "";
    this.getWorkFlowList();
  }

  settingHandler(project: any) {
    this.workflowService.wfItem = { ...project }
    this.router.navigate(['/application-settings/workflow-setup/configurationworkflow']);

  }

  clearAllPayload() {
    this.selectedDepartmentName = null;
    this.searchTerm = "";
    this.page = 1;
    if (this.companyListArray.length > 0) {
      this.selectedCompanyId = this.companyListArray[0].companyId
      this.getWorkFlowList();
    }
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

  error(err: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  @ViewChild("inputer", { static: true }) input: ElementRef;
  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          this.searchFilter();
        })
      )
      .subscribe();
  }

  searchTerm: string = "";
  searchFilter() {
    this.page = 1;
    if (this.searchTerm) {
      const value = this.searchTerm
      this.filteredList = this.workFlowList.filter((i) => i.departmentName?.toLowerCase().includes(value?.toLowerCase() || ''));
      this.collectionSize = this.filteredList.length;
      this.totalRecords = this.filteredList.length;
      this.to = this.page * this.pageSize > this.filteredList.length ? this.filteredList.length : this.page * this.pageSize;
      let fromvalue = this.page * this.pageSize - (this.pageSize - 1);
      this.from = fromvalue < 1 ? 1 : fromvalue;
      this.from = this.filteredList.length == 0 ? 0 : this.from;
      this.setObjectBeforeRefesh();
    } else {
      const value = this.searchTerm
      this.payload.SearchClientName = value
      this.getWorkFlowList();

    }

  }
}
