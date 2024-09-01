import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUploadAttachementsComponent } from './edit-upload-attachements.component';

describe('EditUploadAttachementsComponent', () => {
  let component: EditUploadAttachementsComponent;
  let fixture: ComponentFixture<EditUploadAttachementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditUploadAttachementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditUploadAttachementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
