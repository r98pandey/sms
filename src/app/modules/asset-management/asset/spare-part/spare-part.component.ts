import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { SpareService } from "src/app/core/services/spare.service";
import { environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { UtilService } from "src/app/core/services/util.service";
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from "rxjs";
import * as moment from "moment";
import { ToastService } from "src/app/shared/Service-common/toast-service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";


@Component({
  selector: "app-spare-part",
  templateUrl: "./spare-part.component.html",
  styleUrls: ["./spare-part.component.scss"],
})
export class SparePartComponent implements OnInit, OnChanges {
  @ViewChild("button") button;
  @Input() assestId: any;
  @Input() viewButton: boolean = true;
  @Input() viewButtonShown: boolean = false;
  companyList: any = {};
  companyData: [] = [];
  rows = [];
  loadingspareTableData: boolean;
  spareList: any;
  addspareForm: FormGroup;
  addspareFormDisable: boolean;
  addspareFormloding: boolean;
  editspareForm: FormGroup;
  spareData: any;
  _sparetId: any;
  spareDatailsList: any;
  page = 1;
  from = 0;
  to = 0;
  qrImagesUrl: any;
  pageSize = 10;
  collectionSize = 0;
  totalRecords: number = 0;
  flag: boolean = false;
  isTableView: boolean;
  editContents: any;
  backgroud_img0: string;
  backgroud_img1: any;
  isFirstImageVisible: boolean = false;
  isSecondImageVisible: boolean = false;
  spareDetails: any;
  deleteId: any;


  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private spareService: SpareService,
    public datepipe: DatePipe,
    private utilService: UtilService,
    public toastservice: ToastService
  ) {
    this.isTableView = false;
    this.loadingspareTableData = true;
    this.qrImagesUrl = environment.apiUrl;
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    this.from = this.page;
    this.to = this.pageSize;
    this.getsparedetails(this.assestId);
  }
  editHandler(row: any, content) {
    //console.log("dfgyu");
    this.editContents = content;
    this._sparetId = row.assetSparePartId;
    this.getEditFromBinding(row);
    this.confirmForEdit(content, this._sparetId);
  }

  viewHandler(row: any, content) {
    this.spareDetails = row;
    this._sparetId = row.assetSparePartId;
    this.confirmForEdit(content, this._sparetId);
  }

  deleteHandler(id: any) {
    //for deleting the spare
    this._sparetId = id;
    this.spareService
      .postDeletespare({
        AssetSparePartId: this._sparetId,
      })
      .subscribe(
        (res: any) => {
          this.successForDeletespareData(res);
          this.rows = [];
          this.getsparedetails(this.assestId);
          //  window.location.reload()
        },
        (err) => {
          //console.log("error", err);
          this.errorForDeletespareData(err);
        }
      );
  }
  successForDeletespareData(res) {
    //for  Delete spare successfully message
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  errorForDeletespareData(err) {
    //for  Delete Company error message
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 2000,
    });
  }
  //->>confirm for Add spare
  confirmForAdd(content, event: Event) {
    this.getAddFromBinding();
    this.modalService
      .open(content, {
        
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.submitAddspareFormDetails(event);
        },
        (reason) => {
          this.addspareForm.reset();
        }
      );
  }
  //confirm for edit spare
  confirmForEdit(content, cid: number) { 
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.submitEditspareFormDetails(cid);
        },
        (reason) => {}
      );
  }
  sweetAlertDeleteConfirmation(id: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      //confirmButtonColor: '#727CF5',
      cancelButtonColor: "#FF3366",
      confirmButtonText: "<span class='swal2-confirm '> Yes, delete it!</span>",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteHandler(id);
      }
    });
  }
  getsparedetails(id) {
    // for getting  spare list by company
    this.rows = [];
    this.loadingspareTableData = true;
    this.spareService.getspareByAssetId(id).subscribe((res: any) => {
      this.rows = res.data;
      this.totalRecords = res.data.length;
      this.isTableView = true;
      this.spareList = res.data;
      this.collectionSize = this.spareList.length;
      this.getspareList();
      //console.log(" spareData->", this.spareList);
      this.loadingspareTableData = false;
    });
  }

  getAddFromBinding() {
    this.backgroud_img0 = "../../../../../assets/images/placeholderimage.png";

    this.addspareForm = this.formBuilder.group({
      SparePartName: ["", [Validators.required]],
      PartNumber: ["NA", Validators.required],
      Modal: ["NA", Validators.required],
      Specification: ["NA", Validators.required],
      WarrentyDuration: ["12", Validators.required],
      WarrentyExpDate: ["", Validators.required],
      SparePartImageBase64: [""],
    });
  }
  get SparePartName() {
    return this.addspareForm.get("SparePartName");
  }
  get PartNumber() {
    return this.addspareForm.get("PartNumber");
  }
  get Modal() {
    return this.addspareForm.get("Modal");
  }
  get Specification() {
    return this.addspareForm.get("Specification");
  }
  get WarrentyDuration() {
    return this.addspareForm.get("WarrentyDuration");
  }
  get WarrentyExpDate() {
    return this.addspareForm.get("WarrentyExpDate");
  }
  get SparePartImageBase64() {
    return this.addspareForm.get("SparePartImageBase64");
  }

  submitAddspareFormDetails(e) {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "Are you Sure to add Spare Part";
    modalRef.componentInstance.subTitle = "";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.addAddSparePartSucessModal(e);
        } else {
          //this.onBack();
        }
      }
    });
  }

  addAddSparePartSucessModal(e) {
    let newStr: any;
    if (
      this.backgroud_img0 == "../../../../../assets/images/placeholderimage.png"
    ) {
      newStr = null;
    } else {
      newStr = this.backgroud_img0.replace(/^data:image\/[a-z]+;base64,/, "");
    }

    let requestData = {
      assetId: this.assestId,
      sparePartName: this.SparePartName.value,
      partNumber: this.PartNumber.value + "",
      modal: this.Modal.value,
      specification: this.Specification.value,
      warrentyDuration: this.WarrentyDuration.value,
      warrentyExpDate: this.dateFormatter(this.WarrentyExpDate.value),
      sparePartImageBase64: newStr,
    };
    //console.log("requestData", requestData);
    this.spareService.postspare(requestData).subscribe(
      (res: any) => {
        this.addspareFormloding = false;
        this.forSuccessAdd(res);
        this.addspareForm.reset();
        this.rows = [];
        this.getsparedetails(this.assestId);
        localStorage.setItem("isLoggedin", "true");
      },
      (err) => {
        //console.log("error", err);
        this.addspareFormloding = false;
        this.forErrorAdd(err);
        if (err.code == 401) {
          this.router.navigate(["/error/:400"]);
        } else if (err.code == 500) {
          this.router.navigate(["/error/:500"]);
        } else {
          //   this.router.navigate(['/error/:400']);
        }
      }
    );
  }
  //for payload(Addspare) submitted success
  forSuccessAdd(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  //for payload(Addspare) submitted error
  forErrorAdd(err) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 2000,
    });
  }
  //for edit from binding
  editSpareData: any;
  getEditFromBinding(data) {
    if (data.sparePartImageURL) {
      this.isSecondImageVisible = true;
      this.backgroud_img1 = this.qrImagesUrl + data.sparePartImageURL;
    } else {
      this.isSecondImageVisible = false;

      this.backgroud_img1 = "../../../../../assets/images/placeholderimage.png";
    }
    const dateParts = data?.warrentyExpDate .split('-');

    if (dateParts.length === 3) {
      // Assuming the format is DD-MM-YYYY
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-based (0 = January, 1 = February, etc.)
      const year = parseInt(dateParts[2], 10);
    
      const warrentyExp = new Date(year, month, day);
    
   
    this.editSpareData = data;
    this.editspareForm = this.formBuilder.group({
      SparePartNameEdit: [data.sparePartName, [Validators.required]],
      PartNumberEdit: [
        data.partNumber ? data.partNumber : "NA",
        Validators.required,
      ],
      ModalEdit: [data.modal ? data.modal : "NA", Validators.required],
      SpecificationEdit: [
        data.specification ? data.specification : "NA",
        Validators.required,
      ],
      WarrentyDurationEdit: [
        data.warrentyDuration ? data.warrentyDuration : 12,
        Validators.required,
      ],
      WarrentyExpDateEdit: [warrentyExp, Validators.required],
      SparePartImageBase64Edit: [],
    });
  }
  }
  get SparePartNameEdit() {
    return this.editspareForm.get("SparePartNameEdit");
  }
  get PartNumberEdit() {
    return this.editspareForm.get("PartNumberEdit");
  }
  get ModalEdit() {
    return this.editspareForm.get("ModalEdit");
  }
  get SpecificationEdit() {
    return this.editspareForm.get("SpecificationEdit");
  }
  get WarrentyDurationEdit() {
    return this.editspareForm.get("WarrentyDurationEdit");
  }
  get WarrentyExpDateEdit() {
    return this.editspareForm.get("WarrentyExpDateEdit");
  }
  get SparePartImageBase64Edit() {
    return this.editspareForm.get("SparePartImageBase64Edit");
  }

  ///for submit payload of edit spare
  submitEditspareFormDetails(spareid: any) { 
    let requestData = {
      AssetSparePartId: spareid,
      assetId: this.assestId,
      sparePartName: this.SparePartNameEdit.value,
      partNumber: this.PartNumberEdit.value,
      modal: this.ModalEdit.value,
      specification: this.SpecificationEdit.value,
      warrentyDuration: this.WarrentyDurationEdit.value,
      warrentyExpDate: this.dateFormatter(this.WarrentyExpDateEdit.value),
    };
    //console.log("requestData", requestData);
    this.spareService.postUpdatespare(requestData).subscribe(
      (res: any) => {
        this.addspareFormloding = false;
        this.forSuccessEdit(res);
        this.editspareForm.reset();
        this.rows = [];
        this.getsparedetails(this.assestId);
        localStorage.setItem("isLoggedin", "true");
      },
      (err) => {
        //console.log("error", err);
        this.addspareFormloding = false;
        this.forErrorEdit(err);
      }
    );
  }
  //for payload(Editspare) submitted success
  forSuccessEdit(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  //for payload(Addspare) submitted error
  forErrorEdit(err) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: err.error.message || err.message,
      showConfirmButton: false,
      timer: 2000,
    });
  }
  getsparedetailsByspareId(id: any) {
    this.spareService.getspareById(id).subscribe((res: any) => {
      this.spareData = res.data;
      this.editspareForm.patchValue({
        // code: this.spareData[0].spareCode,
        // companyId: this._companyName,
        // name: this.spareData[0].spareName,
      });
      //console.log("spareData->", this.spareData);
    });
  }
  goback() {
    //to get back
    this.router.navigate(["/mastersetup/spare/listspare"]);
  }

  getspareList() {
    //console.log("this.pageSize", this.pageSize);
    this.rows = this.spareList.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.to =
      this.page * this.pageSize > this.spareList.length
        ? this.spareList.length
        : this.page * this.pageSize;
    let fromvalue = this.page * this.pageSize - (this.pageSize - 1); // (this.page * this.pageSize) > this.companyData.length ? this.to - ((this.page * this.pageSize) - this.companyData.length) : this.to - (this.pageSize - 1);
    this.from = fromvalue < 1 ? 1 : fromvalue;
    this.from = this.spareList.length == 0 ? 0 : this.from;
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader: any = new FileReader();
      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.backgroud_img0 = event.target.result;
        this.isFirstImageVisible = true;
      };
      reader.onerror = () => {
        this.backgroud_img0 =
          "../../../../../assets/images/placeholderimage.png";
        this.SparePartImageBase64.setValue("");
      };

      let typeOfFile = event.target.files[0].type;
      let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

      if (con)
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      else {
        this.backgroud_img0 =
          "../../../../../assets/images/placeholderimage.png";
        this.SparePartImageBase64.setValue("");
      }
    } else {
      this.backgroud_img0 = "../../../../../assets/images/placeholderimage.png";
      this.SparePartImageBase64.setValue("");
    }
  }
  // onSelectFileEdit(event) { // called each time file input changes
  //   if (event.target.files && event.target.files[0]) {
  //     var reader: any = new FileReader();
  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.backgroud_img1 = event.target.result;
  //     }
  //     reader.onerror = () => {
  //       this.backgroud_img1 = "../../../../../assets/images/placeholderimage.png";
  //       this.SparePartImageBase64Edit.setValue('');
  //     }

  //     let typeOfFile = event.target.files[0].type;
  //     let con = /^(image)\/(jpe?g|png|gif|bmp)$/i.test(typeOfFile);

  //     if (con)
  //       reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     else {
  //       this.backgroud_img1 = "../../../../../assets/images/placeholderimage.png";
  //       this.SparePartImageBase64Edit.setValue('');
  //     }
  //   } else {
  //     this.backgroud_img1 = "../../../../../assets/images/placeholderimage.png";
  //     this.SparePartImageBase64Edit.setValue('');
  //   }
  // }

  viewImageName: any;
  viewImageValue: any;
  confirmForViewImage(content, value: any, type: any) {
    this.viewImageName = type.sparePartName;
    this.viewImageValue = value;
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  returnClassStatus(id) {
    return this.utilService.returnStatusClasses(id);
  }

  crossFirstImage(url) {
    if (url) {
      this.backgroud_img0 = "../../../../../assets/images/placeholderimage.png";
      this.isFirstImageVisible = false;
    }
  }

  crossSecondImage(url) {
    if (url) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        //confirmButtonColor: '#727CF5',
        cancelButtonColor: "#FF3366",
        confirmButtonText:
          "<span class='swal2-confirm '> Yes, remove it!</span>",
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveImage(false);
          this.backgroud_img1 =
            "../../../../../assets/images/placeholderimage.png";
          this.isSecondImageVisible = false;
        }
      });
    }
  }

  onSelectFileEdit(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data imageUrl
      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.backgroud_img1 = event.target.result;
        this.saveImage(true);
        //call getcompanyInformation
        //this.getCompanyDetails(this._employeeId)
      };
    }
  }
  saveImage(value) {
    this.spareService
      .UpdateSparePartImageProfile({
        assetSparePartId: this._sparetId,
        SparePartImageBase64:
          this.backgroud_img1 !==
          "../../../../../assets/images/placeholderimage.png"
            ? this.backgroud_img1.split(",")[1]
            : null,
      })
      .subscribe((res) => {
        this.isSecondImageVisible = value;
        this.forSuccessAdd(res);
      });
  }


  dateFormatter(date) {
    const newDate = moment(date).format("YYYY-MM-DD");
    if (newDate === "1970-01-01") return null;
    else return newDate;
  }


  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  deleteData(deleteId){
    this.spareService.postDeletespare({ AssetSparePartId: deleteId }).subscribe({
      next: (res)=>{
        this.successForDeletespareData(res);
        this.rows = [];
        this.getsparedetails(this.assestId);
      }
    })
  }


}
