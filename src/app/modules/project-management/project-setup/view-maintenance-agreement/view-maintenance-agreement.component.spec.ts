import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMaintenanceAgreementComponent } from './view-maintenance-agreement.component';

describe('ViewMaintenanceAgreementComponent', () => {
  let component: ViewMaintenanceAgreementComponent;
  let fixture: ComponentFixture<ViewMaintenanceAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMaintenanceAgreementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewMaintenanceAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
