import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit, OnChanges {
  @Input() title: any;
  @Input() subTitle: any;

  constructor(public modal: NgbActiveModal) {

  }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  close(value) {
    this.modal.close(value)
  }
  deleteData() {

  }
}
