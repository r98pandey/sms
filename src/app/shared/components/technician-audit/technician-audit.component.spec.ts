import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianAuditComponent } from './technician-audit.component';

describe('TechnicianAuditComponent', () => {
  let component: TechnicianAuditComponent;
  let fixture: ComponentFixture<TechnicianAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicianAuditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicianAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
