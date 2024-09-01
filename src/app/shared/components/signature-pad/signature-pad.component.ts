import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: "app-signature-pad",
  templateUrl: "./signature-pad.component.html",
  styleUrls: ["./signature-pad.component.scss"],
})
export class SignaturePadComponent implements AfterViewInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @Output() sendImagedata = new EventEmitter();
  signature: any;
  signatureTaken = false;
  signatureSave: any;
  public signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    minWidth: 3,
    canvasWidth: 390,
    canvasHeight: 200,
    backgroundColor: "#ffffff",
  };
  ngAfterViewInit() {
    this.signaturePad.set("minWidth", 3); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    this.signature = String(this.signaturePad?.toDataURL());

    this.sendImagedata.emit(this.signature);
  }

  drawStart() {
    //console.log("begin drawing");
  }

  signaturePadSignAgain() {
    this.signature = "";
    this.signaturePad?.clear();
    this.signatureSave = this.signature;
    this.sendImagedata.emit(this.signature);
  }
}
