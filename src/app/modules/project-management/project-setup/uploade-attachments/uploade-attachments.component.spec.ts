import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadeAttachmentsComponent } from './uploade-attachments.component';

describe('UploadeAttachmentsComponent', () => {
  let component: UploadeAttachmentsComponent;
  let fixture: ComponentFixture<UploadeAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadeAttachmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadeAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
