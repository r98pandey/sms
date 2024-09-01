
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';

import { FolderModel, recentModel } from './file-manager.model';
import { folderData } from './data';
import { RecentService } from './file-manger.service';
import { NgbdRecentSortableHeader, SortEvent } from './file-manager-sortable.directive';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';
import { FileManagementService } from 'src/app/core/services/file-management.service';
import { DropdownService } from 'src/app/shared/Service-common/dropdown.service';



@Component({
  selector: 'app-new-file-manager',
  templateUrl: './new-file-manager.component.html',
  styleUrls: ['./new-file-manager.component.scss'], providers: [RecentService, DecimalPipe]
})
export class NewFileManagerComponent implements OnInit {

  folderData!: FolderModel[];
  submitted = false;
  folderForm!: UntypedFormGroup;
  folderDatas: any;
  recentForm!: UntypedFormGroup;
  recentDatas: any;
  simpleDonutChart: any;
  public isCollapsed1 = false;
  public isCollapsed2 = true;
  public isCollapsed3 = true;
  payload: any = {
    SearchCompanyId: null,
    SearchClientId: null,
    SearchProjectId: null,
  };
  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownTicketStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownTicketStatusIdValue: any;
  // Table data
  recentData!: Observable<recentModel[]>;
  total: Observable<number>;
  @ViewChildren(NgbdRecentSortableHeader) headers!: QueryList<NgbdRecentSortableHeader>;
  
  folderFileTotalCountByProjectlist: any[];
  selectedfolderName: string;
  selectedfolderId: string;
  isProject: boolean;
  label: any = "File Manager";

