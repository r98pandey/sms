import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAttachmentsWorkProgressModalComponent } from './upload-attachments-work-progress-modal.component';

describe('UploadAttachmentsWorkProgressModalComponent', () => {
  let component: UploadAttachmentsWorkProgressModalComponent;
  let fixture: ComponentFixture<UploadAttachmentsWorkProgressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadAttachmentsWorkProgressModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadAttachmentsWorkProgressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
