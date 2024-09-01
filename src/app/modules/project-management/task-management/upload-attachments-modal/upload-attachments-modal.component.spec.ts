import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAttachmentsModalComponent } from './upload-attachments-modal.component';

describe('UploadAttachmentsModalComponent', () => {
  let component: UploadAttachmentsModalComponent;
  let fixture: ComponentFixture<UploadAttachmentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadAttachmentsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadAttachmentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
