import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Observable } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormArray,
  Validators,
} from "@angular/forms";

import { FolderModel, recentModel } from "./file-manager.model";
import { folderData } from "./data";
import { RecentService } from "./file-manger.service";
import {
  NgbdRecentSortableHeader,
  SortEvent,
} from "./file-manager-sortable.directive";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { FileManagementService } from "../../../core/services/file-management.service";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";

@Component({
  selector: "app-file-manager",
  templateUrl: "./file-manager.component.html",
  styleUrls: ["./file-manager.component.scss"],
  providers: [RecentService, DecimalPipe],
})

/**
 * FileManager Component
 */
export class FileManagerComponent implements OnInit {
  folderData!: FolderModel[];
  submitted = false;
  folderForm!: UntypedFormGroup;
  folderDatas: any;
  recentForm!: UntypedFormGroup;
  label: any = "File Manager";
  simpleDonutChart: any;
  public isCollapsed = false;
  breadCrumbItems: any = [
    { label: "File Manager" },
    { label: "File Manager List", active: true },
  ];
  // Table data
  recentData!: Observable<recentModel[]>;
  total: Observable<number>;
  @ViewChildren(NgbdRecentSortableHeader)
  headers!: QueryList<NgbdRecentSortableHeader>;
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
  isProject: boolean;
  constructor(
    private modalService: NgbModal,
    public service: RecentService,
    private formBuilder: UntypedFormBuilder,
    private dropdownServices: DropdownService,
    private authService: AuthAssetService,
    private fileManagementService: FileManagementService
  ) {
    this.recentData = service.recents$;
    this.total = service.total$;
    this.isProject = this.authService.getisProject();
  }

