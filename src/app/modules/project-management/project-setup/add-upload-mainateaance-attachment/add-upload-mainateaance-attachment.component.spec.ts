import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUploadMainateaanceAttachmentComponent } from './add-upload-mainateaance-attachment.component';

describe('AddUploadMainateaanceAttachmentComponent', () => {
  let component: AddUploadMainateaanceAttachmentComponent;
  let fixture: ComponentFixture<AddUploadMainateaanceAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUploadMainateaanceAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUploadMainateaanceAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
