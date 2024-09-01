import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-catalog-page-upload',
  template: `
    <div class="container-fluid p-0 ">
      <div class="dropzone" (paste)="onPaste($event)" >
        <p>Paste images here</p>
        <button class="btn btn-sm btn-primary mb-3" (click)="pasteFromClipboard()">Paste</button>
    

          <div class="preview-section">
        <div class="image-container" *ngFor="let image of images; let i = index">
          <div class="image-wrapper" [ngClass]="{'new-row': i % 3 === 0 && i !== 0}">
            <img #imgRenderer [src]="image.url" class="img-size-withd-upload"/>
            <i class="ri-close-circle-line ri-close-circle-line2 " type="button" (click)="removeImage(image); $event.stopPropagation();"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./catalog-page-upload.component.scss']
})
export class CatalogPageUploadComponent  implements OnChanges{
  @ViewChild('imgRenderer') imgRenderer: ElementRef;
  @Input() oldDataSave:any;
  @Output() imageData = new EventEmitter<any>(); // Event emitter for sending base64 image data
  images: { url: string, blob: Blob }[] = [];
  constructor(private cdr: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.images=this.oldDataSave;
  }

  onPaste(event: any) {
    const items = event.clipboardData.items;

    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        const fileFromBlob: File = new File([blob], 'your-filename.jpg');

        const reader = new FileReader();
        reader.onload = (evt: any) => {
          const imageUrl = evt.target.result;
          this.images.push({ url: imageUrl, blob: blob });
          this.imageData.emit(this.images); // Emit the base64 image data to the parent
        };
        reader.readAsDataURL(blob);
      }
    }
  }

  removeImage(image: any) {
    const index = this.images.indexOf(image);
    if (index !== -1) {
      this.images.splice(index, 1);
      this.imageData.emit(this.images); // Emit 
      this.cdr.detectChanges(); // Trigger change detection
    }
  }

  async pasteFromClipboard() {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
          const blob = await item.getType('image/png' || 'image/jpeg');
          const fileFromBlob: File = new File([blob], 'pasted-image.png' || 'pasted-image.jpg');

          const reader = new FileReader();
          reader.onload = (evt: any) => {
            const imageUrl = evt.target.result;
            this.images.push({ url: imageUrl, blob: blob });
            this.imageData.emit(this.images); // Emit the base64 image data to the parent
          };
          reader.readAsDataURL(blob);
        }
      }
    } catch (error) {
      console.error('Error reading clipboard:', error);
    }
  }


}