  ngOnInit(): void {
    this.getDropdownCompanyList();
    if (localStorage.getItem("objectSerachForFile")) {
      this.getObjectAfterRefresh();
    }
    document.body.classList.add("file-detail-show");

    /**
     * Form Validation
     */
    this.folderForm = this.formBuilder.group({
      title: ["", [Validators.required]],
    });

    /**
     * Recent Validation
     */
    this.recentForm = this.formBuilder.group({
      file_name: ["", [Validators.required]],
      file_type: ["My File", [Validators.required]],
    });

    // this._simpleDonutChart(
    //   '["--vz-info", "--vz-danger", "--vz-primary", "--vz-success"]'
    // );

    // Compose Model Hide/Show
    var isShowMenu = false;
    document.querySelectorAll(".file-menu-btn").forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        isShowMenu = true;
        document.getElementById("menusidebar")?.classList.add("menubar-show");
      });
    });
    document
      .querySelector(".chat-wrapper")
      ?.addEventListener("click", function () {
        if (
          document
            .querySelector(".file-manager-sidebar")
            ?.classList.contains("menubar-show")
        ) {
          if (!isShowMenu) {
            document
              .querySelector(".file-manager-sidebar")
              ?.classList.remove("menubar-show");
          }
          isShowMenu = false;
        }
      });
     
  }
  closeModel() {
    document.body.classList.remove("file-detail-show");
  }
  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.GetCompanyListDrobDown({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      this.setObjectBeforeRefesh();
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
        this.setObjectBeforeRefesh();
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
        this.setObjectBeforeRefesh();
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
    this.masterFolderList = [];
    this.folderFileTotalCountByProjectlist = [];
    this.selectedfolderName = "";
    this.selectedfolderId = "";
    this.getDropdownClientlist();
    this.setObjectBeforeRefesh();
  }
  onDropdownClientValueChange($event) {
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.masterFolderList = [];
    this.folderFileTotalCountByProjectlist = [];
    this.selectedfolderName = "";
    this.selectedfolderId = "";
    this.getDropdownDepartmentList();
    this.setObjectBeforeRefesh();
  }
  onDropdownDepartmentValueChange($event) {
    this.masterFolderList = [];
    this.folderFileTotalCountByProjectlist = [];
    this.selectedfolderName = "";
    this.selectedfolderId = "";
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue) {
      this.getFolderList(this.selectedDropDownProjectOrDeparmentIdValue);
      this.getV2_FolderFileTotalCountByProject(
        this.selectedDropDownProjectOrDeparmentIdValue
      );
      this.setObjectBeforeRefesh();
    }
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
        var color = getComputedStyle(document.documentElement).getPropertyValue(
          newValue
        );
        if (color) {
          color = color.replace(" ", "");
          return color;
        } else return newValue;
      } else {
        var val = value.split(",");
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
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
          }
        },
        (reason) => {
          this.folderForm.reset();
        }
      );
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

  /**
   * Form data get
   */
  get form1() {
    return this.recentForm.controls;
  }

  _simpleDonutChart(aray: any) {
    // Calculate the difference between total and totalFileSize for each folder
    const series = aray.map((item) => item.totalFileSize);
    const labels = aray.map((item) => item.folderName);

    this.simpleDonutChart = {
      series: series,
      chart: {
        height: 430,
        type: "donut",
      },
      legend: {
        position: "bottom",
        formatter: function (val, opts) {
          const folderIndex = opts.seriesIndex;
          const folderName = aray[folderIndex].folderName;
          const totalFileSize = aray[folderIndex].totalFileSizeType;
          return `${folderName}: ${totalFileSize}`;
        },
      },
      labels: labels,
      dataLabels: {
        enabled: false,
        dropShadow: {
          enabled: true,
          formatter: function (val, opts) {
            const folderIndex = opts.seriesIndex;
            const folderName = aray[folderIndex].folderName;
            const totalFileSize = aray[folderIndex].totalFileSizeType;
            return `${folderName}: ${totalFileSize}`;
          },
        },
      },
    };
  }

  masterFolderList: any = [];
  getFolderList(SearchProjectId: any) {
    let payload = {
      SearchProjectId: SearchProjectId,
    };
    this.fileManagementService
      .getV2_MasterFolderList(payload)
      .subscribe((res: any) => {
        this.masterFolderList = res.list;
        this.setObjectBeforeRefesh();
        //console.log("res", res);
      });
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
        this.getFolderList(this.selectedDropDownProjectOrDeparmentIdValue);
        this.getV2_FolderFileTotalCountByProject(
          this.selectedDropDownProjectOrDeparmentIdValue
        );
        this.selectedfolderName = "";
        this.selectedfolderId = "";
        //console.log("res", res);
        this.setObjectBeforeRefesh();
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
  selectedfolderName: any = "";
  selectedfolderId: any = "";
  fileList: any = [];
  openFiledInFolder(data) {
    this.selectedfolderName = data.folderName;
    this.selectedfolderId = data.folderId;
    this.getV2_FileList(data.folderId);
  }

  getV2_FileList(FolderId: any, selectTypeFile: any = "My File") {
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
      this.setObjectBeforeRefesh();
    });
  }
  files: File[] = [];

  onSelect(event: any) {
    if (this.files.length > 0) {
      this.files.splice(this.files.indexOf(event), 1);
    }
    console.log(...event.addedFiles, "cfghihg");

    this.files.push(...event.addedFiles);
    console.log(this.files, "event");
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  // onSuibmitFile() {
  //   const formdata = new FormData();
  //   formdata.append("FolderId", this.selectedfolderId);
  //   formdata.append("FileName", this.recentForm.get("file_name").value);
  //   if (this.recentForm.get("file_type").value == "My File") {
  //     formdata.append("SearchMyFile", "true");
  //   }
  //   if (this.recentForm.get("file_type").value == "Public") {
  //     formdata.append("SearchIsPublic", "true");
  //   }
  //   if (this.recentForm.get("file_type").value == "Shared") {
  //     formdata.append("SearchIsPublic", "false");
  //   }

  //   if (this.files && this.files.length > 0) {
  //     formdata.append("Icon", this.determineIconClass());
  //     formdata.append("file", this.files[0]);

  //     this.fileManagementService.getV2_CreateV2_File(formdata).subscribe(
  //       (res) => {
  //         //console.log(res, "yuhh");
  //         this.recentForm.reset();
  //         this.files = [];
  //         this.getFolderList(this.selectedDropDownProjectOrDeparmentIdValue);
  //         this.getV2_FolderFileTotalCountByProject(
  //           this.selectedDropDownProjectOrDeparmentIdValue
  //         );
  //         this.getV2_FileList(this.selectedfolderId);
  //       },
  //       (err: any) => {
  //         this.recentForm.reset();
  //         this.files = [];
  //       }
  //     );
  //   }
  // }

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
        this.getFolderList(this.selectedDropDownProjectOrDeparmentIdValue);
        this.getV2_FolderFileTotalCountByProject(
          this.selectedDropDownProjectOrDeparmentIdValue
        );
        this.getV2_FileList(this.selectedfolderId, currentType);
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
  folderFileTotalCountByProjectlist: any = [];
  getV2_FolderFileTotalCountByProject(SearchProjectId) {
    document.body.classList.add("file-detail-show");
    let payload: any = {
      SearchProjectId: SearchProjectId,
    };

    this.fileManagementService
      .getV2_FolderFileTotalCountByProject(payload)
      .subscribe((res: any) => {
        //console.log("resjhjhj", res);
        this.folderFileTotalCountByProjectlist = res.list;
        this.setObjectBeforeRefesh();
        if (this.folderFileTotalCountByProjectlist.length != 0) {
          this.folderFileTotalCountByProjectlist.push({
            folderId: "",
            folderName: "Total",
            totalFileSize: 2147483648,
            totalFileSizeType: "2 GB",
          });
          this._simpleDonutChart(this.folderFileTotalCountByProjectlist);
        }
      });
  }

  onNavChange(event: any) {
    this.getV2_FileList(this.selectedfolderId, event);
  }

  /**
   * for Set object to refesh
   */
  setObjectBeforeRefesh() {
    let objectSerachForFile: any = {};
    if (this.selectedDropDownCompanyIdValue)
    objectSerachForFile.SearchCompanyId =
        this.selectedDropDownCompanyIdValue;
    if (this.selectedDropDownClientIdValue)
    objectSerachForFile.SearchClientId = this.selectedDropDownClientIdValue;
    if (this.selectedDropDownProjectOrDeparmentIdValue)
    objectSerachForFile.SearchDepartmentId =
        this.selectedDropDownProjectOrDeparmentIdValue;

    if (this.selectedDropDownTicketStatusIdValue)
    objectSerachForFile.SearchTicketStatusId =
      this.selectedDropDownTicketStatusIdValue;     

    if (this.selectedDropDownTicketStatusIdValue)
    objectSerachForFile.SearchAssetStatusId =
        this.selectedDropDownTicketStatusIdValue;
    if (this.arrayListDropDownClientList) {
      objectSerachForFile.arrayListDropDownClientList =
        this.arrayListDropDownClientList;
    }
    if (this.arrayListDropDownProjectOrDeparmentList) {
      objectSerachForFile.arrayListDropDownProjectOrDeparmentList =
        this.arrayListDropDownProjectOrDeparmentList;
    }

    localStorage.setItem(
      "objectSerachForFile",
      JSON.stringify(objectSerachForFile)
    );
  }

   /**
   * for get object for refesh
   */
   getObjectAfterRefresh() {
    let objectSerachForFile: any = JSON.parse(
      localStorage.getItem("objectSerachForFile")
    );

    //Company Value
    this.selectedDropDownCompanyIdValue = objectSerachForFile.SearchCompanyId
      ? objectSerachForFile.SearchCompanyId
      : null;
    //Client List
    this.arrayListDropDownClientList =
    objectSerachForFile.arrayListDropDownClientList
        ? objectSerachForFile.arrayListDropDownClientList
        : [];
    //Client Value
    this.selectedDropDownClientIdValue = objectSerachForFile.SearchClientId
      ? objectSerachForFile.SearchClientId
      : null;
    //ProjectOrDeparment List
    this.arrayListDropDownProjectOrDeparmentList =
    objectSerachForFile.arrayListDropDownProjectOrDeparmentList
        ? objectSerachForFile.arrayListDropDownProjectOrDeparmentList
        : [];
    //ProjectOrDeparment Value
    this.selectedDropDownProjectOrDeparmentIdValue =
    objectSerachForFile.SearchProjectId
        ? objectSerachForFile.SearchProjectId
        : null;

    //ProjectOrDeparment Value
    this.selectedDropDownProjectOrDeparmentIdValue =
    objectSerachForFile.SearchDepartmentId
        ? objectSerachForFile.SearchDepartmentId
        : null;
        

    //TicketStatus list;
    this.arrayListDropDownTicketStatus =
    objectSerachForFile.arrayListDropDownTicketStatus
        ? objectSerachForFile.arrayListDropDownTicketStatus
        : [];

    //TicketStatus Value;
    this.selectedDropDownTicketStatusIdValue =
    objectSerachForFile.SearchTicketStatusId
        ? objectSerachForFile.SearchTicketStatusId
        : null;

    //Payload
    this.payload.SearchCompanyId = this.selectedDropDownCompanyIdValue;
    this.payload.SearchClientId = this.selectedDropDownClientIdValue;
    this.payload.SearchProjectId =
      this.selectedDropDownProjectOrDeparmentIdValue;
      this.payload.SearchDepartmentId =
      this.selectedDropDownProjectOrDeparmentIdValue;
    this.payload.SearchTicketStatusId =
      this.selectedDropDownTicketStatusIdValue;

    
  }

}
