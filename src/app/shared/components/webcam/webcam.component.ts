import { Component, Input, AfterViewInit, OnDestroy, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() modalWidth: number;
  @Input() modalHeight: number;
  @Output() sentImage = new EventEmitter();
  @Output() sentCloseImage = new EventEmitter();
  public showWebcam = true;
  public multipleWebcamsAvailable = false;
  public videoOptions: MediaTrackConstraints = {};
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage = null;

  private trigger: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.checkPermissions().then(() => {
      WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    });
    console.log(this.modalHeight, "modalHeight");
    console.log(this.modalWidth, "modalWidth");
  }

  ngAfterViewInit(): void {
    this.adjustVideoOptions();
    window.addEventListener('resize', this.adjustVideoOptions.bind(this));
  }

  private async checkPermissions(): Promise<void> {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
      const webcamInitError: WebcamInitError = {
        message: 'Camera access denied',
        mediaStreamError: err
      };
      this.errors.push(webcamInitError);
      alert('Camera access is required for this feature. Please allow camera access in your browser settings.');
    }
  }

  private adjustVideoOptions(): void {
    if (this.modalWidth && this.modalHeight) {
      this.videoOptions = {
        width: { ideal: this.modalWidth },
        height: { ideal: this.modalHeight }
      };
    }
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.sentImage.emit({
      base64: this.getBase64Image(),
      imageAsDataUrl: this.webcamImage.imageAsDataUrl
    });
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.showWebcam = false; // Close the webcam view after capturing
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public getBase64Image(): string {
    return this.webcamImage ? this.webcamImage.imageAsBase64 : null;
  }

  public closeWebcam(): void {
    this.showWebcam = false;
    this.sentImage.emit({
      base64: null,
      imageAsDataUrl: null
    });
    this.sentCloseImage.emit(this.showWebcam);
  }

  public openWebcam(): void {
    this.showWebcam = true;
    this.adjustVideoOptions(); // Adjust video options when opening webcam
  }

  ngOnDestroy(): void {
    // Ensure the webcam stream is stopped when the component is destroyed
    this.showWebcam = false;
    window.removeEventListener('resize', this.adjustVideoOptions.bind(this));
  }
}
