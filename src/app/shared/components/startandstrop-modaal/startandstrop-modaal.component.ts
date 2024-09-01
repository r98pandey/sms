import {
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-startandstrop-modaal',
  templateUrl: './startandstrop-modaal.component.html',
  styleUrls: ['./startandstrop-modaal.component.scss']
})
export class StartandstropModaalComponent implements OnInit, AfterViewInit, OnDestroy {
  public modalWidth: number;
  public modalHeight: number;

  @Input() type: any;
  maxCharsDecision = 100;
  remarkValue: string = '';
  showingTerm: boolean = true;
  imageUrl: any = null;
  @ViewChild('modalBody', { static: false }) modalBody: ElementRef;
  webcamImageimageAsDataUrl: any;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.setModalDimensions();
  }

  ngAfterViewInit(): void {
    this.setModalDimensions();
    window.addEventListener('resize', this.setModalDimensions.bind(this));
  }

  private setModalDimensions(): void {
    if (this.modalBody) {
      const { width, height } = this.modalBody.nativeElement.getBoundingClientRect();
      this.modalWidth = width;
      this.modalHeight = height;
      console.log("  this.modalWidth ", this.modalWidth)
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.setModalDimensions.bind(this));
  }
  openWebCamer() {
    this.showingTerm = false
  }
  close(value: string): void {
    if (value === 'success') {
      let sendObject = {
        value: value,
        remark: this.remarkValue,
        webcamImageimageAsDataUrl:this.webcamImageimageAsDataUrl ?this.webcamImageimageAsDataUrl :null
      };
      this.modal.close(sendObject);
    } else {
      this.modal.close(value);
    }
  }
  getBase64Image(event) {
    console.log(event)
    this.imageUrl = event.imageAsDataUrl
    this.webcamImageimageAsDataUrl = event.base64
    this.showingTerm = true
  }
  closefterImage(event) {
    console.log(event)
    this.showingTerm = event
  }
  deleteData(): void { }
}
