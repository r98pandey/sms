import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NgbModal, NgbNav, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { TicketService } from "src/app/core/services/ticket.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { DropdownService } from "src/app/shared/Service-common/dropdown.service";
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
import { NewAssetListCommonComponent } from "src/app/shared/components/new-asset-list-common/new-asset-list-common.component";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import Swal from "sweetalert2";
import { DomSanitizer } from "@angular/platform-browser";
import { DeleteModalComponent } from "src/app/shared/components/delete-modal/delete-modal.component";
import { DecimalPipe, Location } from '@angular/common';
@Component({
  selector: "app-add-ticket",
  templateUrl: "./add-ticket.component.html",
  styleUrls: ["./add-ticket.component.scss"],
})
export class AddTicketComponent implements OnInit {
  isProject: boolean = false;
  afterApiCallSubmit: boolean = true;
  minDate: Date = new Date();
  label: any = "Maintenance Management";
  defaultNavActiveId: any = 1;
  breadCrumbItems: any = [
    { label: "Ticket" },
    { label: "Add Ticket ", active: true },
  ];
  maxCharsDecision = 300;
  maxCharsDecisionTitle = 100;

  operationList = [
    { name: "Service", operationTypeId: 1, disabled: false },
    { name: "Incident Report", operationTypeId: 2, disabled: false },
    { name: "Bug", operationTypeId: 3, disabled: true },
    { name: "New Requirement", operationTypeId: 4, disabled: true },



  ];
  ticketTypeList = [
    { typeNo: 1, typeName: "Hardware" },
    { typeNo: 2, typeName: "Non-Hardware" },
  ];
  addTicketFrom: FormGroup;
  urgentList: any[] = [];

  imageOneUrl: any = "";
  imageTwoUrl: any = "";
  isFirstImageTicketVisible: boolean = false;
  isSecondImageTicketVisible: boolean = false;

  isDeviceRelated: boolean = false;
  masterTicketTypeList: any = [];

  arrayListDropDownCompany: any = [];
  arrayListDropDownClientList: any = [];
  arrayListDropDownProjectOrDeparmentList: any = [];
  arrayListDropDownAssetStatus: any = [];
  selectedDropDownCompanyIdValue: any;
  selectedDropDownClientIdValue: any;
  selectedDropDownProjectOrDeparmentIdValue: any;
  selectedDropDownAssetStatusIdValue: any;
  public Editor = ClassicEditor;
  default_imageOneUrl: string;
  default_imageTwoUrl: string;
  selectedAssetList: any = [];
  selectedDropDownLocationtIdValue: any;

