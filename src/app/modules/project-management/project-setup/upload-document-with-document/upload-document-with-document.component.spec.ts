import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentWithDocumentComponent } from './upload-document-with-document.component';

describe('UploadDocumentWithDocumentComponent', () => {
  let component: UploadDocumentWithDocumentComponent;
  let fixture: ComponentFixture<UploadDocumentWithDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadDocumentWithDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadDocumentWithDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
