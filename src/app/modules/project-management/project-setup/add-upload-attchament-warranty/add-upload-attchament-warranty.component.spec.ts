import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUploadAttchamentWarrantyComponent } from './add-upload-attchament-warranty.component';

describe('AddUploadAttchamentWarrantyComponent', () => {
  let component: AddUploadAttchamentWarrantyComponent;
  let fixture: ComponentFixture<AddUploadAttchamentWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUploadAttchamentWarrantyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUploadAttchamentWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
