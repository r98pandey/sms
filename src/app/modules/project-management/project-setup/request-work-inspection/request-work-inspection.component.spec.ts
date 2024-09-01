import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWorkInspectionComponent } from './request-work-inspection.component';

describe('RequestWorkInspectionComponent', () => {
  let component: RequestWorkInspectionComponent;
  let fixture: ComponentFixture<RequestWorkInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestWorkInspectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestWorkInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
