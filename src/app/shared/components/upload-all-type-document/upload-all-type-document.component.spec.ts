import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAllTypeDocumentComponent } from './upload-all-type-document.component';

describe('UploadAllTypeDocumentComponent', () => {
  let component: UploadAllTypeDocumentComponent;
  let fixture: ComponentFixture<UploadAllTypeDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadAllTypeDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadAllTypeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
