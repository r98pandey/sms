import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-success-modal-with-remark",
  templateUrl: "./success-modal-with-remark.component.html",
  styleUrls: ["./success-modal-with-remark.component.scss"],
})
export class SuccessModalWithRemarkComponent {
  @Input() title: any;
  @Input() subTitle: any;
  @Input() buttonName: any = "Done It";
  @Input() subTitle1: any;
  @Input() subTitle2: any;
  @Input() CancelName: any = "Close";
  maxCharsDecision = 100;
  remarkValue: string = "";
  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}
  close(value) {
    if (value === "success") {
      let sendObject = {
        value: value,
        remark: this.remarkValue,
      };
      this.modal.close(sendObject);
    } else {
      this.modal.close(value);
    }
  }
  deleteData() {}
}
