import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from "ngx-lightbox";
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-view-spare",
  templateUrl: "./view-spare.component.html",
  styleUrls: ["./view-spare.component.scss"],
})
export class ViewSpareComponent implements OnInit {
  @Input() spareDetails: any;
  baseUrl = environment.apiUrl;
  @Input() viewSparepartObject: any;

  constructor(private modal: NgbModal, private lightbox: Lightbox) {}

  ngOnInit(): void {
    this.viewSparepartObject = this.viewSparepartObject;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.viewSparepartObject = this.viewSparepartObject;
  }
  close() {
    this.viewSparepartObject = null;
    this.modal.dismissAll();
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
}
