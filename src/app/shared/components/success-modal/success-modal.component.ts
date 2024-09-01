import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss'],
})
export class SuccessModalComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() title: any;
  @Input() subTitle: any;
  @Input() buttonName: any = 'Done It';
  @Input() subTitle1: any;
  @Input() subTitle2: any;
  @Input() CancelName: any = 'Close';
  @Input() thirdButton: any;
  @Input() showProjectCategory: boolean = false;

  projectCategory: string;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void { }
  ngOnChanges(changes: SimpleChanges): void { }
  close(value, event: any) {
    event.preventDefault();
    this.modal.close(value);
  }
  confirm() {
    if (this.showProjectCategory) {
      this.modal.close({
        type: 'success',
        projectCategory: this.projectCategory
      })

    } else {
      this.modal.close('success');
    }

  }
  ngAfterViewInit(): void {
    const lordiconElement: any = document.querySelector('lord-icon');
    if (lordiconElement) {
      // lordiconElement?.play();
    }
  }
}
