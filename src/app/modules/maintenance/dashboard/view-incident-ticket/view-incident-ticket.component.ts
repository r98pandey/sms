import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { SignaturePad } from "angular2-signaturepad";
import { HelpDeskService } from "src/app/core/services/help-desk.service";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";
import { environment } from "src/environments/environment";
import { AuthAssetService } from "../../../../core/services/auth-asset.service";
import { SignatureTechComponent } from "../signature-tech/signature-tech.component";
import { SignatureClientComponent } from "../signature-client/signature-client.component";
import { Lightbox } from "ngx-lightbox";
import { forEach } from "lodash";

@Component({
  selector: "app-view-incident-ticket",
  templateUrl: "./view-incident-ticket.component.html",
  styleUrls: ["./view-incident-ticket.component.scss"],
})
export class ViewIncidentTicketComponent implements OnInit, OnChanges {
  @Input() incidentList: any;
  @Input() ticketData: any;

  @Output() sendUpdateIncident = new EventEmitter();

  imgurl: any = environment.apiUrl;

  isTechSignCard: boolean = false;
  isClientSignCard: boolean = false;
  isTechSignButton: boolean = false;
  isClientSignButton: boolean = false;

  constructor(
    public commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private helpDeskService: HelpDeskService,
    public authAssetService: AuthAssetService,
    private offcanvasService: NgbOffcanvas,
    private lightbox: Lightbox
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.incidentList.imageAllIncident = [];
    this.incidentList.imageAllIncident.push(
      this.incidentList.incidentImage1URL
        ? this.imgurl + this.incidentList.incidentImage1URL
        : null,
      this.incidentList.incidentImage2URL
        ? this.imgurl + this.incidentList.incidentImage2URL
        : null,
      this.incidentList.incidentImage3URL
        ? this.imgurl + this.incidentList.incidentImage3URL
        : null,
      this.incidentList.incidentImage4URL
        ? this.imgurl + this.incidentList.incidentImage4URL
        : null
    );

    this.incidentList.imageAllTech = [];
    this.incidentList.imageAllTech.push(
      this.incidentList.tecgUpdatemage1URL
        ? this.imgurl + this.incidentList.tecgUpdatemage1URL
        : null,
      this.incidentList.tecgUpdatemage2URL
        ? this.imgurl + this.incidentList.tecgUpdatemage2URL
        : null,
      this.incidentList.tecgUpdatemage3URL
        ? this.imgurl + this.incidentList.tecgUpdatemage3URL
        : null,
      this.incidentList.tecgUpdatemage4URL
        ? this.imgurl + this.incidentList.tecgUpdatemage4URL
        : null
    );
    //console.log(this.incidentList);
    this.getCliendAndTechSign();
  }
  clivjiri() {
    this.sendUpdateIncident.emit("fhfhh");
  }
  ngOnInit(): void {
    //console.log("incidentList", this.incidentList);
    //console.log("ticketData", this.ticketData);
    this.getCliendAndTechSign();
    this.clivjiri();
  }

  openSignatureTech() {
    const modalRef = this.offcanvasService.open(SignatureTechComponent, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas2",
    });
    modalRef.componentInstance.incidentList = this.incidentList;
    modalRef.componentInstance.ticketData = this.ticketData;
    modalRef.result
      .then((result) => {
        //console.log("resultQ", result);
        this.sendUpdateIncident.emit(result);
      })
      .catch((error) => {
        //console.log("result!!", error);
        this.sendUpdateIncident.emit("jhhhh");
      });
  }
  openSignatureClient() {
    const modalRef = this.offcanvasService.open(SignatureClientComponent, {
      scroll: true,
      position: "end",
      keyboard: false,
      backdrop: "static",
      panelClass: "custom-offcanvas2",
    });
    modalRef.componentInstance.incidentList = this.incidentList;
    modalRef.componentInstance.ticketData = this.ticketData;
    modalRef.result
      .then((result) => {
        this.sendUpdateIncident.emit(result);
      })
      .catch((error) => {
        this.sendUpdateIncident.emit(error);
      });
  }

  getCliendAndTechSign() {
    if (this.helpDeskService.pageAction == "Incident Tech Sign") {
      if (
        this.ticketData[0]?.ticketStatusId == 31 ||
        this.ticketData[0]?.ticketStatusId == 25
      ) {
        this.isTechSignCard = true;
        this.isClientSignCard = false;
        if (this.incidentList.incindetTechSignImageURL) {
          this.isTechSignButton = false;
        } else {
          this.isTechSignButton = true;
        }
        this.isClientSignButton = false;
      }
    } else if (this.helpDeskService.pageAction == "Incident Client Sign") {
      if (
        this.ticketData[0]?.ticketStatusId == 31 ||
        this.ticketData[0]?.ticketStatusId == 32
      ) {
        if (this.incidentList.incindetTechSignImageURL) {
          this.isTechSignCard = true;
        } else {
          this.isTechSignCard = false;
        }
        this.isClientSignCard = true;
        if (this.incidentList.incindetClientSignImageURL) {
          this.isClientSignButton = false;
        } else {
          this.isClientSignButton = true;
        }
        this.isTechSignButton = false;
      }
    } else {
      if (
        this.ticketData[0]?.ticketStatusId == 31 ||
        this.ticketData[0]?.ticketStatusId == 25 ||
        this.ticketData[0]?.ticketStatusId == 32
      ) {
        this.isTechSignCard = true;
        this.isClientSignCard = true;
        this.isTechSignButton = false;
        this.isClientSignButton = false;
      } else {
        this.isTechSignCard = false;
        this.isClientSignCard = false;
        this.isTechSignButton = false;
        this.isClientSignButton = false;
      }
    }
  }
  open(image): void {
    const album = {
      src: image,
      caption: "",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album);
    this.lightbox.open(_albums);
  }

  open_new(data, changes): void {
    let _albums: any = [];
    let index = 0;
    data.forEach((element) => {
      if (element) {
        _albums.push({
          src: element,
          caption: "",
          thumb: "thumb",
        });
      }
    });
    if (_albums.length != 0) {
      for (let i = 0; i <= _albums.length; i++) {
        if (_albums[i].src == changes) {
          index = i;
          break;
        }
      }
    }
    console.log(_albums, index, "_albums, index");
    this.lightbox.open(_albums, index, {
      wrapAround: true,
      showImageNumberLabel: true,
      showRotate: true,
    });
  }
}
