import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceAgreementComponent } from './maintenance-agreement.component';

describe('MaintenanceAgreementComponent', () => {
  let component: MaintenanceAgreementComponent;
  let fixture: ComponentFixture<MaintenanceAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceAgreementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
