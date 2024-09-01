import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent implements OnInit, OnChanges {
  @Input() title: any;
  @Input() subTitle: any;
  @Input() buttonName:any

  constructor(public modal: NgbActiveModal) {

  }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  close(value) {
    this.modal.close(value)
  }

}
