import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrackerComponent } from './audit-tracker.component';

describe('AuditTrackerComponent', () => {
  let component: AuditTrackerComponent;
  let fixture: ComponentFixture<AuditTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