  breadCrumbItems: any = [
    { label: "File Manager" },
    { label: "File Manager List", active: true },
  ];
  selectTypeFileValue: any = '';
  masterMyFileFolderList: any[]=[];
  masterSharedFolderList: any[]=[];
  masterPublicFolderList: any[]=[];
  constructor(private modalService: NgbModal,
    public service: RecentService,
    private formBuilder: UntypedFormBuilder,
    private dropdownServices: DropdownService,
    private authService: AuthAssetService,
    private fileManagementService: FileManagementService) {
    this.recentData = service.recents$;
    this.total = service.total$;
    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {

    this.getDropdownCompanyList()

    this.folderForm = this.formBuilder.group({
      title: ['', [Validators.required]]
    });


    this.recentForm = this.formBuilder.group({
      file_name: ["", [Validators.required]],
      file_type: ["My File", [Validators.required]],
    });




  }
  get form1() {
    return this.recentForm.controls;
  }

  getDropdownCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .GetClientListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .GetDepartmentListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownProjectOrDeparmentList = res.list;
      });
  }
  onDropdownCompanyValueChange($event) {
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.arrayListDropDownProjectOrDeparmentList = [];
   
    this.masterMyFileFolderList=[];
    this.masterSharedFolderList=[];
    this.masterPublicFolderList=[];
    this.folderFileTotalCountByProjectlist = [];
    this.selectedfolderName = "";
    this.selectedfolderId = "";
    this.getDropdownClientlist();
  }
  onDropdownClientValueChange($event) {
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
   
    this.masterMyFileFolderList=[];
    this.masterSharedFolderList=[];
    this.masterPublicFolderList=[];
    this.folderFileTotalCountByProjectlist = [];
    this.selectedfolderName = "";
    this.selectedfolderId = "";
    this.getDropdownDepartmentList();
  }
  onDropdownDepartmentValueChange($event) {
   
    this.masterMyFileFolderList=[];
    this.masterSharedFolderList=[];
    this.masterPublicFolderList=[];
    this.folderFileTotalCountByProjectlist = [];
    this.selectedfolderName = "";
    this.selectedfolderId = "";
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue) {
      this.getFolderListyFile(this.selectedDropDownProjectOrDeparmentIdValue);
      this.getFolderListShared(this.selectedDropDownProjectOrDeparmentIdValue);
      this.getFolderListPublic(this.selectedDropDownProjectOrDeparmentIdValue);

    }
  }
  getFolderListyFile(SearchProjectId: any) {
    let payload = {
      SearchProjectId: SearchProjectId,
    };
    this.fileManagementService
      .getV2_MasterFolderList(payload)
      .subscribe((res: any) => {
        this.masterMyFileFolderList = res.list;
      });
  }
  getFolderListShared(SearchProjectId: any) {
    let payload = {
      SearchProjectId: SearchProjectId,
    };
    this.fileManagementService
      .getV2_MasterFolderList(payload)
      .subscribe((res: any) => {
        this.masterSharedFolderList = res.list;
      });
  }
  getFolderListPublic(SearchProjectId: any) {
    let payload = {
      SearchProjectId: SearchProjectId,
    };
    this.fileManagementService
      .getV2_MasterFolderList(payload)
      .subscribe((res: any) => {
        this.masterPublicFolderList = res.list;
      });
  }

  fileList: any = [];
  openFiledInFolder(data, type: any) {
    this.selectedfolderName = data.folderName;
    this.selectedfolderId = data.folderId;
    this.getV2_FileList(data.folderId, type);
  }


  getV2_FileList(FolderId: any, selectTypeFile: any) {
    this.selectTypeFileValue = selectTypeFile;
    let paylod: any = {
      FolderId: FolderId,
    };

    if (selectTypeFile == "My File") {
      paylod.SearchMyFile = true;
    }
    if (selectTypeFile == "Public") {
      paylod.SearchIsPublic = true;
    }
    if (selectTypeFile == "Shared") {
      paylod.SearchIsPublic = false;
    }
    this.fileManagementService.getV2_FileList(paylod).subscribe((res: any) => {
      this.fileList = res.list;

    });
  }
  /**
   * End  For Dropdown Company ,client,project
   */
  // Chart Colors Set
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  // Chat Data Fetch
  private _fetchData() {
    // Folder Data Fetch
    this.folderData = folderData;
    this.folderDatas = Object.assign([], this.folderData);

    // Recent Data Fetch
    this.recentData.subscribe(x => {
      this.recentDatas = Object.assign([], x);
    });
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService
      .open(content, {
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          if (result) {
            this.saveFolder();
          }
        },
        (reason) => {
          this.folderForm.reset();
        }
      );
  }
  /**
  * Form data get
  */
  get form() {
    return this.folderForm.controls;
  }

  /**
  * Save user
  */
  saveFolder() {
    if (this.folderForm.valid) {
      this.getV2_CreateMasterFolder();
    }
  }
  getV2_CreateMasterFolder() {
    let payload = {
      FolderName: this.folderForm.get("title")?.value,
      CompanyId: this.selectedDropDownCompanyIdValue,
      CompanyName: this.findCompanyName(this.selectedDropDownCompanyIdValue)
        .companyName,
      ClientId: this.selectedDropDownClientIdValue,
      ClientName: this.findClientName(this.selectedDropDownClientIdValue)
        .clientName,
      ProjectId: this.selectedDropDownProjectOrDeparmentIdValue,
      ProjectName: this.findDepartmentName(
        this.selectedDropDownProjectOrDeparmentIdValue
      ).departmentName,
    };
    this.fileManagementService
      .getV2_CreateMasterFolder(payload)
      .subscribe((res) => {
        this.modalService.dismissAll();
        this.folderForm.reset();
        this.getFolderListyFile(this.selectedDropDownProjectOrDeparmentIdValue);
        this.getFolderListShared(this.selectedDropDownProjectOrDeparmentIdValue);
        this.getFolderListPublic(this.selectedDropDownProjectOrDeparmentIdValue);
  
        this.selectedfolderName = "";
        this.selectedfolderId = "";
        //console.log("res", res);
      });
  }

  findCompanyName(companyId) {
    return this.arrayListDropDownCompany.find((i) => i.companyId === companyId);
  }

  findClientName(clientId) {
    return this.arrayListDropDownClientList.find(
      (i) => i.clientId === clientId
    );
  }

  findDepartmentName(departmentId) {
    return this.arrayListDropDownProjectOrDeparmentList.find(
      (i) => i.departmentId === departmentId
    );
  }

  files: any = [];
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  openModalFile(content: any) {
    this.submitted = false;
    this.modalService
      .open(content, {
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          if (result) {
            this.onSuibmitFile();
          }
        },
        (reason) => {
          this.recentForm.reset();
          this.files = [];
        }
      );
  }
  onSuibmitFile(): void {
    if (this.files.length === 0) return;
    let currentType = this.recentForm.get("file_type").value;
    const formData = new FormData();
    formData.append("FolderId", this.selectedfolderId);
    formData.append("FileName", this.recentForm.get("file_name").value);
    if (this.recentForm.get("file_type").value == "My File") {
      formData.append("SearchMyFile", "true");
    }
    if (this.recentForm.get("file_type").value == "Public") {
      formData.append("SearchIsPublic", "true");
    }
    if (this.recentForm.get("file_type").value == "Shared") {
      formData.append("SearchIsPublic", "false");
    }
    formData.append("Icon", this.determineIconClass());
    formData.append("file", this.files[0], this.files[0].name); // Assuming single file upload

    this.fileManagementService.getV2_CreateV2_File(formData).subscribe({
      next: (response) => {
        console.log("Upload success", response);
        this.recentForm.reset();
        this.files = [];
        this.getV2_FileList(this.selectedfolderId, this.selectTypeFileValue);
        this.files = [];
      },
      error: (error) => {
        this.recentForm.reset();
        this.files = [];
      },
    });
  }

  determineIconClass() {
    let iconClass = "align-bottom ri-file-text-fill text-primary"; // Default icon class for non-image, non-pdf files

    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (file.type === "application/pdf" || fileExtension === "pdf") {
        iconClass = "align-bottom ri-file-pdf-fill text-warning";
      } else if (
        file.type.startsWith("image/") ||
        ["jpg", "jpeg", "png", "gif"].includes(fileExtension)
      ) {
        iconClass = "align-bottom ri-gallery-fill text-success";
      } else if (
        file.type.startsWith("audio/") ||
        ["mp3", "wav", "ogg"].includes(fileExtension)
      ) {
        iconClass = "align-bottom ri-music-fill text-info";
      } else if (
        file.type.startsWith("video/") ||
        ["mp4", "avi", "mkv"].includes(fileExtension)
      ) {
        iconClass = "align-bottom ri-video-fill text-danger";
      } else if (["csv"].includes(fileExtension)) {
        iconClass = "align-bottom ri-file-text-fill text-primary";
      } else if (["xls", "xlsx"].includes(fileExtension)) {
        iconClass = "align-bottom  ri-article-fill text-success";
      } else if (["doc", "docx"].includes(fileExtension)) {
        iconClass = "align-bottom ri-file-word-fill text-primary";
      }
    }
    return iconClass;
  }
}