  arrayListDropDownLocationList: any;
  masterIncidentTypeList: any;
  selectedDropIncidentTypeValue: any = null;
  disabledWithAceessGroup: boolean = false;
  projectDepartmentFieldDisiabled: boolean = false;
  pasteImageAll: any[] = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private ticketService: TicketService,
    private authService: AuthAssetService,
    private menuService: MenuServiceService,
    public formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private dropdownServices: DropdownService,
    private offcanvasService: NgbOffcanvas,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private location: Location
  ) {
    if (this.ticketService.accessRight == true) {
      let url = this.router.url;
      this.isProject = this.authService.getisProject();
      this.getDropdownCompanyList();
      this.getMX_MasterUrgentTypeList();
    } else {
      this.goback();
    }
  }

  ngOnInit(): void {
    let data: any = JSON.parse(localStorage.getItem("currentUser"));
    if (data?.role === "Client User") {
      this.disabledWithAceessGroup = true;
    }
    this.getFromBinding();
  }



  getFromBinding() {
    this.imageOneUrl = "../../../../../assets/images/placeholderimage.png";
    this.imageTwoUrl = "../../../../../assets/images/placeholderimage.png";
    this.asset_img0 = this.default_asset_img0 =
      "../../../../../assets/images/placeholderimage.png";
    this.asset_img1 = this.default_asset_img1 =
      "../../../../../assets/images/placeholderimage.png";
    this.asset_img2 = this.default_asset_img2 =
      "../../../../../assets/images/placeholderimage.png";
    this.asset_img3 = this.default_asset_img3 =
      "../../../../../assets/images/placeholderimage.png";
    this.default_imageOneUrl =
      "../../../../../assets/images/placeholderimage.png";
    this.default_imageTwoUrl =
      "../../../../../assets/images/placeholderimage.png";
    this.addTicketFrom = this.formBuilder.group({
      operationType: ["Service", [Validators.required]],
      ticketType: [null, [Validators.required]],
      type: [null, [Validators.required]],
      company: [null, [Validators.required]],
      client: [null, [Validators.required]],
      project: [null, [Validators.required]],
      title: ["", [Validators.required]],
      urgent: [null, [Validators.required]],
      description: [""],
      picOne: [""],
      picTwo: [""],
      Remark_Pic1: [""],
      Remark_Pic2: [""],
      incidentImage1URLBase64: [""],
      incidentImage2URLBase64: [""],
      incidentImage3URLBase64: [""],
      incidentImage4URLBase64: [""],
      approxTimeOfIncident: [""],
      dateOfincident: [""],
      impactOfIncident: [""],
      locationId: [""],
      incidentType: [null],
      isGlobal: [false, [Validators.required]],
    });

    //console.log(JSON.parse(localStorage.getItem("currentUser")));
    if (
      JSON.parse(localStorage.getItem("currentUser")).accessGroupName ===
      "Software Engineer" ||
      JSON.parse(localStorage.getItem("currentUser")).accessGroupName ===
      "Head Of Department"
    ) {
      this.isGlobal.setValue(true);
      this.isGlobal.disable();
      this.operationType.setValue("Service");
      this.operationList[1].disabled = true;
      this.operationList[2].disabled = false;
      this.operationList[3].disabled = false;
      this.operationList = [...this.operationList];
      this.onChangeServiceType(this.operationType.value);
    }
  }
  get locationId() {
    return this.addTicketFrom.get("locationId");
  }
  get incidentType() {
    return this.addTicketFrom.get("incidentType");
  }

  get impactOfIncident() {
    return this.addTicketFrom.get("impactOfIncident");
  }

  get dateOfincident() {
    return this.addTicketFrom.get("dateOfincident");
  }

  get approxTimeOfIncident() {
    return this.addTicketFrom.get("approxTimeOfIncident");
  }

  get incidentImage4URLBase64() {
    return this.addTicketFrom.get("incidentImage4URLBase64");
  }
  get incidentImage1URLBase64() {
    return this.addTicketFrom.get("incidentImage1URLBase64");
  }
  get incidentImage3URLBase64() {
    return this.addTicketFrom.get("incidentImage3URLBase64");
  }
  get incidentImage2URLBase64() {
    return this.addTicketFrom.get("incidentImage2URLBase64");
  }
  get operationType() {
    return this.addTicketFrom.get("operationType");
  }
  get ticketType() {
    return this.addTicketFrom.get("ticketType");
  }
  get type() {
    return this.addTicketFrom.get("type");
  }
  get project() {
    return this.addTicketFrom.get("project");
  }
  get title() {
    return this.addTicketFrom.get("title");
  }
  get urgent() {
    return this.addTicketFrom.get("urgent");
  }

  get description() {
    return this.addTicketFrom.get("description");
  }
  get picOne() {
    return this.addTicketFrom.get("picOne");
  }
  get picTwo() {
    return this.addTicketFrom.get("picTwo");
  }
  get client() {
    return this.addTicketFrom.get("client");
  }
  get company() {
    return this.addTicketFrom.get("company");
  }
  get Remark_Pic1() {
    return this.addTicketFrom.get("Remark_Pic1");
  }
  get Remark_Pic2() {
    return this.addTicketFrom.get("Remark_Pic2");
  }
  get isGlobal() {
    return this.addTicketFrom.get("isGlobal");
  }

  /**
   * Start  For Dropdown Company ,client,project
   */
  getDropdownCompanyList() {
    this.dropdownServices.Getv3_MaintenanceCompanyDropDownList_Active({}).subscribe((res: any) => {
      this.arrayListDropDownCompany = res.list;
      if (res.list.length != 0) {
        let data: any = JSON.parse(localStorage.getItem("currentUser"));
        if (data?.role === "Client User") {
          // if (data?.accessGroupName === "Application User") {
          this.selectedDropDownCompanyIdValue =
            this.arrayListDropDownCompany[0].companyId;
          this.getDropdownClientlist();
          // }
        }
      }
    });
  }
  getDropdownClientlist() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceClientDropDownList_Active(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownClientList = res.list;

        if (res.list.length != 0) {
          let data: any = JSON.parse(localStorage.getItem("currentUser"));
          if (data?.role === "Client User") {
            // if (data?.accessGroupName === "Application User") {
            this.selectedDropDownClientIdValue =
              this.arrayListDropDownClientList[0].clientId;
            this.getDropdownDepartmentList();
            // }
          }
        }
      });
  }
  getDropdownDepartmentList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
    };
    this.dropdownServices
      .Getv3_MaintenanceDepartmentDropDownList_Active(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownProjectOrDeparmentList = res.list;
        if (res.list.length != 0) {
          let data: any = JSON.parse(localStorage.getItem("currentUser"));
          if (data?.role === "Client User") {
            // if (data?.accessGroupName === "Application User") {
            this.selectedDropDownProjectOrDeparmentIdValue =
              this.arrayListDropDownProjectOrDeparmentList[0].departmentId;
            if (res.list.length >= 2) {
              this.projectDepartmentFieldDisiabled = false;
            } else {
              this.projectDepartmentFieldDisiabled = true;
            }
          }
          // }
        }
      });
  }
  onDropdownCompanyValueChange(event) {
    this.selectedDropDownClientIdValue = null;
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.arrayListDropDownProjectOrDeparmentList = [];
    this.selectedDropDownLocationtIdValue = null;
    this.selectedDropIncidentTypeValue = null;
    this.incidentType.reset();
    this.getDropdownClientlist();
    this.selectedAssetList = [];
  }
  onDropdownClientValueChange(event) {
    this.selectedDropDownProjectOrDeparmentIdValue = null;
    this.selectedDropDownLocationtIdValue = null;
    this.selectedDropIncidentTypeValue = null;
    this.getDropdownDepartmentList();
    this.incidentType.reset();
    this.selectedAssetList = [];
  }
  onDropdownDepartmentValueChange(event) {
    this.selectedDropDownLocationtIdValue = null;
    this.selectedDropIncidentTypeValue = null;
    this.getV2_MasterIncidentTypeList(
      this.selectedDropDownProjectOrDeparmentIdValue
    );
    this.getDropdownLocationList();
    this.incidentType.reset();
    this.selectedAssetList = [];
  }
  onDropdownIncidentTypeValueChange(event) {
    this.selectedDropIncidentTypeValue = event;
  }
  /**
   * End  For Dropdown Company ,client,project
   */

  getDropdownLocationList() {
    let payload: any = {
      SearchCompanyId: this.selectedDropDownCompanyIdValue,
      SearchClientId: this.selectedDropDownClientIdValue,
      SearchDepartmentId: this.selectedDropDownProjectOrDeparmentIdValue,
    };
    this.dropdownServices
      .GetLocationListDrobDown(payload)
      .subscribe((res: any) => {
        this.arrayListDropDownLocationList = res.list;
      });
  }

  getMX_MasterUrgentTypeList(): void {
    this.ticketService
      .getMX_MasterUrgentTypeList()
      .subscribe((response: any) => {
        if (response) {
          this.urgentList = response?.data;
        }
      });
  }
  getMX_MasterTicketType(isDeviceRelated: any): void {
    this.ticketService
      .getMX_MasterTicketType(isDeviceRelated)
      .subscribe((response: any) => {
        if (response) {
          this.masterTicketTypeList = response?.list;
        }
      });
  }
  getV2_MasterIncidentTypeList(ProjectId: any): void {
    let payload = {
      ProjectId: ProjectId,
    };
    this.ticketService
      .getV2_MasterIncidentTypeList(payload)
      .subscribe((response: any) => {
        if (response) {
          this.masterIncidentTypeList = response?.data;
        }
      });
  }

  ticketTypeHandler(event): void {
    if (event?.typeName === "Hardware") {
      this.addTicketFrom.get("type").reset();
      this.isDeviceRelated = true;
      this.getMX_MasterTicketType(this.isDeviceRelated);
    } else {
      this.addTicketFrom.get("type").reset();
      this.isDeviceRelated = false;
      this.getMX_MasterTicketType(this.isDeviceRelated);
    }
  }

  onSelectFirstFileTicketFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        this.imageOneUrl = event.target.result;
        this.isFirstImageTicketVisible = true;
      };
      reader.onerror = () => {
        this.imageOneUrl = this.default_imageOneUrl;
        this.Remark_Pic1.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con) reader.readAsDataURL(event.target.files[0]);
      else {
        this.imageOneUrl = this.default_imageOneUrl;
        this.Remark_Pic1.setValue("");
      }
    } else {
      this.imageOneUrl = this.default_imageOneUrl;
      this.Remark_Pic1.setValue("");
    }
  }

  onSelectSecondTicketFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        this.imageTwoUrl = event.target.result;
        this.isSecondImageTicketVisible = true;
      };
      reader.onerror = () => {
        this.imageTwoUrl = this.default_imageTwoUrl;
        this.Remark_Pic2.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con) reader.readAsDataURL(event.target.files[0]);
      else {
        this.imageTwoUrl = this.default_imageTwoUrl;
        this.Remark_Pic2.setValue("");
      }
    } else {
      this.imageTwoUrl = this.default_imageTwoUrl;
      this.Remark_Pic2.setValue("");
    }
  }

  crossOneTicketImage(url): void {
    if (url) {
      this.imageOneUrl = "../../../../../assets/images/placeholderimage.png";
      this.isFirstImageTicketVisible = false;
      this.resetFileInput("profile-img-file-input-img-1");
    }
  }

  crossTwoTicketImage(url): void {
    if (url) {
      this.imageTwoUrl = "../../../../../assets/images/placeholderimage.png";
      this.isSecondImageTicketVisible = false;
      this.resetFileInput("profile-img-file-input-img-2");
    }
  }
  // getAllselectAsset(event) {
  //   this.selectedAssetList = event;
  //   //console.log("event", event);
  // }
  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }

  onSubmit(event: any): void {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to Add Ticket";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addAddTicketSucessModal(event);
        } else {
          //this.onBack();
        }
      }
    });
  }


  addAddTicketSucessModal(event: any): void {
    event.preventDefault();
    let selectFileData: any = [];
    this.afterApiCallSubmit = false;
    let selectAllUpload = [];
    if (this.pasteImageAll.length != 0) {
      this.pasteImageAll.map((i) => {
        if (i.url)
          selectAllUpload.push({ ImageBase64Url: i.url ? i.url.split(',')[1] : '' })
      })
    }
    if (this.base64Strings.length != 0) {
      this.base64Strings.map((i) => {
        if (i)
          selectAllUpload.push({ ImageBase64Url: i.split(',')[1] })
      })
    }
    console.log("selectAllUpload", selectAllUpload);


    const urgencyType = this.urgentList.find(
      (i) => i.urgencyTypeName === this.urgent.value
    );
    let mX_ReportIncident: any = {
      incidentImage1URLBase64:
        this.asset_img0 !== "../../../../../assets/images/placeholderimage.png"
          ? this.asset_img0.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
      IncidentImage2URLBase64:
        this.asset_img1 !== "../../../../../assets/images/placeholderimage.png"
          ? this.asset_img1.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
      IncidentImage3URLBase64:
        this.asset_img2 !== "../../../../../assets/images/placeholderimage.png"
          ? this.asset_img2.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
      IncidentImage4URLBase64:
        this.asset_img3 !== "../../../../../assets/images/placeholderimage.png"
          ? this.asset_img3.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
      ApproxTimeOfIncident: this.formatTimeNew(this.approxTimeOfIncident.value),
      DateOfincident: this.commonFunctionService.dateFormatter(
        this.dateOfincident.value
      ),
      impactOfIncident: this.impactOfIncident.value,
    };
    if (this.selectedDropIncidentTypeValue) {
      mX_ReportIncident.IncidentTypeId =
        this.selectedDropIncidentTypeValue.incidentTypeId;
      mX_ReportIncident.IncidentTypeName =
        this.selectedDropIncidentTypeValue.incidentTypeName;
    }
    if (this.locationId.value) {
      (mX_ReportIncident.LocationId = this.locationId.value),
        (mX_ReportIncident.LocationName = this.findNameById(
          this.locationId.value,
          this.arrayListDropDownLocationList,
          "locationName",
          "locationId"
        ));
    }
    let sentence = this.title.value;
    if (sentence.charAt(0) === sentence.charAt(0).toLowerCase()) {
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    } else {
      sentence = sentence;
    }
    let mX_Ticketing: any = {
      IssueType: this.ticketType.value ? this.ticketType.value : "",
      TicketTitle: sentence,
      IssueDescription: this.formatDescription(this.description.value),
      CompanyId: this.company.value,
      ClientId: this.client.value,
      ClientName: this.findNameById(
        this.client.value,
        this.arrayListDropDownClientList,
        "clientName",
        "clientId"
      ),
      CompanyName: this.findNameById(
        this.company.value,
        this.arrayListDropDownCompany,
        "companyName",
        "companyId"
      ),
      ProjectId: this.project.value,
      ProjectName: this.findNameById(
        this.project.value,
        this.arrayListDropDownProjectOrDeparmentList,
        "departmentName",
        "departmentId"
      ),
      TicketTypeId: this.type?.value ? this.type?.value : "",
      TicketTypeName: this.findNameById(
        this.type.value,
        this.masterTicketTypeList,
        "ticketTypeName",
        "ticketTypeId"
      ),
      urgencyTypeId: urgencyType.urgencyTypeId,
      urgencyTypeName: urgencyType.urgencyTypeName,
      OperationType: this.operationType?.value
        ? this.operationType?.value
        : "",

      isGlobal: this.isGlobal?.value ? 'false' : 'true',
    }
    let mX_ReportIncidentznew = {}
    if (this.operationType.value == "Incident Report") {
      mX_ReportIncidentznew = this.commonFunctionService.clean(mX_ReportIncident);
    }



    let mX_TicketItem = this.selectedAssetList
      ? this.selectedAssetList.map((i) => ({ ...i, assetId: i.id }))
      : []
    const formData = new FormData();

    for (const key in mX_Ticketing) {
      if (mX_Ticketing.hasOwnProperty(key)) {
        if (mX_Ticketing[key]) {
          formData.append(`mX_Ticketing.${key}`, mX_Ticketing[key]);
        }
      }
    }

    for (const key in mX_ReportIncidentznew) {
      if (mX_ReportIncidentznew.hasOwnProperty(key)) {
        if (mX_ReportIncidentznew[key]) {
          formData.append(`mX_ReportIncident.${key}`, mX_ReportIncidentznew[key]);
        }
      }
    }

    (mX_TicketItem && mX_TicketItem.length > 0)
    {
      mX_TicketItem.forEach((ticketItem, index) => {
        formData.append(`mX_TicketItem[${index}].assetId`, ticketItem.id);
        formData.append(`mX_TicketItem[${index}].assetTagId`, ticketItem.assetTagId);
        formData.append(`mX_TicketItem[${index}].assetName`, ticketItem.assetName);
        formData.append(`mX_TicketItem[${index}].assetImagePath`, ticketItem.assetImagePath);
      });
    }


    (selectAllUpload && selectAllUpload.length > 0)
    {
      selectAllUpload.forEach((image, index) => {
        formData.append(`mX_TikcetImages[${index}].ImageBase64Url`, image.ImageBase64Url);
      });
    }
    for (let i = 0; i < this.multiplyFileUpdload.length; i++) {
      formData.append('file', this.multiplyFileUpdload[i], this.multiplyFileUpdload[i].name);
    }
    for (let i = 0; i < this.multiplyVideoUpdload.length; i++) {
      formData.append('fileVideo', this.multiplyVideoUpdload[i], this.multiplyVideoUpdload[i].name);
    }

    // this.ticketService.createTicket(formData).subscribe(
    //   response => {
    //     // Handle success response
    //     console.log('Ticket created successfully:', response);
    //   },
    //   error => {
    //     // Handle error
    //     console.error('Error creating ticket:', error);
    //   }
    // );
    this.saveTicket(formData);
  }


  formatDescription(description) {
    if (!description) return null;

    // Add style to <img> tags, considering existing style attributes
    description = description.replace(/<img([^>]*)(style="[^"]*")?/gi, function (match, otherAttrs, styleAttr) {
      if (styleAttr) {
        // If there's already a style attribute, append to it
        return `<img${otherAttrs} style="${styleAttr.slice(0, -1)}; height: 200px!important; width: 200px!important;"`;
      } else {
        // If there's no style attribute, add one
        return `<img${otherAttrs} style="height: 200px!important; width: 200px!important;"`;
      }
    });

    // Convert URLs to clickable links, ignoring those in HTML attributes
    description = description.replace(/(?<!=")(https?:\/\/[^\s<]+)/gi, '<a href="$1" target="_blank">$1</a>');

    return description;
  }

  goback() {
    this.location.back()
  }
  saveTicket(payload): void {
    this.afterApiCallSubmit = false;
    this.ticketService.addTicket(payload).subscribe(
      (response: any) => {
        if (response) {
          this.success(response);
          this.modalService.dismissAll();
          this.goback()
        }
      },
      (err) => {
        this.afterApiCallSubmit = true;
        this.refreshRouter();
      }
    );
  }
  refreshRouter() {
    const currentUrl = this.router.url;

    const navigationExtras: NavigationExtras = {
      queryParamsHandling: "preserve",
      preserveFragment: true,
    };

    this.router.navigate([currentUrl], navigationExtras);
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

  waring(message) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  findNameById(
    idToFind: number,
    items,
    objectname,
    objectId
  ): string | undefined {
    const foundItem = items.find((item) => item[objectId] === idToFind);
    return foundItem ? foundItem[objectname] : undefined;
  }

  onChangeTicketType(event: any) {
    this.selectedAssetList = [];
  }
  @ViewChild("defaultNav") defaultNav: NgbNav;
  onChangeServiceType(event) {
    this.addTicketFrom.get("incidentImage1URLBase64").reset();
    this.addTicketFrom.get("incidentImage2URLBase64").reset();
    this.addTicketFrom.get("incidentImage3URLBase64").reset();
    this.addTicketFrom.get("incidentImage4URLBase64").reset();
    this.addTicketFrom.get("approxTimeOfIncident").reset();
    this.addTicketFrom.get("dateOfincident").reset();
    this.addTicketFrom.get("impactOfIncident").reset();
    this.addTicketFrom.get("locationId").reset();
    this.addTicketFrom.get("incidentType").reset();
    this.Remark_Pic1.reset();
    this.Remark_Pic2.reset();
    this.crossOneTicketImage("image1");
    this.crossTwoTicketImage("image2");
    this.asset_img0 = "../../../../../assets/images/placeholderimage.png";
    this.asset_img1 = "../../../../../assets/images/placeholderimage.png";
    this.asset_img2 = "../../../../../assets/images/placeholderimage.png";
    this.asset_img3 = "../../../../../assets/images/placeholderimage.png";
    this.base64Strings = [];
    this.file = [];
    this.pasteImageAll = [];
    this.defaultNavActiveId = 1;
    this.multiplyFileUpdload = [];
    this.multiplyVideoUpdload = [];

    this.multplyImageFileTab = 1;
    // this.defaultNav.activeId = 1;
    if (this.operationType.value == "Incident Report") {
      this.addTicketFrom
        .get("approxTimeOfIncident")
        .setValidators([Validators.required]);
      this.addTicketFrom
        .get("dateOfincident")
        .setValidators([Validators.required]);
      this.addTicketFrom.get("locationId").setValidators([Validators.required]);

      this.addTicketFrom
        .get("incidentType")
        .setValidators([Validators.required]);
    } else {
      this.addTicketFrom.get("approxTimeOfIncident").clearValidators();
      this.addTicketFrom.get("dateOfincident").clearValidators();
      this.addTicketFrom.get("locationId").clearValidators();
      this.addTicketFrom.get("incidentType").clearValidators();
    }
    this.addTicketFrom.get("approxTimeOfIncident").updateValueAndValidity();
    this.addTicketFrom.get("dateOfincident").updateValueAndValidity();
    this.addTicketFrom.get("incidentType").updateValueAndValidity();
    this.addTicketFrom.get("locationId").updateValueAndValidity();
  }

  formatTime(value) {
    let da = moment(value, "hh:mm:ss A");
    const an_hour_ago = moment(da).subtract(1, "hour");
    return an_hour_ago.format("hh:mm A");
  }

  formatTimeNew(value) {
    let time = moment(value, "hh:mm:ss A");
    return time.format("hh:mm A");
  }

  asset_img0: any;
  default_asset_img0: any;
  asset_img1: any;
  default_asset_img1: any;
  asset_img2: any;
  default_asset_img2: any;
  asset_img3: any;
  default_asset_img3: any;
  isFirstImageVisible: boolean = false;
  isSecondImageVisible: boolean = false;
  isThirdImageVisible: boolean = false;
  isFourthImageVisible: boolean = false;

  crossFirstImage(url) {
    if (url) {
      this.asset_img0 = "../../../../../assets/images/placeholderimage.png";
      this.isFirstImageVisible = false;
      this.resetFileInput("asset_id0");
    }
  }

  crossSecondImage(url) {
    if (url) {
      this.asset_img1 = "../../../../../assets/images/placeholderimage.png";
      this.isSecondImageVisible = false;
      this.resetFileInput("asset_id1");
    }
  }

  crossThirdImage(url) {
    if (url) {
      this.asset_img2 = "../../../../../assets/images/placeholderimage.png";
      this.isThirdImageVisible = false;
      this.resetFileInput("asset_id2");
    }
  }

  resetFileInput(id) {
    const fileInput: any = document.getElementById(id);
    if (fileInput) {
      // Clear the value of the file input to remove the selected image
      fileInput.value = "";
    }
  }
  crossFourthImage(url) {
    if (url) {
      this.asset_img3 = "../../../../../assets/images/placeholderimage.png";
      this.isFourthImageVisible = false;
      this.resetFileInput("asset_id3");
    }
  }
  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.asset_img0 = event.target.result;
        this.isFirstImageVisible = true;
      };
      reader.onerror = () => {
        this.asset_img0 = this.default_asset_img0;
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.asset_img0 = this.default_asset_img0;
      }
    } else {
      this.asset_img0 = this.default_asset_img0;
    }
  }
  onSelectFile2(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.asset_img2 = event.target.result;
        this.isThirdImageVisible = true;
      };

      reader.onerror = () => {
        this.asset_img2 = this.default_asset_img2;
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.asset_img2 = this.default_asset_img2;
      }
    } else {
      this.asset_img2 = this.default_asset_img2;
    }
  }
  onSelectFile1(event) {
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        this.asset_img1 = event.target.result;
        this.isSecondImageVisible = true;
      };

      reader.onerror = () => {
        this.asset_img1 = this.default_asset_img1;
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.asset_img1 = this.default_asset_img1;
      }
    } else {
      this.asset_img1 = this.default_asset_img1;
    }
  }
  onSelectFile3(event) {
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();

      reader.onload = (event) => {
        this.asset_img3 = event.target.result;
        this.isFourthImageVisible = true;
      };

      reader.onerror = () => {
        this.asset_img3 = this.default_asset_img3;
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.asset_img3 = this.default_asset_img3;
      }
    } else {
      this.asset_img3 = this.default_asset_img3;
    }
  }

  getAssetList() {
    const modalRef = this.offcanvasService.open(NewAssetListCommonComponent, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas ",
    });
    modalRef.componentInstance.selectedDropDownCompanyIdValue =
      this.company.value;
    modalRef.componentInstance.selectedDropDownClientIdValue =
      this.client.value;
    modalRef.componentInstance.selectedDropDownProjectOrDeparmentIdValue =
      this.project.value;

    modalRef.componentInstance.selectedAsset =
      this.selectedAssetList.length != 0 ? this.selectedAssetList : [];
    console.log(" this.selectedAssetList", this.selectedAssetList)
    modalRef.componentInstance.SearchAssetStatusIdShown = 3;
    modalRef.result
      .then((result) => {
        this.selectedAssetList = result;
      })
      .catch((result) => {
        this.selectedAssetList = result;
      });
  }

  clearChangDate() {
    this.approxTimeOfIncident.reset();
    this.dateOfincident.reset();
  }
  clearChangTime() {
    this.approxTimeOfIncident.reset();
  }

  onClickisGlobal(event) {

    if (this.isGlobal.value) {
      let data = {
        title:
          "Are you certain that the ticket you intend to create will be internal?",
        subTitle:
          "Internal tickets should not be shared with clients,they are intended exclusively for internal team members",
      };
      this.operationType.setValue("Service");
      this.operationList[1].disabled = true;
      this.operationList[2].disabled = false;
      this.operationList[3].disabled = false;

      this.operationList = [...this.operationList];
      console.log(this.operationList)
      this.openModaWaringConf(data);
    } else {
      this.operationType.setValue("Service");
      this.operationList[1].disabled = false;
      this.operationList[2].disabled = true;
      this.operationList[3].disabled = true;
      this.operationList = [...this.operationList]

    }
    this.onChangeServiceType(this.operationType.value);
  }

  openModaWaringConf(message) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = message.title;
    modalRef.componentInstance.subTitle = message.subTitle;
    modalRef.componentInstance.buttonName = "";
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
        } else {
          this.isGlobal.setValue(false);
          this.operationList[1].disabled = false;
          this.operationList[2].disabled = true;
          this.operationList[3].disabled = true;
          this.operationList = [...this.operationList]

        }
      }
    });
  }
  created(event) {
    console.log("thishg", this.description.value.replace(/<img/g, '<img  style="height:200px!important; width:200px!important;" '))
  }



  file: File[] = [];

  onSelect(event: any) {
    // Add the newly selected files without removing existing ones
    this.file.push(...event.addedFiles);

    this.onSelectwithbase64(event)
  }
  base64Strings: string[] = [];

  onSelectwithbase64(event: any) {
    // Loop through each added file
    event.addedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Add the prefix if it's not present
        const base64String = e.target.result.includes('data:image')
          ? e.target.result
          : 'data:image/png;base64,' + e.target.result.split(',')[1];

        this.base64Strings.push(base64String);
        console.log(this.base64Strings, 'cfghihg');
      };

      reader.readAsDataURL(file);
    });
  }

  getObjectURL(file: File): any {
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  onRemove(event: any) {
    // Remove the selected file
    let insex: any = this.file.indexOf(event);
    this.file.splice(insex, 1);
    this.base64Strings.splice(insex, 1);

  }

  getImage(event) {
    this.pasteImageAll = [];
    this.pasteImageAll = event
  }

  multplyImageFileTab: any = 1;
  multiplyFileUpdload: File[] = [];
  multiplyVideoUpdload: File[] = [];

  showExistFileLabel: boolean = false;
  onSelectFilleMultiply(event: any) {
    // if (this.multiplyFileUpdload.length > 0) {
    //   this.multiplyFileUpdload.splice(this.multiplyFileUpdload.indexOf(event), 1);
    // }
    this.showExistFileLabel = false;
    let checkerFile: File[] = [];

    checkerFile.push(...event.addedFiles);
    for (let i = 0; i < this.multiplyFileUpdload.length; i++) {
      if (this.multiplyFileUpdload[i].name == checkerFile[0].name) {
        this.showExistFileLabel = true;
        this.warning();
        break;
      }
    }
    if (!this.showExistFileLabel) {
      this.multiplyFileUpdload.push(...event.addedFiles);

    }



    console.log(this.multiplyFileUpdload, "event");
  }
  warning() {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: 'You can not upload same file. ',
      showConfirmButton: false,
      timer: 3000,
    });
  }
  onRemoveFilleMultiply(event: any) {
    this.multiplyFileUpdload.splice(event, 1);
  }
  showExistVideoLabel: boolean = false
  onSelectVideoMultiply(event) {
    this.showExistVideoLabel = false;
    let checkerFile: File[] = [];

    checkerFile.push(...event.addedFiles);
    for (let i = 0; i < this.multiplyVideoUpdload.length; i++) {
      if (this.multiplyVideoUpdload[i].name == checkerFile[0].name) {
        this.showExistVideoLabel = true;
        this.warning();
        break;
      }
    }
    if (!this.showExistVideoLabel) {
      this.multiplyVideoUpdload.push(...event.addedFiles);

    }

  }
  onRemoveVideoMultiply(event: any) {
    this.multiplyVideoUpdload.splice(event, 1);
  }
  truncateFileName(name: string, getValue: any, startChars: number = 22, endChars: number = 7): string {
    if (!name) return '';

    const totalChars = startChars + endChars;

    if (name.length <= totalChars) {
      // No need to truncate if the total length is less than or equal to the sum of startChars and endChars
      return name;
    }

    const truncatedText =
      name.substring(0, startChars) + '...' + name.substring(name.length - endChars);

    return truncatedText;
  }


  openModalDeleteAssetObject(asset: any) {
    console.log(asset, "hh")
    const modalRef = this.modalService.open(DeleteModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You are about to delete a Asset ?";
    modalRef.componentInstance.subTitle =
      "Deleting your Asset will remove for this Asset List  ";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "delete") {
          this.unCheckItemAssetList(asset);
        }
      }
    });
  }


  unCheckItemAssetList(asset) {
    const index = this.getAssetIndex(asset.id);
    this.selectedAssetList.splice(index, 1);
  }
  getAssetIndex(assetId) {
    return this.selectedAssetList.findIndex((i) => i.id === assetId);
  }
}
